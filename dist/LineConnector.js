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
            if (!req.body) {
                return;
            }
            console.log('listen', req.body);
            if (req.body.events) {
                const events = req.body.events;
                events.forEach(event => {
                    if (event.type !== 'message') {
                        return;
                    }
                    this.replyTokens[event.source.userId] = event.replyToken;
                });
            }
            res.status(200);
        };
    }
    onEvent(handler) {
        console.log('on Event');
        this.handler = handler;
        // handler();
        // throw new Error("Method not implemented.");
    }
    send(messages, callback) {
        console.log('send', messages);
        const lineMessage = {
            type: 'message',
            text: messages[0].text,
        };
        // const replyToken = this.replyTokens[];
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