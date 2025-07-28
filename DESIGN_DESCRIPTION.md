# 🚀 Описание Профессионального Дизайна "Crypto Scanner Bot" v2.0

## 📐 Общая концепция:
- **Стиль**: Профессиональный крипто-сканер с темной тематикой
- **Тематика**: Platinum scanner, professional crypto tools, enterprise-grade UI
- **Подход**: Темная тема + синие акценты + четкая структура + минималистичные эффекты

## 🎨 Цветовая палитра:
```css
--bg-primary: #0B0E1A        /* Основной темно-синий фон */
--bg-secondary: #151B2D      /* Вторичный фон */
--bg-card: #1A2235          /* Фон карточек */
--bg-terminal: #0A0D16      /* Фон терминала */
--accent-blue: #2196F3      /* Основной синий акцент */
--accent-green: #4CAF50     /* Зеленый для успеха */
--accent-orange: #FF9800    /* Оранжевый для BTC и акцентов */
--accent-red: #F44336       /* Красный для STOP */
--text-primary: #FFFFFF     /* Основной белый текст */
--text-secondary: #B0BEC5   /* Серый вторичный текст */
--text-muted: #607D8B       /* Приглушенный текст */
--border-light: rgba(255,255,255,0.1)  /* Легкие границы */
--border-accent: rgba(33,150,243,0.3)  /* Акцентные границы */
```

## 🔤 Типографика:
- **Заголовки**: Inter Bold/Semibold (современный системный шрифт)
- **Основной текст**: Inter Regular (читаемый sans-serif)
- **Терминал**: SF Mono, Consolas, monospace
- **Цифры/балансы**: Inter Medium для четкости

## 🏗️ Структура интерфейса:

### 1. Header Profile (Профиль пользователя):
```jsx
Header: {
  avatar: "Eagle логотип с градиентом",
  username: "@mreaglecall",
  stats: {
    speed: "100x",
    findRate: "70%"
  },
  status: "Online индикатор"
}
```

### 2. Crypto Icons Bar (Панель криптовалют):
```jsx
CryptoBar: {
  layout: "horizontal scroll",
  coins: [BTC, ETH, LTC, BNB, TRX, SOL, USDT, USDC],
  activeState: "синяя рамка + подсветка",
  icons: "цветные круглые иконки"
}
```

### 3. Scanner Terminal (Терминал сканирования):
```jsx
Terminal: {
  header: "> NEURAL.SCAN.STATUS",
  content: "Scanned Wallets: 0 | Speed: 100x | Status: Online",
  button: "Start Neural Scan (синяя кнопка)",
  style: "темный фон с синими акцентами"
}
```

### 4. Boost Section (Секция балансов):
```jsx
BoostSection: {
  title: "BOOST SECTION (белый + красный акцент)",
  cards: [
    {crypto: "BTC", balance: "0.00097000", value: "$105.57"},
    {crypto: "ETH", balance: "0.00800000", value: "$22.62"},
    {crypto: "LTC", balance: "0.38000000", value: "$33.29"},
    {crypto: "SOL", balance: "2.50000000", value: "$380.45"}
  ],
  cardStyle: "темно-синие карточки с иконками слева"
}
```

### 5. Bottom Navigation (Навигация):
```jsx
BottomNav: {
  items: [
    {icon: "🏠", label: "Scan", active: true},
    {icon: "🚀", label: "Boost"},
    {icon: "👥", label: "Referral"},
    {icon: "ℹ️", label: "Info"},
    {icon: "👤", label: "Profile"}
  ],
  style: "темная с синими акцентами"
}
```

## ✨ Специфичные элементы:

### Терминальное окно (Desktop версия):
```css
.terminal-window {
  background: #0A0D16;
  border: 1px solid #2196F3;
  border-radius: 8px;
  font-family: 'SF Mono', monospace;
  color: #4CAF50;
  font-size: 12px;
  line-height: 1.4;
}

.terminal-line {
  display: block;
  margin-bottom: 2px;
}

.terminal-line.eth {
  color: #4CAF50;
}
```

### Информационная панель:
```css
.info-panel {
  background: #1A2235;
  border-radius: 8px;
  padding: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #B0BEC5;
}

.info-value {
  color: #FFFFFF;
  font-weight: 500;
}
```

## 📱 Telegram Mini App адаптация:

