// Конфігурація автодонату
// Скопіюйте цей файл як config.js та налаштуйте під ваш сервер

module.exports = {
    // Налаштування Minecraft сервера
    minecraft: {
        host: 'localhost',          // IP адреса вашого сервера
        port: 25575,               // RCON порт (зазвичай 25575)
        password: 'change_me'      // RCON пароль з server.properties
    },
    
    // Налаштування веб-сервера
    server: {
        port: 3000,               // Порт для веб-сервера
        name: 'Градієнт'          // Назва вашого сервера
    },

    // Налаштування Discord webhook для заявок
    discord: {
        webhook: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN'
        // Щоб створити webhook:
        // 1. Перейдіть в налаштування каналу Discord
        // 2. Перейдіть на вкладку "Інтеграції"
        // 3. Натисніть "Створити Webhook"
        // 4. Скопіюйте URL webhook та вставте тут
    }
};
