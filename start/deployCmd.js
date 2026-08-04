require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const commands = [];

const slashPath = path.join(__dirname, "../slash");
const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith(".js"));

for (const file of slashFiles) {
    const command = require(path.join(slashPath, file));

    if (!command.data) continue;

    commands.push(command.data.toJSON());
    console.log(`Loaded: ${command.data.name}`);
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Deploying ${commands.length} command...`);

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("✅ Slash command berhasil di deploy.");
    } catch (err) {
        console.error(err);
    }
})();