### 1. Viewport и основные настройки:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0B0E1A">
```

### 2. Telegram WebApp инициализация:
```javascript
// Telegram WebApp setup
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0B0E1A');
    tg.setBackgroundColor('#0B0E1A');
    
    // Настройка кнопок
    tg.MainButton.setText('Start Scanning');
    tg.MainButton.color = '#2196F3';
    tg.MainButton.textColor = '#FFFFFF';
}
```

### 3. Haptic Feedback интеграция:
```javascript
// Тактильные отклики
function triggerHaptic(type) {
    if (tg?.HapticFeedback) {
        switch(type) {
            case 'light':
                tg.HapticFeedback.impactOccurred('light');
                break;
            case 'success':
                tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                tg.HapticFeedback.notificationOccurred('error');
                break;
        }
    }
}
```

## 🔧 Компоненты для реализации:

### 1. ProfileHeader Component:
```jsx
<div className="profile-header">
    <div className="profile-avatar">
        <img src="eagle-logo.png" alt="Eagle" />
    </div>
    <div className="profile-info">
        <h2>Eagle</h2>
        <span>@mreaglecall</span>
    </div>
    <div className="profile-stats">
        <div className="stat-item speed">
            <span className="icon">⚡</span>
            <span>100x</span>
            <label>Speed</label>
        </div>
        <div className="stat-item find-rate">
            <span>70%</span>
            <label>Find Rate</label>
        </div>
    </div>
</div>
```

### 2. CryptoSelector Component:
```jsx
<div className="crypto-selector">
    {cryptos.map(crypto => (
        <div key={crypto.id} 
             className={`crypto-item ${selected.includes(crypto.id) ? 'active' : ''}`}
             onClick={() => toggleCrypto(crypto.id)}>
            <img src={crypto.icon} alt={crypto.name} />
        </div>
    ))}
</div>
```

### 3. ScannerTerminal Component:
```jsx
<div className="scanner-terminal">
    <div className="terminal-header">
        <span className="prompt">&gt; NEURAL.SCAN.STATUS</span>
    </div>
    <div className="terminal-content">
        <p>Scanned Wallets: {scanCount} | Speed: 100x | Status: Online</p>
    </div>
    <button className="scan-button" onClick={startScan}>
        Start Neural Scan
    </button>
</div>
```

### 4. BalanceCard Component:
```jsx
<div className="balance-card">
    <div className="crypto-info">
        <img src={crypto.icon} alt={crypto.name} className="crypto-icon" />
        <span className="crypto-name">{crypto.name}</span>
    </div>
    <div className="balance-info">
        <div className="balance-amount">{balance}</div>
        <div className="balance-value">{value}</div>
    </div>
</div>
```

## 🎯 Ключевые CSS стили:

### Основная тема:
```css
:root {
    --bg-primary: #0B0E1A;
    --bg-secondary: #151B2D;
    --bg-card: #1A2235;
    --accent-blue: #2196F3;
    --accent-green: #4CAF50;
    --text-primary: #FFFFFF;
    --text-secondary: #B0BEC5;
}

body {
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.container {
    max-width: 100vw;
    min-height: 100vh;
    padding: 0;
}
```

### Карточки балансов:
```css
.boost-section {
    padding: 16px;
}

.boost-title {
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
    margin-bottom: 16px;
}

.boost-title .accent {
    color: #F44336;
}

.balance-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-light);
    transition: all 0.2s ease;
}

.balance-card:hover {
    border-color: var(--accent-blue);
}
```

### Терминал:
```css
.scanner-terminal {
    background: var(--bg-card);
    border: 1px solid var(--accent-blue);
    border-radius: 12px;
    padding: 16px;
    margin: 16px;
}

.terminal-header {
    color: var(--accent-blue);
    font-family: monospace;
    font-size: 14px;
    margin-bottom: 12px;
}

.scan-button {
    width: 100%;
    background: var(--accent-blue);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.scan-button:hover {
    background: #1976D2;
}
```

## 📱 Мобильная оптимизация:

### Responsive breakpoints:
```css
/* Mobile First */
.container {
    padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        padding: 24px;
        max-width: 500px;
        margin: 0 auto;
    }
}

/* Desktop в Telegram */
@media (min-width: 1024px) {
    .desktop-layout {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 24px;
    }
}
```

## 🚀 Telegram Mini App специфичные функции:

### Интеграция с Telegram:
```javascript
// Отправка данных в Telegram
function sendDataToTelegram(data) {
    if (tg?.sendData) {
        tg.sendData(JSON.stringify(data));
    }
}

// Обработка найденных кошельков
function onWalletFound(wallet) {
    triggerHaptic('success');
    sendDataToTelegram({
        type: 'wallet_found',
        crypto: wallet.crypto,
        balance: wallet.balance,
        value: wallet.value
    });
}

// Закрытие приложения
function closeApp() {
    if (tg?.close) {
        tg.close();
    }
}
```

## 📋 Финальные рекомендации:

1. **Убрать все неоновые эффекты** - заменить на чистые синие акценты
2. **Использовать профессиональную типографику** - Inter вместо Orbitron
3. **Четкая структура карточек** - без излишних анимаций
4. **Telegram-native элементы** - использовать MainButton, HapticFeedback
5. **Производительность** - минимум анимаций для плавной работы в WebView
6. **Адаптивность** - работа на всех размерах экранов в Telegram

**Этот стиль намного более профессиональный и подходящий для Telegram Mini App!** 🎯 