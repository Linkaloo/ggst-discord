import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import messageHandler from "./handlers/MessageHandler.js";
import twitchHandler from "./handlers/twichHandler.js";

dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
});

client.once("ready", async () => {
  console.log("ready");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    console.log("ignoring bot message");
    return;
  }

  try {
    await messageHandler.Handler(message);
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.DISCORD_TOKEN);

export default client;
