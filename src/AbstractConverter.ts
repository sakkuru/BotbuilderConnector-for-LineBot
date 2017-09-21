import { Attachment } from "botframework-directlinejs";

export abstract class AbstractConverter {
  public abstract DirectLineToLine(attachment: Attachment): Line.Message;
}
