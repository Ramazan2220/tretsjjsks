const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

console.log('🔒 Starting code obfuscation...');

// Настройки обфускации
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Обфускация renderer.js
const rendererPath = path.join(__dirname, '../public/renderer.js');
const rendererCode = fs.readFileSync(rendererPath, 'utf8');

console.log('🔄 Obfuscating renderer.js...');
const obfuscatedRenderer = JavaScriptObfuscator.obfuscate(rendererCode, obfuscationOptions);

// Сохраняем обфускированный код
fs.writeFileSync(
    path.join(__dirname, '../public/renderer.min.js'),
    obfuscatedRenderer.getObfuscatedCode()
);

// Создаем production версию HTML
const indexPath = path.join(__dirname, '../public/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Заменяем ссылку на обфускированный скрипт
indexContent = indexContent.replace(
    '<script src="renderer.js"></script>',
    '<script src="renderer.min.js"></script>'
);

fs.writeFileSync(
    path.join(__dirname, '../public/index.prod.html'),
    indexContent
);

console.log('✅ Obfuscation completed!');
console.log('📁 Files created:');
console.log('   - public/renderer.min.js (obfuscated)');
console.log('   - public/index.prod.html (production)'); 