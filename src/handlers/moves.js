import Discord from "discord.js";
import AsciiTable from "ascii-table";
import * as requests from "../requests/index.js";
import { parseCharacterAlias } from "../utility/parseAliases.js";

export const characterMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const characterInput = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  const embed = new Discord.MessageEmbed();

  if (characterInput[0] === "!") {
    embed.setTitle("Error");
    embed.setDescription("Provide a character idiot");
    embed.setColor("RED");
    return { embeds: [embed] };
  }
  const character = parseCharacterAlias(characterInput);
  const { attacks } = await requests.getCharacterFrameData(character);

  if (attacks.length === 0) {
    embed.setTitle("Error");
    embed.setDescription("Either character or frame data do not exist");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  const table = new AsciiTable(`${attacks[0].Character.name} Frame Data`);

  table.setHeading("Input", "Damage", "Guard", "Startup", "Active", "Recovery", "OnBlock", "Level");

  attacks.forEach((attack) => {
    table.addRow(
      attack.input,
      attack.damage,
      attack.guard,
      attack.startup,
      attack.active,
      attack.recovery,
      attack.on_block,
      attack.attack_level,
    );
  });

  const stringTable = `\`\`\`json\n${table.toString()}\`\`\``;

  return stringTable;
};

export const addMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const moveString = baseMessage.split(",").filter((s) => s !== "");
  const embed = new Discord.MessageEmbed();

  const character = moveString[0].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const input = moveString[1].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const damage = moveString[2].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const guard = moveString[3].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const startup = moveString[4].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const active = moveString[5].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const recovery = moveString[6].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const onBlock = moveString[7].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const attackLevel = moveString[8].replace(/^\s/g, "").replace(/\s{2,}/g, " ");

  const body = {
    character,
    input,
    damage: parseInt(damage, 10),
    guard,
    startup: parseInt(startup, 10),
    active: parseInt(active, 10),
    recovery: parseInt(recovery, 10),
    on_block: parseInt(onBlock, 10),
    attack_level: parseInt(attackLevel, 10),
  };

  const response = await requests.addFrameData(body);

  if (response.error) {
    embed.setTitle("Error");
    embed.setDescription("Could not add frame data to character or this move already exists");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Succesfully added frame data for: **${response.input}**`);
  embed.setColor("GREEN");

  return { embeds: [embed] };
};

export const allCharacterMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const moveString = baseMessage.replace(/^\s/g, "").replace(/\s{2,}/g, "");

  if (moveString[0] === "!") {
    const embed = new Discord.MessageEmbed();
    embed.setColor("RED");
    embed.setDescription("Enter an input idiot");
    return { embeds: [embed] };
  }

  const { attacks } = await requests.allFrameData(moveString);
  if (attacks.length === 0) {
    const embed = new Discord.MessageEmbed();
    embed.setColor("RED");
    embed.setDescription("Move does not exist for any character");
    return { embeds: [embed] };
  }

  const table = new AsciiTable(`All Character's ${attacks[0].input}`);

  table.setHeading("Character", "Input", "Damage", "Guard", "Startup", "Active", "Recovery", "OnBlock", "Level");

  attacks.forEach((attack) => {
    table.addRow(
      attack.Character.name,
      attack.input,
      attack.damage,
      attack.guard,
      attack.startup,
      attack.active,
      attack.recovery,
      attack.on_block,
      attack.attack_level,
    );
  });

  const stringTable = `\`\`\`json\n${table.toString()}\`\`\``;

  return stringTable;
};

export const deleteMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const args = baseMessage.split(",").filter((s) => s !== "");
  const embed = new Discord.MessageEmbed();

  if (args[0][0] === "!" || args.length < 2) {
    embed.setDescription("Provide a character and their move input, comma separated").setColor("RED");
    return { embeds: [embed] };
  }

  const character = args[0].replace(/^\s/g, "").replace(/\s{2,}/g, "");
  const input = args[1].replace(/^\s/g, "").replace(/\s{2,}/g, "");

  const response = await requests.deleteMove(character, input);
  if (response.error) {
    console.log(response);
    if (response.error === "Character not found") {
      embed.setDescription(`Character: ${response.character} not found`);
    } else {
      embed.setDescription("Could not delete move");
    }
    embed.setTitle("Error");
    embed.setColor("RED");
    return { embeds: [embed] };
  }

  if (response.total_deleted === 0) {
    embed.setTitle("Error");
    embed.setDescription(`No move ${input} from ${character} to delete`);
    embed.setColor("YELLOW");
    return { embeds: [embed] };
  }

  embed.setTitle("Success");
  embed.setDescription(`Succesfully deleted move **${input}** from **${character}**`);
  embed.setColor("GREEN");

  return { embeds: [embed] };
};
