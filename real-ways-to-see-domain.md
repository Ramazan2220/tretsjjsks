# 👀 Реальные способы увидеть домен Mini App

## ✅ **Способ 1: Telegram Desktop + DevTools**

### Шаги:
1. Откройте **Telegram Desktop** (не веб-версию!)
2. Найдите любого бота с Mini App (например @wallet, @gameee)
3. Нажмите кнопку запуска Mini App
4. **Сразу же нажмите F12** (или Ctrl+Shift+I)
5. Перейдите в **Console** и введите:

```javascript
window.location.href
// Покажет: "https://domain.com/path"

window.location.hostname
// Покажет: "domain.com"
```

### Пример реального результата:
```
> window.location.href
"https://tgapp-backend.herokuapp.com/"

> window.location.hostname  
"tgapp-backend.herokuapp.com"
```

## ✅ **Способ 2: Network запросы в DevTools**

### После открытия DevTools:
1. Перейдите во вкладку **Network**
2. Обновите страницу (Ctrl+R)
3. Увидите ВСЕ запросы с доменами:

```
GET https://domain.com/index.html
GET https://domain.com/styles.css  
GET https://domain.com/renderer.js
POST https://api.trongrid.io/v1/accounts/...
GET https://domain.com/api/bsc/0x123...
```

## ✅ **Способ 3: Через исходный код страницы**

### В DevTools:
1. Вкладка **Elements** 
2. Посмотрите на `<head>` секцию
3. Увидите:

```html
<base href="https://your-domain.com/">
<link rel="stylesheet" href="https://your-domain.com/styles.css">
<script src="https://your-domain.com/renderer.js"></script>
```

## ✅ **Способ 4: Telegram Web (web.telegram.org)**

### Шаги:
1. Откройте **web.telegram.org** в браузере
2. Залогиньтесь
3. Найдите бота с Mini App
4. Запустите Mini App
5. **F12 → Console:**

```javascript
window.location.href
// Покажет полный URL Mini App
```

## ✅ **Способ 5: Перехват трафика (продвинутый)**

### Используя Burp Suite или аналоги:
1. Настройте прокси в системе
2. Откройте Telegram
3. Запустите Mini App
4. В прокси увидите ВСЕ запросы:

```
GET https://your-mini-app.com/
Host: your-mini-app.com
User-Agent: Mozilla/5.0... TelegramBot...
```

## ✅ **Способ 6: Через мобильное приложение (Android)**

### Если включен USB Debugging:
1. Подключите телефон к компьютеру
2. Откройте Chrome на компьютере
3. Перейдите в `chrome://inspect`
4. Найдите "Remote Target" с Telegram
5. Нажмите "Inspect"
6. Получите полные DevTools для мобильного Telegram!

## 🚨 **Что видно в вашем приложении ПРЯМО СЕЙЧАС:**

### Попробуйте с любым ботом:
- @wallet - криптокошелек
- @gameee - игровая платформа  
- @notcoin_bot - Notcoin игра

### Откроете DevTools и увидите:
```javascript
// В Console:
> window.location.href
"https://wallet.tg/"

// В Network:
GET https://wallet.tg/api/user/balance
POST https://wallet.tg/api/transaction/send

// В Sources:
├── https://wallet.tg/
│   ├── main.js        ← Весь код открыт!
│   ├── config.js      ← Конфигурация
│   └── api.js         ← API endpoints
```

## 💡 **Проверьте прямо сейчас:**

1. **Откройте @wallet в Telegram Desktop**
2. **Нажмите "Open Wallet"** 
3. **Сразу F12**
4. **Console → window.location.href**

**Результат:** `https://wallet.tg/`

Домен виден сразу! 👀

## 🛡️ **Почему это проблема:**

### Злоумышленник может:
```bash
# 1. Узнать домен
https://your-eagle-scanner.com

# 2. Скачать весь сайт
wget -r -p -E -k https://your-eagle-scanner.com

# 3. Изменить кошельки на свои
# Заменить TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7
# на СВОЙ_КОШЕЛЕК_ЗЛОУМЫШЛЕННИКА

# 4. Залить на свой домен
# fake-eagle-scanner.com

# 5. Создать фейкового бота
# @fake_eagle_scanner_bot

# 6. Получать ВСЕ платежи! 💸
```

## ✅ **Единственная защита:**

### НЕ храните критические данные в frontend!
```javascript
// ❌ В renderer.js (видно всем):
const wallets = ["ВАШИ_КОШЕЛЬКИ"];
const prices = { boost: 30 };

// ✅ На сервере (скрыто):
app.post('/api/get-wallet', auth, (req, res) => {
    const wallet = getSecureWallet();
    res.json({ wallet });
});
```

**Вывод: Домен ВСЕГДА виден в Mini App! Защищайтесь правильной архитектурой! 🛡️** 