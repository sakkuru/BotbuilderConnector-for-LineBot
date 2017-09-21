import { VideoCard } from "botframework-directlinejs";
import { AbstractConverter } from "./AbstractConverter";

export class VideoConverter extends AbstractConverter {
  constructor() {
    super();
  }

  public DirectLineToLine(attachment: VideoCard): Line.Message {
    const message: Line.VideoMessage = {
      originalContentUrl: attachment.content.media ? attachment.content.media[0].url : "",
      previewImageUrl: attachment.content.image ? attachment.content.image.url : "",
      type: "video"
    };

    return message;
  }
}
