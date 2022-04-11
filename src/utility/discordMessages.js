/* eslint-disable import/prefer-default-export */
import Discord from "discord.js";

export const createBasicEmbed = ({ title, desc, color }) => {
  const embed = new Discord.MessageEmbed();
  embed.setTitle(title);
  if (desc !== null) { embed.setDescription(desc); }
  embed.setColor(color);

  return embed;
};
