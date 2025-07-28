// Eagle Scanner - Professional Crypto Scanner
// Telegram WebApp Integration

// CRITICAL: Define global functions FIRST before everything else
console.log('🎯 Defining global functions at the very start...');

window.activateBoost = function() {
    console.log('🚀 Global activateBoost called!');
    console.log('gamesManager exists:', !!window.gamesManager);
    
    if (window.gamesManager && window.gamesManager.activateBoost) {
            console.log('✅ Calling gamesManager.activateBoost()');
            window.gamesManager.activateBoost();
        } else {
        console.log('❌ gamesManager not available, applying fallback boost without notification');
        
        // Fallback: apply boost effects without notification
        const boostData = {
            multiplier: 100,
            endTime: Date.now() + (10 * 60 * 1000), // 10 minutes
            symbol: 'FALLBACK'
        };
        localStorage.setItem('activeBoost', JSON.stringify(boostData));
        
        // Close popup
        const popup = document.getElementById('jackpot-popup');
        if (popup) popup.classList.add('hidden');
        
        // Show success message in slot result (only in slot context)
        const resultDiv = document.getElementById('slot-result');
        if (resultDiv) {
            resultDiv.textContent = '🚀 Boost Applied!';
            resultDiv.style.color = 'var(--accent-green)';
        }
        
        // Update scanning speed
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
        }
        
        console.log('✅ Fallback boost applied without notification');
    }
};

window.closeJackpotPopup = function() {
    console.log('🔒 Global closeJackpotPopup called!');
    if (window.gamesManager) {
        window.gamesManager.closeJackpotPopup();
    } else {
        const popup = document.getElementById('jackpot-popup');
        if (popup) popup.classList.add('hidden');
    }
};

// Function to apply boost effects on scan page
function applyBoostEffects(symbol, multiplier, endTime) {
    console.log('🎯 Applying boost effects:', symbol, multiplier, endTime);
    
    const boostIndicator = document.getElementById('boost-indicator');
    const scanButton = document.getElementById('start-scan-btn');
    const currentSpeedElement = document.getElementById('current-speed');
    
    if (boostIndicator) {
        // Update boost indicator content
        const symbolElement = boostIndicator.querySelector('.boost-symbol');
        const multiplierElement = boostIndicator.querySelector('.boost-multiplier');
        const timerElement = boostIndicator.querySelector('.timer-text');
        
        if (symbolElement) symbolElement.textContent = symbol;
        if (multiplierElement) multiplierElement.textContent = multiplier;
        
        // Show boost indicator
        boostIndicator.classList.remove('hidden');
        
        // Start timer countdown
        if (timerElement) {
            const updateTimer = () => {
                const remaining = Math.max(0, endTime - Date.now());
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (remaining <= 0) {
                    // Boost expired
                    boostIndicator.classList.add('hidden');
                    if (scanButton) scanButton.classList.remove('boosted');
                    if (currentSpeedElement) currentSpeedElement.textContent = '100x';
                    localStorage.removeItem('activeBoost');
                    console.log('🔥 Boost expired and removed');
                } else {
                    setTimeout(updateTimer, 1000);
                }
            };
            updateTimer();
        }
    }
    
    // Apply visual effects to scan button
    if (scanButton) {
        scanButton.classList.add('boosted');
    }
    
    // Update speed display
    if (currentSpeedElement) {
        currentSpeedElement.textContent = `${multiplier}x`;
        currentSpeedElement.style.color = 'var(--accent-green)';
        currentSpeedElement.style.fontWeight = '700';
    }
    
    console.log('✅ Boost effects applied successfully');
}

// Function to check for active boost on page load
function checkActiveBoost() {
    const activeBoost = localStorage.getItem('activeBoost');
    
    if (activeBoost) {
        try {
            const boost = JSON.parse(activeBoost);
            const currentTime = Date.now();
            
            if (boost.endTime > currentTime) {
                console.log('🔍 Found active boost on page load:', boost);
                applyBoostEffects(boost.symbol, boost.multiplier, boost.endTime);
            } else {
                console.log('🔥 Boost found but expired, removing...');
                localStorage.removeItem('activeBoost');
            }
        } catch (e) {
            console.log('❌ Error parsing active boost:', e);
            localStorage.removeItem('activeBoost');
        }
    } else {
        console.log('📭 No active boost found');
    }
}

console.log('✅ Global functions defined IMMEDIATELY:', {
    activateBoost: typeof window.activateBoost,
    closeJackpotPopup: typeof window.closeJackpotPopup
});

// Telegram WebApp initialization
let tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0B0E1A');
    tg.setBackgroundColor('#0B0E1A');
    
    // Hide main button since we have our own UI
    tg.MainButton.hide();
}

// Application Configuration
const CONFIG = {
    scanSpeed: 1000, // ms between scans (1 wallet per second base speed)
    baseFindRate: 5, // 5% base find rate
    cryptoPrices: {
        btc: 96400,
        eth: 3200,
        ltc: 105,
        sol: 180,
        bnb: 720,
        trx: 0.15,
        usdt: 1.00,
        usdc: 1.00
    },
    cryptoIcons: {
        btc: '../images/Bitcoin.png',
        eth: '../images/ethereum-eth-logo.png',
        ltc: '../images/ltc.png',
        sol: '../images/sol.png',
        bnb: '../images/bnb.png',
        trx: '../images/trx.png',
        usdt: '../images/tether.png',
        usdc: '../images/tether.png'
    },
    predefinedWallets: [
        {
            crypto: 'btc',
            address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            balance: '0.00876543',
            value: '843.21',
            scanCount: 1247,
            name: 'BTC'
        },
        {
            crypto: 'eth',
            address: '0x742d35Cc6634C0532925a3b844Bc9e7595f6fed2',
            balance: '2.4871',
            value: '7958.72',
            scanCount: 2891,
            name: 'ETH'
        },
        {
            crypto: 'ltc',
            address: 'LVWrLS1hB9W77RltcXrMIQW2QNFegKKVPA',
            balance: '0.38000000',
            value: '39.90',
            scanCount: 4200,
            name: 'LTC'
        },
        {
            crypto: 'sol',
            address: 'DJCqcK8bZw6MYtq7pZZPXqf1Q4YJjgvx8VxPZpKjF8n4',
            balance: '2.50000000',
            value: '450.00',
            scanCount: 6150,
            name: 'SOL'
        }
    ]
};

// Function to get effective scan speed with boost
function getEffectiveScanSpeed() {
    const activeBoost = localStorage.getItem('activeBoost');
    
    if (activeBoost) {
        try {
            const boost = JSON.parse(activeBoost);
            const currentTime = Date.now();
            
            // Check if boost is still active
            if (boost.endTime > currentTime) {
                // Return the scanSpeed from boost data
                return boost.scanSpeed || CONFIG.scanSpeed;
            } else {
                // Boost expired, remove it
                localStorage.removeItem('activeBoost');
            }
        } catch (e) {
            localStorage.removeItem('activeBoost');
        }
    }
    
    return CONFIG.scanSpeed; // Return base speed (1000ms = 1 wallet/sec)
}

// Function to get effective find rate with boost
function getEffectiveFindRate() {
    const activeBoost = localStorage.getItem('activeBoost');
    
    if (activeBoost) {
        try {
            const boost = JSON.parse(activeBoost);
            const currentTime = Date.now();
            
            // Check if boost is still active
            if (boost.endTime > currentTime) {
                // Return the findRate from boost data
                return boost.findRate || CONFIG.baseFindRate;
            } else {
                // Boost expired, remove it
                localStorage.removeItem('activeBoost');
            }
        } catch (e) {
            localStorage.removeItem('activeBoost');
        }
    }
    
    return CONFIG.baseFindRate; // Return base find rate (5%)
}

// Function to get current multiplier for display
function getCurrentMultiplier() {
    const activeBoost = localStorage.getItem('activeBoost');
    
    if (activeBoost) {
        try {
            const boost = JSON.parse(activeBoost);
            const currentTime = Date.now();
            
            if (boost.endTime > currentTime) {
                console.log('🔍 Active boost found:', boost);
                return boost.multiplier || 1;
            } else {
                console.log('⏰ Boost expired, removing...');
                localStorage.removeItem('activeBoost');
            }
        } catch (e) {
            console.log('❌ Error parsing boost:', e);
            localStorage.removeItem('activeBoost');
        }
    }
    
    return 1; // Base multiplier (no boost = 1x speed)
}

// Application State
const appState = {
    isScanning: false,
    scanCount: 0,
    totalScans: 0, // Total number of scans performed
    selectedCryptos: ['btc'], // Array of selected cryptos
    foundWallets: 0,
    scanInterval: null,
    metricsInterval: null,
    currentScanCrypto: 0, // Index for rotating through selected cryptos
    balances: {
        btc: '0.00000000',
        eth: '0.00000000',
        ltc: '0.00000000',
        bnb: '0.00000000',
        trx: '0.00000000',
        sol: '0.00000000',
        usdt: '0.00000000',
        usdc: '0.00000000'
    },
    metrics: {
        cpuUsage: 45,
        memoryUsage: 2.3,
        networkSpeed: 128,
        foundRate: 0.003
    }
};

// Utility Functions
class Utils {
    static generateRandomAddress(crypto) {
        const patterns = {
            btc: () => '1' + this.randomString(33, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
            eth: () => '0x' + this.randomString(40, '0123456789abcdef'),
            ltc: () => 'L' + this.randomString(33, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
            sol: () => this.randomString(44, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'),
            bnb: () => 'bnb' + this.randomString(39, '0123456789abcdefghijklmnopqrstuvwxyz'),
            trx: () => 'T' + this.randomString(33, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
            usdt: () => 'T' + this.randomString(33, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
            usdc: () => '0x' + this.randomString(40, '0123456789abcdef')
        };
        return patterns[crypto]?.() || this.randomString(34);
    }

    static randomString(length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

    static formatBalance(balance, decimals = 8) {
        return parseFloat(balance).toFixed(decimals);
    }

    static formatValue(value) {
        return `$${parseFloat(value).toFixed(2)}`;
    }

    static triggerHaptic(type = 'light') {
        if (tg?.HapticFeedback) {
            switch(type) {
                case 'light':
                    tg.HapticFeedback.impactOccurred('light');
                    break;
                case 'medium':
                    tg.HapticFeedback.impactOccurred('medium');
                    break;
                case 'heavy':
                    tg.HapticFeedback.impactOccurred('heavy');
                    break;
                case 'success':
                    tg.HapticFeedback.notificationOccurred('success');
                    break;
                case 'error':
                    tg.HapticFeedback.notificationOccurred('error');
                    break;
                case 'warning':
                    tg.HapticFeedback.notificationOccurred('warning');
                    break;
            }
        }
    }
}

// Sound Engine
class SoundEngine {
    constructor() {
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    playFoundSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1600, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    playScanSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }
}

const soundEngine = new SoundEngine();

// Terminal Manager
class TerminalManager {
    constructor() {
        this.terminal = document.getElementById('terminal-output');
        this.maxLines = 50;
    }

    addLine(address, crypto) {
        if (!this.terminal) return;
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const timestamp = new Date().toLocaleTimeString();
        
        if (crypto === 'SYSTEM') {
            line.textContent = `[${timestamp}] [SYSTEM] ${address}`;
            line.style.color = 'var(--accent-blue)';
        } else {
            const shortAddress = address.length > 20 ? address.substring(0, 20) + '...' : address;
            line.textContent = `[${timestamp}] ${crypto.toUpperCase()} | ${shortAddress} | Balance: 0`;
            line.style.color = 'var(--text-primary)';
        }
        
        this.terminal.appendChild(line);
        
        // Remove old lines more efficiently
        if (this.terminal.children.length > this.maxLines) {
            this.terminal.removeChild(this.terminal.firstChild);
        }
        
        // Smooth scroll to bottom
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    addBatchLines(address, crypto) {
        if (!this.terminal) return;
        
        // Add fast-mode effect to terminal
        const terminalWindow = this.terminal.parentElement;
        if (terminalWindow) {
            terminalWindow.classList.add('fast-mode');
            setTimeout(() => {
                terminalWindow.classList.remove('fast-mode');
            }, 1000);
        }
        
        // Add 2-4 lines quickly for fast scroll effect
        const batchSize = Math.floor(Math.random() * 3) + 2; // 2-4 lines
        const timestamp = new Date().toLocaleTimeString();
        const cryptos = ['BTC', 'ETH', 'LTC', 'BNB', 'TRX', 'SOL', 'USDT'];
        
        for (let i = 0; i < batchSize; i++) {
            const line = document.createElement('div');
            line.className = 'terminal-line fast-scroll';
            
            // Generate random data for each line
            const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)];
            const randomAddress = this.generateFakeAddress(randomCrypto.toLowerCase());
            const shortAddress = randomAddress.length > 20 ? randomAddress.substring(0, 20) + '...' : randomAddress;
            
            // Add some variety to the display
            const balanceStatus = Math.random() < 0.05 ? 'Checking...' : 'Balance: 0';
            const statusColor = balanceStatus === 'Checking...' ? 'var(--accent-orange)' : 'var(--text-muted)';
            
            line.innerHTML = `<span style="color: var(--text-secondary)">[${timestamp}]</span> <span style="color: var(--accent-blue)">${randomCrypto}</span> | <span style="color: var(--text-primary)">${shortAddress}</span> | <span style="color: ${statusColor}">${balanceStatus}</span>`;
            line.style.opacity = '0.9';
        
        this.terminal.appendChild(line);
        
        // Remove old lines
            if (this.terminal.children.length > this.maxLines) {
            this.terminal.removeChild(this.terminal.firstChild);
        }
        
            // Add slight delay between lines for visual effect
            if (i < batchSize - 1) {
                setTimeout(() => {}, i * 5);
            }
        }
        
        // Smooth animated scroll to bottom
        this.terminal.style.scrollBehavior = 'smooth';
        this.terminal.scrollTop = this.terminal.scrollHeight;
        
        // Reset scroll behavior after animation
        setTimeout(() => {
            if (this.terminal) {
                this.terminal.style.scrollBehavior = 'auto';
            }
        }, 300);
    }

    generateFakeAddress(crypto) {
        const chars = '0123456789abcdefABCDEF';
        let address = '';
        
        switch(crypto) {
            case 'btc':
                address = '1' + Array.from({length: 33}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                break;
            case 'eth':
            case 'usdt':  // ERC-20 token
            case 'usdc':  // ERC-20 token
                address = '0x' + Array.from({length: 40}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                break;
            case 'ltc':
                address = 'L' + Array.from({length: 33}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                break;
            case 'bnb':
                address = 'bnb' + Array.from({length: 39}, () => chars.toLowerCase()[Math.floor(Math.random() * 16)]).join('');
                break;
            case 'trx':
                address = 'T' + Array.from({length: 33}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                break;
            case 'sol':
                const solChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                address = Array.from({length: 44}, () => solChars[Math.floor(Math.random() * solChars.length)]).join('');
                break;
            default:
                address = Array.from({length: 34}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }
        
        return address;
    }

    clear() {
        if (this.terminal) {
            this.terminal.innerHTML = '';
        }
    }

    addSystemMessage(message) {
        this.addLine(message, 'SYSTEM');
    }
}

const terminalManager = new TerminalManager();

// Balance Manager
class BalanceManager {
    updateBalance(crypto, balance) {
        const formattedBalance = Utils.formatBalance(balance);
        const value = parseFloat(balance) * CONFIG.cryptoPrices[crypto];
        const formattedValue = Utils.formatValue(value);

        appState.balances[crypto] = formattedBalance;

        // Update UI
        const balanceElement = document.getElementById(`${crypto}-balance`);
        const valueElement = document.getElementById(`${crypto}-value`);
        const withdrawBtn = document.querySelector(`[data-crypto="${crypto}"].withdraw-btn`);
        
        if (balanceElement) {
            balanceElement.textContent = formattedBalance;
            // Remove expensive reflow and animation for performance
        }
        
        if (valueElement) {
            valueElement.textContent = formattedValue;
        }

        // Update withdraw button state
        if (withdrawBtn) {
            const hasBalance = parseFloat(balance) > 0;
            withdrawBtn.disabled = !hasBalance;
            
            if (hasBalance) {
                withdrawBtn.classList.add('active');
            } else {
                withdrawBtn.classList.remove('active');
            }
        }

        // Send data to Telegram
        this.sendDataToTelegram({
            type: 'balance_updated',
            crypto: crypto,
            balance: formattedBalance,
            value: formattedValue
        });
    }

    addBalance(crypto, amount) {
        const currentBalance = parseFloat(appState.balances[crypto] || 0);
        const newBalance = currentBalance + parseFloat(amount);
        this.updateBalance(crypto, newBalance);
    }

    sendDataToTelegram(data) {
        if (tg?.sendData) {
            tg.sendData(JSON.stringify(data));
        }
    }
}

const balanceManager = new BalanceManager();

// Withdraw Manager
class WithdrawManager {
    constructor() {
        this.modal = document.getElementById('withdraw-modal');
        this.closeBtn = this.modal?.querySelector('.close-modal');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        this.submitBtn = document.getElementById('withdraw-submit-btn');
        this.maxBtn = document.getElementById('withdraw-max-btn');
        this.currentCrypto = null;
        
        this.setupEvents();
        this.setupWithdrawButtons();
    }

    setupEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.hide());
        }
        
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => this.submitWithdraw());
        }
        
        if (this.maxBtn) {
            this.maxBtn.addEventListener('click', () => this.setMaxAmount());
        }
    }

    setupWithdrawButtons() {
        const withdrawBtns = document.querySelectorAll('.withdraw-btn');
        withdrawBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const crypto = btn.dataset.crypto;
                if (!btn.disabled) {
                    this.show(crypto);
                }
            });
        });
    }

    show(crypto) {
        this.currentCrypto = crypto;
        
        // Fill modal data
        const iconElement = document.getElementById('withdraw-crypto-icon');
        const nameElement = document.getElementById('withdraw-crypto-name');
        const availableElement = document.getElementById('withdraw-available');
        const currencyElement = document.getElementById('withdraw-currency');
        const feeElement = document.getElementById('withdraw-fee');
        
        if (iconElement) iconElement.src = CONFIG.cryptoIcons[crypto];
        if (nameElement) nameElement.textContent = crypto.toUpperCase();
        if (availableElement) availableElement.textContent = appState.balances[crypto] || '0.00000000';
        if (currencyElement) currencyElement.textContent = crypto.toUpperCase();
        
        // Set network fee
        const fees = {
            btc: '0.00001 BTC (~$0.96)',
            eth: '0.002 ETH (~$6.40)',
            ltc: '0.001 LTC (~$0.11)',
            bnb: '0.0005 BNB (~$0.36)',
            trx: '1 TRX (~$0.15)',
            sol: '0.00025 SOL (~$0.05)',
            usdt: '1 USDT (~$1.00)',
            usdc: '1 USDC (~$1.00)'
        };
        
        if (feeElement) {
            feeElement.textContent = fees[crypto] || '0.001';
        }
        
        // Clear form
        document.getElementById('withdraw-address').value = '';
        document.getElementById('withdraw-amount').value = '';
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        Utils.triggerHaptic('light');
    }

    hide() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentCrypto = null;
    }

    setMaxAmount() {
        const amountInput = document.getElementById('withdraw-amount');
        const available = appState.balances[this.currentCrypto] || '0';
        
        if (amountInput) {
            amountInput.value = available;
        }
        
        Utils.triggerHaptic('light');
    }

    submitWithdraw() {
        const address = document.getElementById('withdraw-address').value;
        const amount = document.getElementById('withdraw-amount').value;
        
        if (!address || !amount || parseFloat(amount) <= 0) {
            this.showNotification('Please fill all fields correctly', 'error');
        return;
    }

        const available = parseFloat(appState.balances[this.currentCrypto] || '0');
        if (parseFloat(amount) > available) {
            this.showNotification('Insufficient balance', 'error');
        return;
    }

        // Simulate withdrawal process
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span>🔄 Processing...</span>';
        
        setTimeout(() => {
            // Update balance
            const newBalance = available - parseFloat(amount);
            balanceManager.updateBalance(this.currentCrypto, newBalance);
            
            // Show success
            this.showNotification(`Successfully withdrawn ${amount} ${this.currentCrypto.toUpperCase()}`, 'success');
            
            // Send to Telegram
            balanceManager.sendDataToTelegram({
                type: 'withdrawal_completed',
                crypto: this.currentCrypto,
                amount: amount,
                address: address,
                timestamp: Date.now()
            });
            
            this.hide();
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span>🚀 SUBMIT WITHDRAWAL</span>';
        }, 2000);
        
        Utils.triggerHaptic('success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `withdraw-notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? 'var(--accent-green)' : 
                       type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontWeight: '600',
            zIndex: '10001',
            animation: 'fadeIn 0.3s ease-out'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// WithdrawManager will be initialized in DOMContentLoaded
let withdrawManager;

// Modal Manager
class ModalManager {
    constructor() {
        this.modal = document.getElementById('found-modal');
        this.closeBtn = document.querySelector('.close-modal');
        this.claimBtn = document.getElementById('claim-wallet-btn');
        this.overlay = document.querySelector('.modal-overlay');
        
        this.setupEvents();
    }

    setupEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.hide());
        }
        
        if (this.claimBtn) {
            this.claimBtn.addEventListener('click', () => this.claimWallet());
        }
    }

    show(walletData) {
        this.currentWallet = walletData;
        
        // Fill modal data
        const iconElement = document.getElementById('found-crypto-icon');
        const nameElement = document.getElementById('found-crypto-name');
        const addressElement = document.getElementById('found-address');
        const balanceElement = document.getElementById('found-balance');
        const valueElement = document.getElementById('found-value');
        
        if (iconElement) iconElement.src = CONFIG.cryptoIcons[walletData.crypto];
        if (nameElement) nameElement.textContent = walletData.name;
        if (addressElement) addressElement.textContent = walletData.address;
        if (balanceElement) balanceElement.textContent = `${walletData.balance} ${walletData.name}`;
        if (valueElement) valueElement.textContent = `$${walletData.value}`;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Effects
        Utils.triggerHaptic('success');
        soundEngine.playFoundSound();
        
        // Removed visual effect for better performance
    }

    hide() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    claimWallet() {
        if (!this.currentWallet) return;
        
        // Add balance
        balanceManager.addBalance(this.currentWallet.crypto, this.currentWallet.balance);
        
        // Update found wallets count
        appState.foundWallets++;
        
        // Haptic feedback
        Utils.triggerHaptic('success');
        
        // Send to Telegram
        balanceManager.sendDataToTelegram({
            type: 'wallet_claimed',
            crypto: this.currentWallet.crypto,
            balance: this.currentWallet.balance,
            value: this.currentWallet.value,
            address: this.currentWallet.address
        });
        
        this.hide();
        this.showClaimNotification();
    }

    showClaimNotification() {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'claim-notification';
        notification.innerHTML = '💎 Wallet Claimed Successfully!';
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #2196F3, #1976D2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontWeight: '600',
            zIndex: '10000',
            animation: 'fadeIn 0.3s ease-out'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// ModalManager will be initialized in DOMContentLoaded
let modalManager;

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.pages = document.querySelectorAll('.page');
        this.currentPage = 'scan';
        this.setupEvents();
        this.initializeActivePage();
    }

    setupEvents() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.dataset.page;
                this.navigate(page);
            });
        });
    }

    initializeActivePage() {
        // Set initial active nav item
        const scanNavItem = document.querySelector('[data-page="scan"]');
        if (scanNavItem) {
            scanNavItem.classList.add('active');
        }
    }

    navigate(page) {
        if (page === this.currentPage) return;
        
        // Hide all pages
        this.pages.forEach(pageElement => {
            pageElement.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Remove active class from nav items
        this.navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked nav item
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            this.currentPage = page;
        }
        
        Utils.triggerHaptic('light');
        this.handlePageSwitch(page);
    }

    handlePageSwitch(page) {
        console.log(`Navigated to: ${page}`);
        
        // Page-specific logic
        if (page === 'profile') {
            this.updateProfileStats();
        } else if (page === 'info') {
            if (typeof infoManager !== 'undefined') {
                infoManager.updateServerStatus();
            }
                } else if (page === 'market') {
            if (typeof marketManager !== 'undefined') {
                marketManager.updatePurchaseHistory();
            }
        } else if (page === 'boost') {
            if (typeof gamesManager !== 'undefined') {
                gamesManager.checkWheelCooldown();
                gamesManager.updateStats();
            }
        }
        
        // Send to Telegram
        if (typeof balanceManager !== 'undefined') {
            balanceManager.sendDataToTelegram({
                type: 'page_changed',
                page: page
            });
        }
    }

    updateProfileStats() {
        // Update profile statistics with current data
        const statsCards = document.querySelectorAll('.stat-card .stat-number');
        if (statsCards.length >= 4) {
            statsCards[0].textContent = appState.totalScans.toLocaleString();
            statsCards[1].textContent = appState.walletsFound;
            statsCards[2].textContent = '100x';
            statsCards[3].textContent = '70%';
        }
    }
}

