from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from pydantic import BaseModel, EmailStr
from typing import Optional

from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from ..models.user import User
from ..schemas.user import UserCreate, UserResponse, UserLogin, Token
from ..services.email_service import email_service

router = APIRouter(tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ForgotUsernameRequest(BaseModel):
    email: EmailStr

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class LoginRequest(BaseModel):
    username: str
    password: str


def detect_registration_source(utm_source: Optional[str], referrer: Optional[str]) -> str:
    """Определить источник регистрации"""
    if utm_source:
        utm_lower = utm_source.lower()
        if 'google' in utm_lower:
            return 'google'
        elif 'yandex' in utm_lower:
            return 'yandex'
        elif 'bing' in utm_lower:
            return 'bing'
        elif 'telegram' in utm_lower:
            return 'telegram'
        elif 'vk' in utm_lower:
            return 'vk'
        else:
            return utm_source[:50]
    
    if referrer:
        ref_lower = referrer.lower()
        if 'google' in ref_lower:
            return 'google'
        elif 'yandex' in ref_lower:
            return 'yandex'
        elif 'bing' in ref_lower:
            return 'bing'
        elif 'duckduckgo' in ref_lower:
            return 'duckduckgo'
        elif 't.me' in ref_lower or 'telegram' in ref_lower:
            return 'telegram'
        elif 'vk.com' in ref_lower:
            return 'vk'
        elif 'habr' in ref_lower:
            return 'habr'
        else:
            return 'referral'
    
    return 'direct'


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = payload.get("sub")
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if hasattr(user, 'is_blocked') and user.is_blocked:
        raise HTTPException(status_code=403, detail=f"Аккаунт заблокирован: {user.block_reason or 'Обратитесь в поддержку'}")
    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    if user_data.email:
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Определяем источник регистрации
    registration_source = detect_registration_source(user_data.utm_source, user_data.referrer)
    
    new_user = User(
        username=user_data.username.lower(),
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        subscription_plan="free",
        tokens_limit=30000,
        is_verified=False,
        # Аналитика
        registration_source=registration_source,
        utm_source=user_data.utm_source[:100] if user_data.utm_source else None,
        utm_medium=user_data.utm_medium[:100] if user_data.utm_medium else None,
        utm_campaign=user_data.utm_campaign[:100] if user_data.utm_campaign else None,
        referrer=user_data.referrer[:500] if user_data.referrer else None
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    if user_data.email:
        try:
            await email_service.send_verification_email(db, new_user.id, user_data.email)
        except Exception as e:
            print(f"Failed to send verification email: {e}")
    return new_user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == form_data.username.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин или пароль")
    if hasattr(user, 'is_blocked') and user.is_blocked:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Аккаунт заблокирован: {user.block_reason or 'Обратитесь в поддержку'}")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/json")
async def login_json(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == data.username.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин или пароль")
    if hasattr(user, 'is_blocked') and user.is_blocked:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Аккаунт заблокирован")
    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "balance": user.balance,
            "subscription_plan": user.subscription_plan,
            "is_active": user.is_active,
            "is_admin": user.is_admin if hasattr(user, 'is_admin') else False,
            "is_verified": user.is_verified if hasattr(user, 'is_verified') else False,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/verify-email")
async def verify_email(data: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    token_data = await email_service.verify_token(db, data.token, 'email_verify')
    if not token_data:
        raise HTTPException(status_code=400, detail="Недействительная или истёкшая ссылка")
    await db.execute(text("UPDATE users SET is_verified = TRUE, email_verified_at = NOW() WHERE id = :user_id"), {"user_id": token_data["user_id"]})
    await email_service.mark_token_used(db, data.token)
    await db.commit()
    return {"message": "Email успешно подтверждён!"}


@router.post("/resend-verification")
async def resend_verification(data: ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user:
        return {"message": "Если email зарегистрирован, мы отправили письмо"}
    if hasattr(user, 'is_verified') and user.is_verified:
        raise HTTPException(status_code=400, detail="Email уже подтверждён")
    await email_service.send_verification_email(db, user.id, data.email)
    return {"message": "Письмо отправлено!"}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if user:
        await email_service.send_password_reset_email(db, user.id, data.email)
    return {"message": "Если email зарегистрирован, мы отправили инструкции"}


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    token_data = await email_service.verify_token(db, data.token, 'password_reset')
    if not token_data:
        raise HTTPException(status_code=400, detail="Недействительная или истёкшая ссылка")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Пароль минимум 6 символов")
    hashed_password = get_password_hash(data.new_password)
    await db.execute(text("UPDATE users SET hashed_password = :password WHERE id = :user_id"), {"password": hashed_password, "user_id": token_data["user_id"]})
    await email_service.mark_token_used(db, data.token)
    await db.commit()
    return {"message": "Пароль успешно изменён!"}


@router.post("/validate-reset-token")
async def validate_reset_token(data: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    token_data = await email_service.verify_token(db, data.token, 'password_reset')
    if not token_data:
        raise HTTPException(status_code=400, detail="Недействительная или истёкшая ссылка")
    return {"valid": True}


@router.post("/forgot-username")
async def forgot_username(data: ForgotUsernameRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if user:
        await email_service.send_username_reminder_email(db, data.email, user.username)
    return {"message": "Если email зарегистрирован, мы отправили логин на почту"}
