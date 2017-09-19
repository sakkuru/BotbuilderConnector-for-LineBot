import { Client, middleware, validateSignature } from "@line/bot-sdk";
import * as botbuilder from "botbuilder";

export class LineConnector implements botbuilder.IConnector {
  private client: Client;

  constructor(config: Line.ClientConfig) {
    this.client = new Client(config);
  }

  public onEvent(handler: (events: botbuilder.IEvent[], callback?: ((err: Error) => void)) => void): void {
    throw new Error("Method not implemented.");
  }

  public send(
    messages: botbuilder.IMessage[],
    callback: (err: Error, addresses?: botbuilder.IAddress[]) => void
  ): void {
    throw new Error("Method not implemented.");
  }

  public startConversation(
    address: botbuilder.IAddress,
    callback: (err: Error, address?: botbuilder.IAddress) => void
  ): void {
    throw new Error("Method not implemented.");
  }
}
