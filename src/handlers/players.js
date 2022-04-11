import * as requests from "../requests/index.js";
import { addHook, createBasicEmbed } from "../utility/index.js";
import { aliases } from "../constants/index.js";

export const playerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const characterInput = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const guild = message.guildId;

  let request;
  if (baseMessage[0] === "!") {
    request = await requests.getPlayers({ guild });
  } else {
    const character = aliases[characterInput];
    request = await requests.getPlayers({ guild, character });
  }

  const { players } = request;
  if (players === undefined || players.length === 0) {
    const desc = "There are no players in this server";
    const embed = createBasicEmbed({ title: "Warning", desc, color: "YELLOW" });
    return { embeds: [embed] };
  }

  const embed = createBasicEmbed({ title: "Players DEv", desc: null, color: "GREEN" });
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
  return { embeds: [embed] };
};

export const addPlayerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const params = baseMessage.split(",").filter((s) => s !== "");

  if (baseMessage[0] === "!" || params.length < 2) {
    const desc = "Provide a name, character, region, and stream, comma separated";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const player = params[0].replace(/\s{2,}/g, " ");
  const character = params[1].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const region = params.length === 3 ? params[2].replace(/^\s/g, "").replace(/\s{2,}/g, " ") : null;
  const stream = params.length === 4 ? params[3].replace(/^\s/g, "").replace(/\s{2,}/g, " ") : null;

  if (player.includes("http") || character.includes("http") || (region && region.includes("http"))) {
    const desc = "Provide your arguments comma separated, url only for stream";
    const embed = createBasicEmbed({ title: "Warning", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const body = {
    name: player,
    region,
    character: aliases[character],
    stream,
    guild_id: message.guildId,
  };

  const response = await requests.addPlayer(body);
  if (response.error) {
    const desc = "could not add player";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  if (!response[1]) {
    const desc = `Player: **${response[0].name}** already exists`;
    const embed = createBasicEmbed({ title: "Warning", desc, color: "YELLOW" });
    return { embeds: [embed] };
  }

  const desc = `Succesfully added player: **${response[0].name}**`;
  const embed = createBasicEmbed({ title: "Success", desc, color: "GREEN" });

  if (stream !== null) {
    const username = stream.substring(22);
    const hook = await addHook(username);
    if (hook === "success" || hook === "exists") {
      embed.setFooter({ text: "player's stream will send notifications" });
    } else {
      embed.setFooter({ text: "player's stream will not send notifications" });
    }
  }

  return { embeds: [embed] };
};

export const deletePlayerHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const player = baseMessage.split(" ").filter((s) => s !== "").join(" ");

  if (player[0] === "!") {
    const desc = "Provide a player's name";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const response = await requests.deletePlayer({ guildId: message.guildId, player });
  if (response.error) {
    const desc = "Could not delete player";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  if (response.total_deleted === 0) {
    const desc = `No player named ${player} to delete`;
    const embed = createBasicEmbed({ title: "Warning", desc, color: "YELLOW" });
    return { embeds: [embed] };
  }

  const desc = `Succesfully deleted player: **${player}**`;
  const embed = createBasicEmbed({ title: "Success", desc, color: "GREEN" });

  return { embeds: [embed] };
};

export const deleteAllPlayersHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const character = baseMessage.split(" ").filter((s) => s !== "").join(" ");

  if (baseMessage[0] === "!") {
    const desc = "Enter a character to delete all the player records of that character";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const response = await requests.deletePlayer({ guildId: message.guildId, character: aliases[character] });
  if (response.total_deleted === 0) {
    const desc = `There were no players for character ${aliases[character]} to delete`;
    const embed = createBasicEmbed({ title: "Warning", desc, color: "YELLOW" });
    return { embeds: [embed] };
  }

  const desc = `Deleted ${response.total_deleted} players for character ${aliases[character]}`;
  const embed = createBasicEmbed({ title: "Success", desc, color: "GREEN" });

  return { embeds: [embed] };
};
