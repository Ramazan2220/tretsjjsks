const crypto = require('crypto');

// Telegram Bot Token для проверки подписи
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';

/**
 * Проверка подлинности данных от Telegram
 */
function verifyTelegramWebAppData(telegramInitData) {
    if (!telegramInitData) return false;
    
    try {
        const urlParams = new URLSearchParams(telegramInitData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        
        // Сортируем параметры
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        // Создаем секретный ключ
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(BOT_TOKEN)
            .digest();
        
        // Проверяем подпись
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
        
        return calculatedHash === hash;
    } catch (error) {
        console.error('❌ Telegram auth error:', error);
        return false;
    }
}

/**
 * Middleware для защиты от прямого доступа
 */
function telegramAuthMiddleware(req, res, next) {
    const telegramData = req.headers['x-telegram-init-data'];
    const userAgent = req.headers['user-agent'] || '';
    
    // В development режиме пропускаем проверку
    if (process.env.NODE_ENV === 'development') {
        console.log('🔓 Development mode - skipping auth');
        return next();
    }
    
    // Проверяем User-Agent на Telegram
    const isTelegramUA = userAgent.includes('TelegramBot') || 
                        userAgent.includes('Telegram') ||
                        req.headers['x-requested-with'] === 'org.telegram.messenger';
    
    // Проверяем Telegram данные
    const isValidTelegram = telegramData && verifyTelegramWebAppData(telegramData);
    
    if (!isTelegramUA && !isValidTelegram) {
        // Блокируем прямой доступ
        res.status(403).json({
            error: 'Access denied',
            message: 'This application can only be accessed through Telegram',
            code: 'TELEGRAM_ONLY'
        });
        return;
    }
    
    // Добавляем пользователя в request
    if (telegramData && isValidTelegram) {
        try {
            const urlParams = new URLSearchParams(telegramData);
            const userParam = urlParams.get('user');
            if (userParam) {
                req.telegramUser = JSON.parse(userParam);
                console.log(`👤 Authenticated user: ${req.telegramUser.id}`);
            }
        } catch (error) {
            console.error('❌ Error parsing user data:', error);
        }
    }
    
    next();
}

/**
 * Простая защита от прямого доступа (без Telegram)
 */
function basicTelegramCheck(req, res, next) {
    const referer = req.headers.referer || '';
    const userAgent = req.headers['user-agent'] || '';
    
    // В development режиме пропускаем
    if (process.env.NODE_ENV === 'development') {
        return next();
    }
    
    // Проверяем признаки Telegram
    const isTelegram = userAgent.includes('Telegram') || 
                      referer.includes('t.me') ||
                      req.headers['x-requested-with'] === 'org.telegram.messenger';
    
    if (!isTelegram) {
        res.status(403).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Access Denied</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        background: #2a2a2a;
                        color: white;
                        padding: 50px;
                    }
                    .container {
                        max-width: 500px;
                        margin: 0 auto;
                        background: #1a1a1a;
                        padding: 40px;
                        border-radius: 15px;
                        border: 2px solid #00ff88;
                    }
                    .icon { font-size: 64px; margin-bottom: 20px; }
                    h1 { color: #00ff88; margin-bottom: 20px; }
                    p { margin-bottom: 15px; line-height: 1.6; }
                    .telegram-btn {
                        display: inline-block;
                        background: #0088cc;
                        color: white;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 10px;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">🦅</div>
                    <h1>Access Denied</h1>
                    <p>This application is exclusively available through Telegram.</p>
                    <p>Please use the official Telegram bot to access Eagle Scanner.</p>
                    <a href="https://t.me/eagle_scanner_bot" class="telegram-btn">
                        Open in Telegram
                    </a>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    next();
}

module.exports = {
    verifyTelegramWebAppData,
    telegramAuthMiddleware,
    basicTelegramCheck
}; 