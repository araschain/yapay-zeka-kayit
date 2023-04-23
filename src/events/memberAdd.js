const db = require("croxydb");
const { Events, codeBlock, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
let isimler = require("../isimler.json");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false, 
  
  async execute(client, member) {
    const kayitSistemi = db.fetch(`kayitSistemi_${member.guild.id}`);
    const withMember = db.fetch(`isim_${member.id}`);
    
    if(kayitSistemi) {
       const channel = member.guild.channels.cache.get(kayitSistemi.channel);
        const log = member.guild.channels.cache.get(kayitSistemi.log);
        const erkekRol = member.guild.roles.cache.get(kayitSistemi.erkekRol);
        const kızRol = member.guild.roles.cache.get(kayitSistemi.kızRol);
      
      if(withMember) {
        console.log(withMember)

        channel.send({
          embeds: [
            new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setTitle("👋 Merhaba değerli kullanıcı")
            .setDescription("> Sunucumuza giriş yapmak için aşağıdaki formu doldurmanız gerekiyordu ama zaten isim ve yaş bilgileriniz hafızamda kayıtlı olduğu için otomatik olarak sizi kayıt ettim.")
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp()
          ],
          components: [
            new ActionRowBuilder().addComponents(
               new ButtonBuilder()
                .setCustomId('kayitOl_'+member.user.id)
                .setLabel('Formu doldur')
                .setEmoji("🖋")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            )
          ]
        });
        
        
        let cinsiyet = isimler.find((c) => c.name.toLowerCase() === withMember.isim.toLowerCase());
            
            if(cinsiyet && cinsiyet.sex === "E") {
             member.roles.add(erkekRol.id)
            } else if(cinsiyet && cinsiyet.sex === "K") {
              member.roles.add(kızRol.id)
            } else if(cinsiyet && cinsiyet.sex === "U") {
              member.roles.add(erkekRol.id)
            } else {
              member.roles.add(erkekRol.id)
            }
            
            member.setNickname(`${withMember.isim} | ${withMember.yas}`)
        
        
        log.send({
              embeds: [
                 new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
                .setTitle("🦴 Bir kullanıcı kayıt oldu")
                .setDescription("> Az önce bir kullanıcı sunucuya giriş yapıp kayıt oldu.")
                .addFields([
                  {
                    name: "Kayıt olan;",
                    value: `${codeBlock("yaml", member.user.tag)}`,
                    inline: true
                  },
                  {
                    name: "Gerçek isim;",
                    value: `${codeBlock("yaml", withMember.isim)}`,
                    inline: true
                  },
                  {
                    name: "Gerçek yaş;",
                    value: `${codeBlock("yaml", withMember.yas)}`,
                    inline: true
                  }
                ])
                .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
                .setTimestamp()
              ]
            })
      } else { 
        console.log("Yok")

        channel.send({
          content: `<@${member.id}>`,
          embeds: [
            new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setTitle("👋 Merhaba değerli kullanıcı")
            .setDescription("> Sunucumuza giriş yapmak için aşağıdaki formu doldurmanız gerekiyor.")
            .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
            .setTimestamp()
          ],
          components: [
            new ActionRowBuilder().addComponents(
               new ButtonBuilder()
                .setCustomId('kayitOl_'+member.user.id)
                .setLabel('Formu doldur')
                .setEmoji("🖋")
                .setStyle(ButtonStyle.Secondary),
            )
          ]
        })
      }
    }
  }
}
