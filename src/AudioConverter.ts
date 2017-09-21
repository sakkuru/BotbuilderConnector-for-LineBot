import { AudioCard } from "botframework-directlinejs";
import { AbstractConverter } from "./AbstractConverter";

export class AudioConverter extends AbstractConverter {
  constructor() {
    super();
  }

  public DirectLineToLine(attachment: AudioCard): Line.Message {
    const message: Line.AudioMessage = {
      duration: "99999999999",
      originalContentUrl: attachment.content.media ? attachment.content.media[0].url : "",
      type: "audio"
    };

    return message;
  }
}