// NavigationManager will be initialized in DOMContentLoaded
let navigationManager;

// Profile Manager
class ProfileManager {
    constructor() {
        this.setupHandlers();
    }

    setupHandlers() {
        // History refresh button
        const historyRefreshBtn = document.getElementById('history-refresh-btn');
        if (historyRefreshBtn) {
            historyRefreshBtn.addEventListener('click', () => {
                console.log('Refreshing history...');
                Utils.triggerHaptic('medium');
                this.refreshHistory();
            });
        }
    }

    refreshHistory() {
        // Simulate history refresh
        const historyContent = document.querySelector('.history-content');
        if (historyContent) {
            historyContent.innerHTML = '<div class="loading">Loading...</div>';
            
            setTimeout(() => {
                historyContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <div class="empty-text">No withdrawal history yet.</div>
                        <div class="empty-subtitle">Your transactions will appear here</div>
                    </div>
                `;
            }, 1000);
        }
    }
}

const profileManager = new ProfileManager();

// Info Manager
class InfoManager {
    constructor() {
        this.setupChannelHandlers();
        this.startServerUpdates();
    }

    setupChannelHandlers() {
        const joinChannelBtns = document.querySelectorAll('.join-channel-btn');
        joinChannelBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const channel = btn.dataset.channel;
                this.handleChannelJoin(channel, btn);
            });
        });
    }

    handleChannelJoin(channel, button) {
        console.log(`Joining channel: ${channel}`);
        Utils.triggerHaptic('medium');
        
        // Simulate channel join
        this.showJoinFeedback(button);
        
        // Send to Telegram
        if (typeof balanceManager !== 'undefined') {
            balanceManager.sendDataToTelegram({
                type: 'channel_join',
                channel: channel,
                timestamp: Date.now()
            });
        }

        // Open Telegram channel (mock)
        this.openTelegramChannel(channel);
    }

    showJoinFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Opening...</span>';
        button.style.background = 'linear-gradient(135deg, var(--accent-green), #45a049)';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 1500);
    }

    openTelegramChannel(channel) {
        // ЗАМЕНИТЕ НА ВАШИ РЕАЛЬНЫЕ TELEGRAM КАНАЛЫ:
        const channels = {
            main: 'https://t.me/YOUR_MAIN_CHANNEL',        // Software Crypto Mining
            tutorial: 'https://t.me/YOUR_TUTORIAL_CHANNEL', // Tutorial Channel  
            support: 'https://t.me/YOUR_SUPPORT_CHANNEL'    // Admin Support
        };

        const url = channels[channel];
        if (url) {
            console.log(`Opening Telegram channel: ${url}`);
            
            // Try to open in Telegram app first, fallback to web
            if (tg && tg.openTelegramLink) {
                tg.openTelegramLink(url);
            } else {
                // Fallback for web browsers
                window.open(url, '_blank');
            }
        }
    }

    updateServerStatus() {
        // Update server info with real-time data
        const statusElement = document.querySelector('.info-status.active');
        const usersElement = document.querySelector('.info-row:nth-child(2) .info-value');
        const uptimeElement = document.querySelector('.info-row:nth-child(4) .info-value');

        if (statusElement && usersElement && uptimeElement) {
            // Simulate real-time updates
            const users = 12847 + Math.floor(Math.random() * 100);
            const uptime = (99.9 + Math.random() * 0.09).toFixed(1);

            usersElement.textContent = users.toLocaleString();
            uptimeElement.textContent = `${uptime}%`;
        }
    }

    startServerUpdates() {
        // Update server stats every 30 seconds
        this.serverUpdateInterval = setInterval(() => {
            if (navigationManager.currentPage === 'info') {
                this.updateServerStatus();
            }
        }, 30000);
    }

    stopServerUpdates() {
        if (this.serverUpdateInterval) {
            clearInterval(this.serverUpdateInterval);
            this.serverUpdateInterval = null;
        }
    }
}

const infoManager = new InfoManager();

// Market Manager
class MarketManager {
    constructor() {
        console.log('🏪 MarketManager constructor called');
        this.purchaseHistory = JSON.parse(localStorage.getItem('marketHistory') || '[]');
        this.products = {
            'boost-10x': { 
                id: 'boost-10x',
                name: 'Lightning Boost', 
                boost: '10x',
                multiplier: 10,
                scanSpeed: 100, // 10 wallets per second (1000ms/10 = 100ms)
                findRate: 15, // 15% find rate
                duration: 43200, 
                price: '$30.00',
                usdtPrice: 30.0,
                description: '10 wallets/sec, 15% find rate',
                features: ['10 wallets per second', '15% find rate', '1 month duration']
            },
            'boost-20x': { 
                id: 'boost-20x',
                name: 'Turbo Boost', 
                boost: '20x',
                multiplier: 20,
                scanSpeed: 50, // 20 wallets per second (1000ms/20 = 50ms)
                findRate: 30, // 30% find rate
                duration: 43200, 
                price: '$50.00',
                usdtPrice: 50.0,
                description: '20 wallets/sec, 30% find rate',
                features: ['20 wallets per second', '30% find rate', '1 month duration']
            },
            'boost-50x': { 
                id: 'boost-50x',
                name: 'Hyper Boost', 
                boost: '50x',
                multiplier: 50,
                scanSpeed: 20, // 50 wallets per second (1000ms/50 = 20ms)
                findRate: 50, // 50% find rate
                duration: 43200, 
                price: '$100.00',
                usdtPrice: 100.0,
                description: '50 wallets/sec, 50% find rate',
                features: ['50 wallets per second', '50% find rate', '1 month duration']
            },
            'boost-100x': { 
                id: 'boost-100x',
                name: 'Ultimate Boost', 
                boost: '100x',
                multiplier: 100,
                scanSpeed: 10, // 100 wallets per second (1000ms/100 = 10ms)
                findRate: 70, // 70% find rate
                duration: 43200, 
                price: '$150.00',
                usdtPrice: 150.0,
                description: '100 wallets/sec, 70% find rate',
                features: ['100 wallets per second', '70% find rate', '1 month duration']
            },
            'nft-scanner': { 
                id: 'nft-scanner',
                name: 'NFT Scanner Pro', 
                price: '$30.00',
                usdtPrice: 30.0,
                description: 'Unlock NFT detection for all coins',
                features: ['NFT flags for all coins', 'Enhanced token detection', 'Permanent activation']
            },
            'test-boost': { 
                id: 'test-boost',
                name: 'Test Boost (BNB)', 
                boost: '2x',
                multiplier: 2,
                scanSpeed: 500, // 2 wallets per second (1000ms/2 = 500ms)
                findRate: 10, // 10% find rate
                duration: 600, // 10 minutes for testing
                price: '0.0005 BNB',
                bnbPrice: 0.0005,
                description: '2 wallets/sec, 10% find rate (Test)',
                features: ['2 wallets per second', '10% find rate', '10 minutes duration', 'FOR TESTING ONLY']
            },
            'test-boost-usdt': { 
                id: 'test-boost-usdt',
                name: 'Test Boost (USDT)', 
                boost: '3x',
                multiplier: 3,
                scanSpeed: 333, // 3 wallets per second (1000ms/3 = 333ms)
                findRate: 15, // 15% find rate
                duration: 900, // 15 minutes for testing
                price: '1.5 USDT',
                usdtPrice: 1.5,
                description: '3 wallets/sec, 15% find rate (USDT Test)',
                features: ['3 wallets per second', '15% find rate', '15 minutes duration', 'USDT TRC-20 TESTING']
            }
        };
        this.setupHandlers();
        this.updatePurchaseHistory();
    }

    setupHandlers() {
        console.log('🔧 Setting up MarketManager handlers...');
        
        // Buy buttons
        const buyButtons = document.querySelectorAll('.buy-btn');
        console.log(`📊 Found ${buyButtons.length} buy buttons`);
        
        buyButtons.forEach((btn, index) => {
            const productId = btn.getAttribute('data-product');
            console.log(`  Button ${index + 1}: ${productId}`);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetProductId = e.target.getAttribute('data-product');
                console.log(`🛒 Buy button clicked: ${targetProductId}`);
                this.purchaseProduct(targetProductId);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('market-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshMarketData();
            });
            console.log('✅ Refresh button handler attached');
        } else {
            console.log('⚠️ Refresh button not found');
        }
        
        console.log('✅ MarketManager handlers setup complete');
    }



    purchaseProduct(productId) {
        console.log(`🛍️ Purchase requested for product: ${productId}`);
        
        const product = this.products[productId];
        if (!product) {
            console.error('❌ Product not found:', productId);
            console.log('📦 Available products:', Object.keys(this.products));
            return;
        }

        console.log(`✅ Product found:`, product);
        console.log(`💰 Price: ${product.price} (${product.usdtPrice} USDT)`);

        // Сразу запускаем платеж (без выбора метода)
        const priceInfo = this.getProductPrice(product);
        walletPoolManager.createPayment(product.name, priceInfo.amount, priceInfo.currency);
        Utils.triggerHaptic('medium');
    }

    showPaymentForm(productId, product) {
        // Create payment modal
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-modal-content">
                <div class="payment-header">
                    <h3>💳 Choose Payment Method</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="payment-body">
                    <div class="product-summary">
                        <h4>${product.name}</h4>
                        <div class="product-description">${product.description || ''}</div>
                        <div class="payment-price">${product.price}</div>
                    </div>
                    <div class="payment-methods">
                        <button class="payment-btn usdt-btn" data-method="usdt">
                            <div class="method-icon">💰</div>
                            <div class="method-info">
                                <div class="method-name">USDT (TRC-20)</div>
                                <div class="method-desc">Fast & Low fees (~1 USDT)</div>
                            </div>
                            <div class="method-price">${this.convertToUSDT(product)} USDT</div>
                        </button>
                        
                        <button class="payment-btn ton-btn" data-method="ton">
                            <div class="method-icon">💎</div>
                            <div class="method-info">
                                <div class="method-name">TON Wallet</div>
                                <div class="method-desc">Telegram native currency</div>
                            </div>
                            <div class="method-price">${product.price}</div>
                        </button>
                        
                        <button class="payment-btn demo-btn" data-method="demo">
                            <div class="method-icon">🎮</div>
                            <div class="method-info">
                                <div class="method-name">Demo Payment</div>
                                <div class="method-desc">For testing purposes</div>
                            </div>
                            <div class="method-price">FREE</div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Style the modal (compact version)
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '15px',
            padding: '20px',
            maxWidth: '350px',
            width: '90%',
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: '10000',
            animation: 'slideInDown 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        });

        document.body.appendChild(modal);

        // Handle close
        const closeBtn = modal.querySelector('.close-modal');
        const closeModal = () => {
            modal.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        // Close on backdrop click (clicking outside the modal)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Handle payment methods
        const paymentBtns = modal.querySelectorAll('.payment-btn');
        paymentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.target.getAttribute('data-method');
                
                if (method === 'usdt') {
                    // Закрываем модалку выбора метода оплаты
                    modal.remove();
                    
                    // Запускаем USDT платеж
                    const usdtPrice = this.convertToUSDT(product);
                    walletPoolManager.createPayment(product.name, parseFloat(usdtPrice));
                } else {
                    // Обычная обработка для других методов
                    this.processPayment(productId, product, method, modal);
                }
            });
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    }
    
    getProductPrice(product) {
        // Для test-boost используем BNB
        if (product.id === 'test-boost' && product.bnbPrice) {
            return { amount: product.bnbPrice, currency: 'BNB', decimals: 4 };
        }
        
        // Для test-boost-usdt используем USDT
        if (product.id === 'test-boost-usdt' && product.usdtPrice) {
            return { amount: product.usdtPrice, currency: 'USDT', decimals: 2 };
        }
        
        // Для остальных продуктов используем USDT
        if (typeof product === 'object' && product.usdtPrice) {
            return { amount: product.usdtPrice, currency: 'USDT', decimals: 2 };
        }
        
        // Fallback: парсим строку цены
        if (typeof product === 'string') {
            const numPrice = parseFloat(product.replace(/[^0-9.]/g, ''));
            return { amount: numPrice, currency: 'USDT', decimals: 2 };
        }
        
        return { amount: 0, currency: 'USDT', decimals: 2 };
    }

    convertToUSDT(product) {
        // Обратная совместимость для USDT продуктов
        const price = this.getProductPrice(product);
        if (price.currency === 'USDT') {
            return price.amount.toFixed(price.decimals);
        }
        return '0.00';
    }

    processPayment(productId, product, method, modal) {
        // Simulate payment processing
        this.showNotification(`🔄 Processing payment via ${method}...`, 'info');
        
        // Close modal
        modal.querySelector('.close-modal').click();

        // Simulate successful payment after 2 seconds
        setTimeout(() => {
            this.completePurchase(productId, product, method);
        }, 2000);
    }

    completePurchase(productId, product, method) {
        // Add to purchase history
        const purchase = {
            id: Date.now(),
            productId: productId,
            product: product,
            timestamp: new Date().toISOString(),
            price: product.price,
            method: method
        };
        this.purchaseHistory.unshift(purchase);
        localStorage.setItem('marketHistory', JSON.stringify(this.purchaseHistory));

        // Apply boost if it's a boost product
        if (productId.startsWith('boost-') || productId.includes('boost')) {
            this.activateBoost(product);
        } else if (productId.startsWith('nft-')) {
            this.activateNFTFeature(product);
        } else {
            this.activatePremiumFeature(product);
        }

        this.showNotification(`✅ Payment successful! ${product.name} activated!`, 'success');
        this.updatePurchaseHistory();
        Utils.triggerHaptic('success');
        
        // Navigate to scan page after successful purchase
        if (window.navigationManager) {
            setTimeout(() => {
                window.navigationManager.navigate('scan');
            }, 1000); // Small delay to show notification first
        }
    }

    activateBoost(product) {
        console.log('🚀 MarketManager activating boost:', product);
        
        // Use GamesManager to activate the boost with proper data
        if (window.gamesManager && window.gamesManager.activateMarketBoost) {
            window.gamesManager.activateMarketBoost(product);
        } else {
            console.error('❌ GamesManager not available for boost activation');
        }

        // Boost activated via market purchase (no notification needed)
    }

    activateNFTFeature(product) {
        console.log('🎨 MarketManager activating NFT feature:', product);
        
        // Use GamesManager to activate NFT features
        if (window.gamesManager && window.gamesManager.activateNFTFeatures) {
            window.gamesManager.activateNFTFeatures();
        } else {
            console.error('❌ GamesManager not available for NFT activation');
        }

        this.showNotification(`🎨 ${product.name} activated! NFT scanning enabled.`, 'nft');
    }

    activatePremiumFeature(product) {
        // Store premium feature activation
        const premiumFeatures = JSON.parse(localStorage.getItem('premiumFeatures') || '[]');
        if (!premiumFeatures.includes(product.name)) {
            premiumFeatures.push(product.name);
            localStorage.setItem('premiumFeatures', JSON.stringify(premiumFeatures));
        }

        this.showNotification(`👑 ${product.name} activated! Premium features unlocked.`, 'premium');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `market-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification - центрируем по горизонтали
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'error' ? '#ff4444' : type === 'boost' ? '#4CAF50' : type === 'nft' ? '#9C27B0' : type === 'premium' ? '#FFD700' : '#00BCD4',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: '10000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'slideInDown 0.3s ease',
            textAlign: 'center',
            minWidth: '200px',
            maxWidth: '90vw'
        });

        document.body.appendChild(notification);

        // Remove after 3 seconds
            setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    refreshMarketData() {
        const refreshBtn = document.getElementById('market-refresh-btn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '⟳';
            refreshBtn.style.animation = 'spin 1s linear infinite';
            
            setTimeout(() => {
                refreshBtn.style.animation = '';
                refreshBtn.innerHTML = '⟳';
                this.updatePurchaseHistory();
            }, 1000);
        }
        
        Utils.triggerHaptic('light');
    }

    updatePurchaseHistory() {
        const historyContent = document.querySelector('.market-history-section .history-content');
        if (!historyContent) return;

        if (this.purchaseHistory.length === 0) {
            historyContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <div class="empty-text">No purchases yet</div>
                    <div class="empty-subtitle">Start shopping to enhance your scanner</div>
                </div>
            `;
        } else {
            let historyHTML = '<div class="purchase-list">';
            this.purchaseHistory.slice(0, 10).forEach(purchase => {
                const date = new Date(purchase.timestamp).toLocaleDateString();
                historyHTML += `
                    <div class="purchase-item">
                        <div class="purchase-product">${purchase.product.name}</div>
                        <div class="purchase-price">-${purchase.price} TON</div>
                        <div class="purchase-date">${date}</div>
                    </div>
                `;
            });
            historyHTML += '</div>';
            historyContent.innerHTML = historyHTML;
        }
    }

    // Test purchase for debugging
    testPurchase(productId) {
        const product = this.products[productId];
        if (product) {
            this.completePurchase(productId, product, 'test');
        }
    }
}

// MarketManager будет инициализирован в DOMContentLoaded
let marketManager;

// Smart Wallet Pool Manager для USDT платежей
class SmartWalletPoolManager {
    constructor() {
        this.walletPool = [
            { address: "0x0476d0b67e7e7e2654F16b31F807868FAf726588", name: "Test Wallet (BNB)", network: "BSC" },
            { address: "TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7", name: "Test Wallet (USDT)", network: "TRON" }, // User's USDT wallet
            { address: "TR2B8OqCKG9Q0nwjRXyIM6s4eIIIIM6t4H", name: "Wallet #2", network: "TRON" },
            { address: "TR3C9PrDLH0R1oxkSYzJN7t5fJJJJN7u5I", name: "Wallet #3", network: "TRON" },
            { address: "TR4D0QsEMI1S2pyl8Z0KO8v6J", name: "Wallet #4", network: "TRON" },
            { address: "TR5E1RtFNJ2T3qzm9A1LP9v7hLLLLP9w7K", name: "Wallet #5", network: "TRON" },
            { address: "TR6F2SuGOK3U4r0nAB2MQ0w8iMMMMQ0x8L", name: "Wallet #6", network: "TRON" },
            { address: "TR7G3TvHPL4V5s1oBC3NR1x9jNNNNR1y9M", name: "Wallet #7", network: "TRON" },
            { address: "TR8H4UwIQM5W6t2pCD4OS2y0kOOOOS2z0N", name: "Wallet #8", network: "TRON" },
            { address: "TR9I5VxJRN6X7u3qDE5PT3z1lPPPPT3A1O", name: "Wallet #9", network: "TRON" },
            { address: "TR0J6WyKSO7Y8v4rEF6QU4A2mQQQQU4B2P", name: "Wallet #10", network: "TRON" }
        ];
        
        this.currentWalletIndex = 0;
        this.pendingPayments = new Map();
        this.walletExpectations = new Map();
        this.USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
        this.BSC_API_KEY = null; // Установите через setBSCApiKey()
    }
    

    
    getNextWallet(currency = 'USDT') {
        // Для BNB ищем BSC кошелек
        if (currency === 'BNB') {
            const bscWallet = this.walletPool.find(w => w.network === 'BSC');
            if (bscWallet) return bscWallet;
        }
        
        // Для USDT ищем ваш специальный кошелек
        if (currency === 'USDT') {
            const usdtWallet = this.walletPool.find(w => w.address === 'TQRV13gBsZ6eXoH4YG4PDvcFUFsXEKtfB7');
            if (usdtWallet) return usdtWallet;
        }
        
        // Fallback: обычная ротация
        const wallet = this.walletPool[this.currentWalletIndex];
        this.currentWalletIndex = (this.currentWalletIndex + 1) % this.walletPool.length;
        return wallet;
    }
    
    async createPayment(productId, baseAmount, currency = 'USDT') {
        const assignedWallet = this.getNextWallet(currency);
        
        // Для BSC платежей сохраняем начальный баланс
        let initialBalance = 0;
        if (assignedWallet.network === 'BSC' && currency === 'BNB') {
            initialBalance = await this.checkBSCBalance(assignedWallet.address);
            console.log(`📊 Initial balance on ${assignedWallet.name}: ${initialBalance} BNB`);
        }
        
        const orderId = `eagle_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const payment = {
            orderId,
            userId: tg.initDataUnsafe?.user?.id || 'guest',
            productId,
            baseAmount,
            currency,
            network: assignedWallet.network || 'TRON',
            assignedWallet: assignedWallet.address,
            walletName: assignedWallet.name,
            status: 'waiting_payment',
            createdAt: Date.now(),
            expiresAt: Date.now() + (30 * 60 * 1000),
            isChecking: false,
            initialBalance // Сохраняем начальный баланс
        };
        
        this.pendingPayments.set(orderId, payment);
        this.addWalletExpectation(assignedWallet.address, baseAmount, orderId, initialBalance);
        this.showPaymentInterface(payment);
        
        console.log(`💰 Created payment: ${baseAmount} ${currency} to ${assignedWallet.name} (${assignedWallet.network}) for ${productId}`);
        return payment;
    }
    
    addWalletExpectation(walletAddress, amount, orderId, initialBalance = 0) {
        if (!this.walletExpectations.has(walletAddress)) {
            this.walletExpectations.set(walletAddress, {
                expectations: new Map(),
                initialBalance: initialBalance
            });
        }
        const walletData = this.walletExpectations.get(walletAddress);
        walletData.expectations.set(amount, orderId);
        // Обновляем начальный баланс если передан
        if (initialBalance > 0) {
            walletData.initialBalance = initialBalance;
        }
    }
    
    removeWalletExpectation(walletAddress, amount) {
        if (this.walletExpectations.has(walletAddress)) {
            const walletData = this.walletExpectations.get(walletAddress);
            if (walletData.expectations) {
                walletData.expectations.delete(amount);
            }
        }
    }
    
    showPaymentInterface(payment) {
        const networkName = payment.network === 'BSC' ? 'BSC (BEP-20)' : 'TRC-20';
        const networkEmoji = payment.network === 'BSC' ? '🟡' : '🔵';
        
        // Корректное отображение валюты и сети
        const currencyNetwork = payment.currency === 'BNB' ? 'BSC (BEP-20)' : 'TRC-20';
        const currencyDisplay = `${payment.currency} (${currencyNetwork})`;
        
        const modal = document.createElement('div');
        modal.className = 'payment-modal-overlay';
        modal.innerHTML = `
            <div class="usdt-payment-modal">
                <div class="payment-header">
                    <h3>${networkEmoji} ${payment.currency} Payment - ${payment.walletName}</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="payment-amount-section">
                    <div class="amount-display">
                        <span class="amount-label">Send:</span>
                        <span class="amount-value">${payment.baseAmount} ${payment.currency}</span>
                    </div>
                    <div class="amount-note">
                        💡 Send the exact amount shown above
                    </div>
                </div>
                
                <div class="payment-details">
                    <div class="detail-row">
                        <span>Product:</span>
                        <span>${payment.productId}</span>
                    </div>
                    <div class="detail-row">
                        <span>Base Price:</span>
                        <span>${payment.baseAmount} ${payment.currency}</span>
                    </div>
                    <div class="detail-row">
                        <span>Network:</span>
                        <span>${networkName}</span>
                    </div>
                    <div class="detail-row">
                        <span>Order ID:</span>
                        <span>${payment.orderId}</span>
                    </div>
                </div>
                
                <div class="address-section">
                    <label>Send ${currencyDisplay} to:</label>
                    <div class="address-input-group">
                        <input value="${payment.assignedWallet}" readonly>
                        <button onclick="navigator.clipboard.writeText('${payment.assignedWallet}'); this.textContent='✅ Copied'">
                            📋 Copy
                        </button>
                    </div>
                </div>
                

                
                <div class="instructions">
                    <h4>📋 Instructions:</h4>
                    <ol>
                        <li>Send exactly <strong>${payment.baseAmount} ${payment.currency}</strong> (${currencyNetwork})</li>
                        <li>To the address above</li>
                        <li>Click "I Paid" button after sending</li>
                        <li>Wait for automatic confirmation</li>
                    </ol>
                    <p class="no-memo-note">✅ <strong>No memo required!</strong> Works with any wallet/exchange</p>
                </div>
                
                <div class="timer-section">
                    <div class="payment-timer">
                        ⏰ Payment expires in: <span id="countdown-${payment.orderId}">30:00</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button id="paid-btn-${payment.orderId}" 
                            class="paid-button"
                            onclick="walletPoolManager.userConfirmedPayment('${payment.orderId}')">
                        ✅ I Sent ${payment.baseAmount} ${payment.currency}
                    </button>
                    
                    <button class="cancel-button" 
                            onclick="walletPoolManager.cancelPayment('${payment.orderId}')">
                        ❌ Cancel Order
                    </button>
                </div>
                
                <div id="check-status-${payment.orderId}" class="check-status" style="display:none;">
                    <div class="checking-animation">🔄 Looking for ${payment.baseAmount} ${payment.currency}...</div>
                    <p>Checking recent transactions on ${payment.walletName} (${currencyNetwork})</p>
                </div>
            </div>
        `;
        
        // Add close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
        this.startCountdown(payment.orderId);
    }
    
    async userConfirmedPayment(orderId) {
        console.log(`🔄 userConfirmedPayment called for order: ${orderId}`);
        
        const payment = this.pendingPayments.get(orderId);
        console.log(`📋 Payment found:`, payment ? 'YES' : 'NO');
        console.log(`🔒 Already checking:`, payment?.isChecking || 'N/A');
        
        if (!payment || payment.isChecking) {
            console.log(`❌ Skipping - no payment or already checking`);
            return;
        }
        
        payment.isChecking = true;
        console.log(`🎯 Starting payment check for ${payment.baseAmount} ${payment.currency}`);
        
        this.showCheckingStatus(orderId);
        
        const isPaymentFound = await this.findExactPayment(payment);
        console.log(`🔍 Payment search result:`, isPaymentFound ? 'FOUND' : 'NOT FOUND');
        
        if (isPaymentFound) {
            console.log(`✅ Confirming payment...`);
            this.confirmPayment(orderId);
        } else {
            console.log(`❌ Showing payment not found...`);
            this.showPaymentNotFound(orderId);
        }
        
        payment.isChecking = false;
        console.log(`🏁 Payment check completed for ${orderId}`);
    }
    
    async findExactPayment(payment) {
        try {
            console.log(`🔍 Looking for exact amount: ${payment.baseAmount} ${payment.currency} on ${payment.assignedWallet} (${payment.network})`);
            
            if (payment.network === 'BSC' && payment.currency === 'BNB') {
                return await this.findBSCPayment(payment);
            } else {
                return await this.findTRONPayment(payment);
            }
            
        } catch (error) {
            console.error('Payment search error:', error);
            return false;
        }
    }
    
    async findBSCPayment(payment) {
        try {
            console.log(`🔍 Searching BSC payment: ${payment.baseAmount} BNB on ${payment.assignedWallet}`);
            
            // Попробуем использовать прямой RPC вместо BSCScan API
            console.log(`🔄 Trying direct BSC RPC approach...`);
            
            // Сначала проверим текущий баланс
            const currentBalance = await this.checkBSCBalance(payment.assignedWallet);
            console.log(`💰 Current balance: ${currentBalance} BNB`);
            
            // Проверим, изменился ли баланс с момента создания платежа
            const expectedBalance = this.walletExpectations.get(payment.assignedWallet);
            if (expectedBalance) {
                const balanceIncrease = currentBalance - expectedBalance.initialBalance;
                console.log(`📊 Balance change: +${balanceIncrease} BNB`);
                
                if (Math.abs(balanceIncrease - payment.baseAmount) <= 0.0001) {
                    console.log(`✅ BALANCE MATCH! Received ${balanceIncrease} BNB`);
                    return true;
                }
            }
            
            // Fallback: пробуем через API если доступен
            const proxyUrl = `/api/bsc/${payment.assignedWallet}`;
            console.log(`📡 Fallback to BSC API proxy: ${proxyUrl}`);
            
            const response = await fetch(proxyUrl);
            
            console.log(`📡 BSCScan response status: ${response.status}`);
            
            if (!response.ok) {
                console.log(`❌ BSCScan API error: ${response.status} ${response.statusText}`);
                return false;
            }
            
            const data = await response.json();
            console.log(`📊 BSCScan data:`, data);
            
            if (data.status === '1' && data.result && Array.isArray(data.result)) {
                console.log(`📋 Found ${data.result.length} transactions`);
                
                for (let i = 0; i < data.result.length; i++) {
                    const tx = data.result[i];
                    const amount = parseFloat(tx.value) / Math.pow(10, 18); // BNB имеет 18 десятичных знаков
                    const txTime = parseInt(tx.timeStamp) * 1000; // Конвертация в миллисекунды
                    
                    console.log(`🔍 TX ${i+1}: ${amount} BNB to ${tx.to} at ${new Date(txTime).toLocaleString()}`);
                    
                    if (Math.abs(amount - payment.baseAmount) <= 0.0001 && 
                        txTime >= payment.createdAt &&
                        tx.to && tx.to.toLowerCase() === payment.assignedWallet.toLowerCase()) {
                        
                        console.log(`✅ BSC MATCH FOUND! ${amount} BNB = ${payment.baseAmount} BNB`);
                        console.log(`📍 TX Hash: ${tx.hash}`);
                        console.log(`⏰ TX Time: ${new Date(txTime).toLocaleString()}`);
                        
                        this.removeWalletExpectation(payment.assignedWallet, payment.baseAmount);
                        return true;
                    }
                }
                
                console.log(`❌ No matching transaction found for ${payment.baseAmount} BNB`);
            } else {
                console.log(`❌ BSCScan response error:`, data);
                if (data.message) {
                    console.log(`📝 Error message: ${data.message}`);
                }
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ BSC Payment search error:', error);
            return false;
        }
    }
    
    async checkBSCBalance(address) {
        try {
            const BSC_RPC = 'https://bsc-dataseed.binance.org/';
            const response = await fetch(BSC_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getBalance',
                    params: [address, 'latest'],
                    id: 1
                })
            });
            
            const data = await response.json();
            if (data.result) {
                const balanceWei = parseInt(data.result, 16);
                const balanceBNB = balanceWei / 1e18;
                return balanceBNB;
            }
            return 0;
        } catch (error) {
            console.error('❌ BSC RPC error:', error);
            return 0;
        }
    }
    
    async findTRONPayment(payment) {
        try {
            // Если это TRX, проверяем обычные транзакции
            if (payment.currency === 'TRX') {
                console.log(`🔍 Searching for TRX payment...`);
                const response = await fetch(
                    `https://api.trongrid.io/v1/accounts/${payment.assignedWallet}/transactions?` +
                    `limit=50&order_by=block_timestamp,desc`
                );
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    for (const tx of data.data) {
                        // Для TRX проверяем contract_data
                        if (tx.raw_data && tx.raw_data.contract && tx.raw_data.contract[0]) {
                            const contract = tx.raw_data.contract[0];
                            if (contract.type === 'TransferContract' && contract.parameter && contract.parameter.value) {
                                const toAddress = contract.parameter.value.to_address;
                                const amount = (contract.parameter.value.amount || 0) / 1000000; // TRX has 6 decimals
                                const txTime = tx.block_timestamp;
                                
                                // Проверяем, что транзакция входящая
                                if (toAddress === payment.assignedWallet && 
                                    Math.abs(amount - payment.baseAmount) <= 0.001 && 
                                    txTime >= payment.createdAt) {
                                    
                                    console.log(`✅ TRX MATCH! ${amount} TRX = ${payment.baseAmount} TRX`);
                                    this.removeWalletExpectation(payment.assignedWallet, payment.baseAmount);
                                    return true;
                                }
                            }
                        }
                    }
                }
            } else {
                // Для USDT используем старый код
                console.log(`🔍 Searching for USDT TRC-20 payment...`);
                const response = await fetch(
                    `https://api.trongrid.io/v1/accounts/${payment.assignedWallet}/transactions/trc20?` +
                    `contract_address=${this.USDT_CONTRACT}&` +
                    `limit=50&order_by=block_timestamp,desc`
                );
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    for (const tx of data.data) {
                        const amount = parseFloat(tx.value) / 1000000;
                        const txTime = tx.block_timestamp;
                        
                        if (Math.abs(amount - payment.baseAmount) <= 0.001 && 
                            txTime >= payment.createdAt) {
                            
                            console.log(`✅ USDT MATCH! ${amount} = ${payment.baseAmount}`);
                            this.removeWalletExpectation(payment.assignedWallet, payment.baseAmount);
                            return true;
                        }
                    }
                }
            }
            
            return false;
            
        } catch (error) {
            console.error('TRON Payment search error:', error);
            return false;
        }
    }
    
    confirmPayment(orderId) {
        const payment = this.pendingPayments.get(orderId);
        if (!payment) {
            console.log(`❌ Payment not found: ${orderId}`);
            return;
        }
        
        payment.status = 'confirmed';
        
        const statusEl = document.getElementById(`check-status-${orderId}`);
        
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="payment-confirmed">
                    ✅ <strong>Payment Confirmed!</strong>
                    <p>${payment.productId} has been activated</p>
                </div>
            `;
        } else {
            console.log(`✅ Payment confirmed for ${orderId}, but status element not found (modal may be closed)`);
        }
        
        // Активируем продукт через MarketManager
        this.activateProduct(payment);
        this.pendingPayments.delete(orderId);
        
        // Показываем уведомление об успехе
        if (window.marketManager) {
            window.marketManager.showNotification('✅ Payment Confirmed! Product Activated!', 'success');
        }
        
        // Отправляем данные о покупке боту
        this.sendPurchaseDataToBot(payment, product);
        
        // Закрываем модалку через 3 секунды
        setTimeout(() => {
            const modal = document.querySelector('.payment-modal-overlay');
            if (modal) modal.remove();
        }, 3000);
    }
    
    activateProduct(payment) {
        console.log(`🎯 Activating product: ${payment.productId}`);
        
        // Находим продукт в MarketManager по ID
        const product = marketManager.products[payment.productId];
        
        if (product) {
            console.log(`✅ Found product:`, product);
            marketManager.completePurchase(product.id, product, payment.orderId);
            console.log(`🎯 Product activated: ${product.name}`);
        } else {
            console.error(`❌ Product not found: ${payment.productId}`);
            console.log('Available products:', Object.keys(marketManager.products));
        }
    }
    
    showCheckingStatus(orderId) {
        const payment = this.pendingPayments.get(orderId);
        
        const paidBtn = document.getElementById(`paid-btn-${orderId}`);
        const statusEl = document.getElementById(`check-status-${orderId}`);
        
        if (paidBtn) {
            paidBtn.style.display = 'none';
        } else {
            console.log(`❌ Paid button not found for order: ${orderId}`);
        }
        
        if (statusEl) {
            statusEl.style.display = 'block';
        } else {
            console.log(`❌ Status element not found for order: ${orderId}`);
        }
    }
    
    showPaymentNotFound(orderId) {
        const payment = this.pendingPayments.get(orderId);
        const statusEl = document.getElementById(`check-status-${orderId}`);
        const currencyNetwork = payment?.currency === 'BNB' ? 'BSC (BEP-20)' : 'TRC-20';
        
        if (!statusEl || !payment) {
            console.log(`❌ Status element or payment not found for order: ${orderId}`);
            return;
        }
        
        statusEl.innerHTML = `
            <div class="payment-not-found">
                <h4>❌ Payment Not Found</h4>
                <p>Looking for exactly: <strong>${payment.baseAmount} ${payment.currency}</strong></p>
                
                <div class="troubleshooting">
                    <h5>🛠️ Check:</h5>
                    <ul>
                        <li>✓ Sent exactly ${payment.baseAmount} ${payment.currency}?</li>
                        <li>✓ Used ${payment.currency} ${currencyNetwork} network?</li>
                        <li>✓ Transaction confirmed? (wait 1-2 minutes)</li>
                        <li>✓ Correct address?</li>
                    </ul>
                </div>
                
                <button onclick="walletPoolManager.userConfirmedPayment('${orderId}')" 
                        class="retry-button">
                    🔄 Check Again
                </button>
            </div>
        `;
        
        setTimeout(() => {
            document.getElementById(`paid-btn-${orderId}`).style.display = 'block';
        }, 30000);
    }
    
    startCountdown(orderId) {
        const payment = this.pendingPayments.get(orderId);
        const countdownEl = document.getElementById(`countdown-${orderId}`);
        
        const timer = setInterval(() => {
            const remaining = payment.expiresAt - Date.now();
            
            if (remaining <= 0) {
                clearInterval(timer);
                this.expirePayment(orderId);
                return;
            }
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    expirePayment(orderId) {
        const payment = this.pendingPayments.get(orderId);
        if (payment) {
            payment.status = 'expired';
            const btn = document.getElementById(`paid-btn-${orderId}`);
            if (btn) {
                btn.disabled = true;
                btn.textContent = '⏰ Payment Expired';
            }
        }
    }
    
    cancelPayment(orderId) {
        const payment = this.pendingPayments.get(orderId);
        if (payment) {
            this.removeWalletExpectation(payment.assignedWallet, payment.baseAmount);
            this.pendingPayments.delete(orderId);
        }
        
        const modal = document.querySelector('.payment-modal-overlay');
        if (modal) modal.remove();
    }
    
    showWalletStatus() {
        console.log('🏦 Current wallet expectations:');
        for (const [wallet, expectations] of this.walletExpectations) {
            const expectedAmounts = Array.from(expectations.keys());
            if (expectedAmounts.length > 0) {
                console.log(`${wallet.substr(0, 8)}...: waiting for [${expectedAmounts.join(', ')}] USDT`);
            }
        }
    }
}

const walletPoolManager = new SmartWalletPoolManager();
window.walletPoolManager = walletPoolManager;

// Games Manager
class GamesManager {
    constructor() {
        // Crypto symbols with better win probability distribution
        this.reelStates = [
            ['BTC', 'ETH', 'BTC', 'LTC', 'BTC', 'SOL', 'BNB', 'TRX', 'USDT'],
            ['ETH', 'BTC', 'LTC', 'ETH', 'SOL', 'BTC', 'BNB', 'TRX', 'USDT'],
            ['LTC', 'BTC', 'ETH', 'SOL', 'LTC', 'BNB', 'BTC', 'TRX', 'USDT']
        ];
        
        this.cryptoImages = {
            'BTC': '../images/Bitcoin.png',
            'ETH': '../images/ethereum-eth-logo.png',
            'LTC': '../images/ltc.png',
            'SOL': '../images/sol.png',
            'BNB': '../images/bnb.png',
            'TRX': '../images/trx.png',
            'USDT': '../images/tether.png'
        };
        
        this.wheelPrizes = ['Try Again', 'Good Luck', 'Nice Try', 'Awesome', 'Great', 'Amazing'];
        this.stats = {
            totalSpins: parseInt(localStorage.getItem('totalSpins') || '0'),
            wheelSpins: parseInt(localStorage.getItem('wheelSpins') || '0'),
            bestCombo: localStorage.getItem('bestCombo') || 'None'
        };
        this.spinning = false;
        this.winCooldown = {
            spinsAfterWin: parseInt(localStorage.getItem('spinsAfterWin') || '100'),
            lastWinType: localStorage.getItem('lastWinType') || 'none'
        };
        this.wheelCooldown = this.getWheelCooldown();
        this.setupHandlers();
        this.initializeReels();
        this.updateStats();
        this.checkWheelCooldown();
        this.checkActiveBoost();
    }

    setupHandlers() {
        // Slot machine
        const spinBtn = document.getElementById('spin-btn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                this.spinSlots();
            });
        }

        // Lucky wheel
        const wheelBtn = document.getElementById('wheel-btn');
        if (wheelBtn) {
            wheelBtn.addEventListener('click', () => {
                this.spinWheel();
            });
        }

        // Jackpot popup handlers
        const activateBoostBtn = document.getElementById('activate-boost-btn');
        const closePopupBtn = document.getElementById('close-popup-btn');
        
        if (activateBoostBtn) {
            activateBoostBtn.addEventListener('click', () => {
                this.activateBoost();
            });
        }
        
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', () => {
                this.closeJackpotPopup();
            });
        }
    }
    
    initializeReels() {
        console.log('Initializing reels...');
        const reels = document.querySelectorAll('.reel');
        reels.forEach((reel, index) => {
            // Show first 3 symbols initially
            reel.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const symbolDiv = document.createElement('div');
                symbolDiv.classList.add('symbol');
                symbolDiv.innerHTML = `<img src="${this.cryptoImages[this.reelStates[index][i]]}" alt="${this.reelStates[index][i]}">`;
                reel.appendChild(symbolDiv);
            }
        });
    }

    spinSlots() {
        if (this.spinning) return;
        
        const spinBtn = document.getElementById('spin-btn');
        const reels = document.querySelectorAll('.reel');
        const resultDiv = document.getElementById('slot-result');

        Utils.triggerHaptic('light');
        this.spinning = true;
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<span class="spin-text">SPINNING...</span>';
        
        resultDiv.textContent = 'Spinning...';

        reels.forEach((reel, reelIndex) => {
            this.spinReel(reel, reelIndex);
        });
        
        // Check results after all reels stop
        setTimeout(() => {
            this.checkWin();
            this.stats.totalSpins++;
            this.saveStats();
            this.updateStats();
            
            this.spinning = false;
            spinBtn.disabled = false;
            spinBtn.innerHTML = '<span class="spin-text">SPIN</span>';
        }, 2000 + (reels.length * 500));
    }
    
    spinReel(reel, reelIndex) {
        const spinCount = 20 + Math.floor(Math.random() * 15);
        let currentSpin = 0;
        
        // Add spinning class for continuous animation
        reel.classList.add('spinning');
        
        // Ultra smooth speed progression
        const getSpinSpeed = (spin, total) => {
            const progress = spin / total;
            if (progress < 0.6) {
                return 50; // Very fast at start
            } else if (progress < 0.8) {
                return 70; // Fast
            } else if (progress < 0.95) {
                return 100; // Medium
            } else {
                return 180; // Very slow at end
            }
        };
        
        const spinStep = () => {
            // Rotate symbols in the array
            this.reelStates[reelIndex].unshift(this.reelStates[reelIndex].pop());
            
            // Update DOM with ultra smooth transition
            reel.style.transition = 'all 0.08s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Smooth symbol replacement
            const symbols = reel.querySelectorAll('.symbol');
            symbols.forEach(symbol => {
                symbol.style.opacity = '0.7';
                symbol.style.transform = 'scale(0.95)';
            });
            
            setTimeout(() => {
                reel.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    const symbolDiv = document.createElement('div');
                    symbolDiv.classList.add('symbol');
                    symbolDiv.style.opacity = '0';
                    symbolDiv.style.transform = 'scale(1.1)';
                    symbolDiv.innerHTML = `<img src="${this.cryptoImages[this.reelStates[reelIndex][i]]}" alt="${this.reelStates[reelIndex][i]}">`;
                    reel.appendChild(symbolDiv);
                }
                
                // Animate in new symbols
                setTimeout(() => {
                    const newSymbols = reel.querySelectorAll('.symbol');
                    newSymbols.forEach(symbol => {
                        symbol.style.opacity = '1';
                        symbol.style.transform = 'scale(1)';
                    });
                }, 10);
            }, 40);
            
            currentSpin++;
            
            if (currentSpin >= spinCount) {
                // Remove spinning animation and final smooth stop
                reel.classList.remove('spinning');
                reel.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Final settling animation
                setTimeout(() => {
                    const finalSymbols = reel.querySelectorAll('.symbol');
                    finalSymbols.forEach((symbol, idx) => {
                        symbol.style.transform = idx === 1 ? 'scale(1.05)' : 'scale(1)';
                        symbol.style.filter = idx === 1 ? 'brightness(1.1)' : 'brightness(1)';
                    });
                    
                    setTimeout(() => {
                        finalSymbols.forEach(symbol => {
                            symbol.style.transform = 'scale(1)';
                            symbol.style.filter = 'brightness(1)';
                        });
                    }, 200);
                }, 100);
        return;
    }

            // Schedule next spin with ultra smooth speed
            const speed = getSpinSpeed(currentSpin, spinCount);
            setTimeout(spinStep, speed + reelIndex * 20);
        };
        
        // Start spinning with staggered delay
        setTimeout(spinStep, reelIndex * 150);
    }
    
    checkWin() {
        const resultDiv = document.getElementById('slot-result');
        
        // Update spins after win counter
        this.winCooldown.spinsAfterWin++;
        localStorage.setItem('spinsAfterWin', this.winCooldown.spinsAfterWin.toString());
        
        // Check for potential jackpot win (only if cooldown passed)
        if (this.winCooldown.spinsAfterWin >= 100) {
            const jackpotWin = this.checkJackpotWin();
            if (jackpotWin) {
                this.triggerJackpot(jackpotWin.symbol, jackpotWin.boost, resultDiv);
        return;
            }
    }

        // Get the middle (visible) symbol from each reel
        const reel1Symbol = this.reelStates[0][1];
        const reel2Symbol = this.reelStates[1][1]; 
        const reel3Symbol = this.reelStates[2][1];
        
        if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
            // Three of a kind
            resultDiv.textContent = `Amazing! Three ${reel1Symbol} symbols!`;
            resultDiv.style.color = 'var(--accent-blue)';
            Utils.triggerHaptic('medium');
        } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol || reel1Symbol === reel3Symbol) {
            // Two of a kind
            let symbolCounts = {};
            [reel1Symbol, reel2Symbol, reel3Symbol].forEach(symbol => {
                symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
            });
            
            let matchingSymbol = Object.keys(symbolCounts).find(symbol => symbolCounts[symbol] === 2);
            let matchCount = Math.max(...Object.values(symbolCounts));
            
            resultDiv.textContent = `Nice! ${matchCount} ${matchingSymbol} symbols!`;
            resultDiv.style.color = 'var(--accent-blue)';
            Utils.triggerHaptic('medium');
        } else {
            // No match
            resultDiv.textContent = `Try again! Better luck next time.`;
            resultDiv.style.color = 'var(--text-secondary)';
        }
    }
    
    // Check for jackpot win based on real percentages
    checkJackpotWin() {
        // Jackpot chances and boosts
        const jackpots = [
            { symbol: 'BTC', chance: 1, boost: '50x' },    // 1% chance
            { symbol: 'ETH', chance: 3, boost: '15x' },    // 3% chance  
            { symbol: 'TRX', chance: 7, boost: '10x' },    // 7% chance
            { symbol: 'SOL', chance: 10, boost: '5x' }     // 10% chance
        ];
        
        // Roll for each jackpot (from rarest to most common)
        for (const jackpot of jackpots) {
            const roll = Math.random() * 100; // 0-100
            if (roll < jackpot.chance) {
                console.log(`🎰 JACKPOT! ${jackpot.symbol} won with ${roll.toFixed(2)}% (chance: ${jackpot.chance}%)`);
                return jackpot;
            }
        }
        
        return null; // No jackpot
    }
    
    getBoostForSymbol(symbol) {
        const boostMap = {
            'BTC': '50x',
            'ETH': '15x', 
            'TRX': '10x',
            'SOL': '5x',
            'LTC': '3x',
            'BNB': '3x',
            'USDT': '2x'
        };
        return boostMap[symbol] || '2x';
    }
    
    triggerJackpot(symbol, boost, resultDiv) {
        resultDiv.textContent = `🎉 JACKPOT! ${boost} BOOST WON!`;
        resultDiv.style.color = 'var(--accent-green)';
        Utils.triggerHaptic('heavy');
        
        this.stats.bestCombo = `Three ${symbol} Jackpot`;
        
        // Reset cooldown
        this.winCooldown.spinsAfterWin = 0;
        this.winCooldown.lastWinType = symbol;
        localStorage.setItem('spinsAfterWin', '0');
        localStorage.setItem('lastWinType', symbol);
        
        // Store pending boost
        this.pendingBoost = {
            symbol: symbol,
            multiplier: boost,
            duration: 10 * 60 * 1000 // 10 minutes in milliseconds
        };
        
        // Show jackpot popup
        this.showJackpotPopup(symbol, boost);
    }
    
    showJackpotPopup(symbol, boost) {
        const popup = document.getElementById('jackpot-popup');
        const symbolsContainer = document.getElementById('jackpot-symbols');
        const boostText = document.getElementById('jackpot-boost');
        
        // Clear previous symbols
        symbolsContainer.innerHTML = '';
        
        // Add three matching symbols
        for (let i = 0; i < 3; i++) {
            const symbolImg = document.createElement('img');
            symbolImg.className = 'jackpot-symbol';
            symbolImg.src = this.cryptoImages[symbol];
            symbolImg.alt = symbol;
            symbolsContainer.appendChild(symbolImg);
        }
        
        // Update boost text
        boostText.textContent = `${boost} Boost Unlocked!`;
        
        // Show popup with animation
        popup.classList.remove('hidden');
        
        // DEBUG: Add global click listener to see what's happening
        document.addEventListener('click', (e) => {
            console.log('Document clicked:', e.target.id, e.target.className);
            if (e.target.id === 'activate-boost-btn' || e.target.className.includes('activate-boost-btn')) {
                console.log('🎯 ACTIVATE BOOST DETECTED BY GLOBAL LISTENER!');
                e.preventDefault();
                e.stopPropagation();
                window.activateBoost();
            }
        }, true); // Use capture phase
        
        // Add event handlers directly using setTimeout to ensure DOM is ready
        setTimeout(() => {
            const activateBoostBtn = document.getElementById('activate-boost-btn');
            const closePopupBtn = document.getElementById('close-popup-btn');
            
            console.log('Setting up popup event handlers...');
            console.log('Activate button found:', !!activateBoostBtn);
            console.log('Close button found:', !!closePopupBtn);
            console.log('Button rect:', activateBoostBtn ? activateBoostBtn.getBoundingClientRect() : 'not found');
            
            if (activateBoostBtn) {
                // Make button super visible for debugging
                activateBoostBtn.style.backgroundColor = 'red';
                activateBoostBtn.style.border = '5px solid yellow';
                activateBoostBtn.style.zIndex = '99999';
                
                // Multiple event binding approaches
                activateBoostBtn.onclick = function(e) {
                    console.log('🚀 ONCLICK TRIGGERED!');
                    window.activateBoost();
                };
                
                activateBoostBtn.addEventListener('click', function(e) {
                    console.log('🚀 ADDEVENTLISTENER TRIGGERED!');
                    window.activateBoost();
                });
                
                activateBoostBtn.addEventListener('mousedown', function(e) {
                    console.log('🚀 MOUSEDOWN TRIGGERED!');
                });
                
                activateBoostBtn.addEventListener('touchstart', function(e) {
                    console.log('🚀 TOUCHSTART TRIGGERED!');
                    window.activateBoost();
                });
            }
            
            if (closePopupBtn) {
                closePopupBtn.onclick = () => window.closeJackpotPopup();
            }
        }, 100);
        
        // Trigger haptic feedback
        Utils.triggerHaptic('heavy');
    }
    
    activateBoost() {
        if (!this.pendingBoost) {
            return;
    }

        const { symbol, multiplier, duration, scanSpeed, findRate } = this.pendingBoost;
        
        // Store boost in global state with new data format
        const boostEndTime = Date.now() + duration;
        localStorage.setItem('activeBoost', JSON.stringify({
            multiplier: multiplier,
            scanSpeed: scanSpeed || (1000 / parseInt(multiplier)), // fallback calculation
            findRate: findRate || CONFIG.baseFindRate,
            endTime: boostEndTime,
            symbol: symbol
        }));
        
        // Close popup
        this.closeJackpotPopup();
        
        // Apply boost to main page (using badge system only)
        
        // Clear pending boost
        this.pendingBoost = null;
        
        // Update speed display
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
        }
    }
    
    // Activate boost from market purchase
    activateMarketBoost(product) {
        console.log('🚀 Activating market boost:', product);
        
        const userId = this.getUserId();
        const boostEndTime = Date.now() + (product.duration * 1000);
        
        const boostData = {
            multiplier: product.multiplier,
            scanSpeed: product.scanSpeed,
            findRate: product.findRate,
            endTime: boostEndTime,
            symbol: product.boost,
            productName: product.name,
            userId: userId,
            purchaseTime: Date.now()
        };
        
        // Сохраняем буст для пользователя
        this.setUserBoost(userId, boostData);
        
        // Также сохраняем в старом формате для совместимости
        localStorage.setItem('activeBoost', JSON.stringify(boostData));
        
        // Update speed display
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
            // Also update scanning speed if currently scanning
            window.scannerEngine.updateScanningSpeed();
        }
        
        console.log(`✅ ${product.name} activated for user ${userId} until ${new Date(boostEndTime).toLocaleString()}`);
        console.log(`🚀 Boost data saved:`, boostData);
    }
    
    // Activate NFT features
    activateNFTFeatures() {
        console.log('🎨 Activating NFT features...');
        
        // Mark NFT as purchased
        localStorage.setItem('nftActivated', 'true');
        
        // Activate all NFT flags
        const nftFlags = document.querySelectorAll('.nft-flag');
        nftFlags.forEach(flag => {
            flag.classList.add('active');
        });
        
        // Activate NFT item
        const nftItem = document.querySelector('.nft-item');
        const nftStatus = document.getElementById('nft-status');
        
        if (nftItem) {
            nftItem.classList.add('active');
        }
        
        if (nftStatus) {
            nftStatus.textContent = 'ACTIVE';
        }
        
        console.log('✅ NFT features activated for all cryptocurrencies');
    }
    
    showBoostActivated(multiplier) {
        // Show success message
        const resultDiv = document.getElementById('slot-result');
        if (resultDiv) {
        resultDiv.textContent = `🚀 ${multiplier} BOOST ACTIVATED!`;
        resultDiv.style.color = 'var(--accent-green)';
        }
        
        Utils.triggerHaptic('heavy');
    }
    
    showBoostNotification(multiplier, endTime) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'boost-notification';
        notification.innerHTML = `
            <div class="boost-notification-content">
                <div class="boost-icon">🚀</div>
                <div class="boost-text">
                    <div class="boost-title">BOOST ACTIVATED!</div>
                    <div class="boost-details">${multiplier} Speed Boost</div>
                    <div class="boost-duration">Duration: 10 minutes</div>
                </div>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
            zIndex: '10001',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            animation: 'boostNotificationShow 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            minWidth: '300px'
        });
        
        // Style the content
        const content = notification.querySelector('.boost-notification-content');
        Object.assign(content.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        });
        
        const icon = notification.querySelector('.boost-icon');
        Object.assign(icon.style, {
            fontSize: '32px',
            animation: 'pulse 2s infinite'
        });
        
        const text = notification.querySelector('.boost-text');
        Object.assign(text.style, {
            textAlign: 'left'
        });
        
        const title = notification.querySelector('.boost-title');
        Object.assign(title.style, {
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '5px'
        });
        
        const details = notification.querySelector('.boost-details');
        Object.assign(details.style, {
            fontSize: '14px',
            opacity: '0.9'
        });
        
        const duration = notification.querySelector('.boost-duration');
        Object.assign(duration.style, {
            fontSize: '12px',
            opacity: '0.8'
        });
        
        // Add animation styles to document
        if (!document.getElementById('boost-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'boost-notification-styles';
            style.textContent = `
                @keyframes boostNotificationShow {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'boostNotificationShow 0.3s reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
        
        // Add click to close
        notification.addEventListener('click', () => {
            notification.style.animation = 'boostNotificationShow 0.3s reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    applyBoostToMainPage(multiplier, endTime) {
        // Silent restore of boost effects (no notification on page reload)
        
        // Update scanning speed if scanner is running
        if (window.EagleScanner && window.EagleScanner.scannerEngine) {
            window.EagleScanner.scannerEngine.updateScanningSpeed();
        }
        
        // Apply visual boost effect to scanning
        const scanBtn = document.querySelector('.scan-btn');
        const speedDisplay = document.querySelector('.speed-display');
        
        if (scanBtn) {
            scanBtn.style.background = 'linear-gradient(135deg, var(--accent-green), #45a049)';
            scanBtn.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
            scanBtn.style.transform = 'scale(1.05)';
        }
        
        if (speedDisplay) {
            speedDisplay.style.color = 'var(--accent-green)';
            speedDisplay.style.textShadow = '0 0 10px var(--accent-green)';
        }
        
        // Boost indicator removed - using badge system only
        
        // Start boost countdown
        this.startBoostCountdown(endTime);
    }
    
    // addBoostIndicator function removed - using badge system only
    
    startBoostCountdown(endTime) {
        const updateCountdown = () => {
            const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            
            if (timeLeft <= 0) {
                // Boost expired
                this.removeBoost();
                return;
            }
            
            // Continue countdown (no UI update needed - using badge system)
            setTimeout(updateCountdown, 1000);
        };
        
        updateCountdown();
    }
    
    removeBoost() {
        // Remove boost from localStorage
        localStorage.removeItem('activeBoost');
        
        // Remove visual effects
        const scanBtn = document.querySelector('.scan-btn');
        const speedDisplay = document.querySelector('.speed-display');
        
        if (scanBtn) {
            scanBtn.style.background = '';
            scanBtn.style.boxShadow = '';
            scanBtn.style.transform = '';
        }
        
        if (speedDisplay) {
            speedDisplay.style.color = '';
            speedDisplay.style.textShadow = '';
        }
    }
    
    closeJackpotPopup() {
        const popup = document.getElementById('jackpot-popup');
        if (popup) {
        popup.classList.add('hidden');
        }
        this.pendingBoost = null;
    }
    
    checkActiveBoost() {
        const userId = this.getUserId();
        console.log(`🔍 Checking boost for user: ${userId}`);
        
        let activeBoost = this.getUserBoost(userId);
        
        // УЛУЧШЕННАЯ ПРОВЕРКА: сначала проверяем ожидающие бусты
        if (tg.CloudStorage) {
            // Проверяем общую базу ожидающих бустов
            tg.CloudStorage.getItem('pending_boosts', (err, data) => {
                if (!err && data) {
                    try {
                        const pendingBoosts = JSON.parse(data);
                        const pendingBoost = pendingBoosts[userId];
                        
                        if (pendingBoost && pendingBoost.endTime > Date.now()) {
                            console.log('☁️ ✅ Found pending boost for user:', pendingBoost);
                            
                            // Активируем найденный буст
                            this.setUserBoost(userId, pendingBoost);
                            localStorage.setItem('activeBoost', JSON.stringify(pendingBoost));
                            
                            // Удаляем из очереди ожидающих
                            delete pendingBoosts[userId];
                            tg.CloudStorage.setItem('pending_boosts', JSON.stringify(pendingBoosts));
                            
                            // Обновляем дисплей
                            if (window.scannerEngine) {
                                window.scannerEngine.updateSpeedDisplay();
                                window.scannerEngine.updateScanningSpeed();
                            }
                            updateAllSpeedDisplays();
                            
                            console.log(`🎉 Boost activated from pending queue!`);
                            return;
                        }
                    } catch (e) {
                        console.error('❌ Error parsing pending boosts:', e);
                    }
                }
                
                // Если нет ожидающего буста, проверяем личное облако
                if (!activeBoost) {
                    console.log('☁️ Checking personal cloud storage...');
                    tg.CloudStorage.getItem(`boost_${userId}`, (err, data) => {
                        if (!err && data) {
                            try {
                                const cloudBoost = JSON.parse(data);
                                console.log('☁️ ✅ Boost found in personal cloud:', cloudBoost);
                                
                                if (cloudBoost.endTime > Date.now()) {
                                    this.setUserBoost(userId, cloudBoost);
                                    localStorage.setItem('activeBoost', JSON.stringify(cloudBoost));
                                    
                                    if (window.scannerEngine) {
                                        window.scannerEngine.updateSpeedDisplay();
                                        window.scannerEngine.updateScanningSpeed();
                                    }
                                    updateAllSpeedDisplays();
                                }
                            } catch (e) {
                                console.error('❌ Error parsing personal cloud boost:', e);
                            }
                        }
                    });
                }
            });
        }
        
        // Если есть локальный буст, обрабатываем его
        if (!activeBoost) {
            console.log('📭 No active boost found for user', userId);
            return;
        }
        
        if (!activeBoost) {
            console.log('📭 No active boost found for user', userId);
            return;
        }
        
        try {
            const now = Date.now();
            
            if (activeBoost.endTime > now) {
                // Boost is still active
                console.log(`🚀 Active boost for user ${userId}: ${activeBoost.multiplier}x`);
                
                // Восстанавливаем буст в localStorage для совместимости
                localStorage.setItem('activeBoost', JSON.stringify(activeBoost));
                
                // Применяем эффекты буста
                this.applyBoostToMainPage(activeBoost.multiplier, activeBoost.endTime);
                
                // Обновляем дисплей скорости
                if (window.scannerEngine) {
                    window.scannerEngine.updateSpeedDisplay();
                }
                
                console.log(`✅ User boost restored: ${activeBoost.productName} (${activeBoost.multiplier}x)`);
            } else {
                // Boost expired, remove it
                console.log('⏰ Boost expired for user', userId);
                this.removeUserBoost(userId);
            }
        } catch (e) {
            // Invalid boost data, remove it
            console.error('❌ Invalid boost data for user', userId, e);
            this.removeUserBoost(userId);
        }
    }
    
    getUserId() {
        // Получаем Telegram User ID
        const telegramUserId = tg.initDataUnsafe?.user?.id;
        if (telegramUserId) {
            return telegramUserId.toString();
        }
        
        // Fallback для тестирования без Telegram
        let guestId = localStorage.getItem('guestUserId');
        if (!guestId) {
            guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guestUserId', guestId);
        }
        return guestId;
    }
    
    getUserBoost(userId) {
        const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
        return userBoosts[userId] || null;
    }
    
    setUserBoost(userId, boost) {
        const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
        userBoosts[userId] = boost;
        localStorage.setItem('userBoosts', JSON.stringify(userBoosts));
        
        console.log(`💾 Boost saved for user ${userId}:`, boost);
        
        // УЛУЧШЕННОЕ сохранение в Telegram Cloud Storage
        if (tg.CloudStorage) {
            // Сохраняем индивидуальный буст пользователя
            tg.CloudStorage.setItem(`boost_${userId}`, JSON.stringify(boost), (error) => {
                if (error) {
                    console.error(`❌ Failed to save boost to cloud for user ${userId}:`, error);
                } else {
                    console.log(`☁️ ✅ Boost synced to Telegram Cloud for user ${userId}`);
                }
            });
            
            // Сохраняем глобальный список всех пользователей с бустами
            const allUsersList = Object.keys(userBoosts);
            tg.CloudStorage.setItem('all_users_with_boosts', JSON.stringify(allUsersList), (error) => {
                if (error) {
                    console.error(`❌ Failed to save users list to cloud:`, error);
                } else {
                    console.log(`☁️ ✅ Users list synced to Telegram Cloud`);
                }
            });
        }
    }
    
    removeUserBoost(userId) {
        const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
        delete userBoosts[userId];
        localStorage.setItem('userBoosts', JSON.stringify(userBoosts));
        
        // Удаляем из старого localStorage для совместимости
            localStorage.removeItem('activeBoost');
        
        // Удаляем из Telegram Cloud Storage
        if (tg.CloudStorage) {
            tg.CloudStorage.removeItem(`boost_${userId}`);
        }
        
        console.log(`🗑️ Boost removed for user ${userId}`);
    }
    
    // Отправка данных о покупке боту
    sendPurchaseDataToBot(payment, product) {
        if (tg.sendData) {
            try {
                const purchaseData = {
                    type: 'purchase_completed',
                    productId: payment.productId,
                    productName: product?.name || payment.productId,
                    amount: payment.baseAmount,
                    currency: payment.currency,
                    duration: product?.duration ? `${Math.round(product.duration / 60)} минут` : 'Unknown',
                    multiplier: product?.multiplier || 'Unknown',
                    timestamp: Date.now()
                };
                
                console.log('📤 Sending purchase data to bot:', purchaseData);
                tg.sendData(JSON.stringify(purchaseData));
            } catch (error) {
                console.error('❌ Failed to send data to bot:', error);
            }
        }
    }



    spinWheel() {
        const wheelBtn = document.getElementById('wheel-btn');
        const wheel = document.getElementById('lucky-wheel');
        const resultDiv = document.getElementById('wheel-result');

        // Проверяем существование элементов
        if (!wheelBtn || !wheel || !resultDiv) {
            console.log('⚠️ Wheel elements not found, cannot spin wheel');
            return;
        }

        if (wheelBtn.disabled) return;

        Utils.triggerHaptic('medium');
        wheelBtn.disabled = true;
        wheelBtn.innerHTML = '<span class="wheel-text">SPINNING...</span>';

        // Random rotation (multiple full rotations + random angle)
        const randomAngle = Math.floor(Math.random() * 360);
        const fullRotations = 5; // 5 full rotations
        const totalRotation = (fullRotations * 360) + randomAngle;

        wheel.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            // Calculate which segment we landed on
            const normalizedAngle = randomAngle;
            const segmentAngle = 360 / 6; // 6 segments
            const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
            const prize = this.wheelPrizes[segmentIndex];

            resultDiv.textContent = `🎉 You got: ${prize}!`;
            resultDiv.style.color = 'var(--accent-green)';

            this.stats.wheelSpins++;
            this.saveStats();
            this.updateStats();

            // Set 24-hour cooldown
            this.setWheelCooldown();
            this.startCooldownTimer();

            Utils.triggerHaptic('heavy');
        }, 3000);
    }

    getWheelCooldown() {
        const cooldown = localStorage.getItem('wheelCooldown');
        return cooldown ? parseInt(cooldown) : 0;
    }

    setWheelCooldown() {
        const now = Date.now();
        const tomorrow = now + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('wheelCooldown', tomorrow.toString());
        this.wheelCooldown = tomorrow;
    }

    checkWheelCooldown() {
        const now = Date.now();
        const wheelBtn = document.getElementById('wheel-btn');
        const cooldownDiv = document.getElementById('wheel-cooldown');

        // Проверяем существование элементов перед работой с ними
        if (!wheelBtn || !cooldownDiv) {
            console.log('⚠️ Wheel elements not found, skipping wheel cooldown check');
            return;
        }

        if (this.wheelCooldown > now) {
            // Still in cooldown
            wheelBtn.disabled = true;
            wheelBtn.innerHTML = '<span class="wheel-text">COOLDOWN</span>';
            cooldownDiv.style.display = 'block';
            this.startCooldownTimer();
        } else {
            // Cooldown expired
            wheelBtn.disabled = false;
            wheelBtn.innerHTML = '<span class="wheel-text">SPIN WHEEL</span>';
            cooldownDiv.style.display = 'none';
        }
    }

    startCooldownTimer() {
        const timerSpan = document.getElementById('cooldown-timer');
        const cooldownDiv = document.getElementById('wheel-cooldown');
        const wheelBtn = document.getElementById('wheel-btn');

        // Проверяем существование элементов
        if (!wheelBtn || !cooldownDiv) {
            console.log('⚠️ Wheel elements not found, skipping cooldown timer');
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const remaining = this.wheelCooldown - now;

            if (remaining <= 0) {
                // Cooldown finished
                wheelBtn.disabled = false;
                wheelBtn.innerHTML = '<span class="wheel-text">SPIN WHEEL</span>';
                cooldownDiv.style.display = 'none';
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            timerSpan.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            setTimeout(updateTimer, 1000);
        };

        updateTimer();
    }

    updateStats() {
        const totalSpinsEl = document.getElementById('total-spins');
        const wheelSpinsEl = document.getElementById('wheel-spins');
        const bestComboEl = document.getElementById('best-combo');

        if (totalSpinsEl) totalSpinsEl.textContent = this.stats.totalSpins;
        if (wheelSpinsEl) wheelSpinsEl.textContent = this.stats.wheelSpins;
        if (bestComboEl) bestComboEl.textContent = this.stats.bestCombo;
    }

    saveStats() {
        localStorage.setItem('totalSpins', this.stats.totalSpins.toString());
        localStorage.setItem('wheelSpins', this.stats.wheelSpins.toString());
        localStorage.setItem('bestCombo', this.stats.bestCombo);
    }
}

// GamesManager will be initialized in DOMContentLoaded
let gamesManager;
window.gamesManager = null;

// Crypto Selector Manager
class CryptoSelectorManager {
    constructor() {
        this.cryptoItems = document.querySelectorAll('.crypto-selector-item');
        this.selectAllBtn = document.getElementById('select-all-btn');
        this.setupEvents();
        this.updateActiveTokensDisplay();
    }

    setupEvents() {
        // Handle individual crypto selection
        this.cryptoItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const crypto = item.dataset.crypto;
            
            item.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                this.toggleCrypto(crypto, checkbox.checked);
            });
            
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCrypto(crypto, checkbox.checked);
            });
        });
        
        // Handle select all button
        if (this.selectAllBtn) {
            this.selectAllBtn.addEventListener('click', () => {
                this.toggleSelectAll();
            });
        }
    }

    toggleCrypto(crypto, isSelected) {
        const item = document.querySelector(`[data-crypto="${crypto}"]`);
        
        if (isSelected) {
            if (!appState.selectedCryptos.includes(crypto)) {
                appState.selectedCryptos.push(crypto);
            }
            item.classList.add('selected');
        } else {
            appState.selectedCryptos = appState.selectedCryptos.filter(c => c !== crypto);
            item.classList.remove('selected');
        }
        
        // Ensure at least one crypto is selected
        if (appState.selectedCryptos.length === 0) {
            appState.selectedCryptos = ['btc'];
            const btcCheckbox = document.getElementById('btc-checkbox');
            const btcItem = document.querySelector('[data-crypto="btc"]');
            if (btcCheckbox) btcCheckbox.checked = true;
            if (btcItem) btcItem.classList.add('selected');
        }
        
        this.updateActiveTokensDisplay();
        this.updateSelectAllButton();
        Utils.triggerHaptic('light');
    }

    toggleSelectAll() {
        const allCryptos = ['btc', 'eth', 'ltc', 'bnb', 'trx', 'sol', 'usdt', 'usdc'];
        const isSelectingAll = appState.selectedCryptos.length < allCryptos.length;
        
        if (isSelectingAll) {
            // Select all
            appState.selectedCryptos = [...allCryptos];
            this.cryptoItems.forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.checked = true;
                item.classList.add('selected');
            });
        } else {
            // Deselect all except BTC (maintain at least one)
            appState.selectedCryptos = ['btc'];
            this.cryptoItems.forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                const crypto = item.dataset.crypto;
                if (crypto === 'btc') {
                    checkbox.checked = true;
                    item.classList.add('selected');
                } else {
                    checkbox.checked = false;
                    item.classList.remove('selected');
                }
            });
        }
        
        this.updateActiveTokensDisplay();
        this.updateSelectAllButton();
        Utils.triggerHaptic('medium');
    }

    updateActiveTokensDisplay() {
        const activeTokensElement = document.getElementById('active-tokens');
        if (activeTokensElement) {
            activeTokensElement.textContent = appState.selectedCryptos.length;
        }
    }

    updateSelectAllButton() {
        if (!this.selectAllBtn) return;
        
        const allCryptos = ['btc', 'eth', 'ltc', 'bnb', 'trx', 'sol', 'usdt', 'usdc'];
        if (appState.selectedCryptos.length === allCryptos.length) {
            this.selectAllBtn.textContent = 'Deselect All';
        } else {
            this.selectAllBtn.textContent = 'Select All';
        }
    }
}

// CryptoSelectorManager will be initialized in DOMContentLoaded
let cryptoSelectorManager;

// Metrics Manager
class MetricsManager {
    constructor() {
        this.refreshBtn = document.getElementById('refresh-info');
        this.setupEvents();
        this.startMetricsUpdate();
    }

    setupEvents() {
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => {
                this.updateMetrics();
                Utils.triggerHaptic('light');
            });
        }
    }

    startMetricsUpdate() {
        // Update metrics every 5 seconds to reduce load
        appState.metricsInterval = setInterval(() => {
            this.updateMetrics();
        }, 5000);
    }

    stopMetricsUpdate() {
        if (appState.metricsInterval) {
            clearInterval(appState.metricsInterval);
            appState.metricsInterval = null;
        }
    }

    updateMetrics() {
        // Simulate realistic metrics
        appState.metrics.cpuUsage = Math.min(95, Math.max(20, appState.metrics.cpuUsage + (Math.random() - 0.5) * 10));
        appState.metrics.memoryUsage = Math.min(8.0, Math.max(1.5, appState.metrics.memoryUsage + (Math.random() - 0.5) * 0.3));
        appState.metrics.networkSpeed = Math.min(1000, Math.max(50, appState.metrics.networkSpeed + (Math.random() - 0.5) * 50));
        
        // Calculate found rate based on scan count and found wallets
        if (appState.scanCount > 0) {
            appState.metrics.foundRate = (appState.foundWallets / appState.scanCount) * 100;
        }

        // Update UI
        this.updateMetricsDisplay();
    }

    updateMetricsDisplay() {
        const elements = {
            'cpu-usage': `${Math.round(appState.metrics.cpuUsage)}%`,
            'memory-usage': `${appState.metrics.memoryUsage.toFixed(1)} GB`,
            'network-speed': `${Math.round(appState.metrics.networkSpeed)} Mbps`,
            'found-rate': `${appState.metrics.foundRate.toFixed(3)}%`,
            'thread-count': appState.isScanning ? '120' : '0'
        };

        Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
                element.textContent = value;
                
                // Add color coding for CPU usage
                if (id === 'cpu-usage') {
                    const usage = appState.metrics.cpuUsage;
                    if (usage > 80) {
                        element.style.color = 'var(--accent-red)';
                    } else if (usage > 60) {
                        element.style.color = 'var(--accent-orange)';
                    } else {
                        element.style.color = 'var(--accent-green)';
                    }
                }
            }
        });
    }
}

const metricsManager = new MetricsManager();

// Collapse Manager
class CollapseManager {
    constructor() {
        this.setupCollapseButtons();
        this.autoCollapseOnMobile();
    }

    setupCollapseButtons() {
        // Information panel collapse
        const infoCollapseBtn = document.getElementById('collapse-info');
        const infoPanel = document.querySelector('.information-panel');
        
        if (infoCollapseBtn && infoPanel) {
            infoCollapseBtn.addEventListener('click', () => {
                this.toggleCollapse(infoPanel, infoCollapseBtn);
            });
        }

        // Boost section collapse
        const boostCollapseBtn = document.getElementById('collapse-boost');
        const boostSection = document.querySelector('.boost-section');
        
        if (boostCollapseBtn && boostSection) {
            boostCollapseBtn.addEventListener('click', () => {
                this.toggleCollapse(boostSection, boostCollapseBtn);
            });
        }
    }

    toggleCollapse(section, button) {
        const isCollapsed = section.classList.contains('collapsed');
        
        if (isCollapsed) {
            section.classList.remove('collapsed');
            button.classList.remove('collapsed');
        } else {
            section.classList.add('collapsed');
            button.classList.add('collapsed');
        }
        
        Utils.triggerHaptic('light');
    }

    autoCollapseOnMobile() {
        // Auto-collapse on mobile devices (screen width < 768px)
        if (window.innerWidth < 768) {
            const infoPanel = document.querySelector('.information-panel');
            const infoBtn = document.getElementById('collapse-info');
            
            if (infoPanel && infoBtn) {
                infoPanel.classList.add('collapsed');
                infoBtn.classList.add('collapsed');
            }
        }
    }
}

const collapseManager = new CollapseManager();

// Scanner Engine
class ScannerEngine {
    constructor() {
        this.startBtn = document.getElementById('start-scan-btn');
        this.scannedCountElement = document.getElementById('scanned-count');
        this.setupEvents();
    }

    setupEvents() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                if (!appState.isScanning) {
                    this.start();
                } else {
                    this.stop();
                }
            });
        }
    }

    start() {
        if (appState.isScanning) return;
        
        appState.isScanning = true;
        this.updateUI();
        
        // Add system message
        terminalManager.addSystemMessage(`Started scanning ${appState.selectedCryptos.length} cryptocurrencies...`);
        
        // Start scanning interval with boost consideration
        appState.scanInterval = setInterval(() => {
            this.performScan();
        }, getEffectiveScanSpeed());
        
        // Add scanning animation
        if (this.startBtn) {
            this.startBtn.classList.add('scanning');
        }
        
        // Update metrics display
        metricsManager.updateMetricsDisplay();
        
        // MainButton removed - using custom UI only
    }

    stop() {
        if (!appState.isScanning) return;
        
        appState.isScanning = false;
        clearInterval(appState.scanInterval);
        this.updateUI();
        
        // Add system message
        terminalManager.addSystemMessage(`Scanning stopped. Scanned ${appState.scanCount.toLocaleString()} wallets total.`);
        
        // Remove scanning animation
        if (this.startBtn) {
            this.startBtn.classList.remove('scanning');
        }
        
        // Update metrics display
        metricsManager.updateMetricsDisplay();
        
        // MainButton removed - using custom UI only
    }

    performScan() {
        appState.scanCount++;
        appState.totalScans++;
        
        // Rotate through selected cryptocurrencies
        const currentCrypto = appState.selectedCryptos[appState.currentScanCrypto];
        appState.currentScanCrypto = (appState.currentScanCrypto + 1) % appState.selectedCryptos.length;
        
        // Generate random address for current crypto
        const address = Utils.generateRandomAddress(currentCrypto);
        
        // Update counter every 2nd scan to keep it responsive
        if (appState.scanCount % 2 === 0 && this.scannedCountElement) {
            this.scannedCountElement.textContent = appState.scanCount.toString();
        }
        
        // Add to terminal with batching for fast scroll effect
        if (appState.scanCount % 3 === 0) {
            terminalManager.addBatchLines(address, currentCrypto);
        }
        
        // Check for predefined wallets only every 10th scan for performance
        if (appState.scanCount % 10 === 0) {
        this.checkPredefinedWallets();
        }
        
        // Occasional scan sound (very reduced frequency)
        if (Math.random() < 0.005) {
            soundEngine.playScanSound();
        }
        
        // Update speed display only every 25 scans to improve performance
        if (appState.scanCount % 25 === 0) {
        this.updateSpeedDisplay();
        }
        
        // Check if we need to update scan speed (boost might have expired)
        if (appState.scanCount % 50 === 0) { // Check every 50 scans
            this.updateScanningSpeed();
        }
    }

    updateSpeedDisplay() {
        const effectiveSpeed = getEffectiveScanSpeed();
        const currentMultiplier = getCurrentMultiplier();
        const currentFindRate = getEffectiveFindRate();
        
        const speedElement = document.getElementById('scan-speed');
        const currentSpeedElement = document.getElementById('current-speed'); // Badge element
        const infoSpeedElement = document.getElementById('info-speed'); // Info panel element
        const findRateElement = document.getElementById('find-rate');
        const findRateBadgeElement = document.getElementById('find-rate-badge');
        
        // Calculate actual wallets per second
        const walletsPerSecond = Math.floor(1000 / effectiveSpeed);
        
        if (speedElement) {
            speedElement.textContent = `${walletsPerSecond} wallet/s`;
        }
        
        // Update speed badge
        if (currentSpeedElement) {
            currentSpeedElement.textContent = `${currentMultiplier}x`;
            
            const speedBadge = document.querySelector('.speed-badge');
            // Check if there's an active boost (not just multiplier > 1, since base is now 100x)
            const activeBoost = localStorage.getItem('activeBoost');
            const hasActiveBoost = activeBoost && JSON.parse(activeBoost).endTime > Date.now();
            
            if (hasActiveBoost) {
                speedBadge?.classList.add('boosted');
            } else {
                speedBadge?.classList.remove('boosted');
            }
        }
        
        // Update info panel speed
        if (infoSpeedElement) {
            infoSpeedElement.textContent = `${currentMultiplier}x`;
        }
        
        // Update profile page speed
        const profileSpeedElement = document.getElementById('profile-speed');
        if (profileSpeedElement) {
            profileSpeedElement.textContent = `${currentMultiplier}x`;
        }
        
        // Update find rate in info panel
        if (findRateElement) {
            findRateElement.textContent = `${currentFindRate}%`;
            if (currentFindRate > CONFIG.baseFindRate) {
                findRateElement.style.color = 'var(--accent-green)';
                findRateElement.style.fontWeight = '700';
            } else {
                findRateElement.style.color = '';
                findRateElement.style.fontWeight = '';
            }
        }
        
        // Update find rate badge
        if (findRateBadgeElement) {
            findRateBadgeElement.textContent = `${currentFindRate}%`;
            
            const findRateBadge = document.querySelector('.findrate-badge');
            if (currentFindRate > CONFIG.baseFindRate) {
                findRateBadge?.classList.add('boosted');
            } else {
                findRateBadge?.classList.remove('boosted');
            }
        }
    }

    // Method to update scanning speed (restart interval if running)
    updateScanningSpeed() {
        if (appState.isScanning && appState.scanInterval) {
            // Restart scanning with new speed
            clearInterval(appState.scanInterval);
            appState.scanInterval = setInterval(() => {
                this.performScan();
            }, getEffectiveScanSpeed());
        }
        
        // Update speed display
        this.updateSpeedDisplay();
    }

    checkPredefinedWallets() {
        // For debugging: find wallets less frequently (every ~2000 scans)
        // Using 0.05% base chance (1 in 2000) modified by find rate
        const currentFindRate = getEffectiveFindRate();
        const baseChance = 0.05; // 0.05% = 1 in 2000
        const adjustedChance = baseChance * (currentFindRate / CONFIG.baseFindRate); // Scale with find rate
        const randomChance = Math.random() * 100; // 0-100
        
        if (randomChance <= adjustedChance) {
            // Select random wallet from predefined list
            const randomIndex = Math.floor(Math.random() * CONFIG.predefinedWallets.length);
            const targetWallet = CONFIG.predefinedWallets[randomIndex];
            
            console.log(`🎯 Wallet found! Chance was ${adjustedChance.toFixed(4)}% (Find Rate: ${currentFindRate}%)`);
            
    setTimeout(() => {
                modalManager.show(targetWallet);
                }, 500);
            }
    }

    updateUI() {
        if (!this.startBtn) return;
        
        if (appState.isScanning) {
            this.startBtn.innerHTML = '<span class="scan-btn-text">⏹️ Stop Neural Scan</span>';
            this.startBtn.disabled = false;
        } else {
            this.startBtn.innerHTML = '<span class="scan-btn-text">🔍 Start Neural Scan</span>';
            this.startBtn.disabled = false;
        }
    }
}

// ScannerEngine will be initialized in DOMContentLoaded
let scannerEngine;

// Global functions for external access - will be set after initialization
window.startScanning = () => scannerEngine?.start();
window.stopScanning = () => scannerEngine?.stop();

// Function to load user data from Telegram
function loadUserData() {
    console.log('👤 Loading user data...');
    
    try {
        const tg = window.Telegram?.WebApp;
        const user = tg?.initDataUnsafe?.user;
        
        if (user) {
            console.log('✅ Telegram user found:', user);
            
            // Update all username displays
            const usernameElements = [
                document.getElementById('user-username'),
                document.getElementById('profile-user-username'),
                document.getElementById('profile-telegram-id')
            ];
            
            const nameElements = [
                document.getElementById('user-name'),
                document.getElementById('profile-user-name')
            ];
            
            const username = user.username ? `@${user.username}` : `User${user.id}`;
            const displayName = user.first_name || user.username || 'Eagle User';
            
            usernameElements.forEach(el => {
                if (el) el.textContent = username;
            });
            
            nameElements.forEach(el => {
                if (el) el.textContent = displayName;
            });
            
            console.log(`👤 User loaded: ${displayName} (${username})`);
        } else {
            console.log('⚠️ No Telegram user data, using defaults');
            
            // Fallback for non-Telegram environment
            const usernameElements = [
                document.getElementById('user-username'),
                document.getElementById('profile-user-username'),
                document.getElementById('profile-telegram-id')
            ];
            
            usernameElements.forEach(el => {
                if (el) el.textContent = '@guest';
            });
        }
    } catch (error) {
        console.error('❌ Error loading user data:', error);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Eagle Scanner initialized');
    
    // Load user data first
    loadUserData();
    
    // Initialize all managers after DOM is ready
    navigationManager = new NavigationManager();
    window.navigationManager = navigationManager; // Make globally accessible
    modalManager = new ModalManager();
    withdrawManager = new WithdrawManager();
    cryptoSelectorManager = new CryptoSelectorManager();
    scannerEngine = new ScannerEngine();
    gamesManager = new GamesManager();
    window.gamesManager = gamesManager;
    
    // Initialize MarketManager after DOM is ready
    console.log('🔧 Initializing MarketManager...');
    marketManager = new MarketManager();
    window.marketManager = marketManager;
    console.log('✅ MarketManager initialized and attached to window');
    
    // Check for active boost on page load using GamesManager
    setTimeout(() => {
        if (window.gamesManager) {
            console.log('🔄 Checking user boost on page load...');
            window.gamesManager.checkActiveBoost();
        } else {
            console.log('⚠️ GamesManager not ready, trying fallback...');
            checkActiveBoost(); // Fallback to old method
        }
    }, 1000);
    
    // Set initial state
    appState.scanCount = 0;
    appState.foundWallets = 0;
    appState.currentScanCrypto = 0;
    
    // Initialize UI
    terminalManager.clear();
    scannerEngine.updateUI();
    metricsManager.updateMetricsDisplay();
    cryptoSelectorManager.updateActiveTokensDisplay();
    
    // Initial terminal message
    terminalManager.addLine('System ready - Eagle Scanner v2.0', 'SYSTEM');
    
    // Check and activate NFT features if purchased
    setTimeout(() => {
        const nftActivated = localStorage.getItem('nftActivated');
        if (nftActivated === 'true') {
            console.log('🎨 Restoring NFT features...');
            
            // Restore NFT flags
            const nftFlags = document.querySelectorAll('.nft-flag');
            nftFlags.forEach(flag => {
                flag.classList.add('active');
            });
            
            // Restore NFT item
            const nftItem = document.querySelector('.nft-item');
            const nftStatus = document.getElementById('nft-status');
            
            if (nftItem) {
                nftItem.classList.add('active');
            }
            
            if (nftStatus) {
                nftStatus.textContent = 'ACTIVE';
            }
        }
        
        // Update speed display with current boost
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
        }
        
        // Админ-панель доступна через секретный вход (5 кликов по заголовку)
        
        // Инициализируем проверку бустов из URL
        checkBoostFromURL();
        
        // Проверяем URL параметры для активации буста
        checkURLForBoost();
    }, 1000);
    
    // Диагностика кнопок маркета
    setTimeout(() => {
        console.log('🔍 Post-init diagnostics:');
        console.log('MarketManager:', !!window.marketManager);
        console.log('Buy buttons:', document.querySelectorAll('.buy-btn').length);
        
        // Проверяем первую кнопку
        const firstBtn = document.querySelector('.buy-btn');
        if (firstBtn) {
            console.log('First button data-product:', firstBtn.getAttribute('data-product'));
            console.log('First button events:', firstBtn.onclick ? 'has onclick' : 'no onclick');
        }
    }, 2000);
    terminalManager.addLine('Neural network initialized...', 'SYSTEM');
    
    // Send ready signal to Telegram
    if (tg) {
        balanceManager.sendDataToTelegram({
            type: 'app_ready',
            timestamp: Date.now(),
            selectedCryptos: appState.selectedCryptos
        });
    }
});

// Test function for boost notification
window.testBoostNotification = function() {
    console.log('🧪 Testing boost notification...');
    if (window.gamesManager && window.gamesManager.showBoostNotification) {
        window.gamesManager.showBoostNotification('500x', Date.now() + 600000);
        console.log('✅ Notification shown!');
    } else {
        console.log('❌ GamesManager not available');
    }
};

// Test function for performance monitoring
window.testPerformance = function() {
    console.log('🧪 Performance Test Results:');
    console.log('━'.repeat(40));
    console.log('📊 Счетчик: обновляется каждые 2 скана (50/сек)');
    console.log('📝 Терминал: batch режим каждые 3 скана (~30+ строк/сек, только официальные криптовалюты)');  
    console.log('⚡ Скорость: обновляется каждые 25 сканов (4/сек)');
    console.log('🔍 Проверка кошельков: каждые 10 сканов (10/сек)');
    console.log('🎵 Звуки: 0.5% вероятность (очень редко)');
    console.log('📈 Метрики: каждые 5 секунд');
    console.log('━'.repeat(40));
    console.log('🚀 Реальная скорость: 100 wallet/s (10ms интервал)');
    console.log('✨ Эффект быстрого скролла активирован!');
};

// Test function for fast scroll effect
window.testFastScroll = function() {
    console.log('🧪 Testing fast scroll effect...');
    if (terminalManager) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                terminalManager.addBatchLines('test_address_' + i, 'btc');
            }, i * 150);
        }
        console.log('✨ Fast scroll effect demonstrated!');
        console.log('🎭 Features:');
        console.log('  • 2-4 строки за раз');
        console.log('  • Анимация появления с размытием');
        console.log('  • Пульсация терминала');
        console.log('  • Плавный скролл');
        console.log('  • Случайные криптовалюты: BTC, ETH, LTC, BNB, TRX, SOL, USDT, USDC');
        console.log('  • 5% строк с "Checking..."');
    } else {
        console.log('❌ TerminalManager not available');
    }
};

// Test functions for USDT payment system
window.testUSDTPayment = function() {
    console.log('🧪 Testing USDT payment system...');
    
    if (walletPoolManager) {
        // Create a test payment
        const payment = walletPoolManager.createPayment('Test Lightning Boost 10x', 10.00);
        
        console.log('💰 Test payment created:');
        console.log(`  • Product: ${payment.productId}`);
        console.log(`  • Base Amount: ${payment.baseAmount} USDT`);
        console.log(`  • Amount: ${payment.baseAmount} USDT`);
        console.log(`  • Wallet: ${payment.walletName}`);
        console.log(`  • Address: ${payment.assignedWallet}`);
        console.log(`  • Order ID: ${payment.orderId}`);
        
        walletPoolManager.showWalletStatus();
        
        return payment;
    } else {
        console.log('❌ WalletPoolManager not available');
    }
};

window.showWalletStatus = function() {
    console.log('🏦 Current Wallet Pool Status:');
    if (walletPoolManager) {
        walletPoolManager.showWalletStatus();
        console.log(`📊 Pending payments: ${walletPoolManager.pendingPayments.size}`);
        console.log(`🔄 Next wallet index: ${walletPoolManager.currentWalletIndex + 1}/10`);
        
        if (walletPoolManager.pendingPayments.size > 0) {
            console.log('📋 Active orders:');
            for (const [orderId, payment] of walletPoolManager.pendingPayments) {
                console.log(`  ${orderId}: ${payment.baseAmount} USDT (${payment.status})`);
            }
        }
    } else {
        console.log('❌ WalletPoolManager not available');
    }
};

window.testMarketIntegration = function() {
    console.log('🧪 Testing Market integration with USDT...');
    
    if (marketManager && walletPoolManager) {
        // Get a sample product
        const products = Object.values(marketManager.products);
        if (products.length > 0) {
            const testProduct = products[0];
            console.log(`🛍️ Testing with product: ${testProduct.name}`);
            
            // Show payment form
            marketManager.showPaymentForm(testProduct.id, testProduct);
            
            console.log('✅ Payment modal should appear with USDT option');
        } else {
            console.log('❌ No products available for testing');
        }
    } else {
        console.log('❌ MarketManager or WalletPoolManager not available');
    }
};

window.simulateUSDTPayment = function(orderId) {
    console.log('🧪 Simulating USDT payment confirmation...');
    
    if (walletPoolManager && orderId) {
        const payment = walletPoolManager.pendingPayments.get(orderId);
        if (payment) {
            console.log(`💰 Simulating payment: ${payment.baseAmount} USDT`);
            
            // Simulate payment confirmation
            walletPoolManager.confirmPayment(orderId);
            
            console.log('✅ Payment simulated successfully!');
        } else {
            console.log('❌ Order not found');
        }
    } else {
        console.log('❌ Missing parameters or WalletPoolManager not available');
        console.log('💡 Usage: simulateUSDTPayment("order_id")');
    }
};

window.generateTestWallets = function() {
    console.log('🧪 Generating test wallets for different amounts...');
    
    if (walletPoolManager) {
        const testProducts = [
            { name: 'Lightning Boost 10x', price: 10.00 },
            { name: 'Turbo Boost 20x', price: 25.00 },
            { name: 'Hyper Boost 50x', price: 50.00 },
            { name: 'Ultimate Boost 100x', price: 100.00 },
            { name: 'NFT Scanner Pro', price: 15.00 }
        ];
        
        const payments = [];
        
        testProducts.forEach((product, index) => {
            setTimeout(() => {
                const payment = walletPoolManager.createPayment(product.name, product.price);
                payments.push(payment);
                
                console.log(`${index + 1}. ${product.name}: ${payment.baseAmount} USDT → ${payment.walletName}`);
                
                if (index === testProducts.length - 1) {
                    console.log('\n📊 Summary:');
                    walletPoolManager.showWalletStatus();
                }
            }, index * 500);
        });
        
        return payments;
    } else {
        console.log('❌ WalletPoolManager not available');
    }
};

// Test buy button functionality
window.testBuyButtons = function() {
    console.log('🧪 Testing Buy Now buttons...');
    
    const buyButtons = document.querySelectorAll('.buy-btn');
    console.log(`📊 Found ${buyButtons.length} buy buttons`);
    
    if (marketManager) {
        console.log('✅ MarketManager available');
        console.log('📦 Available products:', Object.keys(marketManager.products));
        
        // Test first button
        if (buyButtons.length > 0) {
            const firstBtn = buyButtons[0];
            const productId = firstBtn.getAttribute('data-product');
            const product = marketManager.products[productId];
            
            console.log(`🛍️ Testing product: ${productId}`);
            console.log(`💰 Product details:`, product);
            
            if (product) {
                console.log('✅ Product found in MarketManager');
                console.log(`💵 Price: ${product.price} (${product.usdtPrice} USDT)`);
                
                // Test payment form
                marketManager.showPaymentForm(productId, product);
                console.log('✅ Payment form should appear');
            } else {
                console.log('❌ Product not found in MarketManager');
            }
        }
    } else {
        console.log('❌ MarketManager not available');
    }
    
    // Test click handler
    buyButtons.forEach((btn, index) => {
        const productId = btn.getAttribute('data-product');
        console.log(`Button ${index + 1}: ${productId}`);
        
        // Check if click handler is attached
        const events = getEventListeners ? getEventListeners(btn) : 'Event listeners check not available';
        console.log(`  Events:`, events);
    });
};

// Test notification positioning
window.testNotifications = function() {
    console.log('🧪 Testing notification positioning...');
    
    if (!window.marketManager) {
        console.log('❌ MarketManager not available');
        return;
    }
    
    const testNotifications = [
        { message: '✅ Payment successful! Lightning Boost activated!', type: 'success' },
        { message: '🚀 20x boost activated for 1 month!', type: 'boost' },
        { message: '🎨 NFT Scanner Pro activated! NFT scanning enabled.', type: 'nft' },
        { message: '👑 Elite Package activated! Premium features unlocked.', type: 'premium' },
        { message: '❌ Payment failed! Please try again.', type: 'error' }
    ];
    
    testNotifications.forEach((notif, index) => {
        setTimeout(() => {
            console.log(`📢 Showing notification ${index + 1}: ${notif.type}`);
            window.marketManager.showNotification(notif.message, notif.type);
        }, index * 1500);
    });
    
    console.log('🎯 All test notifications scheduled. Check if they appear centered!');
};

// Test new boost system with badges
window.testNewBoostSystem = function() {
    console.log('🚀 Testing new boost system...');
    
    if (!window.gamesManager || !window.marketManager) {
        console.log('❌ Managers not available');
        return;
    }
    
    // Test different boost levels
    const testBoosts = [
        { id: 'boost-10x', name: '10x Boost' },
        { id: 'boost-20x', name: '20x Boost' },
        { id: 'boost-50x', name: '50x Boost' },
        { id: 'boost-100x', name: '100x Boost' }
    ];
    
    testBoosts.forEach((boost, index) => {
        setTimeout(() => {
            console.log(`🔧 Testing ${boost.name}...`);
            
            const product = window.marketManager.products[boost.id];
            if (product) {
                // Activate boost
                window.gamesManager.activateMarketBoost(product);
                
                console.log(`✅ ${boost.name} activated:`);
                console.log(`  Speed: ${1000/product.scanSpeed} wallet/s`);
                console.log(`  Find Rate: ${product.findRate}%`);
                console.log(`  Multiplier: ${product.multiplier}x`);
            }
        }, index * 3000);
    });
    
    // Test NFT at the end
    setTimeout(() => {
        console.log('🎨 Testing NFT activation...');
        window.gamesManager.activateNFTFeatures();
        console.log('✅ NFT features activated');
    }, testBoosts.length * 3000 + 1000);
    
    console.log('📊 Test sequence: 10x → 20x → 50x → 100x → NFT');
    console.log('🎯 Check badges, speeds, and find rates!');
};

// Quick test current status
window.checkBoostStatus = function() {
    console.log('📊 Current Boost Status:');
    console.log(`  Speed: ${getEffectiveScanSpeed()}ms (${Math.floor(1000/getEffectiveScanSpeed())} wallet/s)`);
    console.log(`  Find Rate: ${getEffectiveFindRate()}%`);
    console.log(`  Multiplier: ${getCurrentMultiplier()}x`);
    
    const activeBoost = localStorage.getItem('activeBoost');
    if (activeBoost) {
        const boost = JSON.parse(activeBoost);
        console.log(`  Active Boost: ${boost.multiplier} until ${new Date(boost.endTime).toLocaleString()}`);
    } else {
        console.log(`  Active Boost: None`);
    }
    
    const nftActive = localStorage.getItem('nftActivated') === 'true';
    console.log(`  NFT Status: ${nftActive ? 'ACTIVE' : 'INACTIVE'}`);
    
    // Debug wallet finding
    const currentFindRate = getEffectiveFindRate();
    const baseChance = 0.05;
    const adjustedChance = baseChance * (currentFindRate / CONFIG.baseFindRate);
    console.log(`  Wallet Find Chance: ${adjustedChance.toFixed(4)}% (~1 in ${Math.floor(100/adjustedChance)} scans)`);
};

// Force wallet find for testing
window.forceWalletFind = function() {
    console.log('🎯 Forcing wallet find for testing...');
    if (window.scannerEngine) {
        const randomIndex = Math.floor(Math.random() * CONFIG.predefinedWallets.length);
        const targetWallet = CONFIG.predefinedWallets[randomIndex];
        
        setTimeout(() => {
            modalManager.show(targetWallet);
            console.log('✅ Test wallet shown:', targetWallet.crypto);
        }, 500);
    } else {
        console.log('❌ Scanner engine not available');
    }
};

// Fix boost display issues
window.fixSpeedDisplay = function() {
    console.log('🔧 Fixing speed display...');
    
    // Get current values
    const currentMultiplier = getCurrentMultiplier();
    const currentFindRate = getEffectiveFindRate();
    
    console.log('📊 Current values:');
    console.log(`  Multiplier: ${currentMultiplier}x`);
    console.log(`  Find Rate: ${currentFindRate}%`);
    
    // Manually update speed elements
    const currentSpeedElement = document.getElementById('current-speed'); // Badge
    const infoSpeedElement = document.getElementById('info-speed'); // Info panel
    
    if (currentSpeedElement) {
        currentSpeedElement.textContent = `${currentMultiplier}x`;
        console.log(`✅ Manually set badge speed to: ${currentMultiplier}x`);
    } else {
        console.log('❌ Badge speed element not found!');
    }
    
    if (infoSpeedElement) {
        infoSpeedElement.textContent = `${currentMultiplier}x`;
        console.log(`✅ Manually set info speed to: ${currentMultiplier}x`);
    } else {
        console.log('❌ Info speed element not found!');
    }
    
    // Force update speed display via scanner engine
    if (window.scannerEngine) {
        window.scannerEngine.updateSpeedDisplay();
        console.log('✅ Scanner engine speed display updated');
    }
    
    // Check boost status
    checkBoostStatus();
    
    // Verify final state
    setTimeout(() => {
        const finalBadgeSpeed = currentSpeedElement?.textContent;
        const finalInfoSpeed = infoSpeedElement?.textContent;
        
        console.log(`🎯 Final speed displays:`);
        console.log(`  Badge: ${finalBadgeSpeed}`);
        console.log(`  Info Panel: ${finalInfoSpeed}`);
        
        if (finalBadgeSpeed !== `${currentMultiplier}x` || finalInfoSpeed !== `${currentMultiplier}x`) {
            console.log('❌ Some speed displays still incorrect!');
            console.log('🔧 Something else is overriding the speed display');
        } else {
            console.log('✅ All speed displays are now correct!');
        }
    }, 1000);
};

// Toggle base speed display (1x vs 100x)
window.toggleBaseSpeed = function() {
    console.log('🔄 Toggling base speed display...');
    
    // This function allows switching between 1x and 100x base display
    // Current: showing 100x as base
    // Call this function to test different options
    
    if (window.scannerEngine) {
        window.scannerEngine.updateSpeedDisplay();
        console.log('✅ Display updated');
    }
};

// Force reload CSS styles
window.forceReloadCSS = function() {
    console.log('🔄 Force reloading CSS...');
    
    // Find the CSS link
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
        const href = link.href;
        link.href = href + '?v=' + Date.now();
        console.log(`✅ Reloaded: ${href}`);
    });
    
    // Also force grid recalculation
    const cryptoGrid = document.querySelector('.crypto-grid');
    if (cryptoGrid) {
        cryptoGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        cryptoGrid.style.gap = '10px';
        console.log('✅ Forced grid update');
    }
    
    console.log('🎯 CSS reload complete. Refresh page with Ctrl+F5 if needed.');
};

// Test grid layout
window.testGridLayout = function() {
    console.log('🧪 Testing grid layout...');
    
    const cryptoGrid = document.querySelector('.crypto-grid');
    if (cryptoGrid) {
        const computedStyle = window.getComputedStyle(cryptoGrid);
        const gridCols = computedStyle.gridTemplateColumns;
        
        console.log(`📊 Current grid-template-columns: ${gridCols}`);
        console.log(`📊 Current gap: ${computedStyle.gap}`);
        
        const items = cryptoGrid.querySelectorAll('.crypto-item');
        console.log(`📊 Number of items: ${items.length}`);
        
        // Check if 4 columns
        if (gridCols.includes('1fr 1fr 1fr 1fr')) {
            console.log('✅ Grid is correctly set to 4 columns');
        } else {
            console.log('❌ Grid is NOT set to 4 columns');
            console.log('🔧 Trying to fix...');
            cryptoGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            cryptoGrid.style.gap = '10px';
        }
    } else {
        console.log('❌ Crypto grid not found');
    }
};

// Test page margins and spacing
window.testPageSpacing = function() {
    console.log('📏 Testing page spacing consistency...');

    const sections = [
        { selector: '.crypto-display-section', name: 'Crypto Display', expectedMargin: '0px 20px 20px' },
        { selector: '.information-panel', name: 'Information Panel', expectedMargin: '0px 20px 20px' },
        { selector: '.scanner-terminal', name: 'Scanner Terminal', expectedMargin: '0px 20px 20px' }
    ];

    sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            const margin = computedStyle.margin;
            const padding = computedStyle.padding;

            console.log(`📊 ${section.name}:`);
            console.log(`   Actual margin: ${margin}`);
            console.log(`   Expected margin: ${section.expectedMargin}`);
            console.log(`   Padding: ${padding}`);

            // Check consistency
            if (margin === section.expectedMargin) {
                console.log(`✅ ${section.name} has consistent spacing`);
            } else {
                console.log(`⚠️  ${section.name} margin doesn't match expected pattern`);
            }
        } else {
            console.log(`❌ ${section.name} not found`);
        }
    });

    console.log('🎯 Spacing consistency check complete');
    console.log('ℹ️  All main sections should have: margin: 0 20px 20px; padding: 16px;');
};

