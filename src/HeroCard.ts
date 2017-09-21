import {AbstractConverter} from './AbstractConverter';
import { Activity as DirectLineActivity, CardImage} from "botframework-directlinejs";

export class HeroCard implements AbstractConverter {
    public lineToDirectLine (event: Line.WebhookEvent): DirectLineActivity{
        return {} as DirectLineActivity;
    }

    public DirectLineToLine (event: DirectLineActivity): Line.Message {
        const attachment = event.attachments[0];
        const attachmentType = event.contentType;
        const content = attachment.content;
        let lineButtons = [];
        let image: CardImage;

        if (content.buttons) {
            for (const button of content.buttons) {
                lineButtons.push({
                    "type": "message",
                    "label": button.title,
                    "text": button.value
                })
            }
        }

        if (content.images) {
            image = content.images[0] as CardImage;
        }

        const lineMessage: Line.Message = {
            "type": "template",
            "altText": event.text,
            "template": {
              "type": "buttons",
              "title": content.title ? content.title : event.text,
              "text": content.text ? content.text : event.text,
            }
        }

        if (image) {
            lineMessage.template.thumbnailImageUrl = image.url;
        }

        if (content.buttons) {
            lineMessage.template.actions = lineButtons;
        }

        return lineMessage;
    }
}