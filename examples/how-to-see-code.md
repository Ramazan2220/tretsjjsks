# 👀 Как пользователи видят ваш код

## 🖥️ На компьютере (Telegram Desktop)

### Шаг 1: Открыть Mini App
1. Открыть бота в Telegram Desktop
2. Нажать кнопку Mini App
3. Приложение открывается во встроенном браузере

### Шаг 2: Открыть DevTools
```
Правая кнопка мыши → "Inspect Element"
ИЛИ
F12
ИЛИ
Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (Mac)
```

### Шаг 3: Просмотр кода
```javascript
// Вкладка "Sources" показывает все файлы:
├── https://your-domain.com/
│   ├── index.html          ← HTML структура
│   ├── styles.css          ← Все стили
│   ├── renderer.js         ← ВСЯ логика приложения!
│   └── images/             ← Картинки
```

### Шаг 4: Просмотр сетевых запросов
```
DevTools → Network → All
Видно ВСЕ запросы:
- GET https://your-domain.com/api/bsc/0x123...
- POST https://api.trongrid.io/v1/accounts/...
- Все API ключи в заголовках!
```

## 📱 На телефоне (сложнее, но возможно)

### Вариант A: Telegram Web
1. Открыть web.telegram.org в браузере
2. Найти бота, открыть Mini App
3. F12 в браузере → те же DevTools

### Вариант B: Debugging на Android
1. Chrome → Settings → Developer options
2. USB Debugging → Connect device
3. chrome://inspect → Remote Target

### Вариант C: Proxy перехват
```
Burp Suite / OWASP ZAP:
- Перехватывает весь трафик
- Показывает все запросы и ответы
- Видит домены, API endpoints, данные
```

## 🕵️ Что конкретно видно в вашем приложении:

### В renderer.js пользователь увидит:
```javascript
// Все ваши кошельки для тестов!
this.walletPool = [
    { address: "TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7", name: "Test Wallet" },
    // ... остальные адреса
];

// Все цены и логику
'boost-10x': { 
    price: '30 USDT',
    usdtPrice: 30,
    // ...
}

// API endpoints
const response = await fetch(`https://api.trongrid.io/v1/accounts/${address}`);

// Алгоритмы генерации кошельков
generateWallet(crypto) {
    // Вся логика видна!
}
```

### В Network запросах видно:
```
GET https://your-domain.com/api/bsc/0x0476d0b67e7e7e2654F16b31F807868FAf726588
Response: {
  "status": "1",
  "message": "OK",
  "result": [...]
}
```

### В Local Storage видно:
```javascript
localStorage.getItem('userBoosts')
// Вся информация о покупках пользователей!
```

## 🎯 Практическая демонстрация

### Откройте ПРЯМО СЕЙЧАС любой сайт и нажмите F12:

1. **Зайдите на любой сайт** (например, GitHub)
2. **Нажмите F12**
3. **Sources → Откройте любой .js файл**
4. **Вы видите ВЕСЬ код!** 😱

То же самое происходит с вашим Mini App!

## 🚨 Реальный пример угрозы:

### Злоумышленник может:
```javascript
// 1. Скопировать ваш интерфейс
// Сохранить HTML + CSS + JS

// 2. Создать фейковый домен
// fake-eagle-scanner.com

// 3. Изменить кошельки на свои
this.walletPool = [
    { address: "ЗЛОУМЫШЛЕННИК_КОШЕЛЕК_1" },
    { address: "ЗЛОУМЫШЛЕННИК_КОШЕЛЕК_2" }
];

// 4. Создать фейкового бота
// @fake_eagle_scanner_bot

// 5. Получать ВСЕ платежи пользователей! 💸
```

## 🛡️ Что НЕ защитит:

### ❌ Неэффективные попытки:
```javascript
// Это НЕ работает:
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        e.preventDefault(); // Легко обойти!
    }
});

// Это тоже НЕ работает:
if (window.devtools.open) {
    window.location = 'about:blank'; // Обходится за секунды
}

// И это НЕ поможет:
console.log = function() {}; // Отключение консоли - бесполезно
```

## ✅ Что РЕАЛЬНО защищает:

### 1. Обфускация (усложняет чтение)
```javascript
// Было:
function activateBoost(productId) { ... }

// Стало:
function _0x123abc(_0x456def) { ... }
```

### 2. Серверная логика
```javascript
// ❌ В frontend:
const realPrice = calculatePrice(product);

// ✅ На сервере:
app.post('/api/calculate-price', (req, res) => {
    const price = serverSideCalculation(req.body);
    res.json({ price });
});
```

### 3. Проверка источника
```javascript
// Блокируем прямой доступ
if (!userAgent.includes('Telegram')) {
    return res.status(403).send('Access denied');
}
```

## 💡 Вывод:

**ВСЁ что находится в frontend - ПУБЛИЧНО!**

- HTML/CSS/JS файлы
- API endpoints  
- Кошельки для тестов
- Цены и логика
- Алгоритмы

**Единственная защита:** важную логику держать на сервере! 🛡️ 