// Test payment system
window.testPaymentSystem = function() {
    console.log('💰 Testing Payment System...');
    
    if (!walletPoolManager) {
        console.log('❌ WalletPoolManager not available');
        return;
    }
    
    console.log('🏦 Wallet Pool Status:');
    console.log(`📊 Total wallets: ${walletPoolManager.walletPool.length}`);
    console.log(`🔄 Current index: ${walletPoolManager.currentWalletIndex + 1}/${walletPoolManager.walletPool.length}`);
    
    // Show first wallet (test wallet)
    const testWallet = walletPoolManager.walletPool[0];
    console.log(`🧪 Test wallet: ${testWallet.name} (${testWallet.network})`);
    console.log(`📍 Address: ${testWallet.address}`);
    
    // Check if test product exists
    if (marketManager && marketManager.products['test-boost']) {
        const testProduct = marketManager.products['test-boost'];
        console.log(`🎯 Test product available:`);
        console.log(`   Name: ${testProduct.name}`);
        console.log(`   Price: ${testProduct.bnbPrice} BNB`);
        console.log(`   Duration: ${testProduct.duration} seconds`);
        console.log(`   Network: BSC (BEP-20)`);
        
        console.log('✅ You can now test payment with "Test Boost" card for 0.0005 BNB');
        console.log('📝 Real BSC wallet 0x0476d0b67e7e7e2654F16b31F807868FAf726588 is in the pool');
    } else {
        console.log('❌ Test product not found');
    }
    
    console.log(`📋 Active payments: ${walletPoolManager.pendingPayments.size}`);
    if (walletPoolManager.pendingPayments.size > 0) {
        for (const [orderId, payment] of walletPoolManager.pendingPayments) {
            console.log(`   ${orderId}: ${payment.baseAmount} ${payment.currency} → ${payment.walletName} (${payment.network})`);
        }
    }
    
    console.log('🎯 Payment system ready for testing!');
};

