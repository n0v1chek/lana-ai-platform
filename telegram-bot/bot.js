require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const API_URL = process.env.API_URL || 'http://localhost:8000/api';

// Логирование всех callback
bot.use((ctx, next) => {
  if (ctx.callbackQuery) {
    console.log('Callback:', ctx.callbackQuery.data);
  }
  return next();
});

// Хранилище сессий
const sessions = new Map();

function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, { 
      token: null, 
      model: 'google/gemini-2.0-flash-001',
      modelName: 'Gemini 2.0 Flash',
      conversationId: null,
      loginStep: null,
      loginUsername: null
    });
  }
  return sessions.get(chatId);
}

const VISION_MODELS = new Set([
  'openai/gpt-4o', 'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet', 'anthropic/claude-sonnet-4',
  'anthropic/claude-opus-4', 'anthropic/claude-3.5-haiku',
  'anthropic/claude-3.7-sonnet', 'google/gemini-2.0-flash-001',
  'google/gemini-2.5-flash', 'google/gemini-2.5-pro', 'x-ai/grok-3',
]);

const FALLBACK_MODELS = [
  { model_id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', category: 'economy', coins: 15 },
  { model_id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'economy', coins: 20 },
  { model_id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', category: 'economy', coins: 25 },
  { model_id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', category: 'economy', coins: 30 },
  { model_id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', category: 'standard', coins: 80 },
  { model_id: 'openai/gpt-4o', name: 'GPT-4o', category: 'premium', coins: 300 },
  { model_id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', category: 'premium', coins: 400 },
  { model_id: 'anthropic/claude-opus-4', name: 'Claude Opus 4', category: 'ultra', coins: 1500 },
];

async function fetchModels() {
  try {
    const response = await axios.get(API_URL + '/chat/models/prices', { timeout: 5000 });
    return response.data.models || FALLBACK_MODELS;
  } catch (e) {
    console.log('fetchModels error:', e.message);
    return FALLBACK_MODELS;
  }
}

function formatCoins(coinsPerMillion) {
  // Цена за ответ (~500 токенов = 1/2000 от 1M)
  var perResponse = Math.round(coinsPerMillion / 2000);
  if (perResponse < 1) perResponse = 1;
  return perResponse >= 1000 ? (perResponse / 1000).toFixed(1) + 'k' : String(perResponse);
}

const CATEGORY_EMOJI = { economy: '💚', standard: '💛', premium: '🧡', ultra: '❤️' };

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💬 Начать чат', 'start_chat'), Markup.button.callback('🖼 Картинка', 'generate_image')],
    [Markup.button.callback('🎬 Видео', 'generate_video'), Markup.button.callback('🤖 Модель', 'choose_model')],
    [Markup.button.callback('💰 Баланс', 'balance'), Markup.button.callback('💳 Пополнить', 'topup')],
    [Markup.button.callback('📊 Стоимость', 'pricing'), Markup.button.callback('🏢 Бизнес', 'business')],
    [Markup.button.callback('❓ Помощь', 'help'), Markup.button.url('🌐 Сайт', 'https://lanaaihelper.ru')]
  ]);
}

// === START ===
bot.start(async (ctx) => {
  console.log('START command, chatId:', ctx.chat.id);
  const session = getSession(ctx.chat.id);
  session.loginStep = null;
  
  let text = '👋 *Привет! Я LANA AI*\n\n';
  text += '🤖 Доступ к лучшим нейросетям:\n';
  text += '• GPT-4o, Claude, Gemini, DeepSeek\n';
  text += '• Grok, Mistral и другие\n\n';
  text += '✨ *Наши преимущества:*\n';
  text += '• Нет тарифов — платишь только за сообщения\n';
  text += '• Коины бессрочные, не сгорают\n';
  text += '• Работает в России без VPN\n\n';
  
  if (session.token) {
    text += '✅ Ты авторизован\n';
    text += '📍 Модель: ' + session.modelName + '\n\n';
    text += 'Просто напиши сообщение!';
    await ctx.reply(text, { parse_mode: 'Markdown', ...mainMenu() });
  } else {
    text += '🔐 Для начала войди в аккаунт:';
    await ctx.reply(text, { 
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔐 Войти', 'login_start')],
        [Markup.button.url('📝 Регистрация', 'https://lanaaihelper.ru/register')],
        [Markup.button.callback('🏢 Для бизнеса', 'business')]
      ])
    });
  }
});

