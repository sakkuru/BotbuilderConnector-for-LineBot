import { Activity as DirectLineActivity } from "botframework-directlinejs";

export abstract class AbstractConverter {
  public abstract lineToDirectLine(event: Line.WebhookEvent): DirectLineActivity;
  public abstract DirectLineToLine(event: DirectLineActivity): Line.Message;
}
