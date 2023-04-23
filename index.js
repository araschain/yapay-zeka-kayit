const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");

const config = require("./config.json");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials),
  allowedMentions: {
    parse: ["users", "roles", "everyone"]
  },
  retyLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

/*                         SLASH COMMANDS                               */

console.log(`[-] ${fs.readdirSync("./src/commands").length} komut algılandı.`)

for(let commandName of fs.readdirSync("./src/commands")) {
	if(!commandName.endsWith(".js")) break;

	const command = require(`./src/commands/${commandName}`);	
	client.commands.push({
		name: command.name.toLowerCase(),
		description: command.description.toLowerCase(),
		options: command.options,
		dm_permission: false,
		type: 1
	});

	console.log(`[+] ${commandName} komutu başarıyla yüklendi.`)
}

/*                         EVENTS                                    */

console.log(`[-] ${fs.readdirSync("./src/events").length} olay algılandı.`)

for(let eventName of fs.readdirSync("./src/events")) {
	if(!eventName.endsWith(".js")) break;

	const event = require(`./src/events/${eventName}`);	
  
  if(event.once) {
   client.once(event.name, (...args) => {
		event.execute(client, ...args)
	}); 
  } else {
    client.on(event.name, (...args) => {
		event.execute(client, ...args)
	});
  }

	console.log(`[+] ${eventName} olayı başarıyla yüklendi.`)
}

/*                     LOADING SLASH COMMANDS                     */

client.once("ready", async() => {
	const rest = new REST({ version: "10" }).setToken(config.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    throw error;
  }
});

client.login(config.token).then(() => {
	console.log(`[-] Discord API'ye istek gönderiliyor.`);
	eval("console.clear()")
}).catch(() => {
	console.log(`[x] Discord API'ye istek gönderimi başarısız.`);
});