import * as requests from "../requests/index.js";
import { createBasicEmbed } from "../utility/index.js";
import { aliases } from "../constants/index.js";

export const characterHandler = async (message) => {
  const { characters } = await requests.getCharacters();
  let description = "";

  characters.forEach((character) => {
    description += `${character.name}\n`;
  });

  const embed = createBasicEmbed({ title: "Characters", desc: description, color: "GREEN" });
  return { embeds: [embed] };
};

export const addCharacterHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const params = baseMessage.split(",").filter((s) => s !== "");

  if (baseMessage[0] === "!") {
    const desc = "Provide the character name and optionally an image url, comma separated";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const characterName = params[0].replace(/\s{2,}/g, " ");

  if (characterName.includes("http")) {
    const desc = "Only the image should be a url";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
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
    const desc = "Could not add character or character already exists";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const desc = `Succesfully added character: **${response.name}**`;
  const embed = createBasicEmbed({ title: "Success", desc, color: "GREEN" });

  return { embeds: [embed] };
};

export const deleteCharacterHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const characterInput = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  if (baseMessage[0] === "!") {
    const desc = "Provide a character's name";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const character = aliases[characterInput];

  const response = await requests.deleteCharacter(character);

  if (response.response.data.error === "not found") {
    const desc = "Could not delete character";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  if (response.total_deleted === 0) {
    const desc = `No character named ${character} to delete`;
    const embed = createBasicEmbed({ title: "Warning", desc, color: "YELLOW" });
    return { embeds: [embed] };
  }

  const desc = `Succesfully deleted player: **${character}**`;
  const embed = createBasicEmbed({ title: "Warning", desc, color: "GREEN" });
  return { embeds: [embed] };
};
