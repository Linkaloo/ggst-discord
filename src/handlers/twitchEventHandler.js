/* eslint-disable import/prefer-default-export */
import * as requests from "../requests/index.js";
import Bot from "../Bot.js";

const handleLiveChannel = async (eventInfo) => {
  console.log(eventInfo);
  const streamName = eventInfo.event.broadcaster_user_name;
  const { players } = await requests.getPlayers({ streamName });

  players.forEach(async (player) => {
    const guild = player.guild_id;
    const discordGuild = await Bot.guilds.cache.get(guild);
    console.log(discordGuild);

    try {
      const channel = discordGuild.channels.cache.find((c) => c.name === "bot-test");
      channel.send(`${player.stream} is now live!`);
    } catch (err) {
      console.log(err);
    }
  });
};

export const twitchHandler = (eventInfo) => {
  const eventType = eventInfo.subscription.type;
  switch (eventType) {
    case "stream.online": handleLiveChannel(eventInfo);
      break;
    default: break;
  }
};
