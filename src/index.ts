import { Client, middleware, validateSignature } from "@line/bot-sdk";
import { Middleware } from "@line/bot-sdk/dist/middleware";
import { DirectLine, Message as DirectLineMessage } from "botframework-directlinejs";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import { HeroCard } from "./HeroCard"
import { VideoConverter } from "./VideoConverter";

const XMLHttpRequest = require("xhr2");

global = Object.assign(global, { XMLHttpRequest });

const logger = console;
const directLine = new DirectLine({
  secret:
  process.env.DIRECT_LINE_SECRET ||
  // "8H_E4uG1JPI.cwA.7R0.75PQaEeOKu9rZOKqsZRTx0DX5apb75tIC0szEodaLgc" // Evan's
  "kMVxrgDSM6w.cwA.Bnw.RPkFc8hVzG6hk_JFJ4ke3U0lmo2krScd4h7IqI2w4XI" // saki's
});

/**
 * Map conversation ID to user ID
 */
const conversations: {
  [messageId: string]: string;
} = {};

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
          const activity: DirectLineMessage = {
            from: {
              id: event.replyToken,
              name: event.source.userId // TODO:figure out the user's name.
            },
            text: event.message.text,
            type: "message"
          };
          logger.log("posting activity", activity);
          directLine.postActivity(activity).subscribe(
            messageId => {
              const conversationId = messageId.split("|")[0];
              // conversations[id] = event.replyToken || "";
              conversations[conversationId] = event.source.userId || "";
              logger.log("Posted activity, assigned ID ", messageId);
            },
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
  // .filter(activity => activity.type === "message")
  .subscribe((message: DirectLineMessage) => {
    logger.log("received message ", message);
    let lineMessages: Line.Message[] = [];
    if (message.attachments != null && message.attachments.length > 0) {
      message.attachments.forEach(element => {
        switch (element.contentType) {
          case "application/vnd.microsoft.card.video":
            // const videoConverter = new VideoConverter(); //Masa will update it
            lineMessages.push( {
              text: "Sorry, but Video messsage type can not be displayed yet.",
              type: "text"
            });
            break;
          case "application/vnd.microsoft.card.hero":
            const hero = new HeroCard();
            lineMessages.push(hero.DirectLineToLine(message));
            break;
          default:
            lineMessages.push( {
              text: "Sorry, but this messsage type can not be displayed yet.",
              type: "text"
            });
            break;
        }
      });
    } else {
      lineMessages.push({
        text: message.text || "Couldn't evaluate messsage text.",
        type: "text"
      });
    }
    if (message && message.conversation && message.conversation.id) {
        lineClient
        .pushMessage(conversations[message.conversation.id], lineMessages)
        .then(() => {
          logger.log("Replied with", lineMessages);
        })
        .catch((err: Error) => {
          logger.error(err.message);
        });
    }
  });
