# 🤖 Настройка Telegram Бота с Mini App

## Шаг 1: Создание бота

1. **Откройте @BotFather в Telegram**
2. **Отправьте команду:** `/newbot`
3. **Введите имя бота:** `Eagle Scanner Bot`
4. **Введите username:** `eagle_scanner_bot` (должен заканчиваться на `_bot`)

### Получите токен бота:
```
Token: 7123456789:AAEhBjA7qwertyuiop1234567890
```

## Шаг 2: Создание Mini App

1. **В @BotFather отправьте:** `/newapp`
2. **Выберите вашего бота:** `@eagle_scanner_bot`
3. **Введите название:** `Eagle Scanner`
4. **Введите описание:** `Advanced crypto wallet scanner with boost system`
5. **Загрузите иконку:** 512x512px (PNG)
6. **Введите URL вашего приложения:** `https://ваш-домен.com`

### Для тестирования можно использовать:
- **ngrok:** `https://abc123.ngrok.io`
- **GitHub Pages:** `https://username.github.io/eagle-scanner`
- **Vercel:** `https://eagle-scanner.vercel.app`

## Шаг 3: Настройка команд бота

В @BotFather отправьте `/setcommands` и укажите:

```
start - 🚀 Launch Eagle Scanner
help - ❓ Get help
scanner - 📱 Open Scanner App
market - 🛒 Open Market
profile - 👤 View Profile
```

## Шаг 4: Настройка Web App

В @BotFather отправьте `/setwebapp` и укажите URL вашего приложения. 