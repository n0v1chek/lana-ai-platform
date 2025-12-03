from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from sqlalchemy.orm import selectinload
from typing import List
from datetime import date

from ..core.database import get_db
from ..models.user import User
from ..models.conversation import Conversation, Message, MessageRole, AIModel
from ..schemas.conversation import (
    ConversationCreate, ConversationResponse, ConversationListResponse,
    ChatRequest, ChatResponse, MessageResponse, ConversationUpdate
)
from ..api.auth import get_current_user
from ..services.ai_service import ai_service, prepare_multimodal_message, extract_text_from_document
from ..services.file_service import UPLOAD_DIR, supports_vision, supports_documents

router = APIRouter(tags=["Chat"])


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_conversation = Conversation(
        user_id=current_user.id,
        title=conversation_data.title,
        ai_model=AIModel(conversation_data.ai_model)
    )
    db.add(new_conversation)
    await db.commit()
    await db.refresh(new_conversation)
    return new_conversation


@router.get("/conversations", response_model=List[ConversationListResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
    )
    conversations = result.scalars().all()

    response = []
    for conv in conversations:
        msg_count = await db.scalar(
            select(func.count(Message.id)).where(Message.conversation_id == conv.id)
        )
        response.append({
            **conv.__dict__,
            "message_count": msg_count or 0
        })
    return response


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    return conversation


@router.patch("/conversations/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: int,
    update_data: ConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if update_data.title is not None:
        conversation.title = update_data.title
    if update_data.ai_model is not None:
        conversation.ai_model = AIModel(update_data.ai_model)

    await db.commit()
    await db.refresh(conversation)
    return conversation


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    await db.delete(conversation)
    await db.commit()


@router.post("/send", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # FIX: Сохраняем user_id для избежания двойного списания
    user_id = current_user.id
    
    result = await db.execute(
        text("""
            SELECT balance, budget_period, budget_coins, daily_spent, daily_spent_date
            FROM users WHERE id = :user_id
        """),
        {"user_id": current_user.id}
    )
    row = result.fetchone()
    current_balance = row[0] or 0
    budget_period = row[1] or "none"
    budget_coins = row[2] or 0
    daily_spent = row[3] or 0
    daily_spent_date = row[4]

    today = date.today()
    if daily_spent_date and daily_spent_date != today:
        await db.execute(
            text("UPDATE users SET daily_spent = 0, daily_spent_date = :today WHERE id = :user_id"),
            {"today": today, "user_id": user_id}
        )
        daily_spent = 0

    period_days_map = {"none": 0, "week": 7, "two_weeks": 14, "three_weeks": 21, "month": 30}
    period_days = period_days_map.get(budget_period, 0)
    daily_limit = budget_coins // period_days if period_days > 0 else 0

    requested_model = chat_request.ai_model
    if not requested_model or requested_model == "auto":
        requested_model = "google/gemini-2.0-flash-001"

    estimated_tokens = ai_service.estimate_tokens(chat_request.message) + 500
    estimated_coins = ai_service.estimate_coins(requested_model, estimated_tokens, 500)

    if current_balance <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": "Недостаточно коинов. Пожалуйста, пополните баланс.",
                "error_type": "no_balance",
                "balance": current_balance,
                "topup_url": "/pricing"
            }
        )

    if current_balance < estimated_coins:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": f"Недостаточно коинов. Нужно ~{estimated_coins}, у вас {current_balance}.",
                "error_type": "low_balance",
                "balance": current_balance,
                "topup_url": "/pricing"
            }
        )

    if budget_period != "none" and daily_limit > 0:
        daily_remaining = daily_limit - daily_spent

        if daily_spent >= daily_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": f"Достигнут дневной лимит ({daily_limit} коинов). Попробуйте завтра.",
                    "error_type": "daily_limit",
                    "daily_limit": daily_limit,
                    "daily_spent": daily_spent,
                    "daily_remaining": 0,
                    "settings_url": "/settings"
                }
            )

        if daily_remaining < estimated_coins:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": f"Недостаточно коинов в дневном лимите. Осталось {daily_remaining}, нужно ~{estimated_coins}.",
                    "error_type": "daily_limit",
                    "daily_limit": daily_limit,
                    "daily_spent": daily_spent,
                    "daily_remaining": daily_remaining,
                    "settings_url": "/settings"
                }
            )

    conversation_id = chat_request.conversation_id
    existing_messages = []

    if conversation_id:
        conv_result = await db.execute(
            select(Conversation)
            .where(
                Conversation.id == conversation_id,
                Conversation.user_id == current_user.id
            )
        )
        conversation = conv_result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        msgs_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(10)
        )
        existing_messages = list(reversed(msgs_result.scalars().all()))
    else:
        conversation = Conversation(
            user_id=current_user.id,
            title="New Chat",
            ai_model=AIModel.GPT4O
        )
        db.add(conversation)
        await db.flush()

    user_message = Message(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=chat_request.message,
        tokens_used=ai_service.estimate_tokens(chat_request.message)
    )
    db.add(user_message)
    await db.flush()

    # Системный промпт с текущей датой
    from datetime import datetime
    current_date = datetime.now().strftime("%d.%m.%Y")
    system_prompt = f"""Ты — полезный AI-ассистент LANA. Сегодня {current_date}.
Отвечай на языке пользователя. Будь точным, полезным и дружелюбным.
Если не знаешь ответа — честно скажи об этом."""
    messages_history = [{"role": "system", "content": system_prompt}]
    for msg in existing_messages:
        messages_history.append({
            "role": msg.role.value,
            "content": msg.content
        })
    # Обработка файла если есть
    user_content = chat_request.message
    file_path = None

    if chat_request.file_id:
        # Ищем файл по ID
        for fp in UPLOAD_DIR.iterdir():
            if fp.stem == chat_request.file_id:
                file_path = str(fp)
                break

        if file_path:
            if chat_request.file_type == "image":
                # Проверяем поддержку vision
                if not supports_vision(requested_model):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Модель " + requested_model + " не поддерживает изображения."
                    )
            elif chat_request.file_type == "document":
                # Извлекаем текст из документа
                doc_text = await extract_text_from_document(file_path)
                user_content = chat_request.message + "\n\n--- Документ ---\n" + doc_text
                file_path = None

    # Формируем сообщение пользователя
    if file_path and chat_request.file_type == "image":
        user_msg = await prepare_multimodal_message(chat_request.message, file_path)
        messages_history.append(user_msg)
    else:
        messages_history.append({
            "role": "user",
            "content": user_content
        })

    try:
        ai_response = await ai_service.send_message(
            model=requested_model,
            messages=messages_history
        )

        coins_spent = ai_response["coins_spent"]
        cost_usd = ai_response["cost_usd"]
        usd_rate = ai_response["usd_rate"]

        if current_balance < coins_spent:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "error": f"Недостаточно коинов. Нужно {coins_spent}, у вас {current_balance}.",
                    "error_type": "low_balance",
                    "balance": current_balance,
                    "topup_url": "/pricing"
                }
            )

        if budget_period != "none" and daily_limit > 0:
            if (daily_spent + coins_spent) > daily_limit:
                await db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "error": f"Превышен дневной лимит.",
                        "error_type": "daily_limit",
                        "daily_limit": daily_limit,
                        "daily_spent": daily_spent,
                        "settings_url": "/settings"
                    }
                )

        assistant_message = Message(
            conversation_id=conversation.id,
            role=MessageRole.ASSISTANT,
            content=ai_response["content"],
            tokens_used=ai_response["tokens_used"],
            model_used=ai_response["model"]
        )
        db.add(assistant_message)

        # Удаляем старые сообщения, оставляем последние 30
        await db.execute(
            text("""
                DELETE FROM messages
                WHERE conversation_id = :conv_id
                AND id NOT IN (
                    SELECT id FROM messages
                    WHERE conversation_id = :conv_id
                    ORDER BY created_at DESC
                    LIMIT 30
                )
            """),
            {"conv_id": conversation.id}
        )

        await db.execute(
            text("""
                UPDATE users SET
                    balance = balance - :coins,
                    daily_spent = daily_spent + :coins,
                    daily_spent_date = :today
                WHERE id = :user_id
            """),
            {"coins": coins_spent, "today": today, "user_id": user_id}
        )

        await db.execute(
            text("""
                INSERT INTO usage_logs (user_id, model_id, tokens_used, cost_rub, coins_spent)
                VALUES (:user_id, :model_id, :tokens_used, :cost_rub, :coins_spent)
            """),
            {
                "user_id": user_id,
                "model_id": ai_response["model"],
                "tokens_used": ai_response["tokens_used"],
                "cost_rub": coins_spent / 100,
                "coins_spent": coins_spent
            }
        )

        # Записываем транзакцию с себестоимостью для мониторинга
        await db.execute(
            text("""
                INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, model, tokens_used, cost_usd, usd_rate, source)
                VALUES (:user_id, 'spend', :amount, :before, :after, :desc, :model, :tokens, :cost_usd, :usd_rate, :source)
            """),
            {
                "user_id": user_id,
                "amount": -coins_spent,
                "before": current_balance,
                "after": current_balance - coins_spent,
                "desc": "AI сообщение",
                "model": ai_response["model"],
                "tokens": ai_response["tokens_used"],
                "cost_usd": cost_usd,
                "usd_rate": usd_rate,
                "source": chat_request.source or "web"
            }
        )

        if conversation.title == "New Chat":
            conversation.title = chat_request.message[:50] + ("..." if len(chat_request.message) > 50 else "")

        await db.commit()

        new_result = await db.execute(
            text("SELECT balance, daily_spent FROM users WHERE id = :user_id"),
            {"user_id": current_user.id}
        )
        new_row = new_result.fetchone()
        new_balance = new_row[0] or 0
        new_daily_spent = new_row[1] or 0

        return {
            "conversation_id": conversation.id,
            "user_message": user_message,
            "assistant_message": assistant_message,
            "coins_spent": coins_spent,
            "balance_remaining": new_balance,
            "daily_spent": new_daily_spent,
            "daily_limit": daily_limit,
            "daily_remaining": max(0, daily_limit - new_daily_spent) if daily_limit > 0 else new_balance
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )


