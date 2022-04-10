/* eslint-disable import/prefer-default-export */
import axios from "axios";

const token = {
  access_token: "mj4f66s2vd3nu2ct3rukzr3c2576q2",
  expires_in: -1,
  token_type: "",
  updated_date: new Date(),
};

const generateToken = async () => {
  console.log("generating token");
  const auth = await axios({
    method: "POST",
    url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}4&grant_type=client_credentials`,
  });

  token.access_token = auth.data.access_token;
  token.expires_in = auth.data.expires_in;
  token.token_type = auth.data.token_type;
  token.check_date = new Date();
};

const validateToken = async () => {
  try {
    const valid = await axios({
      method: "GET",
      url: "https://id.twitch.tv/oauth2/validate",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    token.expires_in = valid.data.expires_in;
    token.check_date = new Date();
  } catch (err) {
    generateToken();
  }
};

export const authenticate = () => {
  if (token.access_token === "") {
    generateToken();
  }

  if ((new Date() - token.updated_date) / 86400000 >= 15) {
    validateToken();
  }

  return token;
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

    const userid = user.data.data[0].id;
    console.log(userid);

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
    const sub = await axios({
      method: "POST",
      url: process.env.TWITCH_SUB,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID,
      },
      data: body,
    });

    return "success";
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
