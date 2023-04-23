const { EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "kayıtkur",
  description: "Discord sunucunuzun kayıt sistemini ayarlayın.",
  options: [
    {
      type: 7,
      name: "kanal",
      description: "Bir kanal tipi giriniz.",
      required: true
    },
    {
      type: 7,
      name: "log",
      description: "Bir log kanal tipi giriniz.",
      required: true
    },
    {
      type: 8,
      name: "erkek_rol",
      description: "Bir erkek rol tipi giriniz.",
      required: true
    },
    {
      type: 8,
      name: "kız_rol",
      description: "Bir kız rol tipi giriniz.",
      required: true
    }
  ],
  
  async execute(client, interaction) {
    await interaction.deferReply();
    
    if(db.fetch(`kayitSistemi_${interaction.guild.id}`)) {
        interaction.followUp({
        embeds: [
          new EmbedBuilder()
          .setColor("Red")
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
          .setTitle("❌ Bir şeyler ters gitti!")
          .setDescription("> Kayıt sistemi için kullanıcılar zaten <#"+db.fetch(`kayitSistemi_${interaction.guild.id}`).channel+"> kanalında kayıt oluyor!")
          .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
          .setTimestamp()
        ]
      });
    } else { 
      const channel = interaction.options.getChannel("kanal");
      const log = interaction.options.getChannel("log");
      const erkekRol = interaction.options.getRole("erkek_rol");
      const kızRol = interaction.options.getRole("kız_rol");

      db.set(`kayitSistemi_${interaction.guild.id}`, {
        channel: channel.id,
        log: log.id,
        erkekRol: erkekRol.id,
        kızRol: kızRol.id
      });

      interaction.followUp({
        embeds: [
          new EmbedBuilder()
          .setColor("Green")
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
          .setTitle("✅ İşlem başarıyla kayıt defterine kayıt edildi!")
          .setDescription("> Kayıt sistemi için kullanıcılar <#"+channel.id+"> kanalında kayıt olacak!")
          .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
          .setTimestamp()
        ]
      });
    }
  }
}