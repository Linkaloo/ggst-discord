import axios from "axios";

export const getPlayers = async (params) => {
  let query;

  if (params.guild && params.character) {
    query = `guildId=${params.guild}&&character=${params.character}`;
  } else if (params.streamName) {
    query = `stream=${params.streamName}`;
  } else {
    query = `guildId=${params.guild}`;
  }

  try {
    const request = await axios({
      method: "GET",
      url: `${process.env.BASE_SERVER}/players?${query}`,
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
      url: `${process.env.BASE_SERVER}/players`,
      data: body,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};

export const deletePlayer = async (params) => {
  let query;
  if (params.guildId && params.player) {
    query = `guildId=${params.guildId}&player=${params.player}`;
  } else if (params.guildId && params.character) {
    query = `guildId=${params.guildId}&character=${params.character}`;
  }
  try {
    const request = await axios({
      method: "DELETE",
      url: `${process.env.BASE_SERVER}/players?${query}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};
