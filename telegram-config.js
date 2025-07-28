// Конфигурация для Telegram Bot
// Используйте этот код в вашем Telegram боте

const TelegramBot = require('node-telegram-bot-api');

// Замените на ваш токен от @BotFather
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// URL где размещено ваше приложение
const WEB_APP_URL = 'https://your-domain.com'; // или http://localhost:3000 для тестирования

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Настройка команд бота
bot.setMyCommands([
    { command: 'start', description: '🚀 Запустить бота' },
    { command: 'scanner', description: '🔍 Открыть Crypto Scanner' },
    { command: 'help', description: '❓ Помощь' }
]);

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'Anonymous';
    
    const welcomeMessage = `
🚀 *Добро пожаловать в Crypto Scanner Bot!*

Привет, ${userName}! 

🎮 Этот бот предоставляет доступ к футуристичному симулятору сканирования криптовалютных кошельков.

🌟 *Особенности:*
• Киберпанк интерфейс с неоновыми эффектами
• Симуляция поиска скрытых кошельков
• Интерактивная консоль сканирования
• Система находок и балансов

⚡ *Команды:*
/scanner - Открыть приложение
/help - Получить помощь

🔍 Нажмите кнопку ниже, чтобы начать сканирование!
    `;
    
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{
                    text: '🔍 Открыть Scanner',
                    web_app: { url: WEB_APP_URL }
                }],
                [{
                    text: '❓ Помощь',
                    callback_data: 'help'
                }]
            ]
        }
    });
});

// Команда /scanner
bot.onText(/\/scanner/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, '🚀 *Запуск Crypto Scanner...*', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[{
                text: '🔍 Открыть Neural Scanner',
                web_app: { url: WEB_APP_URL }
            }]]
        }
    });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `
🔧 *Crypto Scanner Bot - Помощь*

📱 *Как использовать:*
1. Нажмите кнопку "Открыть Scanner"
2. Выберите сеть для сканирования
3. Запустите Neural Scan
4. Ждите находки кошельков!

🎯 *Предустановленные находки:*
• 1,247 сканов → BTC кошелек
• 2,891 сканов → ETH кошелек  
• 4,156 сканов → SOL кошелек

⚠️ *Дисклеймер:*
Это симулятор в образовательных целях. Реальный поиск чужих кошельков незаконен.

🔗 *Поддержка:* @your_support_channel
    `;
    
    bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'Markdown'
    });
});

// Обработка inline кнопок
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    
    if (data === 'help') {
        bot.answerCallbackQuery(callbackQuery.id);
        bot.sendMessage(message.chat.id, `
🔧 *Crypto Scanner Bot - Помощь*

📱 *Как использовать:*
1. Нажмите кнопку "Открыть Scanner"
2. Выберите сеть для сканирования
3. Запустите Neural Scan
4. Ждите находки кошельков!

🎯 *Автоматические находки на:*
• 1,247 сканах → BTC кошелек
• 2,891 сканах → ETH кошелек  
• 4,156 сканах → SOL кошелек

⚠️ *Дисклеймер:*
Это симулятор в образовательных целях.
        `, {
            parse_mode: 'Markdown'
        });
    }
});

// Обработка Web App данных
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app.data);
    
    // Здесь можно обработать данные, отправленные из Web App
    console.log('Получены данные из Web App:', data);
    
    // Пример ответа
    bot.sendMessage(chatId, `✅ Получены данные: ${JSON.stringify(data)}`);
});

// Логирование
bot.on('polling_error', (error) => {
    console.log('Polling error:', error);
});

console.log('🤖 Telegram Bot запущен!');
console.log(`📱 Web App URL: ${WEB_APP_URL}`);
console.log('⚡ Бот готов к работе...');

module.exports = bot; 