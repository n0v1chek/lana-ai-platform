# Скрипт для исправления send_message
import re

with open('app/api/chat.py', 'r') as f:
    content = f.read()

# Находим и заменяем проблемную проверку
old_check = '''    if not current_user.can_send_message:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token limit exceeded. Please upgrade your subscription."
        )'''

new_check = '''    # Проверка лимитов пользователя
    from ..core.config import SubscriptionConfig
    can_send, message = current_user.can_send_message(SubscriptionConfig)
    if not can_send:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message
        )'''

content = content.replace(old_check, new_check)

with open('app/api/chat.py', 'w') as f:
    f.write(content)

print("✅ Исправление применено!")
