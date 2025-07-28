# USDT Payment System Testing Guide

## 🚀 Quick Start

1. **Open the application:**
   - Double-click on `index.html` 
   - Open browser console (F12)

2. **Expected console output:**
   ```
   🚀 Eagle Scanner initialized
   ✅ MarketManager initialized  
   ✅ WalletPoolManager initialized
   ```

3. **Test basic functionality:**
   ```javascript
   // Quick test
   testUSDTPayment();
   ```

## 🧪 Test Functions

### Payment System Tests

```javascript
// Create a test USDT payment
testUSDTPayment();

// Check wallet pool status  
showWalletStatus();

// Test market integration
testMarketIntegration();

// Generate multiple test payments
generateTestWallets();

// Simulate payment confirmation
simulateUSDTPayment("order_id");
```

## 📋 Testing Scenarios

### Scenario 1: Single Payment
```javascript
// 1. Create payment
const payment = testUSDTPayment();
console.log(`Send ${payment.uniqueAmount} USDT to ${payment.assignedWallet}`);

// 2. Check status
showWalletStatus();

// 3. Simulate payment
simulateUSDTPayment(payment.orderId);
```

### Scenario 2: Multiple Concurrent Payments
```javascript
// 1. Generate 5 payments
generateTestWallets();

// 2. Check wallet distribution
showWalletStatus();
// Expected: Different amounts on different/same wallets
```

### Scenario 3: Market Integration
```javascript
// 1. Open market
testMarketIntegration();

// 2. Select USDT payment
// 3. Verify unique amount generation
// 4. Test payment flow
```

## 💰 USDT Payment Flow

### Expected Behavior:
1. **User clicks "Buy"** → Payment method modal
2. **Selects "USDT (TRC-20)"** → Payment details modal  
3. **Sees unique amount** (e.g., 10.47 USDT)
4. **Gets wallet address** from pool
5. **Sends USDT** → Clicks "I Paid"
6. **System checks blockchain** → Finds exact match
7. **Product activated** → Success notification

### Key Features:
- ✅ **10 wallet pool** rotating round-robin
- ✅ **Unique amounts** (base + random cents)  
- ✅ **No memo required** - amount-based detection
- ✅ **Concurrent payments** on same wallet
- ✅ **30-minute expiration** timer
- ✅ **Automatic blockchain checking**

## 🏦 Wallet Pool System

### Pool Status Check:
```javascript
showWalletStatus();
```

### Expected Output:
```
🏦 Current Wallet Pool Status:
TR1A7NqBJF8P...: waiting for [10.47, 25.83] USDT  
TR2B8OqCKG9Q...: waiting for [15.19] USDT
📊 Pending payments: 3
🔄 Next wallet index: 4/10
```

### Wallet Rotation:
- Payment 1 → Wallet #1
- Payment 2 → Wallet #2  
- Payment 3 → Wallet #3
- ...
- Payment 11 → Wallet #1 (cycles back)

## 🔍 Debugging

### Common Issues:

1. **"WalletPoolManager not available"**
   ```javascript
   // Check initialization
   console.log(window.walletPoolManager);
   ```

2. **Payments not creating**
   ```javascript
   // Check MarketManager integration
   console.log(window.marketManager);
   ```

3. **Duplicate amounts**
   ```javascript
   // Test amount generation
   for(let i = 0; i < 10; i++) {
     console.log(walletPoolManager.generateUniqueAmount(10.00));
   }
   ```

4. **Modal not appearing**
   ```javascript
   // Check CSS and DOM
   document.querySelector('.payment-modal-overlay');
   ```

## 🌐 API Testing

### TronGrid API Check:
```javascript
// Test blockchain API
fetch('https://api.trongrid.io/v1/accounts/TR1A7NqBJF8PzMviQWxHLFr3dHJHHLr3FG/transactions/trc20?contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&limit=10')
  .then(r => r.json())
  .then(data => {
    console.log('✅ API working:', data.success);
    console.log('📊 Transactions found:', data.data?.length || 0);
  })
  .catch(err => console.log('❌ API error:', err));
```

## 💳 Real Payment Testing

### For Production Testing:

1. **Use small amounts** (0.01-0.1 USDT)
2. **Test with TRC-20 network** only
3. **Verify exact amount matching**
4. **Check timing** (payments expire in 30min)

### Test Wallets:
```
Wallet #1: TR1A7NqBJF8PzMviQWxHLFr3dHJHHLr3FG
Wallet #2: TR2B8OqCKG9Q0nwjRXyIM6s4eIIIIM6t4H  
... (see renderer.js for full list)
```

## ✅ Success Criteria

- [ ] Payment modals appear correctly
- [ ] Unique amounts generate (different each time)
- [ ] Wallet pool rotates properly  
- [ ] Multiple payments can use same wallet
- [ ] Payment simulation activates products
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Timer countdown functions
- [ ] Cancel/close buttons work

## 🚨 Error Handling

### Test Error Scenarios:
```javascript
// Test with invalid order ID
simulateUSDTPayment("invalid_id");

// Test payment expiration
// (wait 30+ minutes or modify expiresAt)

// Test API failure
// (disable internet temporarily)
```

## 📱 Mobile Testing

- Test on actual mobile devices
- Check modal responsiveness
- Verify QR code scanning
- Test address copying
- Check timer visibility

## 🔧 Performance

- Monitor DOM updates frequency
- Check memory usage with multiple payments
- Test with 10+ concurrent payments
- Verify cleanup on payment completion

---

## Quick Commands Summary

```javascript
// Essential tests
testUSDTPayment();           // Create test payment
showWalletStatus();          // Check pool status  
testMarketIntegration();     // Test market integration
generateTestWallets();       // Multiple payments test
simulateUSDTPayment(id);     // Simulate confirmation

// Debugging
console.log(walletPoolManager.pendingPayments);  // Active payments
console.log(walletPoolManager.walletExpectations); // Expected amounts
``` 