/* eslint-disable import/prefer-default-export */
import Axios from "axios";

const token = {
  access_token: "mj4f66s2vd3nu2ct3rukzr3c2576q2",
  expires_in: -1,
  token_type: "",
  updated_date: new Date(),
};

const generateToken = async () => {
  const auth = await Axios({
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
    const valid = await Axios({
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