// === BUSINESS ===
bot.action('business', async (ctx) => {
  console.log('BUSINESS action triggered');
  await ctx.answerCbQuery();
  await ctx.reply(
    '🏢 *LANA AI для бизнеса*\n\n' +
    'Внедряем ИИ в ваши процессы:\n\n' +
    '🤖 *Чат-боты* — поддержка 24/7\n' +
    '📈 *Автоматизация продаж* — квалификация лидов\n' +
    '📝 *Контент* — тексты, посты, описания\n' +
    '📊 *Аналитика* — отчёты, инсайты\n\n' +
    '✅ Компании любого размера\n' +
    '✅ Работает в России без VPN\n' +
    '✅ Оплата в рублях\n\n' +
    '📧 Почта: `support@lanaaihelper.ru`\n' +
    '_(нажми чтобы скопировать)_',
    { 
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('📩 Оставить заявку', 'https://lanaaihelper.ru/business')],
        [Markup.button.callback('◀️ Меню', 'back_main')]
      ])
    }
  );
});

// === LOGIN ===
bot.action('login_start', async (ctx) => {
  console.log('LOGIN_START action');
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  session.loginStep = 'username';
  session.loginUsername = null;
  
  await ctx.reply(
    '🔐 *Вход в аккаунт*\n\n👤 Введи свой *логин*:',
    { parse_mode: 'Markdown', ...Markup.inlineKeyboard([
      [Markup.button.callback('❌ Отмена', 'login_cancel')]
    ])}
  );
});

bot.action('login_cancel', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  session.loginStep = null;
  await ctx.reply('❌ Вход отменён');
});

bot.command('auth', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply('❌ Формат: `/auth логин пароль`', { parse_mode: 'Markdown' });
  }
  const [username, password] = args;
  try { await ctx.deleteMessage(); } catch (e) {}
  await doLogin(ctx, username, password);
});

async function doLogin(ctx, username, password) {
  const session = getSession(ctx.chat.id);
  console.log('Attempting login for:', username);
  
  try {
    const response = await axios.post(
      API_URL + '/auth/login',
      'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    session.token = response.data.access_token;
    session.loginStep = null;
    session.loginUsername = null;
    console.log('Login success, token saved, chatId:', ctx.chat.id);
    
    try {
      const userInfo = await axios.get(API_URL + '/auth/me', {
        headers: { Authorization: 'Bearer ' + session.token }
      });
      const balance = userInfo.data.balance;
      
      await ctx.reply(
        '✅ *Вход выполнен!*\n\n' +
        '👤 ' + username + '\n' +
        '💰 Баланс: ' + balance.toLocaleString() + ' коинов\n' +
        '🤖 Модель: ' + session.modelName + '\n\n' +
        'Просто пиши сообщения!',
        { parse_mode: 'Markdown', ...mainMenu() }
      );
      // Показываем постоянную клавиатуру
      await ctx.reply('⌨️ Быстрые команды:', Markup.keyboard([
        ['🤖 Модель', '💰 Баланс'],
        ['🗑 Новый чат', '📋 Меню']
      ]).resize());
    } catch (e) {
      await ctx.reply('✅ *Вход выполнен!*', { parse_mode: 'Markdown', ...mainMenu() });
    }
  } catch (error) {
    console.log('Login failed:', error.response?.data || error.message);
    session.loginStep = null;
    await ctx.reply(
      '❌ *Неверный логин или пароль*',
      { parse_mode: 'Markdown', ...Markup.inlineKeyboard([
        [Markup.button.callback('🔐 Попробовать снова', 'login_start')],
        [Markup.button.url('📝 Регистрация', 'https://lanaaihelper.ru/register')]
      ])}
    );
  }
}

// === BALANCE ===
bot.action('balance', async (ctx) => {
  console.log('BALANCE action, chatId:', ctx.chat.id);
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  console.log('Session token exists:', !!session.token);
  
  if (!session.token) {
    return ctx.reply('🔐 Сначала войди: /start');
  }

  try {
    const response = await axios.get(API_URL + '/auth/me', {
      headers: { Authorization: 'Bearer ' + session.token }
    });
    const balance = response.data.balance;
    const rubles = (balance / 100).toFixed(2);
    
    await ctx.reply(
      '💰 *Твой баланс*\n\n' +
      '🪙 ' + balance.toLocaleString() + ' коинов\n' +
      '💵 ≈ ' + rubles + ' ₽\n\n' +
      '📍 Модель: ' + session.modelName + '\n\n' +
      '💡 _1₽ = 100 коинов, не сгорают_',
      { 
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.url('💳 Пополнить', 'https://lanaaihelper.ru/pricing')],
          [Markup.button.callback('◀️ Меню', 'back_main')]
        ])
      }
    );
  } catch (error) {
    console.log('Balance error:', error.response?.status);
    session.token = null;
    await ctx.reply('❌ Сессия истекла. Войди заново: /start');
  }
});

