// botClient.js (client init, presence update and login)
// This file creates the Discord client and logs it in. It exposes client as global.client
const {
    Client,
    Collection,
    GatewayIntentBits,
    ActivityType,
    EmbedBuilder,
    Partials
} = require("discord.js");
require("dotenv").config();
const zik = require("../setting/setting");
const log = require("../lib/logger.js");
const fs = require("fs");
const path = require("path");
// note: index.js requires setting.js before requiring this module
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.ThreadMember
    ]
});

// expose client globally for event modules that use `client`
client.commands = new Collection();
global.client = client;

client.once("clientReady", async () => {
    log.banner("Zikk-AI");
    log.connection("ready");
    log.logger.success(`✅ Bot ${client.user.tag} berhasil login!`);
    updateStatus();
    setInterval(updateStatus, 120000);
});

const files = fs.readdirSync(path.join(__dirname, "../slash"));

for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const command = require(path.join(__dirname, "../slash", file));

    if (!command.data || !command.execute) {
        log.logger.warn(`[SKIP] ${file} bukan slash command.`);
        continue;
    }

    client.commands.set(command.data.name, command);
    log.logger.success(`[CMD] ${command.data.name}`);
}

// === UPDATE STATUS ===
async function updateStatus() {
    try {
        let totalOnline = 0;
        let totalMembers = 0;

        for (const [id, guild] of client.guilds.cache) {
            await guild.members.fetch();
            const online = guild.members.cache.filter(
                m => m.presence && m.presence.status !== "offline"
            ).size;
            totalOnline += online;
            totalMembers += guild.memberCount;
        }

        await client.user.setPresence({
            activities: [
                {
                    name: `@ZikkSenpai || Watching ${totalOnline}/${totalMembers} Member Online`,
                    type: ActivityType.Listening
                }
            ],
            status: "online"
        });

        log.logger.info(
            `👀 Watching${totalOnline}/${totalMembers} member online`
        );
    } catch (err) {
        log.logger.error("[ERR]", "⚠️ Gagal update status:", err.message);
    }
}

client.on("messageCreate", message => {
    log.message(message);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);

        interaction.reply({
            content: "Terjadi error.",
            ephemeral: true
        });
    }
});
// login (this mirrors original behavior where client.login(botToken) was called at the end)
client.login(process.env.TOKEN);

module.exports = client;