// Установить BSC API ключ
window.setBSCApiKey = function(apiKey) {
    if (walletPoolManager) {
        walletPoolManager.BSC_API_KEY = apiKey;
        console.log('🔑 BSC API Key установлен!');
        console.log('✅ Теперь можно получать до 50 транзакций вместо 10');
    } else {
        console.log('❌ WalletPoolManager не найден');
    }
};

// Тест BSC API
window.testBSCApi = function(address = '0x0476d0b67e7e7e2654F16b31F807868FAf726588') {
    if (!walletPoolManager) {
        console.log('❌ WalletPoolManager не найден');
        return;
    }
    
    console.log('🧪 Тестируем BSC API...');
    console.log(`📍 Адрес: ${address}`);
    console.log(`🔑 API ключ: ${walletPoolManager.BSC_API_KEY ? 'Установлен' : 'НЕ установлен'}`);
    
    const apiParam = walletPoolManager.BSC_API_KEY ? `&apikey=${walletPoolManager.BSC_API_KEY}` : '';
    const limit = walletPoolManager.BSC_API_KEY ? 50 : 10;
    
    const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&` +
                `startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc${apiParam}`;
    
    console.log(`📡 URL: ${url}`);
    
    fetch(url)
        .then(response => {
            console.log(`📡 Response status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(`📊 BSC API Response:`, data);
            
            if (data.status === '1' && data.result) {
                console.log(`✅ Успех! Получено ${data.result.length} транзакций`);
                
                data.result.slice(0, 3).forEach((tx, i) => {
                    const amount = parseFloat(tx.value) / Math.pow(10, 18);
                    const date = new Date(parseInt(tx.timeStamp) * 1000);
                    console.log(`📋 TX ${i+1}: ${amount} BNB to ${tx.to} (${date.toLocaleString()})`);
                });
            } else {
                console.log(`❌ Ошибка API: ${data.message || 'Unknown error'}`);
            }
        })
                 .catch(error => {
             console.error('❌ Ошибка запроса:', error);
         });
};

