"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const botframework_directlinejs_1 = require("botframework-directlinejs");
const restify = require("restify");
const DirectLineConverter_1 = require("./DirectLineConverter");
const XMLHttpRequest = require("xhr2");
global = Object.assign(global, { XMLHttpRequest });
const logger = console;
const directLine = new botframework_directlinejs_1.DirectLine({
    secret: process.env.DIRECT_LINE_SECRET ||
        // "8H_E4uG1JPI.cwA.7R0.75PQaEeOKu9rZOKqsZRTx0DX5apb75tIC0szEodaLgc" // Evan's
        "kMVxrgDSM6w.cwA.Bnw.RPkFc8hVzG6hk_JFJ4ke3U0lmo2krScd4h7IqI2w4XI" // saki's
});
/**
 * Map conversation ID to user ID
 */
const conversations = {};
const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ||
        "pjGjFSn+tjX+rfWBfNIR3wbwS/KXA1GDHc0Qb3RMXxNVFLAyjVFfcfaIbte2LWFOEYy2wNENtLROxUiPeqGrg2MOwdz1h+DGEFCGUurLSXnDTz8ki9X3/OZ43tz1KJWbYmDo0/uvsqDReZ1DZP9ZcwdB04t89/1O/w1cDnyilFU=",
    channelSecret: process.env.LINE_CHANNEL_SECRET || "bdfbed31e6f523f7bfbcdf838ff01caf"
};
const lineClient = new bot_sdk_1.Client(lineConfig);
const server = restify.createServer();
server.use(bot_sdk_1.middleware(lineConfig));
server.listen(process.env.port || process.env.PORT || 9999 || 3978, () => {
    logger.log("%s listening to %s", server.name, server.url);
});
const endpoint = process.env.ENDPOINT || "/";
server.post(endpoint, async (req, res) => {
    if (Array.isArray(req.body.events)) {
        for (const event of req.body.events) {
            switch (event.type) {
                case "message":
                    const activity = {
                        from: {
                            id: event.replyToken,
                            name: event.source.userId // TODO:figure out the user's name.
                        },
                        text: event.message.text,
                        type: "message"
                    };
                    logger.log("posting activity", activity);
                    directLine.postActivity(activity).subscribe(messageId => {
                        const conversationId = messageId.split("|")[0];
                        // conversations[id] = event.replyToken || "";
                        conversations[conversationId] = event.source.userId || "";
                        logger.log("Posted activity, assigned ID ", messageId);
                    }, error => logger.error("Error posting activity", error));
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
    .subscribe((message) => {
    logger.log("received message ", message);
    const lineMessages = DirectLineConverter_1.DirectLineConverter.convertDirectLineToLine(message);
    if (message.conversation && message.conversation.id) {
        lineClient
            .pushMessage(conversations[message.conversation.id], lineMessages)
            .then(() => {
            logger.log("Replied with", lineMessages);
        })
            .catch((err) => {
            logger.error(err.message);
        });
    }
});
//# sourceMappingURL=index.js.map