import Discord from "discord.js";
import * as requests from "../requests/index.js";
import { addHook } from "../utility/twitchAuth.js";

export const playerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf("s") + 2);
  const character = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const guild = message.guildId;
  const embed = new Discord.MessageEmbed();
  const { players } = await requests.getPlayers({ guild, character });

  if (players.length === 0) {
    embed.setDescription("There are no players in this server");
    embed.setTitle("Warning");
    embed.setColor("YELLOW");
    return { embeds: [embed] };
  }

  players.forEach((player) => {
    if (player.stream) {
      embed.addFields(
        { name: player.name, value: `${player.Character.name}\n[ttv/${player.name}](${player.stream})` },
      );
    } else {
      embed.addFields(
        { name: player.name, value: `${player.Character.name}` },
      );
    }
  });
  embed.setTitle("Players");
  embed.setColor("GREEN");
  return { embeds: [embed] };
};

export const addPlayerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const params = baseMessage.split(",").filter((s) => s !== "");
  const embed = new Discord.MessageEmbed();

  if (baseMessage[0] === "!" || params.length < 2) {
    const embed = new Discord.MessageEmbed().setDescription("Provide a name, character, region, and stream, comma separated").setColor("RED");
    return { embeds: [embed] };
  }

  const player = params[0].replace(/\s{2,}/g, " ");
  const character = params[1].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const region = params.length === 3 ? params[2].replace(/^\s/g, "").replace(/\s{2,}/g, " ") : null;
  const stream = params.length === 4 ? params[3].replace(/^\s/g, "").replace(/\s{2,}/g, " ") : null;

  if (player.includes("http") || character.includes("http") || (region && region.includes("http"))) {
    embed.setColor("RED");
    embed.setDescription("Provide your arguments comma separated, url only for stream");
    return { embeds: [embed] };
  }

  const body = {
    name: player,
    region,
    character,
    stream,
    guild_id: message.guildId,
  };

  const response = await requests.addPlayer(body);
  if (response.error) {
    console.log(response.error);
    embed.setDescription("could not add player");
    embed.setTitle("Error");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  if (!response[1]) {
    embed.setTitle("Error");
    embed.setDescription(`Player: **${response[0].name}** already exists`);
    embed.setColor("YELLOW");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Succesfully added player: **${response[0].name}**`);
  embed.setColor("GREEN");

  if (stream !== null) {
    const username = stream.substring(22);
    const hook = await addHook(username);
    if (hook === "success") {
      embed.setFooter({ text: "player's stream added to notifications" });
    } else {
      embed.setFooter({ text: "player's stream was not added" });
    }
  }

  return { embeds: [embed] };
};

export const updatePlayerHandler = async (message) => {

};

export const deletePlayerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const player = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const embed = new Discord.MessageEmbed();

  if (player[0] === "!") {
    embed.setDescription("Provide a player's name").setColor("RED");
    return { embeds: [embed] };
  }

  const response = await requests.deletePlayer(message.guildId, player);
  if (response.error) {
    embed.setTitle("Error");
    embed.setDescription("Could not delete player");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  if (response.total_deleted === 0) {
    embed.setTitle("Error");
    embed.setDescription(`No player named ${player} to delete`);
    embed.setColor("YELLOW");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Succesfully deleted player: **${player}**`);
  embed.setColor("GREEN");

  return { embeds: [embed] };
};

export const deleteAllPlayersHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const character = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const embed = new Discord.MessageEmbed();
  if (baseMessage[0] === "!") {
    embed.setTitle("Error");
    embed.setDescription("Enter a character to delete all the player records");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  const response = await requests.deletePlayer(message.guildId);
  if (response.total_deleted === 0) {
    embed.setTitle("Warning");
    embed.setDescription(`There were no players for character ${character} to delete`);
    embed.setColor("YELLOW");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Deleted ${response.total_deleted} players for character ${character}`);
  embed.setColor("GREEN");
  return { embeds: [embed] };
};