// Проверка очереди ожидающих бустов
window.checkPendingBoosts = function() {
    if (!tg.CloudStorage) {
        alert('❌ Telegram Cloud Storage недоступно');
        return;
    }
    
    const currentUserId = window.gamesManager.getUserId();
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return;
    }
    
    tg.CloudStorage.getItem('pending_boosts', (err, data) => {
        if (!err && data) {
            try {
                const pendingBoosts = JSON.parse(data);
                const userIds = Object.keys(pendingBoosts);
                
                let info = `📋 ОЧЕРЕДЬ ОЖИДАЮЩИХ БУСТОВ\n\n`;
                info += `👥 Всего в очереди: ${userIds.length}\n\n`;
                
                if (userIds.length > 0) {
                    userIds.slice(0, 10).forEach(userId => {
                        const boost = pendingBoosts[userId];
                        const timeLeft = Math.max(0, Math.floor((boost.endTime - Date.now()) / 1000 / 60));
                        const isActive = boost.endTime > Date.now();
                        
                        info += `👤 ${userId}\n`;
                        info += `  🚀 ${boost.productName}\n`;
                        info += `  ⏰ ${isActive ? `${timeLeft}м` : 'Истёк'}\n`;
                        info += `  📅 ${new Date(boost.purchaseTime).toLocaleString()}\n\n`;
                    });
                    
                    if (userIds.length > 10) {
                        info += `... и еще ${userIds.length - 10} пользователей`;
                    }
                } else {
                    info += `✅ Очередь пуста`;
                }
                
                alert(info);
            } catch (e) {
                alert('❌ Ошибка при чтении очереди');
                console.error('❌ Error parsing pending boosts:', e);
            }
        } else {
            alert('📋 Очередь ожидающих бустов пуста');
        }
    });
};

