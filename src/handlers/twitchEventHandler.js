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

export const addHook = async (username) => {
  const token = authenticate();
  try {
    console.log("getting user info");
    const user = await axios({
      method: "GET",
      url: `https://api.twitch.tv/helix/users?login=${username}`,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID,
      },
    });

    const userid = user.data.id;

    const body = {
      version: "1",
      type: "stream.online",
      condition: {
        broadcaster_user_id: userid,
      },
      transport: {
        method: "webhook",
        callback: "https://ggst-discord.herokuapp.com",
        secret: process.env.SECRET,
      },
    };

    console.log("trying to add hook");
    await axios({
      method: "POST",
      url: process.env.TWITCH_SUB,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID,
      },
      body,
    });

    return "success";
  } catch (err) {
    return err.message;
  }
};
