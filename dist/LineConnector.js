"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
class LineConnector {
    constructor(config) {
        this.replyTokens = {};
        this.client = new bot_sdk_1.Client(config);
    }
    listen(req, res) {
        return (req, res) => {
            if (!req.body)
                return;
            console.log('middleware', req.body);
            if (req.body.events) {
                const events = req.body.events;
                events.forEach(event => {
                    if (event.tyme !== 'message')
                        return;
                    console.log(event);
                    console.log(event.message);
                    this.replyTokens[event.source.userID] = event.replyToken;
                });
            }
            console.log(this.replyTokens);
            res.status(200).send('aaaa');
        };
    }
    onEvent(handler) {
        console.log(handler);
        this.handler = handler;
        // throw new Error("Method not implemented.");
    }
    send(messages, callback) {
        // throw new Error("Method not implemented.");
        console.log(messages);
        const lineMessage = {
            type: 'message',
            text: messages[0].text,
        };
        this.client.replyMessage(this.Token, lineMessage)
            .then()
            .catch(error => {
            console.log(error);
        });
    }
    startConversation(address, callback) {
        throw new Error("Method not implemented.");
    }
}
exports.LineConnector = LineConnector;
//# sourceMappingURL=LineConnector.js.map