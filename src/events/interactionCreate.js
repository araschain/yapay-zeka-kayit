const { Events, ModalBuilder, ButtonBuilder, ButtonStyle, codeBlock, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { düzgünİsim } = require("../Utils");

const db = require("croxydb");
const fs = require("fs");

let isimler = require("../isimler.json");
module.exports = {
  name: Events.InteractionCreate,
  once: false,
  
  async execute(client, interaction) {
    if(interaction.isChatInputCommand()) {
		if (!interaction.guild) return;

	for(let props of fs.readdirSync("./src/commands")) {
			const command = require(`../commands/${props}`);

			if(interaction.commandName.toLowerCase() === command.name.toLowerCase()) {

        		return command.execute(client, interaction);

        }
		  }	
	  }
    
    if(interaction.isButton()) {
      if(interaction.customId === 'kayitOl_'+interaction.user.id) {
        
        const modal = new ModalBuilder()
        .setCustomId('kayitOl')
        .setTitle('Kayıt Olma aşaması');

	  	const isim = new TextInputBuilder()
			.setCustomId('isim')
			.setLabel("Gerçek isminiz nedir?")
			.setStyle(TextInputStyle.Short);

		const yas = new TextInputBuilder()
			.setCustomId('yas')
			.setLabel("Gerçek yaşınız nedir?")
			.setStyle(TextInputStyle.Short);

		
      const firstActionRow = new ActionRowBuilder().addComponents(isim);
      const secondActionRow = new ActionRowBuilder().addComponents(yas);


      modal.addComponents(firstActionRow, secondActionRow);


      await interaction.showModal(modal);
      }
    }
    
    if(interaction.isModalSubmit()) {
      if (interaction.customId === 'kayitOl') {
         const isim = interaction.fields.getTextInputValue('isim');
         const yas = interaction.fields.getTextInputValue('yas');
        
        const kayitSistemi = db.fetch(`kayitSistemi_${interaction.guild.id}`);
        
        if(kayitSistemi) {
           const channel = interaction.guild.channels.cache.get(kayitSistemi.channel);
           const log = interaction.guild.channels.cache.get(kayitSistemi.log);
           const erkekRol = interaction.guild.roles.cache.get(kayitSistemi.erkekRol);
           const kızRol = interaction.guild.roles.cache.get(kayitSistemi.kızRol);
          
          if(channel && log && erkekRol && kızRol) {
            let yeniIsım = düzgünİsim(isim).yeniIsım;
            let cinsiyet = isimler.find((c) => c.name.toLowerCase() === isim.split(" ")[0].toLowerCase());
            
            console.log(isim.split(" ")[0].toLowerCase())
            
            if(cinsiyet && cinsiyet.sex === "E") {
              interaction.member.roles.add(erkekRol.id)
            } else if(cinsiyet && cinsiyet.sex === "K") {
              interaction.member.roles.add(kızRol.id)
            } else if(cinsiyet && cinsiyet.sex === "U") {
              interaction.member.roles.add(erkekRol.id)
            } else {
              interaction.member.roles.add(erkekRol.id)
            }
            
            interaction.member.setNickname(`${yeniIsım} | ${yas}`) 
            
            db.set(`isim_${interaction.member.id}`, {
              isim: yeniIsım,
              yas: yas
            });
            
            log.send({
              embeds: [
                 new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setTitle("🦴 Bir kullanıcı kayıt oldu")
                .setDescription("> Az önce bir kullanıcı sunucuya giriş yapıp kayıt oldu.")
                .addFields([
                  {
                    name: "Kayıt olan;",
                    value: `${codeBlock("yaml", interaction.user.tag)}`,
                    inline: true
                  },
                  {
                    name: "Gerçek isim;",
                    value: `${codeBlock("yaml", yeniIsım)}`,
                    inline: true
                  },
                  {
                    name: "Gerçek yaş;",
                    value: `${codeBlock("yaml", yas)}`,
                    inline: true
                  }
                ])
                .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
                .setTimestamp()
              ]
            })
            
            interaction.message.edit({
              embeds: [
                new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setTitle("✅ Sunucuya hoşgeldiniz!")
                .setDescription("> Artık sunucumuzda sohbet edebilir, etkinliklere katılabilirsiniz.")
                .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
                .setTimestamp()
            ],
              components: [
            new ActionRowBuilder().addComponents(
               new ButtonBuilder()
                .setCustomId('kayitOl_'+interaction.user.id)
                .setLabel('Formu doldur')
                .setEmoji("🖋")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            )
          ]
            });
            interaction.reply({ content: `✅ **|** Sunucuya hoşgeldiniz sayın **${yeniIsım}**!`, ephemeral: true })
          }
        }
	    }
    }
  }
}