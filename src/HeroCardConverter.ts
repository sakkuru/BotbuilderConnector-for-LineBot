import {AbstractConverter} from './AbstractConverter';
import {
    Activity as DirectLineActivity,
    CardImage
} from "botframework-directlinejs";

export class HeroCardConverter implements AbstractConverter {
    public lineToDirectLine (event: Line.WebhookEvent): DirectLineActivity{
        return {} as DirectLineActivity;
    }

    public DirectLineToLine (event: DirectLineActivity): Line.Message {
        const attachment = event.attachments[0];
        const content = attachment.content;
        const lineButtons = [];
        let image: CardImage;

        if (content.buttons) {
            for (const button of content.buttons) {
                lineButtons.push({
                    "label": button.title,
                    "text": button.value,
                    "type": "message",
                })
            }
        }

        if (content.images) {
            image = content.images[0] as CardImage;
        }

        const lineMessage: Line.Message = {
            "altText": event.text,
            "template": {
              "text": content.text ? content.text : event.text,
              "title": content.title ? content.title : event.text,
              "type": "buttons"
            },
            "type": "template",
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