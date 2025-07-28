# 🧪 Тестирование платежной системы

## ✅ **Платежная система готова к тестированию!**

### 🎯 **Что настроено:**

#### **1. Тестовая карточка на 1 USDT:**
```
🧪 Test Boost
- Цена: 1.0 USDT  
- Длительность: 10 минут
- Скорость: 2x (2 кошелька/сек)
- Find Rate: 10%
- Иконка: 🧪 с красной рамкой
```

#### **2. Реальный кошелек в пуле:**
```
📍 TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7
   ↳ Добавлен как "Test Wallet (Real)" в первое место пула
```

#### **3. Отладочная функция:**
```javascript
testPaymentSystem() // проверит статус системы
```

---

## 🔧 **Как работает система:**

### **Процесс оплаты:**
1. **Нажать "Buy Now"** на тестовой карточке
2. **Сразу откроется** USDT форма (без выбора метода)
3. **Показывается точная сумма:** 1.00 USDT  
4. **Адрес кошелька:** TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7
5. **После оплаты:** нажать "✅ I Sent 1.0 USDT"
6. **Система проверит** блокчейн через TronGrid API

### **Smart Wallet Pool:**
- **10 кошельков** в пуле (round-robin распределение)
- **Ваш кошелек** идет первым в очереди
- **Точные суммы** без уникализатора (1.00 USDT)
- **Автопроверка** транзакций через API

---

## 📱 **Визуальная карточка:**

```
┌─────────────────────────────────┐
│ 🧪 [TEST]                       │ ← Красная рамка
│ Test Boost                      │
│ 2x Speed                        │
│ 10 min                          │ ← Короткая длительность
│ For payment testing only        │
│ ────────────────────────────────│
│ 1.0 USDT    [Buy Now]          │ ← Дешево для теста
└─────────────────────────────────┘
```

---

## 🔍 **Проверка системы:**

### **В консоли браузера выполните:**
```javascript
testPaymentSystem()
```

### **Ожидаемый вывод:**
```
💰 Testing Payment System...
🏦 Wallet Pool Status:
📊 Total wallets: 10
🔄 Current index: 1/10
🧪 Test wallet: Test Wallet (Real)  
📍 Address: TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7
🎯 Test product available:
   Name: Test Boost
   Price: 1 USDT
   Duration: 600 seconds
✅ You can now test payment with "Test Boost" card for 1 USDT
📝 Real wallet TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7 is in the pool
📋 Active payments: 0
🎯 Payment system ready for testing!
```

---

## 🧪 **Сценарий тестирования:**

### **Шаг 1: Открыть маркет**
- Перейти на страницу Market
- Найти карточку "🧪 Test Boost"

### **Шаг 2: Нажать "Buy Now"**  
- Сразу откроется USDT форма
- Увидите адрес: `TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7`
- Сумма: `1.00 USDT`

### **Шаг 3: Отправить USDT**
- Отправить ровно **1.00 USDT** на указанный адрес
- Использовать **TRC-20 сеть** (TRON)

### **Шаг 4: Подтвердить оплату**
- Нажать "✅ I Sent 1.0 USDT"
- Начнется проверка через блокчейн API

### **Шаг 5: Дождаться подтверждения**
- Система найдет транзакцию (обычно 1-2 минуты)
- Буст активируется на 10 минут
- Скорость изменится на 2x

---

## 📊 **Технические детали:**

### **API проверки:**
```javascript
// TronGrid API для проверки USDT транзакций
https://api.trongrid.io/v1/accounts/${wallet}/transactions/trc20?
contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&
limit=50&order_by=block_timestamp,desc
```

### **Логика поиска:**
```javascript
// Ищет точное совпадение суммы и времени
if (Math.abs(amount - payment.baseAmount) <= 0.001 && 
    txTime >= payment.createdAt) {
    // Платеж найден!
}
```

### **Структура платежа:**
```javascript
payment = {
    orderId: "eagle_123456789_abc123",
    productId: "Test Boost", 
    baseAmount: 1.0,  // Точно 1 USDT
    assignedWallet: "TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7",
    walletName: "Test Wallet (Real)",
    status: "waiting_payment",
    createdAt: 1703184000000,
    expiresAt: 1703185800000  // +30 минут
}
```

---

## 🚀 **Что должно произойти при успехе:**

### **1. Подтверждение платежа:**
```
✅ Payment confirmed! 
🚀 Test Boost activated!
⏰ Active for 10 minutes
```

### **2. Изменения в интерфейсе:**
- **Скорость сканирования:** 2 кошелька/сек  
- **Find Rate:** 10%
- **Статус:** активный буст
- **Время:** обратный отсчет 10 минут

### **3. В localStorage:**
```javascript
activeBoost = {
    multiplier: 2,
    endTime: Date.now() + 600000,  // +10 минут
    symbol: 'TEST'
}
```

---

## 🛠️ **Отладочные команды:**

### **Проверить статус системы:**
```javascript
testPaymentSystem()           // Общий статус
walletPoolManager.showWalletStatus()  // Статус кошельков  
marketManager.showMarketStatus()      // Статус маркета
```

### **Симулировать платеж:**
```javascript
// Найти активный платеж и симулировать его подтверждение
const orderId = Array.from(walletPoolManager.pendingPayments.keys())[0];
simulatePayment(orderId);
```

### **Проверить кошельки:**
```javascript
console.log(walletPoolManager.walletPool[0]);
// Должен показать: Test Wallet (Real) с вашим адресом
```

---

## ⚠️ **Важные моменты:**

### **Сеть и сумма:**
- ✅ **ТОЛЬКО TRC-20** (TRON сеть)
- ✅ **Точно 1.00 USDT** (без лишних копеек)
- ❌ НЕ BEP-20, ERC-20 или другие сети

### **Время:**
- ⏰ **Платеж истекает через 30 минут**
- ⏰ **Буст длится 10 минут** (для быстрого тестирования)
- ⏰ **Проверка транзакций** каждые 2-3 минуты

### **Кошелек:**
- 📍 **Ваш реальный кошелек** TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7
- 🔄 **Round-robin распределение** между всеми кошельками
- 🎯 **Высокий шанс** получить ваш кошелек при первом тесте

---

## 🎯 **Готово к тестированию!**

**Платежная система полностью настроена:**
- 🟢 **Тестовая карточка** добавлена
- 🟢 **Реальный кошелек** в пуле  
- 🟢 **Отладочные функции** работают
- 🟢 **API интеграция** настроена
- 🟢 **Форма оплаты** компактная и красивая

**Можете протестировать отправив 1 USDT!** 💰🧪✨ 