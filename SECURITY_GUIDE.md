# 🛡️ Безопасность Telegram Mini App

## ⚠️ Основные угрозы

### 1. Видимость домена
- ✅ **Что видят:** URL приложения в адресной строке
- ❌ **Риск:** Прямой доступ к сайту
- 🔧 **Решение:** Проверка источника запроса

### 2. Доступность исходного кода
- ✅ **Что видят:** Весь frontend код через DevTools
- ❌ **Риск:** Копирование логики, API endpoints
- 🔧 **Решение:** Обфускация + серверная логика

### 3. Клонирование приложения
- ✅ **Что видят:** Полная структура интерфейса
- ❌ **Риск:** Создание фейковых копий
- 🔧 **Решение:** Уникальные токены + брендинг

## 🔒 Уровни защиты

### Уровень 1: Базовая защита (легко обойти)
```javascript
// Проверка User-Agent
if (!navigator.userAgent.includes('Telegram')) {
    window.location.href = 'https://t.me/eagle_scanner_bot';
}
```

### Уровень 2: Проверка источника
```javascript
// В server.js - middleware
function basicTelegramCheck(req, res, next) {
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer || '';
    
    const isTelegram = userAgent.includes('Telegram') || 
                      referer.includes('t.me');
    
    if (!isTelegram) {
        res.status(403).send('Access only via Telegram');
        return;
    }
    next();
}
```

### Уровень 3: Криптографическая проверка (рекомендуемый)
```javascript
// Проверка Telegram WebApp initData
function verifyTelegramWebAppData(initData) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    // ... проверка HMAC подписи
    return isValid;
}
```

### Уровень 4: Серверная авторизация
```javascript
// Все важные операции на сервере
app.post('/api/purchase', authenticateUser, (req, res) => {
    // Проверяем Telegram ID
    // Обрабатываем платеж
    // Активируем продукт
});
```

## 🚀 Практические решения

### 1. Скрыть критическую логику
```javascript
// ❌ Не делайте так (в frontend)
function generateRealWallet() {
    // Реальный алгоритм генерации
}

// ✅ Делайте так (на сервере)
app.post('/api/generate-wallet', (req, res) => {
    const wallet = realWalletGenerator();
    res.json({ wallet });
});
```

### 2. Обфускация клиентского кода
```bash
# Установка обфускатора
npm install --save-dev javascript-obfuscator

# Запуск обфускации
node build-scripts/obfuscate.js
```

### 3. Динамические домены (продвинутый уровень)
```javascript
// Ротация доменов каждые N дней
const domains = [
    'eagle1.example.com',
    'eagle2.example.com', 
    'eagle3.example.com'
];

const activeDomain = domains[Math.floor(Date.now() / (24*60*60*1000)) % domains.length];
```

### 4. Проксирование через CDN
```javascript
// Cloudflare Workers для проксирования
addEventListener('fetch', event => {
    // Проверяем заголовки Telegram
    // Проксируем запрос к реальному серверу
});
```

## 🎯 Рекомендации по архитектуре

### Frontend (Mini App)
- 🎨 **Только UI и анимации**
- 📱 **Telegram WebApp API**
- 🔒 **Минимум логики**
- 🎭 **Обфускированный код**

### Backend (API Server)
- 🛡️ **Вся бизнес-логика**
- 🔐 **Аутентификация пользователей**
- 💳 **Обработка платежей**
- 📊 **Хранение данных**

### Telegram Bot
- 🤖 **Точка входа**
- 👥 **Управление пользователями**
- 📢 **Уведомления**
- 🔗 **Выдача ссылок на Mini App**

## 📋 Чек-лист безопасности

### ✅ Обязательно
- [ ] Проверка User-Agent в middleware
- [ ] Обфускация JavaScript кода
- [ ] Перенос критической логики на сервер
- [ ] HTTPS для всех запросов
- [ ] Проверка Telegram initData

### 🔄 Рекомендуемо
- [ ] Ротация доменов
- [ ] Мониторинг подозрительной активности
- [ ] Rate limiting для API
- [ ] Логирование всех действий
- [ ] Резервные домены

### 🚀 Для продакшена
- [ ] CDN с проверкой заголовков
- [ ] WAF (Web Application Firewall)
- [ ] DDoS защита
- [ ] Регулярные аудиты безопасности

## 🔄 Что НЕ защитит

### ❌ Неэффективные методы:
1. **Отключение DevTools** - легко обойти
2. **Минификация** - не защита, только сжатие
3. **Проверка на клиенте** - можно изменить
4. **Скрытие URL** - всегда видна в браузере

### ⚠️ Ограничения Telegram Mini App:
- Домен всегда виден пользователю
- Код frontend доступен через DevTools
- Нельзя полностью заблокировать прямой доступ
- User-Agent можно подделать

## 💡 Философия безопасности

> **Принцип:** Считайте, что весь frontend код будет скомпрометирован

1. **Важные данные** - только на сервере
2. **Критическая логика** - только на сервере  
3. **Платежи** - только через проверенные API
4. **Аутентификация** - только через Telegram

**Помните:** 100% защиты не существует, но можно существенно усложнить жизнь злоумышленникам! 🛡️ 