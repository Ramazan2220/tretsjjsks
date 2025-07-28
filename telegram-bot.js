const TelegramBot = require('node-telegram-bot-api');

// Замените на ваш токен бота
const BOT_TOKEN = '8223532804:AAHXZ_u0qM9NOFrnPp5-I6Ey0GmrfGLteAg';
const WEB_APP_URL = 'https://t.me/Eagle_Scanner_bot/EScanner'; // URL вашего приложения

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Eagle Scanner Bot started!');

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'User';
    
    console.log(`👤 User ${firstName} (${userId}) started the bot`);
    
    const welcomeMessage = `
🦅 *Добро пожаловать в Eagle Scanner!*

Привет, ${firstName}! 👋

Eagle Scanner - это продвинутый сканер криптокошельков с системой бустов.

🚀 *Возможности:*
• Сканирование кошельков с высокой скоростью
• Система бустов для увеличения скорости
• NFT детектор
• Джекпот система
• Рынок апгрейдов

💰 *Тарифы:*
• Базовая скорость: 1 кошелек/сек
• С бустами: до 100 кошельков/сек
• Find Rate: от 5% до 70%

Нажмите кнопку ниже, чтобы запустить приложение! 👇
    `;
    
    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🚀 Запустить Eagle Scanner',
                        web_app: { url: WEB_APP_URL }
                    }
                ],
                [
                    {
                        text: '🛒 Открыть Маркет',
                        web_app: { url: `${WEB_APP_URL}#market` }
                    }
                ],
                [
                    {
                        text: '🎮 Джекпот',
                        web_app: { url: `${WEB_APP_URL}#games` }
                    },
                    {
                        text: '👤 Профиль',
                        callback_data: 'profile'
                    }
                ],
                [
                    {
                        text: '❓ Помощь',
                        callback_data: 'help'
                    },
                    {
                        text: '📊 Статистика',
                        callback_data: 'stats'
                    }
                ]
            ]
        }
    };
    
    bot.sendMessage(chatId, welcomeMessage, options);
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `
❓ *Помощь - Eagle Scanner*

🔧 *Команды бота:*
/start - Главное меню
/help - Эта помощь
/profile - Информация о профиле
/market - Открыть маркет
/scanner - Запустить сканер

🚀 *Как использовать:*

1️⃣ *Запуск сканера*
• Нажмите "Запустить Eagle Scanner"
• Выберите криптовалюты для поиска
• Нажмите "Start Neural Scan"

2️⃣ *Покупка бустов*
• Откройте "Маркет"
• Выберите нужный буст
• Оплатите USDT/BNB/TRX
• Буст активируется автоматически

3️⃣ *Джекпот система*
• Играйте в Lucky Wheel
• Выигрывайте мощные бусты
• Кулдаун после выигрыша

💡 *Тарифы:*
• 10x Boost - 30 USDT
• 20x Boost - 50 USDT  
• 50x Boost - 100 USDT
• 100x Boost - 150 USDT
• NFT Scanner - 30 USDT

🆘 *Поддержка:* @support_username
    `;
    
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Команда /profile
bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'User';
    
    const profileMessage = `
👤 *Профиль пользователя*

🆔 *ID:* \`${userId}\`
👤 *Имя:* ${firstName}
📅 *Дата регистрации:* ${new Date().toLocaleDateString()}

🚀 *Статус бустов:*
Для просмотра активных бустов откройте приложение.

💰 *Статистика:*
• Кошельков просканировано: -
• Найдено токенов: -
• Активных бустов: -

📱 Откройте приложение для подробной статистики!
    `;
    
    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '📱 Открыть приложение',
                        web_app: { url: WEB_APP_URL }
                    }
                ]
            ]
        }
    };
    
    bot.sendMessage(chatId, profileMessage, options);
});

