import Discord from "discord.js";
import * as requests from "../requests/index.js";

export const characterHandler = async (message) => {
  const { characters } = await requests.getCharacters({});
  const embed = new Discord.MessageEmbed();
  let description = "";

  characters.forEach((character) => {
    description += `${character.name}\n`;
  });

  embed.setTitle("Characters");
  embed.setDescription(description);
  embed.setColor("GREEN");
  return { embeds: [embed] };
};

export const addCharacterHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const params = baseMessage.split(",").filter((s) => s !== "");
  const embed = new Discord.MessageEmbed();

  if (baseMessage[0] === "!") {
    embed.setColor("RED");
    embed.setDescription("Provide the character name and optionally an image url, comma separated");
    return { embeds: [embed] };
  }

  const characterName = params[0].replace(/\s{2,}/g, " ");

  if (characterName.includes("http")) {
    embed.setColor("RED");
    embed.setDescription("Only the image should be a url");
    return { embeds: [embed] };
  }

  let characterImage = "";
  if (params.length > 1) { characterImage = params[1].replace(/^\s/g, "").replace(/\s{2,}/g, " "); }

  const body = {
    name: characterName,
    image: characterImage,
  };

  const response = await requests.addCharacter(body);

  if (response.error) {
    embed.setTitle("Error");
    embed.setDescription("Could not add character or character already exists");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Succesfully added character: **${response.name}**`);
  embed.setColor("GREEN");

  return { embeds: [embed] };
};

export const deleteCharacterHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const character = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const embed = new Discord.MessageEmbed();

  if (character[0] === "!") {
    embed.setDescription("Provide a character's name").setColor("RED");
    return { embeds: [embed] };
  }

  const response = await requests.deleteCharacter(character);
  if (response.response.data.error === "not found") {
    embed.setTitle("Error");
    embed.setDescription("Could not delete character");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  if (response.total_deleted === 0) {
    embed.setTitle("Error");
    embed.setDescription(`No character named ${character} to delete`);
    embed.setColor("YELLOW");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Succesfully deleted player: **${character}**`);
  embed.setColor("GREEN");

  return { embeds: [embed] };
};
