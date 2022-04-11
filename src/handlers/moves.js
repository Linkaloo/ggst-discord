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

  table.setHeading("Input", "Name", "Damage", "Guard", "Startup", "Active", "Recovery", "OnBlock", "Level");
  const columns = 9;
  attacks.forEach((attack) => {
    const attackName = attack.name === undefined ? "-" : attack.name;
    const damage = attack.damage === undefined ? "-" : attack.damage;
    const guard = attack.guard === undefined ? "-" : attack.guard;
    const startup = attack.startup === undefined ? "-" : attack.startup;
    const active = attack.active === undefined ? "-" : attack.active;
    const recovery = attack.recovery === undefined ? "-" : attack.recovery;
    const onBlock = attack.on_block === undefined ? "-" : attack.on_block;
    const attackLevel = attack.attack_level === undefined ? "-" : attack.attack_level;

    table.addRow(
      attack.input,
      attackName,
      damage,
      guard,
      startup,
      active,
      recovery,
      onBlock,
      attackLevel,
    );
  });

  for (let i = 0; i < columns; i += 1) {
    table.setAlign(i, AsciiTable.CENTER);
  }

  const stringTable = `\`\`\`json\n${table.toString()}\`\`\``;

  return stringTable;
};

export const addMoveHandler = async (message) => {
  const baseMessage = message.content.substring(message.content.indexOf(" ") + 1);
  const moveString = baseMessage.split(",").filter((s) => s !== "");

  if (baseMessage[0] === "!" || moveString.length < 2) {
    const desc = "Provide the character name, input, move name, damage, guard, startup, active frames, recovery frames, on block frames, and the attack level, comma separated"
    + "\nYou can leave things blank if you dont know besides input and character";
    const embed = createBasicEmbed({ title: "Error", desc, color: "RED" });
    return { embeds: [embed] };
  }

  const character = moveString[0].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  const input = moveString[1].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let name = moveString[2].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let damage = moveString[3].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let guard = moveString[4].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let startup = moveString[5].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let active = moveString[6].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let recovery = moveString[7].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let onBlock = moveString[8].replace(/^\s/g, "").replace(/\s{2,}/g, " ");
  let attackLevel = moveString[9].replace(/^\s/g, "").replace(/\s{2,}/g, " ");

  name = name === " " ? null : name;
  damage = damage === " " ? null : parseInt(damage, 10);
  guard = guard === " " ? null : guard;
  startup = startup === " " ? null : parseInt(startup, 10);
  active = active === " " ? null : parseInt(active, 10);
  recovery = recovery === " " ? null : parseInt(recovery, 10);
  onBlock = onBlock === " " ? null : parseInt(onBlock, 10);
  attackLevel = attackLevel === " " ? null : parseInt(attackLevel, 10);

  const body = {
    character: aliases[character],
    input,
    damage,
    guard,
    startup,
    active,
    recovery,
    on_block: onBlock,
    attack_level: attackLevel,
    name,
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
