import { Message, Attachment,HeroCard } from "botframework-directlinejs";
import { AbstractConverter } from "./AbstractConverter";
import { AudioConverter } from "./AudioConverter";
import { VideoConverter } from "./VideoConverter";
import {HeroCardConverter} from "./HeroCardConverter";

export class DirectLineConverter {
  public static convertDirectLineToLine(dlMessage: Message): Line.Message[] {
    const lineMessages: Line.Message[] = [];
    const attachments: Attachment[]=[];

    if (dlMessage.text) {
      lineMessages.push({
        text: dlMessage.text,
        type: "text"
      });
    }

    // Iterate over all possible attachments and add them to message array
    const heroCards:HeroCard[]  = [];
    for (const attachment of dlMessage.attachments || []) {
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
          break;
        default:
          break;
      }

      if (converter) {
        lineMessages.push(converter.DirectLineToLine(attachment));
      } else {
        lineMessages.push({
          text: `Unsupported DirectLine type: ${attachment.contentType}`,
          type: "text"
        });
      }
    }
    if(attachments.length > 0){
      lineMessages.push(HeroCardConverter.DirectLineToLine(heroCards));
    }

    return lineMessages;
  }
}