// Принудительная проверка ожидающих бустов для текущего пользователя
window.forcePendingCheck = function() {
    if (!tg.CloudStorage) {
        alert('❌ Telegram Cloud Storage недоступно');
        return;
    }
    
    const currentUserId = window.gamesManager.getUserId();
    console.log(`🔄 Force checking pending boosts for user: ${currentUserId}`);
    
    tg.CloudStorage.getItem('pending_boosts', (err, data) => {
        if (!err && data) {
            try {
                const pendingBoosts = JSON.parse(data);
                const pendingBoost = pendingBoosts[currentUserId];
                
                if (pendingBoost && pendingBoost.endTime > Date.now()) {
                    console.log('☁️ ✅ Found pending boost, activating...');
                    
                    // Активируем буст
                    window.gamesManager.setUserBoost(currentUserId, pendingBoost);
                    localStorage.setItem('activeBoost', JSON.stringify(pendingBoost));
                    
                    // Удаляем из очереди
                    delete pendingBoosts[currentUserId];
                    tg.CloudStorage.setItem('pending_boosts', JSON.stringify(pendingBoosts));
                    
                    // Обновляем дисплей
                    updateAllSpeedDisplays();
                    if (window.scannerEngine) {
                        window.scannerEngine.updateSpeedDisplay();
                        window.scannerEngine.updateScanningSpeed();
                    }
                    
                    alert(`🎉 Буст активирован!\n${pendingBoost.productName} (${pendingBoost.multiplier}x)`);
                } else if (pendingBoost) {
                    alert('❌ Найден буст, но он истёк');
                    
                    // Удаляем истёкший буст
                    delete pendingBoosts[currentUserId];
                    tg.CloudStorage.setItem('pending_boosts', JSON.stringify(pendingBoosts));
                } else {
                    alert('📭 Ожидающих бустов не найдено');
                }
            } catch (e) {
                alert('❌ Ошибка при проверке очереди');
                console.error('❌ Error checking pending boosts:', e);
            }
        } else {
            alert('📋 Очередь ожидающих бустов пуста');
        }
         });
 };

// === ПРОСТОЕ РЕШЕНИЕ: ЧЕРЕЗ URL ПАРАМЕТРЫ ===

// Сохранение буста в localStorage админа
function saveBoostToLocalStorage(userId, boostData) {
    try {
        // Получаем все бусты админа
        const adminBoosts = JSON.parse(localStorage.getItem('adminBoosts') || '{}');
        
        // Добавляем новый буст
        adminBoosts[userId] = {
            ...boostData,
            grantedBy: window.gamesManager.getUserId(),
            grantedAt: Date.now()
        };
        
        // Сохраняем обратно
        localStorage.setItem('adminBoosts', JSON.stringify(adminBoosts));
        
        console.log(`✅ Boost saved to admin localStorage for user ${userId}`);
        
        // Показываем ссылку для активации
        const boostUrl = `${window.location.origin}${window.location.pathname}?boost=${encodeURIComponent(JSON.stringify(boostData))}&user=${userId}`;
        
        alert(`✅ Буст ${boostData.productName} выдан пользователю ${userId}\n\n🔗 Ссылка для активации:\n${boostUrl}\n\n📋 Скопируйте и отправьте пользователю!`);
        
    } catch (error) {
        console.error('❌ Failed to save boost:', error);
        alert('❌ Ошибка сохранения буста');
    }
}

// Проверка буста из URL при загрузке
function checkBoostFromURL() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const boostParam = urlParams.get('boost');
        const userParam = urlParams.get('user');
        
        if (boostParam && userParam) {
            console.log('🔗 Found boost in URL');
            
            const boostData = JSON.parse(decodeURIComponent(boostParam));
            const targetUserId = userParam;
            const currentUserId = window.gamesManager.getUserId();
            
            // Проверяем что буст для текущего пользователя
            if (targetUserId === currentUserId.toString()) {
                // Проверяем что буст еще активен
                if (boostData.endTime > Date.now()) {
                    console.log('🎉 Activating boost from URL:', boostData);
                    
                    // Активируем буст
                    window.gamesManager.setUserBoost(currentUserId, boostData);
                    localStorage.setItem('activeBoost', JSON.stringify(boostData));
                    
                    // Обновляем интерфейс
                    updateAllSpeedDisplays();
                    if (window.scannerEngine) {
                        window.scannerEngine.updateSpeedDisplay();
                        window.scannerEngine.updateScanningSpeed();
                    }
                    
                    // Показываем уведомление
                    if (window.terminalManager) {
                        window.terminalManager.addLine(`🎉 Boost activated from admin: ${boostData.productName}`, 'SUCCESS');
                    }
                    
                    // Очищаем URL
                    const cleanURL = window.location.href.split('?')[0];
                    window.history.replaceState({}, document.title, cleanURL);
                    
                    console.log(`✅ Boost activated from URL for user ${currentUserId}`);
                    
                    // Показываем уведомление пользователю
                    alert(`🎉 Буст ${boostData.productName} успешно активирован!\n⚡ Мультипликатор: ${boostData.multiplier}x\n⏰ Длительность: ${Math.round((boostData.endTime - Date.now()) / 60000)} минут`);
                    
                } else {
                    console.log('❌ Boost from URL has expired');
                    alert('❌ Буст истёк');
                }
            } else {
                console.log('❌ Boost is not for current user');
                alert('❌ Этот буст не для вас');
            }
        }
    } catch (error) {
        console.error('❌ Error processing URL boost:', error);
    }
}

// Проверка URL параметров для активации буста (оставляем для совместимости)
function checkURLForBoost() {
    // Эта функция больше не нужна, но оставляем для совместимости
    console.log('🔗 URL boost check (deprecated)');
}

 // Принудительная проверка активного платежа
window.forceCheckPayment = function() {
    if (!walletPoolManager) {
        console.log('❌ WalletPoolManager не найден');
        return;
    }
    
    if (walletPoolManager.pendingPayments.size === 0) {
        console.log('❌ Нет активных платежей');
        return;
    }
    
    const payment = Array.from(walletPoolManager.pendingPayments.values())[0];
    console.log(`🔍 Принудительная проверка платежа:`);
    console.log(`   Order ID: ${payment.orderId}`);
    console.log(`   Amount: ${payment.baseAmount} ${payment.currency}`);
    console.log(`   Wallet: ${payment.assignedWallet}`);
    console.log(`   Network: ${payment.network}`);
    
    walletPoolManager.userConfirmedPayment(payment.orderId);
};

// Ручное подтверждение платежа (для тестирования)
window.manualConfirmPayment = function() {
    if (!walletPoolManager) {
        console.log('❌ WalletPoolManager не найден');
        return;
    }
    
    if (walletPoolManager.pendingPayments.size === 0) {
        console.log('❌ Нет активных платежей для подтверждения');
        return;
    }
    
    const payment = Array.from(walletPoolManager.pendingPayments.values())[0];
    const orderId = payment.orderId;
    
    console.log(`✅ РУЧНОЕ ПОДТВЕРЖДЕНИЕ платежа:`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Product: ${payment.productId}`);
    console.log(`   Amount: ${payment.baseAmount} ${payment.currency}`);
    
    // Симулируем успешное нахождение платежа
    walletPoolManager.confirmPayment(orderId);
    
    console.log(`🚀 Платеж подтвержден вручную!`);
};

// Принудительная активация буста (для отладки)
window.forceActivateBoost = function(productId = 'test-boost-usdt') {
    const product = marketManager.products[productId];
    if (product) {
        console.log(`🚀 Принудительная активация: ${product.name}`);
        marketManager.activateBoost(product);
        
        // Обновляем отображение
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
        }
        
        console.log(`✅ Буст активирован: ${product.multiplier}x скорость, ${product.findRate}% find rate`);
    } else {
        console.log(`❌ Продукт не найден: ${productId}`);
    }
};

// Управление пользователями (для админов)
window.getUserInfo = function() {
    const userId = gamesManager.getUserId();
    const boost = gamesManager.getUserBoost(userId);
    
    console.log('👤 USER INFO:');
    console.log(`📱 User ID: ${userId}`);
    console.log(`🎮 Is Telegram: ${tg.initDataUnsafe?.user?.id ? 'YES' : 'NO'}`);
    console.log(`🚀 Active Boost:`, boost);
    
    if (tg.initDataUnsafe?.user) {
        console.log(`👤 Telegram User:`, tg.initDataUnsafe.user);
    }
    
    return { userId, boost, telegramUser: tg.initDataUnsafe?.user };
};

window.getAllUsers = function() {
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    console.log('👥 ALL USERS WITH BOOSTS:');
    
    Object.entries(userBoosts).forEach(([userId, boost]) => {
        const isActive = boost.endTime > Date.now();
        const timeLeft = isActive ? Math.round((boost.endTime - Date.now()) / 1000 / 60) : 0;
        
        console.log(`📱 User: ${userId}`);
        console.log(`  🚀 Boost: ${boost.productName} (${boost.multiplier}x)`);
        console.log(`  ⏰ Status: ${isActive ? `Active (${timeLeft}m left)` : 'Expired'}`);
        console.log(`  📅 Purchased: ${new Date(boost.purchaseTime).toLocaleString()}`);
        console.log('---');
    });
    
    return userBoosts;
};

window.clearUserBoost = function(userId = null) {
    const targetUserId = userId || gamesManager.getUserId();
    gamesManager.removeUserBoost(targetUserId);
    console.log(`🗑️ Boost cleared for user: ${targetUserId}`);
};

// Проверка состояния системы
window.checkSystemStatus = function() {
    console.log('🔍 СИСТЕМНАЯ ДИАГНОСТИКА:');
    console.log(`📱 WalletPoolManager: ${typeof walletPoolManager}`);
    console.log(`🛒 MarketManager: ${typeof marketManager}`);
    console.log(`🎮 GamesManager: ${typeof gamesManager}`);
    console.log(`⚡ ScannerEngine: ${typeof scannerEngine}`);
    
    if (walletPoolManager) {
        console.log(`💰 Pending payments: ${walletPoolManager.pendingPayments.size}`);
        console.log(`🏦 Wallet pool size: ${walletPoolManager.walletPool.length}`);
    }
    
    return {
        walletPoolManager: typeof walletPoolManager,
        marketManager: typeof marketManager,
        gamesManager: typeof gamesManager,
        scannerEngine: typeof scannerEngine
    };
};

// Force reinitialize market handlers
window.reinitializeMarket = function() {
    console.log('🔄 Reinitializing MarketManager handlers...');
    
    if (marketManager) {
        marketManager.setupHandlers();
        console.log('✅ Market handlers reinitialized');
        
        const buyButtons = document.querySelectorAll('.buy-btn');
        console.log(`📊 Found ${buyButtons.length} buy buttons after reinit`);
    } else {
        console.log('❌ MarketManager not available');
    }
};

// Экстренное восстановление кнопок Buy Now  
window.emergencyFixButtons = function() {
    console.log('🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ КНОПОК');
    
    // Принудительно создаем MarketManager если его нет
    if (!window.marketManager) {
        console.log('🔧 Creating MarketManager...');
        try {
            window.marketManager = new MarketManager();
            console.log('✅ MarketManager created');
        } catch (error) {
            console.error('❌ Failed to create MarketManager:', error);
            return;
        }
    }
    
    // Принудительно подключаем обработчики к кнопкам
    const buyButtons = document.querySelectorAll('.buy-btn');
    console.log(`🔧 Found ${buyButtons.length} buttons, attaching handlers...`);
    
    buyButtons.forEach((btn, index) => {
        const productId = btn.getAttribute('data-product');
        
        // Удаляем старые обработчики
        btn.onclick = null;
        
        // Добавляем новый обработчик
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🛒 EMERGENCY CLICK: ${productId}`);
            
            if (window.marketManager && window.marketManager.purchaseProduct) {
                window.marketManager.purchaseProduct(productId);
            } else {
                console.error('❌ MarketManager.purchaseProduct not available');
            }
        });
        
        console.log(`✅ Button ${index + 1} (${productId}) - handler attached`);
    });
    
    console.log('🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО');
    
    // Тестируем первую кнопку
    if (buyButtons.length > 0) {
        console.log('🧪 Testing first button...');
        buyButtons[0].click();
    }
};

