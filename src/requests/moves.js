import axios from "axios";

export const getFrameData = async (params) => {
  let query;
  if (params.character) {
    query = `character=${params.character}`;
  } else if (params.input) {
    query = `input=${params.input}`;
  }

  const request = await axios({
    method: "GET",
    url: `${process.env.BASE_SERVER}/attacks?${query}`,
  });

  return request.data;
};

export const addFrameData = async (body) => {
  try {
    const request = await axios({
      method: "POST",
      url: `${process.env.BASE_SERVER}/attacks`,
      data: body,
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
      url: `${process.env.BASE_SERVER}/attacks/${character}/${input}`,
    });

    return request.data;
  } catch (err) {
    return err;
  }
};
