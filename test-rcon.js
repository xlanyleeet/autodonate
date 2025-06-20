const rcon = require('rcon');

// Завантаження конфігурації
let config;
try {
    config = require('./config.js');
} catch (error) {
    console.error('❌ Файл config.js не знайдено! Скопіюйте config.example.js як config.js');
    process.exit(1);
}

console.log('🔧 Тестування RCON підключення...');
console.log(`📡 Сервер: ${config.minecraft.host}:${config.minecraft.port}`);

// Функція для тестування RCON
function testRcon() {
    return new Promise((resolve, reject) => {
        const conn = new rcon(config.minecraft.host, config.minecraft.port, config.minecraft.password);
        
        conn.on('auth', () => {
            console.log('✅ RCON авторизація успішна');
            conn.send('list');
        });
        
        conn.on('response', (str) => {
            console.log('📋 Відповідь сервера:', str);
            conn.disconnect();
            resolve(str);
        });
        
        conn.on('error', (err) => {
            console.error('❌ RCON помилка:', err.message);
            conn.disconnect();
            reject(err);
        });
        
        conn.on('end', () => {
            console.log('🔌 RCON з\'єднання закрито');
        });
        
        console.log('🔄 Підключення до RCON...');
        conn.connect();
    });
}

// Тестування команд
async function testCommands() {
    const testCommands = [
        'list',
        'version',
        'tps'
    ];
    
    for (const command of testCommands) {
        try {
            console.log(`\n🧪 Тестування команди: ${command}`);
            
            const result = await new Promise((resolve, reject) => {
                const conn = new rcon(config.minecraft.host, config.minecraft.port, config.minecraft.password);
                
                conn.on('auth', () => {
                    conn.send(command);
                });
                
                conn.on('response', (str) => {
                    conn.disconnect();
                    resolve(str);
                });
                
                conn.on('error', (err) => {
                    conn.disconnect();
                    reject(err);
                });
                
                conn.connect();
            });
            
            console.log(`✅ Результат: ${result}`);
        } catch (error) {
            console.error(`❌ Команда "${command}" не вдалась:`, error.message);
        }
    }
}

// Головна функція
async function main() {
    try {
        console.log('🚀 Початок тестування RCON...\n');
        
        // Базове тестування
        await testRcon();
        
        console.log('\n🔍 Тестування команд...');
        await testCommands();
        
        console.log('\n🎉 Тестування завершено успішно!');
        console.log('✅ RCON працює правильно');
        console.log('🚀 Можете запускати автодонат командою: npm start');
        
    } catch (error) {
        console.error('\n💥 Тестування не вдалось');
        console.error('Можливі причини:');
        console.error('1. Minecraft сервер не запущений');
        console.error('2. RCON не увімкненто в server.properties');
        console.error('3. Невірний пароль RCON');
        console.error('4. Невірний IP або порт');
        console.error('\nПеревірте налаштування в config.js');
        process.exit(1);
    }
}

// Запуск тестування
main();