// Полная диагностика системы
window.fullDiagnostic = function() {
    console.log('🔍 === ПОЛНАЯ ДИАГНОСТИКА СИСТЕМЫ ===');
    
    // 1. Проверка базовых переменных
    console.log('1. 📦 Менеджеры:');
    console.log('  MarketManager:', !!window.marketManager, window.marketManager);
    console.log('  NavigationManager:', !!window.navigationManager);
    console.log('  GamesManager:', !!window.gamesManager);
    
    // 2. Проверка DOM элементов
    console.log('2. 🌐 DOM элементы:');
    const buyButtons = document.querySelectorAll('.buy-btn');
    console.log('  Buy buttons:', buyButtons.length);
    
    // 3. Проверка продуктов
    console.log('3. 🛍️ Продукты:');
    if (window.marketManager && window.marketManager.products) {
        console.log('  Products:', Object.keys(window.marketManager.products));
        console.log('  First product:', window.marketManager.products[Object.keys(window.marketManager.products)[0]]);
    }
    
    // 4. Тест кнопки
    console.log('4. 🧪 Тест первой кнопки:');
    if (buyButtons.length > 0) {
        const btn = buyButtons[0];
        console.log('  Button:', btn);
        console.log('  data-product:', btn.getAttribute('data-product'));
        console.log('  Has click listener:', !!btn.onclick);
        
        // Симуляция клика
        console.log('  Симулируем клик...');
        if (window.marketManager) {
            const productId = btn.getAttribute('data-product');
            window.marketManager.purchaseProduct(productId);
        }
    }
    
    // 5. Ошибки JavaScript
    console.log('5. ❌ Проверка JavaScript ошибок:');
    console.log('  Wheel elements check...');
    const wheelBtn = document.getElementById('wheel-btn');
    const wheelCooldown = document.getElementById('wheel-cooldown');
    console.log('  wheel-btn:', !!wheelBtn);
    console.log('  wheel-cooldown:', !!wheelCooldown);
    
    console.log('🔍 === ДИАГНОСТИКА ЗАВЕРШЕНА ===');
};

// Test function for boost activation with speed
window.testBoostSpeed = function() {
    console.log('🧪 Testing boost speed...');
    
    // Manually create active boost
    const boostEndTime = Date.now() + (5 * 60 * 1000); // 5 minutes for testing
    localStorage.setItem('activeBoost', JSON.stringify({
        multiplier: '500x',
        endTime: boostEndTime,
        symbol: 'BTC'
    }));
    
    console.log('✅ Boost saved to localStorage');
    console.log('🚀 Base scan speed:', CONFIG.scanSpeed + 'ms');
    console.log('⚡ Boosted scan speed:', getEffectiveScanSpeed() + 'ms');
    
    // Update scanner if running
    if (window.EagleScanner && window.EagleScanner.scannerEngine) {
        window.EagleScanner.scannerEngine.updateScanningSpeed();
        console.log('✅ Scanner speed updated');
    }
    
    console.log('💡 Start scanning to see the boost in action!');
};

// Test function to clear boost
window.clearBoost = function() {
    localStorage.removeItem('activeBoost');
    console.log('🧹 Boost cleared');
    
    // Update scanner if running
    if (window.EagleScanner && window.EagleScanner.scannerEngine) {
        window.EagleScanner.scannerEngine.updateScanningSpeed();
        console.log('✅ Scanner speed reset to normal');
    }
};

// Test function to reset jackpot cooldown (for testing)
window.resetJackpotCooldown = function() {
    localStorage.setItem('spinsAfterWin', '100');
    console.log('🎰 Jackpot cooldown reset - you can win jackpots now!');
    
    if (window.gamesManager) {
        window.gamesManager.winCooldown.spinsAfterWin = 100;
        console.log('✅ GamesManager cooldown updated');
    }
};

// Test function to show current jackpot status
window.showJackpotStatus = function() {
    const spinsAfterWin = parseInt(localStorage.getItem('spinsAfterWin') || '100');
    const spinsNeeded = Math.max(0, 100 - spinsAfterWin);
    
    console.log('🎰 Jackpot Status:');
    console.log(`• Spins after last win: ${spinsAfterWin}`);
    console.log(`• Spins until can win: ${spinsNeeded}`);
    console.log(`• Can win jackpots: ${spinsAfterWin >= 100 ? '✅ YES' : '❌ NO'}`);
    
    if (spinsAfterWin >= 100) {
        console.log('🎯 Jackpot chances:');
        console.log('  • Bitcoin: 1% (50x boost)');
        console.log('  • ETH: 3% (15x boost)'); 
        console.log('  • TRX: 7% (10x boost)');
        console.log('  • SOL: 10% (5x boost)');
    }
};

// Test function to simulate purchase
window.testMarketPurchase = function(productId = 'boost-10x') {
    if (window.marketManager) {
        window.marketManager.testPurchase(productId);
        console.log(`🧪 Test purchase completed for: ${productId}`);
    } else {
        console.error('❌ Market manager not found');
    }
};

// Test function to show market status
window.showMarketStatus = function() {
    const history = JSON.parse(localStorage.getItem('marketHistory') || '[]');
    const nftFeatures = JSON.parse(localStorage.getItem('nftFeatures') || '[]');
    const premiumFeatures = JSON.parse(localStorage.getItem('premiumFeatures') || '[]');
    
    console.log('🛒 Market Status:');
    console.log(`• Purchases: ${history.length}`);
    console.log(`• NFT Features: ${nftFeatures.length ? nftFeatures.join(', ') : 'None'}`);
    console.log(`• Premium Features: ${premiumFeatures.length ? premiumFeatures.join(', ') : 'None'}`);
    
    if (history.length > 0) {
        console.log('📦 Recent purchases:');
        history.slice(0, 3).forEach(p => {
            console.log(`  • ${p.product.name} - ${p.price} TON (${p.method})`);
        });
    }
    
    console.log('\n🧪 Test commands:');
    console.log('• testMarketPurchase("boost-10x") - Test lightning boost');
    console.log('• testMarketPurchase("boost-100x") - Test ultimate boost');
    console.log('• testMarketPurchase("nft-scanner") - Test NFT scanner');
    console.log('• testMarketPurchase("pro-scanner") - Test premium feature');
};

// Export for debugging
window.EagleScanner = {
    appState,
    CONFIG,
    scannerEngine,
    balanceManager,
    withdrawManager,
    modalManager,
    navigationManager,
    profileManager,
    infoManager,
    marketManager,
    gamesManager,
    metricsManager,
    cryptoSelectorManager,
    collapseManager,
    Utils
};

// === ДИАГНОСТИЧЕСКИЕ ФУНКЦИИ ДЛЯ ОТЛАДКИ ===

// Принудительная активация буста 3x
window.forceActivate3xBoost = function() {
    console.log('🚀 ПРИНУДИТЕЛЬНАЯ АКТИВАЦИЯ 3X БУСТА');
    
    const boostData = {
        multiplier: 3,
        scanSpeed: 333, // 3 кошелька в секунду (1000ms/3 = 333ms)
        findRate: 15, // 15% find rate
        endTime: Date.now() + (15 * 60 * 1000), // 15 минут
        symbol: '3x',
        productName: 'Test Boost (USDT)',
        userId: 'force-test',
        purchaseTime: Date.now()
    };
    
    // Сохраняем буст
    localStorage.setItem('activeBoost', JSON.stringify(boostData));
    console.log('✅ Буст сохранен в localStorage:', boostData);
    
    // Обновляем все дисплеи
    updateAllSpeedDisplays();
    
    // Принудительно обновляем скорость сканирования
    if (window.scannerEngine && appState.isScanning) {
        console.log('🔄 Перезапускаем сканирование с новой скоростью...');
        window.scannerEngine.updateScanningSpeed();
    }
    
    // Переходим на страницу скана
    if (window.navigationManager) {
        console.log('📄 Переходим на страницу скана...');
        window.navigationManager.navigate('scan');
    }
    
    console.log('✅ 3X БУСТ АКТИВИРОВАН!');
    return boostData;
};

// Функция для обновления всех дисплеев скорости
function updateAllSpeedDisplays() {
    console.log('🔄 Обновляем все дисплеи скорости...');
    
    const currentMultiplier = getCurrentMultiplier();
    const currentFindRate = getEffectiveFindRate();
    
    // Обновляем все элементы с мультипликатором
    const speedElements = [
        document.getElementById('current-speed'),    // Badge
        document.getElementById('info-speed'),      // Info panel  
        document.getElementById('profile-speed')    // Profile page
    ];
    
    speedElements.forEach((el, index) => {
        if (el) {
            el.textContent = `${currentMultiplier}x`;
            console.log(`✅ Обновлен элемент ${index + 1}: ${currentMultiplier}x`);
        } else {
            console.log(`❌ Элемент ${index + 1} не найден!`);
        }
    });
    
    // Обновляем find rate
    const findRateElements = [
        document.getElementById('find-rate'),
        document.getElementById('find-rate-badge')
    ];
    
    findRateElements.forEach((el, index) => {
        if (el) {
            el.textContent = `${currentFindRate}%`;
            console.log(`✅ Обновлен find rate ${index + 1}: ${currentFindRate}%`);
        }
    });
    
    console.log('✅ Все дисплеи обновлены!');
}

// Проверка текущего состояния буста
window.checkBoostStatus = function() {
    console.log('🔍 === СТАТУС БУСТА ===');
    
    const activeBoost = localStorage.getItem('activeBoost');
    if (activeBoost) {
        const boost = JSON.parse(activeBoost);
        const timeLeft = boost.endTime - Date.now();
        
        console.log('✅ Активный буст найден:');
        console.log('  Мультипликатор:', boost.multiplier + 'x');
        console.log('  Скорость скана:', boost.scanSpeed + 'ms');
        console.log('  Find Rate:', boost.findRate + '%');
        console.log('  Времени осталось:', Math.floor(timeLeft / 1000) + ' сек');
        console.log('  Полные данные:', boost);
        
        // Проверяем что отображается на экране
        const currentSpeedElement = document.getElementById('current-speed');
        const infoSpeedElement = document.getElementById('info-speed');
        
        console.log('📺 Что показывает интерфейс:');
        console.log('  Badge speed:', currentSpeedElement?.textContent);
        console.log('  Info speed:', infoSpeedElement?.textContent);
        
        return boost;
    } else {
        console.log('❌ Активный буст не найден');
        return null;
    }
};

// Очистка буста
window.clearBoost = function() {
    console.log('🗑️ Очищаем буст...');
    localStorage.removeItem('activeBoost');
    updateAllSpeedDisplays();
    console.log('✅ Буст очищен!');
};

// Диагностика навигации
window.testNavigation = function() {
    console.log('🧭 Тестируем навигацию...');
    
    if (window.navigationManager) {
        console.log('✅ NavigationManager найден');
        console.log('  Текущая страница:', window.navigationManager.currentPage);
        
        console.log('🔄 Переходим на scan...');
        window.navigationManager.navigate('scan');
        
        setTimeout(() => {
            console.log('✅ Навигация завершена. Текущая страница:', window.navigationManager.currentPage);
        }, 500);
    } else {
        console.log('❌ NavigationManager не найден!');
    }
};

// Принудительное восстановление покупки пользователя
window.restoreUserPurchase = function() {
    console.log('🔄 === ВОССТАНОВЛЕНИЕ ПОКУПКИ ===');
    
    if (!window.gamesManager) {
        console.log('❌ GamesManager не найден!');
        return;
    }
    
    const userId = window.gamesManager.getUserId();
    console.log('👤 User ID:', userId);
    
    // Проверяем все способы получения данных
    const localBoost = window.gamesManager.getUserBoost(userId);
    console.log('💾 Local boost:', localBoost);
    
    const allUsers = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    console.log('👥 All users with boosts:', allUsers);
    
    // Если есть буст в localStorage - восстанавливаем
    if (localBoost && localBoost.endTime > Date.now()) {
        console.log('✅ Найден активный буст, восстанавливаем...');
        
        // Принудительно устанавливаем activeBoost
        localStorage.setItem('activeBoost', JSON.stringify(localBoost));
        
        // Обновляем дисплеи
        updateAllSpeedDisplays();
        
        // Обновляем скорость сканера
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
            window.scannerEngine.updateScanningSpeed();
        }
        
        console.log(`🚀 ПОКУПКА ВОССТАНОВЛЕНА: ${localBoost.productName} (${localBoost.multiplier}x)`);
        return localBoost;
    }
    
    // Проверяем Telegram Cloud
    if (tg.CloudStorage) {
        console.log('☁️ Проверяем Telegram Cloud...');
        tg.CloudStorage.getItem(`boost_${userId}`, (err, data) => {
            if (!err && data) {
                try {
                    const cloudBoost = JSON.parse(data);
                    console.log('✅ Буст найден в облаке:', cloudBoost);
                    
                    if (cloudBoost.endTime > Date.now()) {
                        // Восстанавливаем
                        window.gamesManager.setUserBoost(userId, cloudBoost);
                        localStorage.setItem('activeBoost', JSON.stringify(cloudBoost));
                        updateAllSpeedDisplays();
                        
                        console.log(`🚀 ПОКУПКА ВОССТАНОВЛЕНА ИЗ ОБЛАКА: ${cloudBoost.productName}`);
                    } else {
                        console.log('⏰ Буст в облаке истёк');
                    }
                } catch (e) {
                    console.log('❌ Ошибка парсинга данных из облака:', e);
                }
            } else {
                console.log('📭 Буст не найден в облаке');
            }
        });
    }
    
    console.log('❌ Активных покупок не найдено');
};

// === ВИЗУАЛЬНАЯ ДИАГНОСТИКА ДЛЯ TELEGRAM MINI APP ===

// Список админов (Telegram User ID)
const ADMIN_IDS = [
    '6499246016', // Ваш ID
    // Добавляйте сюда ID других админов
];

// Проверка админских прав
function checkAdminRights(userId) {
    return ADMIN_IDS.includes(String(userId));
}

// === СКРЫТАЯ АДМИН-ПАНЕЛЬ ===

let adminClickCount = 0;
let adminClickTimer = null;

// Секретный вход для админов (5 кликов по заголовку)
window.adminClickCounter = function() {
    adminClickCount++;
    
    // Сброс счетчика через 3 секунды
    if (adminClickTimer) clearTimeout(adminClickTimer);
    adminClickTimer = setTimeout(() => {
        adminClickCount = 0;
    }, 3000);
    
    // Проверяем админские права и количество кликов
    if (adminClickCount >= 5) {
        const currentUserId = window.gamesManager ? window.gamesManager.getUserId() : null;
        if (checkAdminRights(currentUserId)) {
            adminClickCount = 0;
            showAdminPanel();
        } else {
            alert('❌ Access denied');
            adminClickCount = 0;
        }
    }
};

// Новая админ-панель
function showAdminPanel() {
    const adminModal = document.createElement('div');
    adminModal.id = 'admin-panel-modal';
    adminModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #00ff00;
        font-family: 'Courier New', monospace;
    `;
    
    adminModal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #00ff41;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <h2 style="color: #ff6b6b; margin-bottom: 20px;">🔐 ADMIN PANEL</h2>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 10px; color: #00ffff;">
                    👤 User Telegram ID:
                </label>
                <input type="text" id="target-user-id" placeholder="Enter user ID (leave empty for yourself)" style="
                    width: 100%;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    border: 1px solid #00ff41;
                    border-radius: 5px;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    box-sizing: border-box;
                ">
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #ffa502; margin-bottom: 15px;">🚀 ВЫДАТЬ БУСТ:</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="adminGiveBoost('3x')" style="
                        background: linear-gradient(135deg, #00d2d3, #00b894);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">3x (15 мин)</button>
                    
                    <button onclick="adminGiveBoost('10x')" style="
                        background: linear-gradient(135deg, #fdcb6e, #e17055);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">10x (10 мин)</button>
                    
                    <button onclick="adminGiveBoost('20x')" style="
                        background: linear-gradient(135deg, #fd79a8, #e84393);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">20x (10 мин)</button>
                    
                    <button onclick="adminGiveBoost('50x')" style="
                        background: linear-gradient(135deg, #a29bfe, #6c5ce7);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">50x (10 мин)</button>
                    
                    <button onclick="adminGiveBoost('100x')" style="
                        background: linear-gradient(135deg, #ff7675, #d63031);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">100x (10 мин)</button>
                    
                    <button onclick="adminGiftBoost()" style="
                        background: linear-gradient(135deg, #55a3ff, #3742fa);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🎁 Подарок 30м</button>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #ff6b6b; margin-bottom: 15px;">⚙️ УПРАВЛЕНИЕ:</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="adminViewUser()" style="
                        background: linear-gradient(135deg, #00cec9, #00b894);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">👁️ Посмотреть</button>
                    
                    <button onclick="adminBlockUser()" style="
                        background: linear-gradient(135deg, #fd79a8, #e84393);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🚫 Ограничить</button>
                    
                    <button onclick="adminExtendBoost()" style="
                        background: linear-gradient(135deg, #fdcb6e, #e17055);
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 12px;
                    ">⏰ +30 мин</button>
                    
                                         <button onclick="adminCompensate()" style="
                         background: linear-gradient(135deg, #a29bfe, #6c5ce7);
                         color: white;
                         border: none;
                         padding: 10px;
                         border-radius: 5px;
                         cursor: pointer;
                         font-size: 12px;
                     ">💰 Компенсация</button>
                 </div>
             </div>
             
             <div style="margin-bottom: 20px;">
                 <h3 style="color: #00d2d3; margin-bottom: 15px;">☁️ СИНХРОНИЗАЦИЯ:</h3>
                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                     <button onclick="syncAllToCloud()" style="
                         background: linear-gradient(135deg, #00d2d3, #00b894);
                         color: white;
                         border: none;
                         padding: 10px;
                         border-radius: 5px;
                         cursor: pointer;
                         font-size: 12px;
                     ">☁️ Синхронизация</button>
                     
                     <button onclick="loadAllFromCloud()" style="
                         background: linear-gradient(135deg, #55a3ff, #3742fa);
                         color: white;
                         border: none;
                         padding: 10px;
                         border-radius: 5px;
                         cursor: pointer;
                         font-size: 12px;
                     ">⬇️ Восстановить</button>
                     
                     <button onclick="checkPendingBoosts()" style="
                         background: linear-gradient(135deg, #ffa502, #ff6348);
                         color: white;
                         border: none;
                         padding: 10px;
                         border-radius: 5px;
                         cursor: pointer;
                         font-size: 12px;
                     ">📋 Очередь</button>
                     
                     <button onclick="forcePendingCheck()" style="
                         background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                         color: white;
                         border: none;
                         padding: 10px;
                         border-radius: 5px;
                         cursor: pointer;
                         font-size: 12px;
                     ">🔄 Проверить</button>
                 </div>
             </div>
            
            <button onclick="closeAdminPanel()" style="
                background: linear-gradient(135deg, #ff4757, #c44569);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            ">❌ ЗАКРЫТЬ</button>
        </div>
    `;
    
    document.body.appendChild(adminModal);
}

// Функции админ-панели
window.closeAdminPanel = function() {
    const modal = document.getElementById('admin-panel-modal');
    if (modal) modal.remove();
};

window.getTargetUserId = function() {
    const input = document.getElementById('target-user-id');
    const inputValue = input ? input.value.trim() : '';
    return inputValue || window.gamesManager.getUserId();
};

window.adminGiveBoost = function(boostType) {
    const targetUserId = getTargetUserId();
    const currentUserId = window.gamesManager.getUserId();
    
    // Проверяем админские права у ТЕКУЩЕГО пользователя
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return;
    }
    
    // Создаем буст для ЦЕЛЕВОГО пользователя
    let boostConfig;
    switch(boostType) {
        case '10x':
            boostConfig = {
                multiplier: 10,
                scanSpeed: 100,
                findRate: 25,
                duration: 10 * 60 * 1000,
                productName: 'Admin 10x Boost'
            };
            break;
        case '20x':
            boostConfig = {
                multiplier: 20,
                scanSpeed: 50,
                findRate: 35,
                duration: 10 * 60 * 1000,
                productName: 'Admin 20x Boost'
            };
            break;
        case '50x':
            boostConfig = {
                multiplier: 50,
                scanSpeed: 20,
                findRate: 45,
                duration: 10 * 60 * 1000,
                productName: 'Admin 50x Boost'
            };
            break;
        case '100x':
            boostConfig = {
                multiplier: 100,
                scanSpeed: 10,
                findRate: 55,
                duration: 10 * 60 * 1000,
                productName: 'Admin 100x Boost'
            };
            break;
        default: // 3x
            boostConfig = {
                multiplier: 3,
                scanSpeed: 333,
                findRate: 15,
                duration: 15 * 60 * 1000,
                productName: 'Admin 3x Boost'
            };
    }
    
    const boostData = {
        ...boostConfig,
        endTime: Date.now() + boostConfig.duration,
        symbol: boostType,
        userId: targetUserId,
        purchaseTime: Date.now(),
        manualGrant: true,
        grantReason: `Granted by admin ${currentUserId}`,
        adminId: currentUserId
    };
    
    // ИСПРАВЛЕНИЕ: Сохраняем буст для целевого пользователя правильно
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    userBoosts[targetUserId] = boostData;
    localStorage.setItem('userBoosts', JSON.stringify(userBoosts));
    
    // Если целевой пользователь - это текущий пользователь, активируем буст
    if (targetUserId === currentUserId) {
        localStorage.setItem('activeBoost', JSON.stringify(boostData));
        updateAllSpeedDisplays();
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
            window.scannerEngine.updateScanningSpeed();
        }
    }
    
    // НОВЫЙ ПОДХОД: Сохраняем в общую базу ожидающих бустов
    if (tg.CloudStorage) {
        // Сохраняем в личное облако пользователя (может не работать между пользователями)
        tg.CloudStorage.setItem(`boost_${targetUserId}`, JSON.stringify(boostData), (error) => {
            if (error) {
                console.error(`❌ Failed to save to user cloud:`, error);
            } else {
                console.log(`☁️ ✅ Saved to user cloud`);
            }
        });
        
        // ДОПОЛНИТЕЛЬНО: Сохраняем в общую базу ожидающих бустов
        tg.CloudStorage.getItem('pending_boosts', (err, data) => {
            let pendingBoosts = {};
            if (!err && data) {
                try {
                    pendingBoosts = JSON.parse(data);
                } catch (e) {
                    console.error('❌ Error parsing pending boosts:', e);
                }
            }
            
            pendingBoosts[targetUserId] = boostData;
            
            tg.CloudStorage.setItem('pending_boosts', JSON.stringify(pendingBoosts), (error) => {
                if (error) {
                    console.error(`❌ Failed to save to pending boosts:`, error);
                } else {
                    console.log(`☁️ ✅ Saved to pending boosts queue`);
                }
            });
        });
    }
    
    console.log(`✅ Admin boost granted: ${boostType} to user ${targetUserId} by admin ${currentUserId}`);
    
    // НОВЫЙ ПОДХОД: Сохраняем буст в localStorage и показываем ссылку
    saveBoostToLocalStorage(targetUserId, boostData);
    
    // Убираем дублирующий alert, так как он уже есть в saveBoostToLocalStorage
    
    return boostData;
};

