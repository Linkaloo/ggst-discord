import AsciiTable from "ascii-table";
import * as requests from "../requests/index.js";
import { createBasicEmbed } from "../utility/index.js";
import { aliases } from "../constants/index.js";

export const getCharacterMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const characterInput = baseMessage.split(" ").filter((s) => s !== "").join(" ");
  if (baseMessage[0] === "!") {
    const desc = "Provide a character's name";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const character = aliases[characterInput];

  if (character === undefined) {
    const desc = "Invalid character entered";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const { attacks } = await requests.getFrameData({ character });
  if (attacks.length === 0) {
    const desc = "Either the character or frame data do not exist";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
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

  if (baseMessage[0] === "!" || moveString.length < 9) {
    const desc = "Provide the character name, input, damage, guard, startup, active frames, recovery frames, on block frames, and the attack level, comma separated";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

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
    character: aliases[character],
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
    const desc = "Could not add frame data to character or this move already exists";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const desc = `Succesfully added frame data for: **${response.input}**`;
  const embed = createBasicEmbed({ title: "Success", desc, color: "GREEN" });

  return { embeds: [embed] };
};

export const allCharacterMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const moveString = baseMessage.replace(/^\s/g, "").replace(/\s{2,}/g, "");

  if (moveString[0] === "!") {
    const desc = "Enter an input";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const { attacks } = await requests.getFrameData({ input: moveString });
  if (attacks.length === 0) {
    const desc = "Move does not exist for any character";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
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
  if (baseMessage[0] === "!" || args.length < 2) {
    const desc = "Provide a character and their move input, comma separated";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const characterInput = args[0].replace(/^\s/g, "").replace(/\s{2,}/g, "");
  const input = args[1].replace(/^\s/g, "").replace(/\s{2,}/g, "");

  const character = aliases[characterInput];

  const response = await requests.deleteMove(character, input);
  if (response.error) {
    let desc = "";
    if (response.error === "Character not found") {
      desc = `Character: ${response.character} not found`;
    } else {
      desc = "Could not delete move";
    }

    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  if (response.total_deleted === 0) {
    const desc = `No move ${input} from ${character} to delete`;
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const desc = `Succesfully deleted move **${input}** from **${character}**`;
  const embed = createBasicEmbed({ title: "Success", desc, color: "GREEN" });

  return { embeds: [embed] };
};
