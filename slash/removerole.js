const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { embed } = require("../lib/embed.js");
require("../setting/setting");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removerole")
        .setDescription("Hapus role dari member")
        .addUserOption(o =>
            o.setName("member").setDescription("Member").setRequired(true)
        )
        .addRoleOption(o =>
            o.setName("role1").setDescription("Role 1").setRequired(true)
        )
        .addRoleOption(o => o.setName("role2").setDescription("Role 2"))
        .addRoleOption(o => o.setName("role3").setDescription("Role 3"))
        .addRoleOption(o => o.setName("role4").setDescription("Role 4"))
        .addRoleOption(o => o.setName("role5").setDescription("Role 5"))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const member = interaction.options.getMember("member");

        if (
            !interaction.member.roles.cache.some(r =>
                zik.ownerRoles.includes(r.id)
            )
        ) {
            return interaction.reply({
                content: "This command can only be used by the owner.",
                ephemeral: true
            });
        }

        if (!member)
            return interaction.reply({
                content: "Member not found.",
                ephemeral: true
            });

        const roles = [];

        for (let i = 1; i <= 5; i++) {
            const role = interaction.options.getRole(`role${i}`);
            if (role) roles.push(role);
        }

        const roleMentions = roles.map(role => role.toString()).join(", ");
        try {
            await member.roles.remove(roles);

            await interaction.reply({
                embeds: [
                    embed({
                        color: "#ff1c1c",
                        title: "Role Removed",
                        description: `${member} Successfully deleted role.`,
                        fields: [
                            {
                                name: "Role",
                                value: roleMentions
                            },
                            {
                                name: "Moderator",
                                value: `${interaction.user}`
                            }
                        ],
                        footer: {
                            text: interaction.guild.name,
                            iconURL: interaction.guild.iconURL()
                        }
                    })
                ]
            });
        } catch (e) {
            interaction.reply({
                content: `❌ ${e.message}`,
                ephemeral: true
            });
        }
    }
};
