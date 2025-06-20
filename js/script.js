const config = {
    serverInfo: {
        serverLogoImageFileName: "logo.webp", /*Это имя файла логотипа в /images/ (Если вы загружаете новый логотип с другим именем, вам необходимо изменить это значение)*/
        serverName: "Градієнт", /*Имя сервера*/
        serverIp: "gg.gradient-mc.com", /*IP-адрес сервера (если вы хотите добавить счетчик пользователей онлайн, у вас должны быть true enable-status и enable-query в server.properties)*/
        discordServerID: "962998232751931402" /*Ваш идентификатор сервера (если вы хотите добавить счетчик пользователей онлайн, у вас должен быть включен виджет сервера Discord)*/
    },

    /*Admin-Team
    ------------
    Если вы хотите создать новую группу, вам необходимо добавить эту структуру в adminTeamPage:
    <nameOfGroup>: [
        {
            inGameName: "Astronavta",
            rank: "Owner",
            skinUrlOrPathToFile: "",
            rankColor: ""
        },
    ]
    затем вы должны добавить эту группу с тем же именем в atGroupsDefaultColors и задать нужный вам цвет для группы.
    Вы также можете задать специальный цвет для конкретного пользователя, просто поместив его в rankColor этого пользователя.

    Все скины для оригинальных плееров генерируются автоматически. Если вы хотите добавить скины для варезных плееров, вы должны добавить url для скина в skin UrlOrPathToFile
        {
            inGameName: "Astronavta",  <--- Имя в игре
            rank: "Owner",  <-- ранг
            skinUrlOrPathToFile: "",  <-- URL-адрес или путь к файлу изображения скина для игроков warez (если у вас оригинальный minecraft, оставьте его пустым)
            rankColor: "rgba(255, 3, 3, 1)"  <-- цвет звания
        },

    Если вы хотите изменить тип скина, замените userSKinTypeInAdminTeam на то, что вам нужно, из массива в комментариях.
    */
    userSKinTypeInAdminTeam: "bust", /*[full, bust, head, face, front, frontFull, skin]*/
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
    },

    /*
    Заявка на сервер
    ------------
    Для активации вам необходимо отправить первое письмо через контактную форму и подтвердить его в письме.
    Письма отправляются через   https://formsubmit.co/
    */
    contactPage: {
        email: "support@gradient-mc.com"
    }
}










/*Если вы хотите, чтобы все работало как надо, и не понимаете, что здесь написано, не трогайте это :D*/


const navbar = document.querySelector(".navbar");
const navbarLinks = document.querySelector(".links");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
    navbarLinks.classList.toggle("active");
})

const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener("click", () => {
        accordionItemHeader.classList.toggle("active");
        const accordionItemBody = accordionItemHeader.nextElementSibling;

        if(accordionItemHeader.classList.contains("active")) accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
        else accordionItemBody.style.maxHeight = "0px";
    });
});

const serverName = document.querySelector(".server-name");
const serverLogo = document.querySelector(".logo-img");
const serverIp = document.querySelector(".minecraft-server-ip");
const serverLogoHeader = document.querySelector(".logo-img-header");
const discordOnlineUsers = document.querySelector(".discord-online-users");
const minecraftOnlinePlayers = document.querySelector(".minecraft-online-players");
const contactForm = document.querySelector(".contact-form");
const inputWithLocationAfterSubmit = document.querySelector(".location-after-submit");

const getDiscordOnlineUsers = async () => {
    try {
        const discordServerId = config.serverInfo.discordServerID;

        const apiWidgetUrl = `https://discord.com/api/guilds/${discordServerId}/widget.json`;
        let response = await fetch(apiWidgetUrl);
        let data = await response.json();

        if(!data.presence_count) return "Ни одного";
        else return (await data.presence_count);
    } catch (e) {
        return "Ни одного";
    }
}

const getMinecraftOnlinePlayer = async () => {
    try {
        const serverIp = config.serverInfo.serverIp;

        const apiUrl = `https://api.mcsrvstat.us/2/${serverIp}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        return data.players.online;
    } catch (e) {
        console.log(e);
        return "Ни одного";
    }
}

const getUuidByUsername = async (username) => {
    try {
        const usernameToUuidApi = `https://api.minetools.eu/uuid/${username}`;
        let response = await fetch(usernameToUuidApi);
        let data = await response.json();

        return data.id;
    } catch (e) {
        console.log(e);
        return "Ни одного";
    }
}

const getSkinByUuid = async (username) => {
    try {
        const skinByUuidApi = `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/${await getUuidByUsername(username)}`;
        let response = await fetch(skinByUuidApi);

        if(response.status === 400) return `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/ec561538f3fd461daff5086b22154bce`;
        else return skinByUuidApi;
    } catch (e) {
        console.log(e);
        return "Ни одного";
    }
}

/*Копирование IP работает только если на вашем сайте есть HTTPS*/
const copyIp = () => {
    const copyIpButton = document.querySelector(".copy-ip");
    const copyIpAlert = document.querySelector(".ip-copied");

    copyIpButton.addEventListener("click", () => {
        try {
            navigator.clipboard.writeText(config.serverInfo.serverIp);
    
            copyIpAlert.classList.add("active");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
            }, 5000);
        } catch (e) {
            console.log(e);
            copyIpAlert.innerHTML = "An error has occurred!";
            copyIpAlert.classList.add("active");
            copyIpAlert.classList.add("error");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
                copyIpAlert.classList.remove("error");
            }, 5000);
        }
    })
}

const setDataFromConfigToHtml = async () => {
    serverName.innerHTML = config.serverInfo.serverName;
    serverLogo.src = `images/` + config.serverInfo.serverLogoImageFileName;
    serverIp.innerHTML = config.serverInfo.serverIp;

    let locationPathname = location.pathname;

    if(locationPathname == "/" || locationPathname.includes("index")) {
        copyIp();
        serverLogoHeader.src = `images/` + config.serverInfo.serverLogoImageFileName;
        discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        minecraftOnlinePlayers.innerHTML = await getMinecraftOnlinePlayer();
    } else if(locationPathname.includes("rules")) {
        copyIp();
    }
    else if(locationPathname.includes("admin-team")) {
        for (let team in config.adminTeamPage) {
            const atContent = document.querySelector(".at-content");
            
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
    } else if(locationPathname.includes("contact")) {
        contactForm.action = `https://formsubmit.co/${config.contactPage.email}`;
        discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        inputWithLocationAfterSubmit.value = location.href;
    }
}

setDataFromConfigToHtml();