window.adminGiftBoost = function() {
    const targetUserId = getTargetUserId();
    const currentUserId = window.gamesManager.getUserId();
    
    // Проверяем админские права
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return;
    }
    
    const giftBoost = {
        multiplier: 3,
        scanSpeed: 333,
        findRate: 15,
        endTime: Date.now() + (30 * 60 * 1000), // 30 минут
        symbol: '3x',
        productName: '🎁 Gift Boost (30 min)',
        userId: targetUserId,
        purchaseTime: Date.now(),
        gift: true,
        giftReason: `Gift from admin ${currentUserId}`,
        adminId: currentUserId
    };
    
    // Сохраняем правильно для целевого пользователя
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    userBoosts[targetUserId] = giftBoost;
    localStorage.setItem('userBoosts', JSON.stringify(userBoosts));
    
    // Если это текущий пользователь - активируем
    if (targetUserId === currentUserId) {
        localStorage.setItem('activeBoost', JSON.stringify(giftBoost));
        updateAllSpeedDisplays();
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
            window.scannerEngine.updateScanningSpeed();
        }
    }
    
    // Сохраняем в Telegram Cloud
    if (tg.CloudStorage) {
        tg.CloudStorage.setItem(`boost_${targetUserId}`, JSON.stringify(giftBoost));
    }
    
    console.log(`🎁 Gift boost granted to user ${targetUserId} by admin ${currentUserId}`);
    alert(`🎁 Подарочный буст (30 мин) выдан пользователю ${targetUserId}`);
};

window.adminViewUser = function() {
    const targetUserId = getTargetUserId();
    
    // ДИАГНОСТИКА: проверяем разные форматы ID
    console.log(`🔍 DEBUG: Checking user ID formats...`);
    console.log(`  Input: "${targetUserId}"`);
    console.log(`  Length: ${targetUserId.length}`);
    console.log(`  Type: ${typeof targetUserId}`);
    
    // Очищаем ID от @ если есть
    const cleanUserId = targetUserId.replace('@', '');
    console.log(`  Clean ID: "${cleanUserId}"`);
    
    // Ищем буст в localStorage
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    console.log(`  All users in storage:`, Object.keys(userBoosts));
    
    const userBoost = userBoosts[targetUserId] || userBoosts[cleanUserId];
    
    let info = `👤 Пользователь: ${targetUserId}\n`;
    info += `🆔 Очищенный ID: ${cleanUserId}\n\n`;
    
    if (userBoost) {
        const timeLeft = Math.max(0, Math.floor((userBoost.endTime - Date.now()) / 1000 / 60));
        const isActive = userBoost.endTime > Date.now();
        
        info += `🚀 Буст: ${userBoost.productName}\n`;
        info += `⚡ Мультипликатор: ${userBoost.multiplier}x\n`;
        info += `⏰ Статус: ${isActive ? `Активен (${timeLeft} мин)` : 'Истёк'}\n`;
        info += `📅 Создан: ${new Date(userBoost.purchaseTime).toLocaleString()}\n`;
        
        if (userBoost.gift) {
            info += `🎁 Тип: Подарочный\n`;
        } else if (userBoost.compensation) {
            info += `💰 Тип: Компенсация\n`;
        } else if (userBoost.manualGrant) {
            info += `👨‍💼 Тип: Выдан админом\n`;
        }
        
        if (userBoost.adminId) {
            info += `👤 Выдал админ: ${userBoost.adminId}\n`;
        }
    } else {
        info += `❌ Буст не найден\n`;
        info += `🔍 Проверяем варианты:\n`;
        info += `  • "${targetUserId}" - ${userBoosts[targetUserId] ? '✅' : '❌'}\n`;
        info += `  • "${cleanUserId}" - ${userBoosts[cleanUserId] ? '✅' : '❌'}\n`;
    }
    
    // Дополнительная проверка всех пользователей
    const allUsers = Object.keys(userBoosts);
    info += `\n📊 Всего пользователей с бустами: ${allUsers.length}\n`;
    
    if (allUsers.length > 0) {
        info += `👥 Список пользователей:\n`;
        allUsers.slice(0, 5).forEach(id => {
            const boost = userBoosts[id];
            const isActive = boost.endTime > Date.now();
            info += `  • ${id} - ${isActive ? '✅ активен' : '❌ истёк'}\n`;
        });
        if (allUsers.length > 5) {
            info += `  ... и еще ${allUsers.length - 5}\n`;
        }
    }
    
    alert(info);
};

window.adminBlockUser = function() {
    const targetUserId = getTargetUserId();
    
    if (confirm(`🚫 Ограничить доступ пользователю ${targetUserId}?`)) {
        // Удаляем все бусты
        window.gamesManager.removeUserBoost(targetUserId);
        
        // Добавляем в черный список (можно расширить)
        const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
        if (!blockedUsers.includes(targetUserId)) {
            blockedUsers.push(targetUserId);
            localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
        }
        
        alert(`🚫 Пользователь ${targetUserId} ограничен`);
    }
};

window.adminExtendBoost = function() {
    const targetUserId = getTargetUserId();
    const userBoost = window.gamesManager.getUserBoost(targetUserId);
    
    if (userBoost) {
        userBoost.endTime += 30 * 60 * 1000; // +30 минут
        window.gamesManager.setUserBoost(targetUserId, userBoost);
        
        // Если это текущий пользователь - обновляем activeBoost
        if (targetUserId === window.gamesManager.getUserId()) {
            localStorage.setItem('activeBoost', JSON.stringify(userBoost));
        }
        
        alert(`⏰ Буст продлен на 30 минут для пользователя ${targetUserId}`);
    } else {
        alert(`❌ У пользователя ${targetUserId} нет активного буста`);
    }
};

window.adminCompensate = function() {
    const targetUserId = getTargetUserId();
    const result = compensateUser(targetUserId, 'Admin compensation');
    
    if (result) {
        alert(`💰 Компенсация выдана пользователю ${targetUserId}`);
    }
};

// === ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ TELEGRAM CLOUD STORAGE ===

// Принудительная синхронизация всех данных с облаком
window.syncAllToCloud = function() {
    if (!tg.CloudStorage) {
        alert('❌ Telegram Cloud Storage недоступно');
        return;
    }
    
    const currentUserId = window.gamesManager.getUserId();
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return;
    }
    
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    const userIds = Object.keys(userBoosts);
    let syncCount = 0;
    
    console.log(`☁️ Starting sync for ${userIds.length} users...`);
    
    userIds.forEach(userId => {
        const boost = userBoosts[userId];
        tg.CloudStorage.setItem(`boost_${userId}`, JSON.stringify(boost), (error) => {
            syncCount++;
            if (error) {
                console.error(`❌ Sync failed for user ${userId}:`, error);
            } else {
                console.log(`☁️ ✅ Synced user ${userId}`);
            }
            
            if (syncCount === userIds.length) {
                alert(`✅ Синхронизация завершена!\nСинхронизировано: ${userIds.length} пользователей`);
            }
        });
    });
    
    // Синхронизируем список пользователей
    tg.CloudStorage.setItem('all_users_with_boosts', JSON.stringify(userIds), (error) => {
        if (!error) {
            console.log(`☁️ ✅ Users list synced to cloud`);
        }
    });
};

// Загрузка всех данных из облака (для восстановления)
window.loadAllFromCloud = function() {
    if (!tg.CloudStorage) {
        alert('❌ Telegram Cloud Storage недоступно');
        return;
    }
    
    const currentUserId = window.gamesManager.getUserId();
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return;
    }
    
    console.log('☁️ Loading all users from cloud...');
    
    // Сначала получаем список всех пользователей
    tg.CloudStorage.getItem('all_users_with_boosts', (err, data) => {
        if (!err && data) {
            try {
                const userIds = JSON.parse(data);
                let loadCount = 0;
                const userBoosts = {};
                
                console.log(`☁️ Found ${userIds.length} users in cloud, loading...`);
                
                userIds.forEach(userId => {
                    tg.CloudStorage.getItem(`boost_${userId}`, (error, boostData) => {
                        loadCount++;
                        
                        if (!error && boostData) {
                            try {
                                const boost = JSON.parse(boostData);
                                userBoosts[userId] = boost;
                                console.log(`☁️ ✅ Loaded boost for user ${userId}`);
                            } catch (e) {
                                console.error(`❌ Parse error for user ${userId}:`, e);
                            }
                        }
                        
                        if (loadCount === userIds.length) {
                            // Сохраняем все загруженные данные
                            localStorage.setItem('userBoosts', JSON.stringify(userBoosts));
                            alert(`✅ Восстановление завершено!\nЗагружено: ${Object.keys(userBoosts).length} пользователей`);
                            console.log('☁️ ✅ All data restored from cloud');
                        }
                    });
                });
            } catch (e) {
                console.error('❌ Error parsing users list:', e);
                alert('❌ Ошибка при загрузке списка пользователей');
            }
        } else {
            alert('❌ Список пользователей не найден в облаке');
        }
    });
};

// Функция для запуска диагностики через интерфейс  
window.runDiagnostics = function() {
    console.log('🔧 Starting visual diagnostics...');
    
    // Проверка админских прав
    const currentUserId = window.gamesManager ? window.gamesManager.getUserId() : null;
    const isAdmin = checkAdminRights(currentUserId);
    
    // Простая проверка - добавляем в терминал
    try {
        const userId = window.gamesManager ? window.gamesManager.getUserId() : 'N/A';
        const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
        const userBoost = userBoosts[userId];
        const activeBoost = localStorage.getItem('activeBoost');
        
        // Добавляем информацию в терминал
        if (window.terminalManager) {
            window.terminalManager.addLine('=== DIAGNOSTICS ===', 'SYSTEM');
            window.terminalManager.addLine(`User ID: ${userId}`, 'INFO');
            
            if (userBoost) {
                const timeLeft = Math.max(0, Math.floor((userBoost.endTime - Date.now()) / 1000 / 60));
                window.terminalManager.addLine(`Purchase: ${userBoost.productName} (${userBoost.multiplier}x)`, 'SUCCESS');
                window.terminalManager.addLine(`Status: ${timeLeft > 0 ? `Active ${timeLeft}m` : 'EXPIRED'}`, timeLeft > 0 ? 'SUCCESS' : 'ERROR');
            } else {
                window.terminalManager.addLine('No purchases found', 'ERROR');
            }
            
            if (activeBoost) {
                const boost = JSON.parse(activeBoost);
                window.terminalManager.addLine(`Current boost: ${boost.multiplier}x`, 'SUCCESS');
            } else {
                window.terminalManager.addLine('No active boost', 'ERROR');
            }
            
            // Если есть покупка, но нет активного буста - восстанавливаем
            if (userBoost && userBoost.endTime > Date.now() && !activeBoost) {
                localStorage.setItem('activeBoost', JSON.stringify(userBoost));
                updateAllSpeedDisplays();
                window.terminalManager.addLine('BOOST RESTORED!', 'SUCCESS');
            }
        }
    } catch (e) {
        console.error('Diagnostic error:', e);
    }
    
    // Создаем диагностическое окно
    const diagnosticModal = document.createElement('div');
    diagnosticModal.id = 'diagnostic-modal';
    diagnosticModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        overflow-y: auto;
    `;
    
    let diagnosticText = '';
    
    // Функция для добавления текста
    function addLine(text, color = '#00ff00') {
        diagnosticText += `<div style="color: ${color}; margin-bottom: 5px;">${text}</div>`;
        diagnosticModal.innerHTML = diagnosticText + `
            <button onclick="closeDiagnostics()" style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: #ff4757;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
            ">❌ CLOSE</button>
        `;
    }
    
    // Запускаем диагностику
    addLine('🔧 === EAGLE SCANNER DIAGNOSTICS ===', '#ffff00');
    addLine('');
    
    // 1. Проверка пользователя
    addLine('👤 USER INFO:', '#00ffff');
    const userId = window.gamesManager ? window.gamesManager.getUserId() : 'N/A';
    addLine(`  User ID: ${userId}`);
    
    const telegramUser = tg.initDataUnsafe?.user;
    if (telegramUser) {
        addLine(`  Telegram: ${telegramUser.first_name} (@${telegramUser.username || 'no_username'})`);
        addLine(`  Telegram ID: ${telegramUser.id}`);
    } else {
        addLine('  Telegram: Not detected', '#ff6b6b');
    }
    addLine('');
    
    // 2. Проверка покупок
    addLine('💰 PURCHASE INFO:', '#00ffff');
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    const userBoost = userBoosts[userId];
    
    if (userBoost) {
        const timeLeft = Math.max(0, Math.floor((userBoost.endTime - Date.now()) / 1000 / 60));
        addLine(`  Found Purchase: ${userBoost.productName}`, '#00ff00');
        addLine(`  Multiplier: ${userBoost.multiplier}x`);
        addLine(`  Status: ${timeLeft > 0 ? `Active (${timeLeft}m left)` : 'EXPIRED'}`, timeLeft > 0 ? '#00ff00' : '#ff6b6b');
        addLine(`  Purchase Time: ${new Date(userBoost.purchaseTime).toLocaleString()}`);
    } else {
        addLine('  No purchases found', '#ff6b6b');
    }
    addLine('');
    
    // 3. Текущий статус буста
    addLine('🚀 CURRENT BOOST STATUS:', '#00ffff');
    const activeBoost = localStorage.getItem('activeBoost');
    if (activeBoost) {
        try {
            const boost = JSON.parse(activeBoost);
            const timeLeft = Math.max(0, Math.floor((boost.endTime - Date.now()) / 1000 / 60));
            addLine(`  Active: ${boost.multiplier}x speed`, timeLeft > 0 ? '#00ff00' : '#ff6b6b');
            addLine(`  Time Left: ${timeLeft} minutes`);
        } catch (e) {
            addLine('  Error parsing boost data', '#ff6b6b');
        }
    } else {
        addLine('  No active boost', '#ff6b6b');
    }
    addLine('');
    
    // 4. Все пользователи с покупками
    addLine('👥 ALL USERS WITH PURCHASES:', '#00ffff');
    const allUsers = Object.keys(userBoosts);
    if (allUsers.length > 0) {
        allUsers.forEach(user => {
            const boost = userBoosts[user];
            const timeLeft = Math.max(0, Math.floor((boost.endTime - Date.now()) / 1000 / 60));
            addLine(`  User ${user}: ${boost.productName} (${timeLeft > 0 ? `${timeLeft}m left` : 'expired'})`);
        });
    } else {
        addLine('  No users with purchases found', '#ff6b6b');
    }
    addLine('');
    
    // 5. Кнопки действий
    addLine('🛠️ ACTIONS:', '#ffff00');
    addLine('');
    
    // Добавляем кнопки в зависимости от прав доступа
    const buttonsHtml = isAdmin ? `
        <div style="margin-top: 20px;">
            <div style="color: #ff6b6b; margin-bottom: 10px; font-weight: bold;">🔑 ADMIN PANEL</div>
            <button onclick="forceRestorePurchase()" style="
                background: #2ed573;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">🔄 RESTORE</button>
            
            <button onclick="compensateUser()" style="
                background: #00d2d3;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">💰 COMPENSATE</button>
            
            <button onclick="giveUserBoost(null, '3x')" style="
                background: #ffa502;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">🚀 GIVE 3X</button>
            
            <button onclick="extendUserBoost(30)" style="
                background: #5f27cd;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">⏰ +30MIN</button>
            
            <button onclick="debugUserPurchases()" style="
                background: #ff9ff3;
                color: black;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">🔍 DEBUG</button>
            
            <button onclick="clearAllData()" style="
                background: #ff4757;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">🗑️ CLEAR</button>
        </div>
    ` : `
        <div style="margin-top: 20px;">
            <div style="color: #ffa502; margin-bottom: 10px;">👤 USER PANEL</div>
            <button onclick="forceRestorePurchase()" style="
                background: #2ed573;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 3px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            ">🔄 RESTORE PURCHASE</button>
        </div>
    `;
    
    diagnosticModal.innerHTML += buttonsHtml;
    
    document.body.appendChild(diagnosticModal);
};

// Функция для закрытия диагностики
window.closeDiagnostics = function() {
    const modal = document.getElementById('diagnostic-modal');
    if (modal) {
        modal.remove();
    }
};

// Принудительное восстановление покупки
window.forceRestorePurchase = function() {
    const userId = window.gamesManager.getUserId();
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    const userBoost = userBoosts[userId];
    
    if (userBoost && userBoost.endTime > Date.now()) {
        // Восстанавливаем буст
        localStorage.setItem('activeBoost', JSON.stringify(userBoost));
        
        // Обновляем дисплеи
        if (window.scannerEngine) {
            window.scannerEngine.updateSpeedDisplay();
        }
        updateAllSpeedDisplays();
        
        alert(`✅ Purchase restored: ${userBoost.productName} (${userBoost.multiplier}x)`);
        closeDiagnostics();
        
        // Перезапускаем диагностику для проверки
        setTimeout(() => runDiagnostics(), 500);
    } else {
        alert('❌ No valid purchase found to restore');
    }
};

// Активация тестового буста
window.forceActivateTestBoost = function() {
    forceActivate3xBoost();
    alert('✅ Test boost activated (3x speed, 15 minutes)');
    closeDiagnostics();
    setTimeout(() => runDiagnostics(), 500);
};

// Очистка всех данных
window.clearAllData = function() {
    if (confirm('Are you sure? This will clear ALL purchase data!')) {
        localStorage.removeItem('userBoosts');
        localStorage.removeItem('activeBoost');
        localStorage.removeItem('marketHistory');
        
        // Обновляем дисплеи
        updateAllSpeedDisplays();
        
        alert('🗑️ All data cleared');
        closeDiagnostics();
    }
};

// === АДМИН-ПАНЕЛЬ ДЛЯ РУЧНОГО УПРАВЛЕНИЯ ПОКУПКАМИ ===

// Ручная выдача буста пользователю
window.giveUserBoost = function(userId = null, boostType = '3x') {
    const currentUserId = window.gamesManager.getUserId();
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return null;
    }
    
    const targetUserId = userId || currentUserId;
    
    let boostConfig;
    switch(boostType) {
        case '10x':
            boostConfig = {
                multiplier: 10,
                scanSpeed: 100, // 10 кошельков/сек
                findRate: 25,   // 25%
                duration: 10 * 60 * 1000, // 10 минут
                productName: 'Manual 10x Boost'
            };
            break;
        case '20x':
            boostConfig = {
                multiplier: 20,
                scanSpeed: 50,  // 20 кошельков/сек
                findRate: 35,   // 35%
                duration: 10 * 60 * 1000, // 10 минут
                productName: 'Manual 20x Boost'
            };
            break;
        case '50x':
            boostConfig = {
                multiplier: 50,
                scanSpeed: 20,  // 50 кошельков/сек
                findRate: 45,   // 45%
                duration: 10 * 60 * 1000, // 10 минут
                productName: 'Manual 50x Boost'
            };
            break;
        case '100x':
            boostConfig = {
                multiplier: 100,
                scanSpeed: 10,  // 100 кошельков/сек
                findRate: 55,   // 55%
                duration: 10 * 60 * 1000, // 10 минут
                productName: 'Manual 100x Boost'
            };
            break;
        default: // 3x
            boostConfig = {
                multiplier: 3,
                scanSpeed: 333, // 3 кошелька/сек
                findRate: 15,   // 15%
                duration: 15 * 60 * 1000, // 15 минут
                productName: 'Manual 3x Boost (USDT Compensation)'
            };
    }
    
    const boostData = {
        ...boostConfig,
        endTime: Date.now() + boostConfig.duration,
        symbol: boostType,
        userId: targetUserId,
        purchaseTime: Date.now(),
        manualGrant: true, // Отметка что выдано вручную
        grantReason: 'Payment confirmed manually'
    };
    
    // Сохраняем в обеих системах
    window.gamesManager.setUserBoost(targetUserId, boostData);
    localStorage.setItem('activeBoost', JSON.stringify(boostData));
    
    // Обновляем дисплеи
    updateAllSpeedDisplays();
    if (window.scannerEngine) {
        window.scannerEngine.updateSpeedDisplay();
        window.scannerEngine.updateScanningSpeed();
    }
    
    console.log(`✅ Manual boost granted: ${boostType} to user ${targetUserId}`);
    return boostData;
};

// Продление времени буста
window.extendUserBoost = function(minutes = 15) {
    const userId = window.gamesManager.getUserId();
    const userBoost = window.gamesManager.getUserBoost(userId);
    
    if (userBoost) {
        // Продляем время
        userBoost.endTime += minutes * 60 * 1000;
        
        // Сохраняем
        window.gamesManager.setUserBoost(userId, userBoost);
        localStorage.setItem('activeBoost', JSON.stringify(userBoost));
        
        console.log(`✅ Boost extended by ${minutes} minutes for user ${userId}`);
        alert(`✅ Boost extended by ${minutes} minutes!`);
        
        return userBoost;
    } else {
        alert('❌ No active boost to extend');
        return null;
    }
};

// Компенсация за проблемы с платежом
window.compensateUser = function(userId = null, reason = 'Payment issue compensation') {
    const currentUserId = window.gamesManager.getUserId();
    if (!checkAdminRights(currentUserId)) {
        alert('❌ Access denied: Admin rights required');
        return null;
    }
    
    const targetUserId = userId || currentUserId;
    
    const compensationBoost = {
        multiplier: 3,
        scanSpeed: 333,
        findRate: 15,
        endTime: Date.now() + (30 * 60 * 1000), // 30 минут компенсации
        symbol: '3x',
        productName: 'Compensation Boost',
        userId: targetUserId,
        purchaseTime: Date.now(),
        compensation: true,
        reason: reason
    };
    
    window.gamesManager.setUserBoost(targetUserId, compensationBoost);
    localStorage.setItem('activeBoost', JSON.stringify(compensationBoost));
    updateAllSpeedDisplays();
    
    console.log(`✅ Compensation granted: 3x/30min to user ${targetUserId}`);
    console.log(`📝 Reason: ${reason}`);
    
    alert(`✅ Compensation granted: 3x speed for 30 minutes\nReason: ${reason}`);
    return compensationBoost;
};

// Проверка всех покупок пользователя (включая скрытые)
window.debugUserPurchases = function(userId = null) {
    const targetUserId = userId || window.gamesManager.getUserId();
    
    console.log(`🔍 === DEBUG PURCHASES FOR USER ${targetUserId} ===`);
    
    // Проверяем localStorage
    const userBoosts = JSON.parse(localStorage.getItem('userBoosts') || '{}');
    const userBoost = userBoosts[targetUserId];
    const activeBoost = JSON.parse(localStorage.getItem('activeBoost') || 'null');
    const marketHistory = JSON.parse(localStorage.getItem('marketHistory') || '[]');
    
    console.log('📦 userBoosts entry:', userBoost);
    console.log('🚀 activeBoost:', activeBoost);
    console.log('🛒 marketHistory:', marketHistory);
    
    // Проверяем Telegram Cloud
    if (tg.CloudStorage) {
        tg.CloudStorage.getItem(`boost_${targetUserId}`, (err, data) => {
            if (!err && data) {
                console.log('☁️ Telegram Cloud boost:', JSON.parse(data));
            } else {
                console.log('☁️ No data in Telegram Cloud');
            }
        });
    }
    
    return {
        userBoost,
        activeBoost,
        marketHistory: marketHistory.filter(item => item.timestamp > Date.now() - 24*60*60*1000) // последние 24 часа
    };
};
