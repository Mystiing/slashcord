module.exports = (command, interaction) => {
	if (command.extras) {
	      if (command.extras.memberPerms) {
	        if (!interaction.member.permissions.has(command.extras.memberPerms)) {
				return "MemberPermissionsError"
	        //   return interaction.reply({
	        //     content: `Insufficient member perimissions \`${command.extras.memberPerms}\``,
	        //   });
	        }
	      }
	      if (command.extras.clientPerms) {
	        if (!interaction.guild.me.permissions.has(command.extras.clientPerms)) {
				return "ClientPermissionsError"
	        //   return interaction.reply({
	        //     content: `Insufficient client perimissions \`${command.extras.clientPerms}\``,
	        //   });
	        }
	      }
	    }
	}