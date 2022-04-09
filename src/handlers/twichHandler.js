import requests from "../requests";

const twitchStreams = async () => {
  console.log("ready");

//   const { players } = requests.getPlayers();
};

const twitchHandler = () => {
  setTimeout(() => {
    twitchStreams();
    twitchHandler();
  }, 9000);
};

export default twitchHandler;