// === START CHAT ===
bot.action('start_chat', async (ctx) => {
  console.log('START_CHAT action');
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  console.log('Session token:', !!session.token);

  if (!session.token) {
    return ctx.reply('🔐 Сначала войди: /start');
  }

  session.conversationId = null;
  session.imageMode = false;
  await ctx.reply(
    '💬 *Новый чат!*\n\n🤖 Модель: ' + session.modelName + '\n\nПиши сообщение:',
    { parse_mode: 'Markdown' }
  );
});

// === GENERATE IMAGE ===
bot.action('generate_image', async (ctx) => {
  console.log('GENERATE_IMAGE action');
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);

  if (!session.token) {
    return ctx.reply('🔐 Сначала войди: /start');
  }

  session.imageMode = true;
  await ctx.reply(
    '🖼 *Генерация изображений*\n\n' +
    'Опиши что хочешь увидеть на картинке.\n\n' +
    '💡 *Примеры:*\n' +
    '• _Кот в космическом скафандре на Луне_\n' +
    '• _Закат над морем в стиле Ван Гога_\n' +
    '• _Футуристический город будущего_\n\n' +
    '💰 Стоимость: ~500 коинов\n\n' +
    'Напиши описание:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Назад к чату', 'back_to_chat')]
      ])
    }
  );
});

bot.action('back_to_chat', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  session.imageMode = false;
  session.videoMode = false;
  await ctx.reply('💬 Режим чата. Пиши сообщения!');
});

bot.command('image', async (ctx) => {
  const session = getSession(ctx.chat.id);
  if (!session.token) return ctx.reply('🔐 Войди: /start');

  const prompt = ctx.message.text.replace('/image', '').trim();
  if (!prompt) {
    session.imageMode = true;
    return ctx.reply(
      '🖼 *Генерация изображений*\n\n' +
      'Используй: `/image описание картинки`\n\n' +
      'Или просто напиши описание:',
      { parse_mode: 'Markdown' }
    );
  }

  await generateImage(ctx, session, prompt);
});

