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
            if (!req.body) {
                return;
            }
            console.log('listen', req.body);
            if (req.body.events) {
                const events = req.body.events;
                events.forEach(event => {
                    if(event.type !== 'message') {
                        return;
                    }
                    this.replyTokens[event.source.userId] = event.replyToken;
                });
            }
            res.status(200);
        }
    }

    public onEvent(handler: (events: botbuilder.IEvent[], callback ? : ((err: Error) => void)) => void): void {
        console.log('on Event');
        this.handler = handler;
        // handler();
        // throw new Error("Method not implemented.");
    }

    public send(
        messages: botbuilder.IMessage[],
        callback: (err: Error, addresses ? : botbuilder.IAddress[]) => void
    ): void {
        console.log('send', messages);
        const lineMessage: Line.Message = {
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

    public startConversation(
        address: botbuilder.IAddress,
        callback: (err: Error, address ? : botbuilder.IAddress) => void
    ): void {
        throw new Error("Method not implemented.");
    }
}