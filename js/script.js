// Основний JavaScript файл для сайту
// Конфігурація завантажується з config-frontend.js

// Перевірка на наявність конфігурації
if (typeof window.SITE_CONFIG === 'undefined') {
    console.error('Помилка: config-frontend.js не завантажено або SITE_CONFIG не визначено!');
}

const config = window.SITE_CONFIG;

// Елементи DOM
const navbar = document.querySelector(".navbar");
const navbarLinks = document.querySelector(".links");
const hamburger = document.querySelector(".hamburger");
const serverName = document.querySelector(".server-name");
const serverLogo = document.querySelector(".logo-img");
const serverIp = document.querySelector(".minecraft-server-ip");
const serverLogoHeader = document.querySelector(".logo-img-header");
const discordOnlineUsers = document.querySelector(".discord-online-users");
const minecraftOnlinePlayers = document.querySelector(".minecraft-online-players");
const contactForm = document.querySelector(".contact-form");

// Обробник меню гамбургера
if (hamburger) {
    hamburger.addEventListener("click", () => {
        navbar.classList.toggle("active");
        navbarLinks.classList.toggle("active");
    });
}

// Обробник FAQ аккордеону
const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");
accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener("click", () => {
        accordionItemHeader.classList.toggle("active");
        const accordionItemBody = accordionItemHeader.nextElementSibling;

        if(accordionItemHeader.classList.contains("active")) {
            accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
        } else {
            accordionItemBody.style.maxHeight = "0px";
        }
    });
});

// Функція отримання онлайн користувачів Discord
const getDiscordOnlineUsers = async () => {
    try {
        const discordServerId = config.serverInfo.discordServerID;
        const apiWidgetUrl = `https://discord.com/api/guilds/${discordServerId}/widget.json`;
        let response = await fetch(apiWidgetUrl);
        let data = await response.json();

        if(!data.presence_count) return "Жодного";
        else return (await data.presence_count);
    } catch (e) {
        return "Жодного";
    }
}

// Функція отримання онлайн гравців на Minecraft сервері
const getMinecraftOnlinePlayer = async () => {
    try {
        const serverIp = config.serverInfo.serverIp;
        const apiUrl = `https://api.mcsrvstat.us/2/${serverIp}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        return data.players.online;
    } catch (e) {
        console.log(e);
        return "Жодного";
    }
}

// Функція отримання UUID за ніком
const getUuidByUsername = async (username) => {
    try {
        const usernameToUuidApi = `https://api.minetools.eu/uuid/${username}`;
        let response = await fetch(usernameToUuidApi);
        let data = await response.json();

        return data.id;
    } catch (e) {
        console.log(e);
        return "Жодного";
    }
}

// Функція отримання скіна за UUID
const getSkinByUuid = async (username) => {
    try {
        const skinByUuidApi = `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/${await getUuidByUsername(username)}`;
        let response = await fetch(skinByUuidApi);

        if(response.status === 400) {
            return `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/ec561538f3fd461daff5086b22154bce`;
        } else {
            return skinByUuidApi;
        }
    } catch (e) {
        console.log(e);
        return "Жодного";
    }
}

// Функція копіювання IP (працює тільки якщо на сайті є HTTPS)
const copyIp = () => {
    const copyIpButton = document.querySelector(".copy-ip");
    const copyIpAlert = document.querySelector(".ip-copied");

    if (!copyIpButton || !copyIpAlert) return;

    copyIpButton.addEventListener("click", () => {
        try {
            navigator.clipboard.writeText(config.serverInfo.serverIp);
    
            copyIpAlert.classList.add("active");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
            }, 5000);
        } catch (e) {
            console.log(e);
            copyIpAlert.innerHTML = "Сталася помилка!";
            copyIpAlert.classList.add("active");
            copyIpAlert.classList.add("error");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
                copyIpAlert.classList.remove("error");
            }, 5000);
        }
    });
}