async function generateImage(ctx, session, prompt) {
  await ctx.sendChatAction('upload_photo');
  const processing = await ctx.reply('🎨 Генерирую изображение...\n_Это может занять 30-60 секунд_', { parse_mode: 'Markdown' });

  try {
    const response = await axios.post(API_URL + '/images/generate', {
      prompt: prompt,
      model: 'google/gemini-2.0-flash-exp-image-generation',
      aspect_ratio: '1:1',
      source: 'telegram'
    }, {
      headers: { Authorization: 'Bearer ' + session.token, 'Content-Type': 'application/json' },
      timeout: 180000
    });

    await ctx.deleteMessage(processing.message_id).catch(function() {});

    const images = response.data.images || [];
    const coinsSpent = response.data.coins_spent || 0;

    if (images.length === 0) {
      return ctx.reply('❌ Не удалось сгенерировать изображение. Попробуй другое описание.');
    }

    for (const img of images) {
      const imageUrl = img.url.startsWith('/api') ? 'http://localhost:8000' + img.url : img.url;
      try {
        await ctx.replyWithPhoto({ url: imageUrl }, {
          caption: '🖼 ' + prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '') + '\n\n_💰 -' + coinsSpent + ' коинов_',
          parse_mode: 'Markdown'
        });
      } catch (photoErr) {
        console.error('Photo send error:', photoErr.message);
        await ctx.reply('🖼 Изображение готово!\n🔗 ' + imageUrl + '\n\n_💰 -' + coinsSpent + ' коинов_', { parse_mode: 'Markdown' });
      }
    }

    session.imageMode = false;

  } catch (error) {
    await ctx.deleteMessage(processing.message_id).catch(function() {});

    if (error.response && error.response.status === 401) {
      session.token = null;
      return ctx.reply('❌ Сессия истекла: /start');
    }

    if (error.response && error.response.status === 402) {
      return ctx.reply('❌ Недостаточно коинов!\n\n💳 https://lanaaihelper.ru/pricing');
    }

    console.error('Image generation error:', error.response ? error.response.data : error.message);
    ctx.reply('❌ Ошибка генерации. Попробуй позже или другое описание.');
  }
}

// === GENERATE VIDEO ===
bot.action('generate_video', async (ctx) => {
  console.log('GENERATE_VIDEO action');
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);

  if (!session.token) {
    return ctx.reply('🔐 Сначала войди: /start');
  }

  session.videoMode = true;
  await ctx.reply(
    '🎬 *Генерация видео*\n\n' +
    'Опиши что хочешь увидеть в видео.\n\n' +
    '💡 *Примеры:*\n' +
    '• _Кот играет с мячиком на траве_\n' +
    '• _Волны на закате, замедленная съёмка_\n' +
    '• _Полёт над горами, кинематографично_\n\n' +
    '💰 Стоимость: ~2000 коинов (5 сек)\n' +
    '⏱ Время генерации: 1-3 минуты\n\n' +
    'Напиши описание:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Назад к чату', 'back_to_chat')]
      ])
    }
  );
});

bot.command('video', async (ctx) => {
  const session = getSession(ctx.chat.id);
  if (!session.token) return ctx.reply('🔐 Войди: /start');

  const prompt = ctx.message.text.replace('/video', '').trim();
  if (!prompt) {
    session.videoMode = true;
    return ctx.reply(
      '🎬 *Генерация видео*\n\n' +
      'Используй: `/video описание видео`\n\n' +
      'Или просто напиши описание:',
      { parse_mode: 'Markdown' }
    );
  }

  await generateVideo(ctx, session, prompt);
});

async function generateVideo(ctx, session, prompt) {
  await ctx.sendChatAction('record_video');
  const processing = await ctx.reply('🎬 Генерирую видео...\n_Это может занять 1-3 минуты_', { parse_mode: 'Markdown' });

  try {
    const response = await axios.post(API_URL + '/videos/generate', {
      prompt: prompt,
      model: 'wan-video/wan-2.5-t2v-fast',
      aspect_ratio: '16:9',
      duration: 5,
      source: 'telegram'
    }, {
      headers: { Authorization: 'Bearer ' + session.token, 'Content-Type': 'application/json' },
      timeout: 300000  // 5 минут таймаут
    });

    await ctx.deleteMessage(processing.message_id).catch(function() {});

    const videoUrl = response.data.video_url;
    const coinsSpent = response.data.coins_spent || 0;
    const duration = response.data.duration || 5;

    if (!videoUrl) {
      return ctx.reply('❌ Не удалось сгенерировать видео. Попробуй другое описание.');
    }

    const fullVideoUrl = videoUrl.startsWith('/api') ? 'http://localhost:8000' + videoUrl : videoUrl;

    try {
      await ctx.replyWithVideo({ url: fullVideoUrl }, {
        caption: '🎬 ' + prompt.substring(0, 80) + (prompt.length > 80 ? '...' : '') + '\n⏱ ' + duration + ' сек\n\n_💰 -' + coinsSpent + ' коинов_',
        parse_mode: 'Markdown'
      });
    } catch (videoErr) {
      console.error('Video send error:', videoErr.message);
      await ctx.reply('🎬 Видео готово!\n🔗 ' + fullVideoUrl + '\n⏱ ' + duration + ' сек\n\n_💰 -' + coinsSpent + ' коинов_', { parse_mode: 'Markdown' });
    }

    session.videoMode = false;

  } catch (error) {
    await ctx.deleteMessage(processing.message_id).catch(function() {});

    if (error.response && error.response.status === 401) {
      session.token = null;
      return ctx.reply('❌ Сессия истекла: /start');
    }

    if (error.response && error.response.status === 402) {
      return ctx.reply('❌ Недостаточно коинов!\n\n💳 https://lanaaihelper.ru/pricing');
    }

    if (error.response && error.response.status === 503) {
      return ctx.reply('❌ Сервис видео временно недоступен. Попробуй позже.');
    }

    console.error('Video generation error:', error.response ? error.response.data : error.message);
    ctx.reply('❌ Ошибка генерации видео. Попробуй позже.');
  }
}

