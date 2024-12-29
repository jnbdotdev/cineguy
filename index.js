// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')

//dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN } = process.env

//import commands
const fs = require("node:fs")
const path = require("node:path")
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(`The command in ${filePath} doesn't have data or execute commands.`)
	}
}

//Bot login
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
});
client.login(TOKEN)

//Action listener
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return
	const command = interaction.client.commands.get(interaction.commandName)
	if (!command) {
		console.error('Command not found')
		return
	}
	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply('An error occured when executing this command')
	}
});