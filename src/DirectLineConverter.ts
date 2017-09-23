import { Message, HeroCard } from "botframework-directlinejs";
import { AbstractConverter } from "./AbstractConverter";
import { AudioConverter } from "./AudioConverter";
import { HeroCardConverter } from "./HeroCardConverter";
import { VideoConverter } from "./VideoConverter";

export class DirectLineConverter {
  public static convertDirectLineToLine(dlMessage: Message): Line.Message[] {
    const lineMessages: Line.Message[] = [];

    if (dlMessage.text) {
      lineMessages.push({
        text: dlMessage.text,
        type: "text"
      });
    }

    // Iterate over all possible attachments and add them to message array
    //Viode, Audio card will be single message.
    //Hero card may transform to carousel(inclues multiple items in single message)
    const heroCards:HeroCard[]  = [];
    for (const attachment of dlMessage.attachments || []) {
      let isSupported:boolean = false;
      let converter: AbstractConverter | null = null;
      switch (attachment.contentType) {
        case "application/vnd.microsoft.card.video":
          converter = new VideoConverter();
          break;
        case "application/vnd.microsoft.card.audio":
          converter = new AudioConverter();
          break;
        case "application/vnd.microsoft.card.hero":
          heroCards.push(attachment as HeroCard);
          isSupported = true;
          break;
        default:
          break;
      }

      if (converter) {
        lineMessages.push(converter.DirectLineToLine(attachment));
      }
      else if(isSupported){
        //TODO: It is dirty conditionnal junp.. will consolidate if statement above.
      } else {
        lineMessages.push({
          text: `Unsupported DirectLine type: ${attachment.contentType}`,
          type: "text"
        });
      }
    }
    if(heroCards.length > 0){
      lineMessages.push(HeroCardConverter.DirectLineToLine(heroCards));
    }
    return lineMessages;
  }
}
