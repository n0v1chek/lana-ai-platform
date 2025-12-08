import sys
import time
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
from .api import auth, chat, payments, analytics, subscriptions, budget, admin, files, contact
from .core.database import engine, Base
from .services.currency_service import currency_service
from .services.openrouter_prices import openrouter_prices_service
from .services.file_service import cleanup_old_files, start_cleanup_scheduler
from .core.logging import (
    logger, generate_request_id, set_request_id,
    log_api_request, log_api_response
)


# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


# Request Logging Middleware
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate and set request ID
        request_id = generate_request_id()
        set_request_id(request_id)

        # Skip logging for health checks
        if request.url.path in ["/health", "/health/detailed", "/metrics"]:
            return await call_next(request)

        start_time = time.time()
        log_api_request(request.method, request.url.path)

        response = await call_next(request)

        duration_ms = (time.time() - start_time) * 1000
        log_api_response(request.method, request.url.path, response.status_code, duration_ms)

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 AI Chat Platform starting...", flush=True)
    
    # Создание таблиц БД
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Загрузка курса ЦБ РФ
    print("📊 Loading USD rate from CBR...", flush=True)
    try:
        usd_rate = await currency_service.get_usd_rate()
        cbr_rate = currency_service.get_cbr_rate()
        print(f"✅ USD rate loaded: CBR={cbr_rate:.2f}, Sell={usd_rate:.2f} (with 8% spread)", flush=True)
    except Exception as e:
        print(f"⚠️ Failed to load USD rate: {e}", flush=True)
        traceback.print_exc()
    
    # Загрузка цен с OpenRouter
    print("💰 Loading model prices from OpenRouter...", flush=True)
    try:
        prices = await openrouter_prices_service.fetch_prices()
        print(f"✅ Loaded {len(prices)} model prices from OpenRouter", flush=True)
    except Exception as e:
        print(f"⚠️ Failed to load OpenRouter prices: {e}", flush=True)
        traceback.print_exc()
    
    # Очищаем старые файлы при старте
    deleted = await cleanup_old_files()
    if deleted > 0:
        print(f"🧹 Cleaned up {deleted} old files", flush=True)
    
    # Запускаем фоновую очистку
    import asyncio
    asyncio.create_task(start_cleanup_scheduler())
    
    print("🎉 AI Chat Platform ready!", flush=True)
    sys.stdout.flush()
    
    yield
    
    print("👋 AI Chat Platform shutting down...", flush=True)

app = FastAPI(
    title="AI Chat Platform API",
    version="1.0.0",
    description="API для общения с различными AI моделями",
    lifespan=lifespan
)

# Middleware stack (order matters - first added = last executed)
app.add_middleware(RequestLoggingMiddleware)  # Logging
app.add_middleware(SecurityHeadersMiddleware)  # Security headers

# CORS middleware - только для разрешённых доменов
ALLOWED_ORIGINS = [
    "https://lanaaihelper.ru",
    "https://www.lanaaihelper.ru",
    "http://localhost:3000",  # для локальной разработки
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Subscriptions"])
app.include_router(budget.router, prefix="/api", tags=["Budget"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])
app.include_router(files.router, prefix="/api", tags=["Files"])
app.include_router(contact.router, prefix="/api", tags=["Contact"])

@app.get("/")
async def root():
    return {
        "message": "AI Chat Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/health/detailed")
async def health_detailed():
    """Детальная проверка здоровья всех сервисов"""
    from datetime import datetime
    from .core.cache import cache
    from .core.database import engine
    from sqlalchemy import text

    result = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {}
    }

    # Check Database
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        result["services"]["database"] = {"status": "healthy"}
    except Exception as e:
        result["services"]["database"] = {"status": "unhealthy", "error": str(e)}
        result["status"] = "degraded"

    # Check Redis
    try:
        is_healthy = await cache.is_healthy()
        result["services"]["redis"] = {"status": "healthy" if is_healthy else "unhealthy"}
        if not is_healthy:
            result["status"] = "degraded"
    except Exception as e:
        result["services"]["redis"] = {"status": "unhealthy", "error": str(e)}
        result["status"] = "degraded"

    return result


@app.get("/metrics")
async def metrics_endpoint():
    """Prometheus-compatible metrics endpoint"""
    from fastapi.responses import PlainTextResponse
    from .core.metrics import metrics
    return PlainTextResponse(
        content=metrics.get_prometheus_format(),
        media_type="text/plain"
    )


@app.get("/metrics/json")
async def metrics_json():
    """Metrics in JSON format"""
    from .core.metrics import metrics
    return metrics.get_stats()


@app.get("/api/info")
async def api_info():
    return {
        "name": "Lana AI Helper",
        "version": "2.5.0",
        "registration": "anonymous (username + password)",
        "pricing_system": "coins",
        "min_topup": "49 RUB",
        "rate": "1 RUB = 100 coins",
        "endpoints": {
            "auth": "/api/auth",
            "chat": "/api/chat",
            "payments": "/api/payments",
            "analytics": "/api/analytics",
            "subscriptions": "/api/subscriptions",
            "budget": "/api/budget"
        },
        "models": [
            "gemini-2.0-flash",
            "gpt-4o-mini",
            "gpt-4o",
            "claude-sonnet-4",
            "claude-3.5-sonnet"
        ],
        "features": [
            "50+ AI models",
            "Budget management",
            "Daily limits",
            "Anonymous registration",
            "Data privacy"
        ]
    }
