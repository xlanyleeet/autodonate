// Приклад конфігурації для фронтенду
// Скопіюйте цей файл як config-frontend.js та налаштуйте під ваш сервер

window.SITE_CONFIG = {
    serverInfo: {
        serverLogoImageFileName: "logo.webp", // Це ім'я файлу логотипу в /images/
        serverName: "Градієнт", // Ім'я сервера
        serverIp: "gg.gradient-mc.com", // IP-адреса сервера
        discordServerID: "962998232751931402" // Ваш ідентифікатор Discord сервера
    },

    // Налаштування Discord webhook для заявок
    contactPage: {
        discordWebhook: "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"
        // Інструкція:
        // 1. Перейдіть в налаштування каналу Discord
        // 2. Перейдіть на вкладку "Інтеграції" 
        // 3. Натисніть "Створити Webhook"
        // 4. Скопіюйте URL webhook та замініть значення вище
    },

    // Налаштування адмін команди
    userSKinTypeInAdminTeam: "bust", // [full, bust, head, face, front, frontFull, skin]
    atGroupsDefaultColors: {
        адміністратори: "rgba(255, 124, 124, 0.5)",
        білдери: "rgba(230, 83, 0, 0.5)",
    },
    adminTeamPage: {
        адміністратори: [
            {
                inGameName: "xlanyleeet",
                rank: "Власник",
                skinUrlOrPathToFile: "",
                rankColor: "#FFA500"
            },
            {
                inGameName: "ookori",
                rank: "Замісник",
                skinUrlOrPathToFile: "",
                rankColor: "rgba(255, 85, 85, 1)"
            }
        ],
        білдери: [
            {
                inGameName: "Alex",
                rank: "Мапмейкер",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ]
    }
};
