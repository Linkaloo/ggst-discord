/* eslint-disable import/prefer-default-export */
import * as requests from "../requests/index.js";
import Bot from "../Bot.js";

const handleLiveChannel = async (eventInfo) => {
  const streamName = eventInfo.broadcaster_user_name;
  const { players } = await requests.getPlayers({ streamName });

  players.forEach(async (player) => {
    const guild = player.guild_id;
    const discordGuild = await Bot.guilds.cache.get(guild);
    try {
      const channel = discordGuild.channels.cache.find((c) => c.name === process.env.DISCORD_TWITCH_CHANNEL);
      channel.send(`${player.stream} is now live!`);
    } catch (err) {
      console.log(err);
    }
  });
};

export const twitchHandler = (req, res, next) => {
  if (!req.twitchReq) {
    next();
    return;
  }
  const eventType = req.body.subscription.type;
  switch (eventType) {
    case "stream.online": handleLiveChannel(req.body.event);
      break;
    default: break;
  }
};
