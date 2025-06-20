const express = require('express');
const rcon = require('rcon');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Завантаження конфігурації
let config;
try {
    config = require('./config.js');
} catch (error) {
    console.error('❌ Файл config.js не знайдено! Скопіюйте config.example.js як config.js');
    process.exit(1);
}

const PORT = config.server.port || 3000;

// Продукти
const products = {
    // Підписки
    'vip': {
        name: 'VIP',
        price: 99,
        commands: [
            'lp user {player} parent add vip',
            'give {player} minecraft:diamond 5',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Дякуємо за покупку VIP статусу!","color":"green"}]'
        ]
    },
    'premium': {
        name: 'Premium',
        price: 199,
        commands: [
            'lp user {player} parent add premium',
            'give {player} minecraft:diamond 10',
            'give {player} minecraft:emerald 5',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Дякуємо за покупку Premium статусу!","color":"green"}]'
        ]
    },
    'elite': {
        name: 'Elite', 
        price: 299,
        commands: [
            'lp user {player} parent add elite',
            'give {player} minecraft:diamond 20',
            'give {player} minecraft:emerald 10',
            'give {player} minecraft:netherite_ingot 1',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Дякуємо за покупку Elite статусу!","color":"green"}]'
        ]
    },
    
    // Монети
    'coins-100': {
        name: '100 Монет',
        price: 25,
        commands: [
            'eco give {player} 100',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам нараховано 100 монет!","color":"green"}]'
        ]
    },
    'coins-500': {
        name: '500 Монет',
        price: 100,
        commands: [
            'eco give {player} 550',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам нараховано 550 монет (+50 бонус)!","color":"green"}]'
        ]
    },
    'coins-1000': {
        name: '1000 Монет',
        price: 180,
        commands: [
            'eco give {player} 1200',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам нараховано 1200 монет (+200 бонус)!","color":"green"}]'
        ]
    },
    'coins-2500': {
        name: '2500 Монет',
        price: 400,
        commands: [
            'eco give {player} 3000',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам нараховано 3000 монет (+500 бонус)!","color":"green"}]'
        ]
    },
    
    // Косметика
    'trails': {
        name: 'Trails Pack',
        price: 50,
        commands: [
            'give {player} minecraft:firework_rocket 10',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам видано Trails Pack!","color":"green"}]'
        ]
    },
    'cages': {
        name: 'Cages Pack',
        price: 75,
        commands: [
            'give {player} minecraft:glass 64',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам видано Cages Pack!","color":"green"}]'
        ]
    },
    'kill-effects': {
        name: 'Kill Effects',
        price: 60,
        commands: [
            'give {player} minecraft:tnt 10',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам видано Kill Effects!","color":"green"}]'
        ]
    },
    'cosmetics-bundle': {
        name: 'Cosmetics Bundle',
        price: 150,
        commands: [
            'give {player} minecraft:firework_rocket 10',
            'give {player} minecraft:glass 64',
            'give {player} minecraft:tnt 10',
            'tellraw {player} ["",{"text":"[Автодонат] ","color":"gold","bold":true},{"text":"Вам видано весь Cosmetics Bundle!","color":"green"}]'
        ]
    }
};

// Функція для логування
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    
    // Зберігаємо в файл
    fs.appendFileSync('autodonate.log', logMessage);
}

// Функція для валідації нікнейму Minecraft
function validateMinecraftNickname(nickname) {
    const regex = /^[a-zA-Z0-9_]{3,16}$/;
    return regex.test(nickname);
}

// Функція для відправки RCON команди
async function sendRconCommand(command) {
    return new Promise((resolve, reject) => {
        const conn = new rcon(config.minecraft.host, config.minecraft.port, config.minecraft.password);
        
        conn.on('auth', () => {
            conn.send(command);
        });
        
        conn.on('response', (str) => {
            log(`RCON Response: ${str}`);
            conn.disconnect();
            resolve(str);
        });
        
        conn.on('error', (err) => {
            log(`RCON Error: ${err.message}`);
            conn.disconnect();
            reject(err);
        });
        
        conn.connect();
    });
}

// Функція для виконання команд для гравця
async function executeProductCommands(nickname, productId) {
    const product = products[productId];
    if (!product) {
        throw new Error('Продукт не знайдено');
    }
    
    const results = [];
    
    for (const command of product.commands) {
        const finalCommand = command.replace(/{player}/g, nickname);
        
        try {
            const result = await sendRconCommand(finalCommand);
            results.push({ command: finalCommand, success: true, result });
            log(`Command executed: ${finalCommand}`);
        } catch (error) {
            results.push({ command: finalCommand, success: false, error: error.message });
            log(`Command failed: ${finalCommand} - ${error.message}`);
        }
    }
    
    return results;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API маршрути

// Отримання списку продуктів
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        products: products
    });
});

// Тестова покупка (без реальної оплати)
app.post('/api/purchase', async (req, res) => {
    try {
        const { nickname, email, product: productId } = req.body;
        
        // Валідація
        if (!nickname || !email || !productId) {
            return res.status(400).json({
                success: false,
                message: 'Всі поля обов\'язкові'
            });
        }
        
        if (!validateMinecraftNickname(nickname)) {
            return res.status(400).json({
                success: false,
                message: 'Невірний нікнейм Minecraft'
            });
        }
        
        if (!products[productId]) {
            return res.status(400).json({
                success: false,
                message: 'Продукт не знайдено'
            });
        }
        
        // Логуємо покупку
        log(`Purchase attempt: ${nickname} - ${products[productId].name} - ${email}`);
        
        // Виконуємо команди
        const commandResults = await executeProductCommands(nickname, productId);
        
        const successfulCommands = commandResults.filter(r => r.success).length;
        
        log(`Purchase completed: ${nickname} - ${successfulCommands}/${commandResults.length} commands executed`);
        
        res.json({
            success: true,
            message: 'Покупка успішно завершена!',
            transactionId: `TXN${Date.now()}`,
            commandsExecuted: successfulCommands,
            totalCommands: commandResults.length,
            details: commandResults
        });
        
    } catch (error) {
        log(`Purchase error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Помилка при обробці покупки: ' + error.message
        });
    }
});

// Перевірка статусу сервера
app.get('/api/status', async (req, res) => {
    try {
        await sendRconCommand('list');
        res.json({
            success: true,
            status: 'online',
            message: 'Сервер доступний'
        });
    } catch (error) {
        res.json({
            success: false,
            status: 'offline',
            message: 'Сервер недоступний'
        });
    }
});

// Тестова команда
app.post('/api/test-command', async (req, res) => {
    try {
        const { command } = req.body;
        if (!command) {
            return res.status(400).json({
                success: false,
                message: 'Команда не вказана'
            });
        }
        
        const result = await sendRconCommand(command);
        
        res.json({
            success: true,
            result: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Статичні файли (HTML, CSS, JS, images)
app.use(express.static('.'));

// Головна сторінка автодонату
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'autodonate.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    log(`Autodonate server started on port ${PORT}`);
    console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
    console.log(`📁 Відкрийте http://localhost:${PORT} у браузері`);
    console.log(`🎮 Запуск автодонату для сервера: ${config.server.name}`);
    console.log(`🔧 Minecraft сервер: ${config.minecraft.host}:${config.minecraft.port}`);
});

// Обробка помилок
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection: ${reason}`);
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
