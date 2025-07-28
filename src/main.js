const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const bitcoin = require('bitcoinjs-lib');
const ethers = require('ethers');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile(path.join(__dirname, '../public/index.html'));
}

// Обработчик генерации кошельков
ipcMain.handle('generate-wallet', async (event, crypto) => {
    console.log(`Запрос на генерацию кошелька для ${crypto}`);

    try {
        switch(crypto.toUpperCase()) {
            case 'BTC':
                return generateBTCWallet();
            case 'ETH':
                return generateETHWallet();
            // Добавьте другие криптовалюты здесь
            default:
                throw new Error(`Неподдерживаемая криптовалюта: ${crypto}`);
        }
    } catch (error) {
        console.error(`Ошибка при генерации кошелька для ${crypto}:`, error);
        throw error;
    }
});

function generateBTCWallet() {
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return { 
        address,
        privateKey: keyPair.toWIF()
    };
}

function generateETHWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});