from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    contact: str
    task: str = ""

@router.post("/contact")
async def submit_contact_form(form: ContactForm):
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.mail.ru")
        smtp_port = int(os.getenv("SMTP_PORT", "465"))
        smtp_user = os.getenv("SMTP_USER", "support@lanaaihelper.ru")
        smtp_pass = os.getenv("SMTP_PASSWORD", "")
        
        if not smtp_pass:
            raise HTTPException(status_code=500, detail="SMTP not configured")
        
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = "support@lanaaihelper.ru"
        msg["Subject"] = "Новая заявка с сайта LANA AI (B2B)"
        
        body = f"""
Новая заявка с сайта!

Имя / Компания: {form.name}
Контакт: {form.contact}

Задача:
{form.task if form.task else "Не указано"}

---
Отправлено с https://lanaaihelper.ru/business
        """
        
        msg.attach(MIMEText(body, "plain", "utf-8"))
        
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        
        return {"success": True, "message": "Заявка отправлена"}
    
    except Exception as e:
        print(f"Contact form error: {e}")
        raise HTTPException(status_code=500, detail="Ошибка отправки")
