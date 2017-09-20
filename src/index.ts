import { Client, middleware, validateSignature } from "@line/bot-sdk";
import { Middleware } from "@line/bot-sdk/dist/middleware";
import * as builder from "botbuilder";
import { DirectLine, Message as DirectLineMessage } from "botframework-directlinejs";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import { LineConnector } from "./LineConnector";
global.XMLHttpRequest = require("xhr2");

const logger = console;
const directLine = new DirectLine({
  secret:
    process.env.DIRECT_LINE_SECRET ||
    // "8H_E4uG1JPI.cwA.7R0.75PQaEeOKu9rZOKqsZRTx0DX5apb75tIC0szEodaLgc" // Evan's
    "kMVxrgDSM6w.cwA.Bnw.RPkFc8hVzG6hk_JFJ4ke3U0lmo2krScd4h7IqI2w4XI" // saki's
});

const server = restify.createServer();
server.use(restifyPlugins.bodyParser({}));

server.listen(process.env.port || process.env.PORT || 9999 || 3978, () => {
  logger.log("%s listening to %s", server.name, server.url);
});

const lineConfig: Line.ClientConfig & Line.MiddlewareConfig = {
  channelAccessToken:
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    "pjGjFSn+tjX+rfWBfNIR3wbwS/KXA1GDHc0Qb3RMXxNVFLAyjVFfcfaIbte2LWFOEYy2wNENtLROxUiPeqGrg2MOwdz1h+DGEFCGUurLSXnDTz8ki9X3/OZ43tz1KJWbYmDo0/uvsqDReZ1DZP9ZcwdB04t89/1O/w1cDnyilFU=",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "bdfbed31e6f523f7bfbcdf838ff01caf"
};

const lineClient = new Client(lineConfig);

const endpoint = "/";
server.post(endpoint, async (req, res) => {
  if (Array.isArray(req.body.events)) {
    for (const event of req.body.events) {
      switch (event.type) {
        case "message":
          logger.log(event);
          directLine
            .postActivity({
              from: {
                id: event.source.userId,
                name: "user" // TODO:figure out the user's name. 
              },
              text: event.message.text,
              type: "message",
              value: {
                token: event.replyToken // Needed to send a response to the message from theb user.
              }
            })
            .subscribe(
              id => logger.log("Posted activity, assigned ID ", id),
              error => logger.error("Error posting activity", error)
            );
          break;
        case "follow":
          logger.log("follow");
          break;
        case "unfollow":
          logger.log("unfollow");
          break;
        default:
          res.send(404);
          break;
      }
    }
  }
});

directLine.activity$
  // .filter(activity => activity.type === "message" && activity.from.id === "yourBotHandle")
  .filter(activity => activity.type === "message")
  .subscribe((message: DirectLineMessage) => {
    logger.log("received message ", message);
    const lineMessage: Line.Message = {
      text: `Hey there, your id is ${message.from.id}! 
      You said: ${message.text}`,
      type: "text"
    };
    // if (Object.keys(message.value || {}).includes("token")) {
    if (message.value && Object.keys(message.value).includes("token")) {
      lineClient
        .replyMessage(message.value.token, lineMessage)
        .then(() => {
          logger.log("Replied");
        })
        .catch(err => {
          logger.error(err);
        });
    }
  });