// === TOPUP ===
bot.action('topup', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '💳 *Пополнение*\n\n1₽ = 100 коинов\nМинимум: 49₽\n\n✨ Коины не сгорают!',
    { 
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('💳 Пополнить', 'https://lanaaihelper.ru/pricing')],
        [Markup.button.callback('◀️ Меню', 'back_main')]
      ])
    }
  );
});

// === PRICING ===
bot.action('pricing', async (ctx) => {
  await ctx.answerCbQuery();
  const models = await fetchModels();
  
  let text = '📊 *Стоимость моделей*\n_Коинов за ответ_\n\n';
  
  const catNames = { economy: '💚 Экономичные', standard: '💛 Стандартные', premium: '🧡 Премиум', ultra: '❤️ Ультра' };
  
  for (const cat of ['economy', 'standard', 'premium', 'ultra']) {
    const catModels = models.filter(function(m) { return m.category === cat; });
    if (!catModels.length) continue;
    
    text += '*' + catNames[cat] + ':*\n';
    
    catModels.slice(0, 5).forEach(function(m) {
      const vision = VISION_MODELS.has(m.model_id) ? ' 📷' : '';
      text += '• ' + m.name + vision + ' — ~' + formatCoins(m.coins) + '\n';
    });
    text += '\n';
  }
  
  text += '📷 — фото\n💡 1₽ = 100 коинов';
  
  await ctx.reply(text, { 
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.url('💳 Пополнить', 'https://lanaaihelper.ru/pricing')],
      [Markup.button.callback('◀️ Меню', 'back_main')]
    ])
  });
});

// === CHOOSE MODEL ===
bot.action('choose_model', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  const models = await fetchModels();
  session.models = models;
  
  const buttons = [];
  for (const cat of ['economy', 'standard', 'premium', 'ultra']) {
    const catModels = models.filter(function(m) { return m.category === cat; }).slice(0, 5);
    for (const m of catModels) {
      const current = session.model === m.model_id ? ' ✓' : '';
      const vision = VISION_MODELS.has(m.model_id) ? '📷' : '';
      buttons.push([Markup.button.callback(
        CATEGORY_EMOJI[cat] + ' ' + m.name + ' ' + vision + ' ~' + formatCoins(m.coins) + current, 
        'model:' + m.model_id
      )]);
    }
  }
  buttons.push([Markup.button.callback('◀️ Меню', 'back_main')]);
  
  await ctx.reply(
    '🤖 *Выбери модель*\n\nТекущая: ' + session.modelName + '\n📷 — фото',
    { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) }
  );
});

bot.action(/model:(.+)/, async (ctx) => {
  const modelId = ctx.match[1];
  const session = getSession(ctx.chat.id);
  const models = session.models || FALLBACK_MODELS;
  const model = models.find(function(m) { return m.model_id === modelId; });
  
  if (model) {
    session.model = model.model_id;
    session.modelName = model.name;
    session.conversationId = null;
  }
  
  await ctx.answerCbQuery('✓ ' + (model ? model.name : ''));
  await ctx.editMessageText(
    '✅ *Модель: ' + (model ? model.name : '') + '*\n💰 ~' + formatCoins(model ? model.coins : 0) + '/ответ\n\nПиши сообщения!',
    { parse_mode: 'Markdown', ...mainMenu() }
  );
});

