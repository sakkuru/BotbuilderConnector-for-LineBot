"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Want to consolidate with Interface like AbstractConverter for maintain easily
class HeroCardConverter {
    static DirectLineToLine(attachments) {
        // We expects there is at least 1 attachment
        if (attachments.length === 1) {
            return this.CreateButtonTemplateMessage(attachments[0]);
        }
        else {
            return this.CreateCarouselTemplateMessage(attachments);
        }
    }
    static CreateButtonTemplateMessage(attachment) {
        // Create Buttons
        const buttonsTemplate = {
            actions: attachment.content.buttons ? this.CreateMessageActions(attachment.content.buttons) : [],
            text: attachment.content.text ? attachment.content.text : "",
            thumbnailImageUrl: attachment.content.images ? attachment.content.images[0].url : "",
            title: attachment.content.title,
            type: "buttons",
        };
        // Create Message
        const message = {
            altText: "Loading..",
            template: buttonsTemplate,
            type: "template",
        };
        return message;
    }
    static CreateCarouselTemplateMessage(attachments) {
        // Create Column object
        const columnObjects = [];
        for (const attachment of attachments) {
            columnObjects.push({
                actions: attachment.content.buttons ? this.CreateMessageActions(attachment.content.buttons) : [],
                text: attachment.content.text ? attachment.content.text : "",
                thumbnailImageUrl: attachment.content.images ? attachment.content.images[0].url : "",
                title: attachment.content.title,
            });
        }
        // Create Carousel
        const carousel = {
            columns: columnObjects,
            type: "carousel"
        };
        // Create Template Message
        const message = {
            altText: "Loading..",
            template: carousel,
            type: "template"
        };
        return message;
    }
    static CreateMessageActions(buttons) {
        const messageActions = [];
        for (const button of buttons) {
            messageActions.push({
                label: button.title,
                text: button.value,
                type: "message",
            });
        }
        return messageActions;
    }
}
exports.HeroCardConverter = HeroCardConverter;
//# sourceMappingURL=HeroCardConverter.js.map