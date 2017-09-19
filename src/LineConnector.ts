import { Client, middleware, validateSignature } from "@line/bot-sdk";
import * as botbuilder from "botbuilder";

export class LineConnector implements botbuilder.IConnector {
    public lastMessageToken: string;
    private client: Client;
    private handler: void;
    // private Token: string;

    constructor(config: Line.ClientConfig) {
        this.client = new Client(config);
    }

    public listen() {
        // return this.client.middleware();
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