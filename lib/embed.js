const { EmbedBuilder } = require("discord.js");

function embed(options = {}) {
    return new EmbedBuilder()
        .setColor(options.color ?? "#5865F2")
        .setTitle(options.title ?? null)
        .setURL(options.url ?? null)
        .setAuthor(options.author ?? null)
        .setDescription(options.description ?? null)
        .setThumbnail(options.thumbnail ?? null)
        .addFields(...(options.fields ?? []))
        .setImage(options.image ?? null)
        .setFooter(options.footer ?? null)
        .setTimestamp(options.timestamp === false ? null : new Date());
}

module.exports = { embed };
