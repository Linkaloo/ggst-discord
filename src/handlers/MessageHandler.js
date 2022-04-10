import Discord from "discord.js";
import * as constants from "../constants/index.js";
import * as ggst from "./ggstHandler.js";

const listCommands = () => {
  const embed = new Discord.MessageEmbed();
  const commandList = Object.keys(constants.commands);
  let embedFieldList = "";

  commandList.forEach((command) => {
    embedFieldList += `${command}\n`;
  });

  embed.setTitle("Discord Commands");
  embed.addField("Command", embedFieldList);
  embed.setColor("GREEN");
  return { embeds: [embed] };
};

const commandHandler = async (message) => {
  const command = message.content.split(" ")[0].trim();
  switch (command) {
    case "!help": return listCommands();
    case "!players": return ggst.playerHandler(message);
    case "!addplayer": return ggst.addPlayerHandler(message);
    // case "!updateplayer": return ggst.updatePlayerHandler(message);
    case "!delplayer": return ggst.deletePlayerHandler(message);
    case "!delallplayers": return ggst.deleteAllPlayersHandler(message);

    case "!characters": return ggst.characterHandler(message);
    case "!addcharacter": return ggst.addCharacterHandler(message);
    // case "!updatecharacter": return ggst.updateCharacterHandler(message);
    case "!delcharacter": return ggst.deleteCharacterHandler(message);

    case "!fd": return ggst.characterMoveHandler(message);
    case "!addfd": return ggst.addMoveHandler(message);
    case "!fdall": return ggst.allCharacterMoveHandler(message);
    // case "!updatefd": return ggst.updateMoveHandler(message);
    case "!delfd": return ggst.deleteMoveHandler(message);
    default: break;
  }

  return undefined;
};

const sendMessage = async (channel, message) => {
  channel.send(message);
};

const processMessage = async (message) => {
  // check for command
  const commandString = message.content.split(" ")[0].trim();
  let newMessage;
  if (constants.commands[commandString] !== undefined) {
    newMessage = await commandHandler(message);
  }

  // send message
  if (newMessage) { await sendMessage(message.channel, newMessage); }
};

const Handler = async (message) => {
  await processMessage(message);
};

export default { Handler };
