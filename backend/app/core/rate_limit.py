from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Лимиты:
# /api/auth/register - 5 запросов в час (защита от спама)
# /api/auth/login - 10 запросов в минуту (защита от брутфорса)
# /api/chat/send - 30 запросов в минуту (защита от злоупотреблений)
# остальные endpoints - 100 запросов в минуту
