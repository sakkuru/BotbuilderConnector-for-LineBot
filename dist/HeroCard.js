"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeroCard {
    lineToDirectLine(event) {
        return {};
    }
    DirectLineToLine(event) {
        const attachment = event.attachments[0];
        const content = attachment.content;
        const lineButtons = [];
        let image;
        if (content.buttons) {
            for (const button of content.buttons) {
                lineButtons.push({
                    "label": button.title,
                    "text": button.value,
                    "type": "message",
                });
            }
        }
        if (content.images) {
            image = content.images[0];
        }
        const lineMessage = {
            "altText": event.text,
            "template": {
                "text": content.text ? content.text : event.text,
                "title": content.title ? content.title : event.text,
                "type": "buttons"
            },
            "type": "template",
        };
        if (image) {
            lineMessage.template.thumbnailImageUrl = image.url;
        }
        if (content.buttons) {
            lineMessage.template.actions = lineButtons;
        }
        return lineMessage;
    }
}
exports.HeroCard = HeroCard;
//# sourceMappingURL=HeroCard.js.map