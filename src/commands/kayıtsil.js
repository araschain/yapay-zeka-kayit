const {
  EmbedBuilder
} = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "kayıtsil",
  description: "Discord sunucunuzun kayıt sistemini sıfırlarsınız.",
  options: [],
  
  async execute(client, interaction) {
    await interaction.deferReply();
    
    if(!db.fetch(`kayitSistemi_${interaction.guild.id}`)) {
        interaction.followUp({
        embeds: [
          new EmbedBuilder()
          .setColor("Red")
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
          .setTitle("❌ Bir şeyler ters gitti!")
          .setDescription("> Kayıt sistemi __sunucunuz__ için zaten de-aktif.")
          .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
          .setTimestamp()
        ]
      });
    } else { 

      db.delete(`kayitSistemi_${interaction.guild.id}`);

      interaction.followUp({
        embeds: [
          new EmbedBuilder()
          .setColor("Green")
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
          .setTitle("✅ İşlem başarıyla kayıt defterinden silindi!")
          .setDescription("> Kayıt sistemi için kullanıcılar artık kayıt olmayacak!")
          .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL() })
          .setTimestamp()
        ]
      });
    }
  }
}