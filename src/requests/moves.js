import axios from "axios";

export const getCharacterFrameData = async (characterName) => {
  const request = await axios({
    method: "GET",
    url: `${process.env.BASE}/attacks/${characterName}`,
  });

  return request.data;
};

export const addFrameData = async (body) => {
  try {
    const request = await axios({
      method: "POST",
      url: `${process.env.BASE}/attacks`,
      data: body,
    });
    return request.data;
  } catch (err) {
    return err;
  }
};

export const updateFrameData = async (vody) => {

};

export const allFrameData = async (move) => {
  try {
    const request = await axios({
      method: "GET",
      url: `${process.env.BASE}/attacks/all/${move}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};

export const deleteMove = async (character, input) => {
  try {
    const request = await axios({
      method: "DELETE",
      url: `${process.env.BASE}/attacks/${character}/${input}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};
