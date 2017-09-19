"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
class LineConnector {
    // private Token: string;
    constructor(config) {
        this.client = new bot_sdk_1.Client(config);
    }
    listen() {
        // return this.client.middleware();
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