# 🚀 Деплой Eagle Scanner в Telegram

## Шаг 1: Подготовка к деплою

### 📦 Установите зависимости
```bash
npm install
```

### 🔧 Настройте токен бота
Отредактируйте `telegram-bot.js`:
```javascript
const BOT_TOKEN = 'YOUR_ACTUAL_BOT_TOKEN';
const WEB_APP_URL = 'https://your-actual-domain.com';
```

## Шаг 2: Деплой Web App

### Вариант A: Vercel (Рекомендуемый)
1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Добавьте `vercel.json`:
```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

### Вариант B: Heroku
1. Создайте `Procfile`:
```
web: node server.js
```
2. Деплойте через Git:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Вариант C: VPS/Dedicated Server
```bash
# На вашем сервере
git clone https://github.com/your-username/eagle-scanner.git
cd eagle-scanner
npm install
pm2 start server.js --name "eagle-scanner-web"
pm2 start telegram-bot.js --name "eagle-scanner-bot"
pm2 save
```

## Шаг 3: Настройка домена и HTTPS

### Для Telegram Mini App ОБЯЗАТЕЛЕН HTTPS!

1. **Настройте домен** (например: `eagle-scanner.your-domain.com`)
2. **Получите SSL сертификат** (Let's Encrypt, Cloudflare)
3. **Проверьте HTTPS** - откройте URL в браузере

## Шаг 4: Настройка Telegram бота

### 🤖 Создание бота в @BotFather
```
/newbot
Eagle Scanner Bot
eagle_scanner_bot

/newapp
@eagle_scanner_bot
Eagle Scanner
Advanced crypto wallet scanner with boost system
https://your-domain.com

/setcommands
start - 🚀 Launch Eagle Scanner
help - ❓ Get help
profile - 👤 View Profile
market - 🛒 Open Market

/setdescription
@eagle_scanner_bot
🦅 Eagle Scanner - Advanced crypto wallet scanner with boost system

Scan wallets at lightning speed:
• Base speed: 1 wallet/sec
• With boosts: up to 100 wallets/sec
• Find Rate: from 5% to 70%
• NFT detector included
• Jackpot system
• Multiple payment options: USDT, BNB, TRX

Launch the app and start earning! 💰

/setabouttext
@eagle_scanner_bot
🚀 Professional crypto wallet scanner
💰 Earn tokens through advanced scanning
🎮 Mini-app available 24/7
```

## Шаг 5: Запуск бота

### Локальный запуск (для тестирования)
```bash
# Запуск Web App
npm run web

# Запуск Telegram бота (в отдельном терминале)
npm run bot
```

### Production запуск
```bash
# На VPS с PM2
pm2 start ecosystem.config.js
```

Создайте `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'eagle-scanner-web',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'eagle-scanner-bot',
      script: 'telegram-bot.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

## Шаг 6: Тестирование

1. **Откройте бота**: `https://t.me/eagle_scanner_bot`
2. **Нажмите /start**
3. **Нажмите "🚀 Запустить Eagle Scanner"**
4. **Проверьте все функции**:
   - Сканирование
   - Покупка тест-буста
   - Джекпот система
   - Маркет

## Шаг 7: Мониторинг

### Логи приложения
```bash
# PM2 логи
pm2 logs eagle-scanner-web
pm2 logs eagle-scanner-bot

# Проверка статуса
pm2 status
```

### Проверка API
```bash
# Проверка Web App
curl https://your-domain.com

# Проверка BSC API прокси
curl https://your-domain.com/api/bsc/0x0476d0b67e7e7e2654F16b31F807868FAf726588
```

## Шаг 8: Обновления

```bash
# Обновление кода
git pull origin main
npm install

# Перезапуск сервисов
pm2 restart eagle-scanner-web
pm2 restart eagle-scanner-bot
```

## 🔒 Безопасность

1. **Никогда не коммитьте токены**
2. **Используйте переменные окружения**
3. **Регулярно обновляйте зависимости**
4. **Мониторьте логи на ошибки**

## 📱 Полезные ссылки

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Mini App Development](https://core.telegram.org/bots/webapps)
- [Vercel Deployment](https://vercel.com/docs)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

## 🆘 Поддержка

Если возникли проблемы:
1. Проверьте логи приложения
2. Убедитесь что HTTPS работает
3. Проверьте токен бота
4. Убедитесь что URL правильный 