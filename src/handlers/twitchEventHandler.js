/* eslint-disable import/prefer-default-export */
import axios from "axios";
import * as requests from "../requests/index.js";
import Bot from "../Bot.js";
import { authenticate } from "../utility/twitchAuth.js";

const handleLiveChannel = async (eventInfo) => {
  const streamName = eventInfo.broadcaster_user_name;
  const { players } = await requests.getPlayers({ streamName });

  players.forEach(async (player) => {
    const guild = player.guild_id;
    const discordGuild = await Bot.guilds.cache.get(guild);
    try {
      const channel = discordGuild.channels.cache.find((c) => c.name === "bot-test");
      channel.send(`${player.stream} is now live!`);
    } catch (err) {
      console.log(err);
    }
  });
};

export const twitchHandler = (eventInfo) => {
  const eventType = eventInfo.body.subscription.type;
  switch (eventType) {
    case "stream.online": handleLiveChannel(eventInfo.body.event);
      break;
    default: break;
  }
};

export const addHook = async () => {
  const token = authenticate();
  try {
    await axios({
      method: "POST",
      url: process.env.TWITCH_SUB,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID,
      },
    });

    return "success";
  } catch (err) {
    return err.message;
  }
};
