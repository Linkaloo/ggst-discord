/* eslint-disable import/prefer-default-export */
import Discord from "discord.js";
import AsciiTable from "ascii-table";

export const createBasicEmbed = ({ title, desc, color }) => {
  const embed = new Discord.MessageEmbed();
  embed.setTitle(title);
  if (desc !== null) { embed.setDescription(desc); }
  embed.setColor(color);

  return embed;
};

export const createAttackTable = (attacks) => {
  const table = new AsciiTable(`${attacks[0].Character.name} Frame Data`);
  table.setHeading("Input", "Name", "Damage", "Guard", "Startup", "Active", "Recovery", "OnBlock", "Level");
  const columns = 9;
  let lastElement = 0;
  attacks.every((attack) => {
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
    if (table.toString().length > 1900) {
      return false;
    }
    lastElement += 1;

    return true;
  });

  for (let i = 0; i < columns; i += 1) {
    table.setAlign(i, AsciiTable.CENTER);
  }

  const stringTable = `\`\`\`json\n${table.toString()}\`\`\``;
  return { table: stringTable, lastElement };
};
