const Discord = require('discord.js');
const pref = require('./settings.json');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"],
});
const fs = require('fs');
const Token = pref.token;
let Bot_Name = pref.name;
const prefix = pref.prefix;


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once("ready", () => {
  console.log(`${Bot_Name} Ready!, Going Online!`);
  client.user.setActivity('TESTING STATE')
});

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.on("messageCreate", message => {
    let author = {
        name: "Sorry!"
    }
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.guild === null){
        return;
    };
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName)){
        let ErrorEmbed = new Discord.MessageEmbed()
        .setAuthor(author)
        .setDescription(`\"${commandName}\" is not recognized as a command!`)
        .setColor('#FF0000')
        return message.channel.send({embeds: ErrorEmbed}).catch(console.error);
    };
    const command = client.commands.get(commandName);
    try{
        command.execute(client, message, args);
    }catch(error){
        let ErrorEmbed = new Discord.MessageEmbed()
        .setAuthor(author)
        .setDescription('Something went wrong, use \`^^^report\` to report this issue to the developer.')
        .setColor('#FF0000')
        return message.channel.send({embeds: ErrorEmbed}).catch(console.error) && console.log(error);
    }
})

client.on("messageCreate", message => {
    let author = {
        name: "Hey there!"
    };
    
    if(message.content === '<@!929827813614297148>') {
        let Embed = new Discord.MessageEmbed()
        .setAuthor(author)
        .setDescription(`My prefix is ${prefix}!`)
        .addField(`If you need help, run '${prefix}help'.`)
        return message.channel.send({embeds: Embed}).catch(console.error); 
    }
})

client.login(Token);