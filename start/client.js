// botClient.js (client init, presence update and login)
// This file creates the Discord client and logs it in. It exposes client as global.client
const {
    Client,
    GatewayIntentBits,
    ActivityType,
    EmbedBuilder,
    Partials
} = require("discord.js");
require("dotenv").config();
const zik = require("../setting/setting");
const log = require("../lib/logger.js");
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

client.once("ready", async () => {
    log.success(`✅ Bot ${client.user.tag} berhasil login!`);
    updateStatus();
    setInterval(updateStatus, 30000);
});

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

        log.info(`👀 Watching ${totalOnline}/${totalMembers} member online`);
    } catch (err) {
        log.error("⚠️ Gagal update status:", err.message);
    }
}

// login (this mirrors original behavior where client.login(botToken) was called at the end)
client.login(process.env.TOKEN);

module.exports = client;