// Функція для відправки заявки через Discord webhook
const sendToDiscord = async (formData) => {
    const webhookUrl = config.contactPage.discordWebhook;
    
    if (!webhookUrl || webhookUrl === "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN") {
        throw new Error("Discord webhook не налаштований");
    }

    const embed = {
        title: "🎮 Нова заявка на сервер",
        color: 0xF0C75E, // Золотий колір
        fields: [
            {
                name: "🎯 Ігровий нікнейм",
                value: formData.get('name') || "Не вказано",
                inline: true
            },
            {
                name: "💬 Discord нікнейм",
                value: formData.get('discord-name') || "Не вказано",
                inline: true
            },
            {
                name: "📧 Електронна пошта",
                value: formData.get('email') || "Не вказано",
                inline: true
            },
            {
                name: "🎂 Вік",
                value: formData.get('age') || "Не вказано",
                inline: true
            },
            {
                name: "📝 Про себе",
                value: formData.get('message') || "Не вказано",
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: `Заявка з сайту ${config.serverInfo.serverName}`
        }
    };

    const payload = {
        embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Помилка відправки: ${response.status}`);
    }

    return true;
};

// Головна функція ініціалізації
const setDataFromConfigToHtml = async () => {
    // Базові елементи
    if (serverName) serverName.innerHTML = config.serverInfo.serverName;
    if (serverLogo) serverLogo.src = `images/` + config.serverInfo.serverLogoImageFileName;
    if (serverIp) serverIp.innerHTML = config.serverInfo.serverIp;

    let locationPathname = location.pathname;

    // Головна сторінка
    if(locationPathname == "/" || locationPathname.includes("index")) {
        copyIp();
        if (serverLogoHeader) serverLogoHeader.src = `images/` + config.serverInfo.serverLogoImageFileName;
        if (discordOnlineUsers) discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        if (minecraftOnlinePlayers) minecraftOnlinePlayers.innerHTML = await getMinecraftOnlinePlayer();
    } 
    // Сторінка правил
    else if(locationPathname.includes("rules")) {
        copyIp();
    }
    // Сторінка адмін команди
    else if(locationPathname.includes("admin-team")) {
        for (let team in config.adminTeamPage) {
            const atContent = document.querySelector(".at-content");
            if (!atContent) continue;
            
            const group = document.createElement("div");
            group.classList.add("group");
            group.classList.add(team);

            const groupSchema = `
                <h2 class="rank-title">${team.charAt(0).toUpperCase() + team.slice(1)}</h2>
                <div class="users">
                </div>
            `;

            group.innerHTML = groupSchema;
            atContent.appendChild(group);

            for (let j = 0; j < config.adminTeamPage[team].length; j++) {
                let user = config.adminTeamPage[team][j];
                const group = document.querySelector("." + team + " .users");

                const userDiv = document.createElement("div");
                userDiv.classList.add("user");

                let userSkin = config.adminTeamPage[team][j].skinUrlOrPathToFile;

                if(userSkin == "") userSkin = await getSkinByUuid(user.inGameName);
                let rankColor = config.atGroupsDefaultColors[team];

                if(user.rankColor != "") {
                    rankColor = user.rankColor;
                }

                const userDivSchema = `
                    <img src="${await (userSkin)}" alt="${user.inGameName}">
                    <h5 class="name">${user.inGameName}</h5>
                    <p class="rank ${team}" style="background: ${rankColor}">${user.rank}</p>  
                `;

                userDiv.innerHTML = userDivSchema;
                group.appendChild(userDiv);
            }
        }
    } 
    // Сторінка контактів
    else if(locationPathname.includes("contact")) {
        if (discordOnlineUsers) discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        
        // Додаємо обробник для форми
        if (contactForm) {
            contactForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                
                try {
                    // Показуємо індикатор завантаження
                    submitButton.innerHTML = 'Відправляється... <i class="fa-solid fa-spinner fa-spin"></i>';
                    submitButton.disabled = true;
                    
                    const formData = new FormData(contactForm);
                    await sendToDiscord(formData);
                    
                    // Успіх
                    submitButton.innerHTML = 'Відправлено! <i class="fa-solid fa-check"></i>';
                    submitButton.style.backgroundColor = '#4CAF50';
                    
                    // Очищаємо форму
                    contactForm.reset();
                    
                    // Повертаємо кнопку через 3 секунди
                    setTimeout(() => {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                    }, 3000);
                    
                } catch (error) {
                    console.error('Помилка відправки:', error);
                    
                    // Показуємо помилку
                    submitButton.innerHTML = 'Помилка! <i class="fa-solid fa-exclamation-triangle"></i>';
                    submitButton.style.backgroundColor = '#f44336';
                    
                    // Повертаємо кнопку через 3 секунди
                    setTimeout(() => {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                    }, 3000);
                }
            });
        }
    }
}

// Запускаємо ініціалізацію
setDataFromConfigToHtml();
