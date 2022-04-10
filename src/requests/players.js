import Discord from "discord.js";
import axios from "axios";

export const getPlayers = async (params) => {
  if (params.guild && params.character) {
    try {
      const request = await axios({
        method: "GET",
        url: `${process.env.BASE}/players/guild=${params.guild}/character=${params.character}`,
      });
      return request.data;
    } catch (err) {
      return err;
    }
  } else if (params.streamName) {
    try {
      const request = await axios({
        method: "GET",
        url: `${process.env.BASE}/players/streamName=${params.streamName}`,
      });
      return request.data;
    } catch (err) {
      return err;
    }
  }

  try {
    const request = await axios({
      method: "GET",
      url: `${process.env.BASE}/players/${params.guild}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};

export const addPlayer = async (body) => {
  try {
    const request = await axios({
      method: "POST",
      url: `${process.env.BASE}/players`,
      data: body,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};

export const deletePlayer = async (guild, player) => {
  if (player) {
    try {
      const request = await axios({
        method: "DELETE",
        url: `${process.env.BASE}/players/${guild}/${player}`,
      });

      return request.data;
    } catch (err) {
      return err;
    }
  }

  try {
    const request = await axios({
      method: "DELETE",
      url: `${process.env.BASE}/players/${guild}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};
