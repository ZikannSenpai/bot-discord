const chalk = require("chalk");
const gradient = require("gradient-string");
const figlet = require("figlet");

// Palet warna gen z
const colors = {
    primary: chalk.hex("#5865F2"), // biru discord
    success: chalk.hex("#57F287"), // hijau
    warning: chalk.hex("#FEE75C"), // kuning
    error: chalk.hex("#ED4245"), // merah
    info: chalk.hex("#00D4FF"), // cyan
    text: chalk.white,
    dim: chalk.gray,
    tag: chalk.hex("#EB459E") // pink
};

const icons = {
    ok: colors.success("✓"),
    no: colors.error("✗"),
    wn: colors.warning("⚠︎"),
    info: colors.info("i"),
    msg: colors.primary("🗯️"),
    user: colors.tag("👤"),
    guild: colors.primary("🜲"),
    cmd: colors.info("</>")
};

function timestamp() {
    return colors.dim(`[${new Date().toLocaleTimeString("id-ID")}]`);
}

function pad(label, n = 12) {
    return colors.dim(label.padEnd(n));
}

const logger = {
    info: (detail = "", label = "[INFO]") =>
        console.log(
            `${timestamp()} ${icons.info} ${pad(label)} ${colors.text(detail)}`
        ),

    success: (detail = "", label = "[SUCCESS]") =>
        console.log(
            `${timestamp()} ${icons.ok} ${pad(label)} ${colors.success(detail)}`
        ),

    warn: (detail = "", label = "[WARN]") =>
        console.log(
            `${timestamp()} ${icons.wn} ${pad(label)} ${colors.warning(detail)}`
        ),

    error: (detail = "", label = "[ERR]") =>
        console.log(
            `${timestamp()} ${icons.no} ${pad(label)} ${colors.error(detail)}`
        ),

    debug: (detail = "", label = "[DEBUG]") =>
        console.log(
            `${timestamp()} ${colors.dim("·")} ${pad(label)} ${colors.dim(detail)}`
        )
};

// Log khusus message discord
function message(message) {
    if (message.author.bot) return; // skip bot

    const isGuild = !message.guild ? false : true;
    const guildName = message.guild?.name || "DM";
    const channelName = message.channel.name || "DM";
    const username = message.author.username;
    const userTag = message.author.tag;
    const content =
        message.content.slice(0, 80) +
        (message.content.length > 80 ? "..." : "");

    const location = isGuild
        ? `${colors.primary(guildName)} ${colors.dim(">")} ${colors.tag(`#${channelName}`)}`
        : colors.dim("Private DM");

    console.log("");
    console.log(`${colors.dim("╭─〔")} ${location} ${colors.dim("〕")}`);
    console.log(
        `${colors.dim("│")} ${icons.user} User: ${colors.text(username)} ${colors.dim(`(${userTag})`)}`
    );
    console.log(
        `${colors.dim("│")} ${icons.msg} Message: ${colors.text(content)}`
    );
    console.log(`${colors.dim("╰─")}`);
}

// Log command
function command(interaction) {
    console.log(
        `${timestamp()} ${icons.cmd} ${pad("COMMAND")} ${colors.info(`/${interaction.commandName}`)} by ${colors.text(interaction.user.tag)}`
    );
}

// Banner pas bot nyala
function banner(botName = "DISCORD BOT") {
    // console.clear();
    const ascii = figlet.textSync(botName, { font: "Standard" });
    console.log(gradient(["#5865F2", "#EB459E"])(ascii));
    console.log(
        colors.dim(`  Started at ${new Date().toLocaleString("id-ID")}\n`)
    );
}

function connection(status) {
    const statusText =
        status === "ready"
            ? colors.success("● Online")
            : colors.error("○ Offline");
    console.log(`${timestamp()} ${statusText}`);
}

module.exports = {
    logger,
    message,
    command,
    banner,
    connection,
    colors
};