// === HELP ===
bot.action('help', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    '❓ *Помощь*\n\n' +
    '1️⃣ Войди в аккаунт\n' +
    '2️⃣ Выбери модель\n' +
    '3️⃣ Пиши сообщения\n\n' +
    '/start — Меню\n' +
    '/model — Модель\n' +
    '/balance — Баланс\n' +
    '/new — Новый диалог',
    { 
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('📖 Подробнее', 'https://lanaaihelper.ru/about')],
        [Markup.button.callback('◀️ Меню', 'back_main')]
      ])
    }
  );
});

// === BACK TO MAIN ===
bot.action('back_main', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx.chat.id);
  
  await ctx.editMessageText(
    '🏠 *Меню*\n\n🤖 ' + session.modelName + '\n' + (session.token ? '✅ Авторизован' : '🔐 Не авторизован'),
    { parse_mode: 'Markdown', ...mainMenu() }
  );
});

// === COMMANDS ===
bot.command('model', async (ctx) => {
  const session = getSession(ctx.chat.id);
  const models = await fetchModels();
  session.models = models;
  
  const buttons = [];
  for (const cat of ['economy', 'standard', 'premium', 'ultra']) {
    const catModels = models.filter(function(m) { return m.category === cat; }).slice(0, 5);
    for (const m of catModels) {
      const current = session.model === m.model_id ? ' ✓' : '';
      buttons.push([Markup.button.callback(
        CATEGORY_EMOJI[cat] + ' ' + m.name + ' ~' + formatCoins(m.coins) + current,
        'model:' + m.model_id
      )]);
    }
  }
  buttons.push([Markup.button.callback('◀️ Меню', 'back_main')]);
  
  await ctx.reply('🤖 *Выбери модель:*', { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) });
});

bot.command('balance', async (ctx) => {
  const session = getSession(ctx.chat.id);
  if (!session.token) return ctx.reply('🔐 Войди: /start');
  
  try {
    const response = await axios.get(API_URL + '/auth/me', {
      headers: { Authorization: 'Bearer ' + session.token }
    });
    const balance = response.data.balance;
    await ctx.reply('💰 Баланс: ' + balance.toLocaleString() + ' коинов');
  } catch (e) {
    session.token = null;
    await ctx.reply('❌ Сессия истекла: /start');
  }
});

bot.command('new', async (ctx) => {
  const session = getSession(ctx.chat.id);
  session.conversationId = null;
  await ctx.reply('🗑 Новый диалог!');
});

// === TEXT MESSAGE ===
// Обработка кнопок reply keyboard
bot.hears('🤖 Модель', async (ctx) => {
  const session = getSession(ctx.chat.id);
  const models = await fetchModels();
  session.models = models;
  
  const buttons = [];
  for (const cat of ['economy', 'standard', 'premium', 'ultra']) {
    const catModels = models.filter(function(m) { return m.category === cat; }).slice(0, 4);
    for (const m of catModels) {
      const current = session.model === m.model_id ? ' ✓' : '';
      const vision = VISION_MODELS.has(m.model_id) ? '📷' : '';
      buttons.push([Markup.button.callback(
        CATEGORY_EMOJI[cat] + ' ' + m.name + ' ' + vision + ' ~' + formatCoins(m.coins) + current,
        'model:' + m.model_id
      )]);
    }
  }
  buttons.push([Markup.button.callback('◀️ Закрыть', 'close_menu')]);
  
  await ctx.reply('🤖 *Выбери модель:*\nТекущая: ' + session.modelName, 
    { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) });
});

bot.hears('💰 Баланс', async (ctx) => {
  const session = getSession(ctx.chat.id);
  if (!session.token) return ctx.reply('🔐 Войди: /start');
  
  try {
    const response = await axios.get(API_URL + '/auth/me', {
      headers: { Authorization: 'Bearer ' + session.token }
    });
    const balance = response.data.balance;
    await ctx.reply('💰 ' + balance.toLocaleString() + ' коинов\n🤖 ' + session.modelName);
  } catch (e) {
    session.token = null;
    await ctx.reply('❌ Сессия истекла: /start');
  }
});