@router.get("/balance")
async def get_balance(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # FIX: Сохраняем user_id для избежания двойного списания
    user_id = current_user.id
    
    result = await db.execute(
        text("""
            SELECT balance, budget_period, budget_coins, daily_spent, daily_spent_date
            FROM users WHERE id = :user_id
        """),
        {"user_id": current_user.id}
    )
    row = result.fetchone()

    balance = row[0] or 0
    budget_period = row[1] or "none"
    budget_coins = row[2] or 0
    daily_spent = row[3] or 0
    daily_spent_date = row[4]

    today = date.today()
    if daily_spent_date and daily_spent_date != today:
        await db.execute(
            text("UPDATE users SET daily_spent = 0, daily_spent_date = :today WHERE id = :user_id"),
            {"today": today, "user_id": user_id}
        )
        await db.commit()
        daily_spent = 0

    period_days_map = {"none": 0, "week": 7, "two_weeks": 14, "three_weeks": 21, "month": 30}
    period_days = period_days_map.get(budget_period, 0)
    daily_limit = budget_coins // period_days if period_days > 0 else 0

    return {
        "balance": balance,
        "balance_rub": balance / 100,
        "username": current_user.username,
        "budget_period": budget_period,
        "budget_coins": budget_coins,
        "daily_limit": daily_limit,
        "daily_spent": daily_spent,
        "daily_remaining": max(0, daily_limit - daily_spent) if daily_limit > 0 else balance
    }


@router.get("/models/available")
async def get_available_models(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from ..services.ai_service import get_usd_to_coins_multiplier, get_model_prices_usd
    from ..services.currency_service import currency_service
    usd_rate = await currency_service.get_usd_rate()
    multiplier = get_usd_to_coins_multiplier(usd_rate)

    result = await db.execute(
        text("SELECT balance FROM users WHERE id = :user_id"),
        {"user_id": current_user.id}
    )
    balance = result.scalar() or 0

    models = []
    prices_usd = await get_model_prices_usd()
    for model_id, (input_usd, output_usd) in prices_usd.items():
        input_coins = round(input_usd * multiplier)
        output_coins = round(output_usd * multiplier)
        avg_coins = round((input_coins + output_coins) / 2)
        models.append({
            "model_id": model_id,
            "input_per_1m": input_coins,
            "output_per_1m": output_coins,
            "price_per_1m_tokens": avg_coins,
            "price_per_1k_tokens": round(avg_coins / 1000, 2)
        })

    models.sort(key=lambda x: x["price_per_1m_tokens"])

    return {
        "balance": balance,
        "balance_rub": balance / 100,
        "models": models
    }


@router.get("/usage/stats")
async def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        text("""
            SELECT
                model_id,
                SUM(tokens_used) as total_tokens,
                COUNT(*) as requests_count,
                SUM(coins_spent) as total_coins
            FROM usage_logs
            WHERE user_id = :user_id
                AND created_at >= DATE_TRUNC('month', NOW())
            GROUP BY model_id
            ORDER BY total_coins DESC
            LIMIT 10
        """),
        {"user_id": current_user.id}
    )
    top_models = result.fetchall()

    total_result = await db.execute(
        text("""
            SELECT
                SUM(tokens_used) as total_tokens,
                SUM(coins_spent) as total_coins,
                COUNT(*) as total_requests
            FROM usage_logs
            WHERE user_id = :user_id
                AND created_at >= DATE_TRUNC('month', NOW())
        """),
        {"user_id": current_user.id}
    )
    totals = total_result.fetchone()

    balance_result = await db.execute(
        text("SELECT balance FROM users WHERE id = :user_id"),
        {"user_id": current_user.id}
    )
    balance = balance_result.scalar() or 0

    return {
        "balance": balance,
        "balance_rub": balance / 100,
        "month_stats": {
            "total_tokens": totals[0] or 0,
            "total_coins_spent": totals[1] or 0,
            "total_requests": totals[2] or 0
        },
        "top_models": [
            {
                "model_id": m[0],
                "tokens": m[1],
                "requests": m[2],
                "coins_spent": m[3] or 0
            }
            for m in top_models
        ]
    }


@router.get("/models/prices")
async def get_models_prices():
    """Публичный endpoint для получения цен моделей (для Telegram бота)"""
    from ..services.ai_service import get_model_prices, MODEL_INFO
    
    prices_data = await get_model_prices()
    return prices_data
