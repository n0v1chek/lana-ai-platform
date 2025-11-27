import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional
import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    TOKEN_EXPIRY = {
        'email_verify': timedelta(hours=24),
        'password_reset': timedelta(hours=1),
        'username_remind': timedelta(hours=1),
    }
    
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
        self.site_url = settings.SITE_URL or "https://lanaaihelper.ru"
        self.site_name = "LANA AI Helper"
    
    def _generate_token(self) -> str:
        return secrets.token_urlsafe(32)
    
    async def create_token(self, db: AsyncSession, user_id: Optional[int], email: str, token_type: str) -> str:
        token = self._generate_token()
        expires_at = datetime.utcnow() + self.TOKEN_EXPIRY.get(token_type, timedelta(hours=1))
        
        await db.execute(text("""
            DELETE FROM email_tokens 
            WHERE email = :email AND token_type = :token_type AND used_at IS NULL
        """), {"email": email, "token_type": token_type})
        
        await db.execute(text("""
            INSERT INTO email_tokens (user_id, email, token, token_type, expires_at)
            VALUES (:user_id, :email, :token, :token_type, :expires_at)
        """), {
            "user_id": user_id,
            "email": email,
            "token": token,
            "token_type": token_type,
            "expires_at": expires_at
        })
        
        await db.commit()
        return token
    
    async def verify_token(self, db: AsyncSession, token: str, token_type: str) -> Optional[dict]:
        result = await db.execute(text("""
            SELECT id, user_id, email, token_type, expires_at, used_at
            FROM email_tokens
            WHERE token = :token AND token_type = :token_type
        """), {"token": token, "token_type": token_type})
        
        row = result.fetchone()
        if not row:
            return None
        
        token_data = {
            "id": row[0],
            "user_id": row[1],
            "email": row[2],
            "token_type": row[3],
            "expires_at": row[4],
            "used_at": row[5]
        }
        
        if token_data["used_at"] is not None:
            return None
        
        if token_data["expires_at"] < datetime.utcnow():
            return None
        
        return token_data
    
    async def mark_token_used(self, db: AsyncSession, token: str):
        await db.execute(text("""
            UPDATE email_tokens SET used_at = NOW() WHERE token = :token
        """), {"token": token})
        await db.commit()
    
    def _send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.site_name} <{self.from_email}>"
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            if self.smtp_port == 465:
                with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port) as server:
                    server.login(self.smtp_user, self.smtp_password)
                    server.sendmail(self.from_email, to_email, msg.as_string())
            else:
                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.sendmail(self.from_email, to_email, msg.as_string())
            
            logger.info(f"Email sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False
    
    def _get_template(self, title: str, content: str, button_text: str, button_url: str) -> str:
        return f'''<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif;">
<table width="100%" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="100%" style="max-width:500px;background:#18181b;border-radius:16px;">
<tr><td style="padding:32px;text-align:center;border-bottom:1px solid #27272a;">
<h1 style="margin:0;color:#a855f7;font-size:28px;">🐱 LANA AI</h1>
</td></tr>
<tr><td style="padding:32px;">
<h2 style="margin:0 0 16px;color:#fff;font-size:20px;">{title}</h2>
<p style="margin:0 0 24px;color:#a1a1aa;font-size:15px;line-height:1.6;">{content}</p>
<table width="100%"><tr><td align="center">
<a href="{button_url}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">{button_text}</a>
</td></tr></table>
<p style="margin:24px 0 0;color:#71717a;font-size:13px;">Если кнопка не работает:<br><a href="{button_url}" style="color:#a855f7;">{button_url}</a></p>
</td></tr>
<tr><td style="padding:24px;background:#0f0f10;text-align:center;border-top:1px solid #27272a;">
<p style="margin:0;color:#52525b;font-size:13px;">Это автоматическое сообщение от LANA AI</p>
</td></tr>
</table>
</td></tr></table>
</body></html>'''
    
    async def send_verification_email(self, db: AsyncSession, user_id: int, email: str) -> bool:
        token = await self.create_token(db, user_id, email, 'email_verify')
        url = f"{self.site_url}/verify-email?token={token}"
        html = self._get_template("Подтвердите email", "Нажмите кнопку для подтверждения. Ссылка действует 24 часа.", "Подтвердить email", url)
        return self._send_email(email, "Подтверждение email — LANA AI", html)
    
    async def send_password_reset_email(self, db: AsyncSession, user_id: int, email: str) -> bool:
        token = await self.create_token(db, user_id, email, 'password_reset')
        url = f"{self.site_url}/reset-password?token={token}"
        html = self._get_template("Сброс пароля", "Нажмите кнопку для сброса пароля. Ссылка действует 1 час.", "Сбросить пароль", url)
        return self._send_email(email, "Сброс пароля — LANA AI", html)
    
    async def send_username_reminder_email(self, db: AsyncSession, email: str, username: str) -> bool:
        url = f"{self.site_url}/login"
        html = self._get_template("Ваш логин", f"Ваш логин: <strong style='color:#a855f7;'>{username}</strong>", "Войти", url)
        return self._send_email(email, "Напоминание логина — LANA AI", html)


email_service = EmailService()
