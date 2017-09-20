import { Client, middleware, validateSignature } from "@line/bot-sdk";
import * as botbuilder from "botbuilder";

export class LineConnector implements botbuilder.IConnector {
    public lastMessageToken: string;
    private client: Client;
    private handler: void;
    private replyTokens = {};

    constructor(config: Line.ClientConfig) {
        this.client = new Client(config);
    }

    public listen(req, res) {
        return (req, res) => {
            if (!req.body) return;
            console.log('middleware', req.body);
            if (req.body.events) {
                const events = req.body.events;
                console.log(events);
                events.forEach(event => {
                    if(event.tyme !== 'message') return;
                    console.log(event);
                    console.log(event.message);
                    this.replyTokens[event.source.userID] = event.replyToken;
                });
            }
            console.log(this.replyTokens);
            res.status(200);
        }

    }

    public onEvent(handler: (events: botbuilder.IEvent[], callback ? : ((err: Error) => void)) => void): void {
        console.log(handler);
        this.handler = handler;
        // throw new Error("Method not implemented.");
    }

    public send(
        messages: botbuilder.IMessage[],
        callback: (err: Error, addresses ? : botbuilder.IAddress[]) => void
    ): void {
        // throw new Error("Method not implemented.");
        console.log(messages);
        const lineMessage: Line.Message = {
            type: 'message',
            text: messages[0].text,
        };

        this.client.replyMessage(this.Token, lineMessage)
            .then()
            .catch(error => {
                console.log(error);
            });
    }

    public startConversation(
        address: botbuilder.IAddress,
        callback: (err: Error, address ? : botbuilder.IAddress) => void
    ): void {
        throw new Error("Method not implemented.");
    }
}