const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { embed } = require("../lib/embed.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("Tambah role ke member")
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

        if (!member)
            return interaction.reply({
                content: "Member ga ketemu.",
                ephemeral: true
            });

        const roles = [];

        for (let i = 1; i <= 5; i++) {
            const role = interaction.options.getRole(`role${i}`);
            if (role) roles.push(role);
        }

        const roleMentions = roles.map(role => role.toString()).join(", ");

        try {
            await member.roles.add(roles);

            await interaction.reply({
                embeds: [
                    embed({
                        color: "#38ff16",
                        title: "Role Added",
                        description: `${member} Successfully given a role.`,
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