// Обработка callback кнопок
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = message.chat.id;
    const userId = callbackQuery.from.id;
    
    console.log(`🔘 Callback: ${data} from user ${userId}`);
    
    // Отвечаем на callback чтобы убрать "загрузку"
    bot.answerCallbackQuery(callbackQuery.id);
    
    switch (data) {
        case 'profile':
            bot.sendMessage(chatId, `
👤 *Ваш профиль*

🆔 User ID: \`${userId}\`
📱 Telegram: @${callbackQuery.from.username || 'No username'}
🎮 Статус: Активный пользователь

🚀 Для подробной информации откройте приложение!
            `, { 
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '📱 Открыть приложение', web_app: { url: WEB_APP_URL } }
                    ]]
                }
            });
            break;
            
        case 'help':
            bot.sendMessage(chatId, `
❓ *Быстрая помощь*

🚀 *Основные функции:*
• Сканирование кошельков
• Покупка бустов
• Джекпот игры
• NFT детектор

💰 *Оплата:*
• USDT (TRC-20)
• BNB (BSC)
• TRX (TRON)

🆘 *Поддержка:* @support_username
            `, { parse_mode: 'Markdown' });
            break;
            
        default:
            // Обработка копирования кода
            if (data.startsWith('copy_code_')) {
                const code = data.replace('copy_code_', '');
                bot.answerCallbackQuery(callbackQuery.id, `✅ Код ${code} скопирован!`);
                console.log(`📋 Code ${code} copied by user ${userId}`);
            }
            break;
            
        case 'stats':
            bot.sendMessage(chatId, `
📊 *Статистика Eagle Scanner*

👥 *Общая статистика:*
• Активных пользователей: 1,234
• Кошельков просканировано: 5,678,901
• Найдено токенов: 12,345
• Выплачено наград: $45,678

🚀 *Популярные бусты:*
• 10x Boost - 45% пользователей
• 100x Boost - 23% пользователей
• NFT Scanner - 67% пользователей

📈 *Сегодня:*
• Новых пользователей: +89
• Активных сканирований: 456
• Покупок в маркете: 23
            `, { parse_mode: 'Markdown' });
            break;
    }
});

// Обработка сообщений от Web App
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app.data);
    
    console.log('📱 Web App Data:', data);
    
    // Обработка различных событий от приложения
    switch (data.type) {
        case 'admin_boost_grant':
            // НОВОЕ: Админ выдает буст пользователю
            handleAdminBoostGrant(chatId, data);
            break;
            
        case 'purchase_completed':
            bot.sendMessage(chatId, `
✅ *Покупка успешна!*

🛒 Товар: ${data.productName}
💰 Сумма: ${data.amount} ${data.currency}
⏰ Длительность: ${data.duration}

Буст активирован! Удачного сканирования! 🚀
            `, { parse_mode: 'Markdown' });
            break;
            
        case 'jackpot_win':
            bot.sendMessage(chatId, `
🎉 *ДЖЕКПОТ!*

🎰 Выпало: ${data.symbols}
🚀 Выигрыш: ${data.boost}
⏰ Длительность: ${data.duration}

Поздравляем с выигрышем! 🎊
            `, { parse_mode: 'Markdown' });
            break;
            
        case 'scan_completed':
            bot.sendMessage(chatId, `
📊 *Сканирование завершено*

🔍 Просканировано: ${data.scanned} кошельков
💰 Найдено: ${data.found} токенов
⚡ Скорость: ${data.speed} кошельков/сек

Отличная работа! 💪
            `, { parse_mode: 'Markdown' });
            break;
    }
});

// === НОВАЯ ФУНКЦИЯ: Обработка выдачи буста админом ===
async function handleAdminBoostGrant(adminChatId, data) {
    console.log('🔐 Admin boost grant received:', data);
    
    const { targetUserId, boostData, activationCode, adminId } = data;
    
    try {
        // Отправляем уведомление целевому пользователю с кодом
        const timeLeft = Math.round((boostData.endTime - Date.now()) / 60000);
        const notificationMessage = `
🎉 *Вам выдан буст от админа!*

🚀 *Буст:* ${boostData.productName}
⚡ *Мультипликатор:* ${boostData.multiplier}x
⏰ *Длительность:* ${timeLeft} минут

🔑 *Код активации:* \`${activationCode}\`

👨‍💼 *От админа:* ${adminId}

Введите код в приложении для активации! 👇
        `;
        
        // Отправляем уведомление пользователю с кнопкой активации
        await bot.sendMessage(targetUserId, notificationMessage, { 
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🚀 Открыть приложение',
                            web_app: { url: WEB_APP_URL }
                        }
                    ],
                    [
                        {
                            text: '📋 Копировать код',
                            callback_data: `copy_code_${activationCode}`
                        }
                    ]
                ]
            }
        });
        
        console.log(`✅ Boost notification with code sent to user ${targetUserId}`);
        
        // Отправляем подтверждение админу
        await bot.sendMessage(adminChatId, `✅ Буст ${boostData.multiplier}x с кодом ${activationCode} отправлен пользователю ${targetUserId}!`);
        
    } catch (error) {
        console.error('❌ Error sending boost notification:', error);
        
        // Уведомляем админа об ошибке
        try {
            await bot.sendMessage(adminChatId, `❌ Ошибка отправки буста пользователю ${targetUserId}: ${error.message}`);
        } catch (e) {
            console.error('❌ Failed to send error message to admin:', e);
        }
    }
}

// Обработка ошибок
bot.on('error', (error) => {
    console.error('❌ Bot error:', error);
});

bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error);
});

console.log('✅ Eagle Scanner Bot is ready!');
console.log('📱 Web App URL:', WEB_APP_URL);
console.log('🔗 Bot link: https://t.me/eagle_scanner_bot');

module.exports = bot; 
