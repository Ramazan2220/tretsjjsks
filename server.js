const http = require('http');
const fs = require('fs');
const path = require('path');
const { basicTelegramCheck } = require('./security-middleware');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

// Простая реализация middleware для HTTP сервера
function applyMiddleware(req, res, middleware) {
    return new Promise((resolve) => {
        middleware(req, res, resolve);
    });
}

const server = http.createServer(async (req, res) => {
    // Применяем базовую Telegram проверку для главной страницы
    if (req.url === '/' || req.url === '/index.html') {
        try {
            await applyMiddleware(req, res, basicTelegramCheck);
        } catch (error) {
            // Если middleware вернул ответ, выходим
            return;
        }
    }
    
    // BSC API Proxy для обхода CORS
    if (req.url.startsWith('/api/bsc/')) {
        const address = req.url.split('/')[3];
        
        if (!address) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Address required' }));
            return;
        }
        
        try {
            const https = require('https');
            // Используем API ключ если доступен через переменную окружения
            const apiKey = process.env.BSC_API_KEY || '';
            const apiParam = apiKey ? `&apikey=${apiKey}` : '';
            const apiUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc${apiParam}`;
            
            console.log(`🔑 API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND'}`);
            console.log(`📡 Full URL: ${apiUrl}`);
            
            console.log(`🔍 BSC API Proxy request for: ${address}`);
            
            const apiReq = https.get(apiUrl, (apiRes) => {
                let data = '';
                
                apiRes.on('data', (chunk) => {
                    data += chunk;
                });
                
                apiRes.on('end', () => {
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(data);
                    console.log(`✅ BSC API response sent for ${address}`);
                });
            });
            
            apiReq.on('error', (error) => {
                console.error('BSC API error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'BSC API request failed' }));
            });
            
        } catch (error) {
            console.error('BSC Proxy error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
        
        return;
    }
    
    // Обычная обработка файлов
    let filePath = '.' + req.url;
    
    if (filePath === './') {
        filePath = './public/index.html';
    }
    
    // Проверяем, если запрашивается файл из корня, перенаправляем в public
    if (!filePath.includes('/public/') && !filePath.includes('/images/')) {
        if (filePath.endsWith('.html') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
            filePath = './public' + req.url;
        }
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Crypto Scanner Bot server running at http://localhost:${PORT}`);
    console.log(`📱 Open in browser to test the web version`);
    console.log(`🔧 Press Ctrl+C to stop the server`);
}); 