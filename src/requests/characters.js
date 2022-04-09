import Discord from "discord.js";
import axios from "axios";

export const getCharacters = async (query) => {
  const request = await axios({
    method: "GET",
    url: `${process.env.BASE}/characters`,
    data: query,
  });

  return request.data;
};

export const addCharacter = async (body) => {
  try {
    const request = await axios({
      method: "POST",
      url: `${process.env.BASE}/characters`,
      data: body,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};

export const deleteCharacter = async (character) => {
  try {
    const request = await axios({
      method: "DELETE",
      url: `${process.env.BASE}/characters/${character}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};
