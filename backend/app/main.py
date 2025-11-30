import sys
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .api import auth, chat, payments, analytics, subscriptions, budget, admin, files
from .core.database import engine, Base
from .services.currency_service import currency_service
from .services.openrouter_prices import openrouter_prices_service
from .services.file_service import cleanup_old_files, start_cleanup_scheduler

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
