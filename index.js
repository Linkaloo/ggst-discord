import express from "express";
import bodyParser from "body-parser";
import Bot from "./src/Bot.js";
import * as middleWare from "./src/middleware/index.js";

const app = express();

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: "*/*" }));

app.use(middleWare.signatureValidation);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