bot.hears('🗑 Новый чат', async (ctx) => {
  const session = getSession(ctx.chat.id);
  session.conversationId = null;
  await ctx.reply('🗑 Новый диалог начат!');
});

bot.hears('📋 Меню', async (ctx) => {
  const session = getSession(ctx.chat.id);
  await ctx.reply(
    '🏠 *Меню*\n\n🤖 ' + session.modelName + '\n' + (session.token ? '✅ Авторизован' : '🔐 Не авторизован'),
    { parse_mode: 'Markdown', ...mainMenu() }
  );
});

bot.action('close_menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage().catch(function() {});
});

bot.on('text', async (ctx) => {
  const session = getSession(ctx.chat.id);
  const text = ctx.message.text;

  // Login step: username
  if (session.loginStep === 'username') {
    session.loginUsername = text;
    session.loginStep = 'password';
    await ctx.reply(
      '👤 Логин: `' + text + '`\n\n🔑 Введи *пароль*:',
      { parse_mode: 'Markdown', ...Markup.inlineKeyboard([
        [Markup.button.callback('❌ Отмена', 'login_cancel')]
      ])}
    );
    return;
  }

  // Login step: password
  if (session.loginStep === 'password') {
    try { await ctx.deleteMessage(); } catch (e) {}
    await doLogin(ctx, session.loginUsername, text);
    return;
  }

  // Regular message
  if (!session.token) {
    return ctx.reply('🔐 Сначала войди: /start');
  }

  // Image generation mode
  if (session.imageMode) {
    await generateImage(ctx, session, text);
    return;
  }

  // Video generation mode
  if (session.videoMode) {
    await generateVideo(ctx, session, text);
    return;
  }

  await ctx.sendChatAction('typing');
  const typing = await ctx.reply('⏳ Думаю...');

  try {
    const response = await axios.post(API_URL + '/chat/send', {
      message: text,
      ai_model: session.model,
      source: "telegram",
      conversation_id: session.conversationId
    }, {
      headers: { Authorization: 'Bearer ' + session.token, 'Content-Type': 'application/json' },
      timeout: 120000
    });

    session.conversationId = response.data.conversation_id;
    const aiMessage = response.data.assistant_message.content;
    const coinsSpent = response.data.coins_spent || 0;

    await ctx.deleteMessage(typing.message_id).catch(function() {});
    
    if (aiMessage.length > 4000) {
      const parts = aiMessage.match(/.{1,4000}/gs) || [];
      for (const part of parts) {
        await ctx.reply(part, { parse_mode: 'Markdown' }).catch(function() { return ctx.reply(part); });
      }
    } else {
      await ctx.reply(aiMessage, { parse_mode: 'Markdown' }).catch(function() { return ctx.reply(aiMessage); });
    }
    
    if (coinsSpent > 50) {
      await ctx.reply('_💰 -' + coinsSpent + '_', { parse_mode: 'Markdown' });
    }
  } catch (error) {
    await ctx.deleteMessage(typing.message_id).catch(function() {});
    
    if (error.response && error.response.status === 401) {
      session.token = null;
      return ctx.reply('❌ Сессия истекла: /start');
    }
    
    if (error.response && error.response.status === 402) {
      return ctx.reply('❌ Недостаточно коинов!\n\n💳 https://lanaaihelper.ru/pricing');
    }
    
    console.error('Error:', error.response ? error.response.data : error.message);
    ctx.reply('❌ Ошибка. Попробуй позже.');
  }
});

bot.catch(function(err) {
  // Ignore "message is not modified" error - it's harmless
  if (err.description && err.description.includes('message is not modified')) {
    return;
  }
  console.error('Bot error:', err);
});

bot.launch().then(function() { console.log('🤖 LANA AI Bot v3.3 started!'); });

process.once('SIGINT', function() { bot.stop('SIGINT'); });
process.once('SIGTERM', function() { bot.stop('SIGTERM'); });
