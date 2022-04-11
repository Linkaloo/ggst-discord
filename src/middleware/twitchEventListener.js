/* eslint-disable import/prefer-default-export */
import crypto from "crypto";

// Notification request headers
const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_REVOCATION = "revocation";

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = "sha256=";

const getSecret = () => process.env.SECRET;

// Build the message used to get the HMAC.
function getHmacMessage(request) {
  return (request.headers[TWITCH_MESSAGE_ID]
        + request.headers[TWITCH_MESSAGE_TIMESTAMP]
        + request.rawBody);
}

// Get the HMAC.
function getHmac(secret, message) {
  return crypto.createHmac("sha256", secret)
    .update(message)
    .digest("hex");
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac, verifySignature) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

export const signatureValidation = async (req, res, next) => {
  if (!req.headers["twitch-eventsub-message-signature"]) {
    req.twitchReq = false;
    next();
    return;
  }

  const secret = getSecret();
  const message = getHmacMessage(req);
  const hmac = HMAC_PREFIX + getHmac(secret, message);
  if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE]) === true) {
    // Get JSON object from body, so you can process the message.
    const notification = req.body;

    if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
      // TODO: Do something with the event's data.
      req.twitchReq = true;
      next();

      res.sendStatus(204);
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
      res.status(200).send(notification.challenge);
    } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
      res.sendStatus(204);
    } else {
      res.sendStatus(204);
    }
  } else {
    res.sendStatus(403);
  }
};
