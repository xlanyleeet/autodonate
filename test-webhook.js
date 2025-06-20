// Тестування Discord Webhook
// Запустіть цей файл для перевірки налаштування webhook

const webhookUrl = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";

async function testWebhook() {
    console.log("🔧 Тестування Discord Webhook...");
    
    if (webhookUrl === "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN") {
        console.log("❌ Помилка: Налаштуйте webhook URL в цьому файлі!");
        return;
    }

    const testEmbed = {
        title: "🧪 Тестове повідомлення",
        description: "Це тестове повідомлення для перевірки налаштування webhook",
        color: 0x00FF00, // Зелений колір
        fields: [
            {
                name: "✅ Статус",
                value: "Webhook працює коректно!",
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: "Тест з сайту автодонату"
        }
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [testEmbed]
            })
        });

        if (response.ok) {
            console.log("✅ Успіх! Webhook налаштований правильно.");
            console.log("📩 Перевірте ваш Discord канал - там повинно з'явитися тестове повідомлення.");
        } else {
            console.log(`❌ Помилка: ${response.status} ${response.statusText}`);
            console.log("🔍 Перевірте URL webhook та права доступу.");
        }
    } catch (error) {
        console.log("❌ Помилка мережі:", error.message);
    }
}

// Запускаємо тест
testWebhook();
