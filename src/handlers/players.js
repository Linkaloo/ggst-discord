import Discord from "discord.js";
import * as requests from "../requests/index.js";

export const playerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf("s") + 2);
  const character = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const guild = message.guildId;
  const embed = new Discord.MessageEmbed();
  const { players } = await requests.getPlayers({ guild, character });

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

  return { embeds: [embed] };
};

export const addPlayerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf("r") + 2);
  const params = baseMessage.split(",").filter((s) => s !== "");
  const embed = new Discord.MessageEmbed();

  if (params.length < 3) {
    const embed = new Discord.MessageEmbed().setDescription("Provide a name, region, character, and stream if applicable").setColor("RED");
    return { embeds: [embed] };
  }

  const player = params[0].replace(/\s{2,}/g, " ");
  const region = params[1].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const character = params[2].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const stream = params.length > 3 ? params[3].replace(/^\s/g, "").replace(/\s{2,}/g, " ") : null;

  const body = {
    name: player,
    region,
    character,
    stream,
    guild_id: message.guildId,
  };

  const response = await requests.addPlayer(body);
  if (response.error) {
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

  const response = await requests.deletePlayer();
};
