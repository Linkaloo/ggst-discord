import Discord from "discord.js";
import axios from "axios";

export const getPlayers = async (guild, character) => {
  if (character) {
    try {
      const request = await axios({
        method: "GET",
        url: `${process.env.BASE}/players/${guild}/${character}`,
      });
      return request.data;
    } catch (err) {
      return err;
    }
  }

  try {
    const request = await axios({
      method: "GET",
      url: `${process.env.BASE}/players/${guild}`,
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
