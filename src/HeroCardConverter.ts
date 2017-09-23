import {CardAction, HeroCard} from "botframework-directlinejs";

// Want to consolidate with Interface like AbstractConverter for maintain easily
export class HeroCardConverter{
    public static DirectLineToLine (attachments: HeroCard[]): Line.TemplateMessage{
        // We expects there is at least 1 attachment
        if(attachments.length === 1){
            return this.CreateButtonTemplateMessage(attachments[0]);
        }
        else{
            return this.CreateCarouselTemplateMessage(attachments);
        }
    }

    private static CreateButtonTemplateMessage(attachment:HeroCard):Line.TemplateMessage{
        // Create Buttons
        const buttonsTemplate:Line.TemplateButtons = {
            actions: attachment.content.buttons ? this.CreateMessageActions(attachment.content.buttons) : [],
            text:attachment.content.text ? attachment.content.text : "",
            thumbnailImageUrl: attachment.content.images? attachment.content.images[0].url : "",
            title: attachment.content.title,
            type:"buttons",
        };

        // Create Message
        const message: Line.TemplateMessage = {
            altText: "Loading..", // TODO: Confirm what is good for this property and will modify.
            template:buttonsTemplate,
            type: "template",
        }
        return message;
    }

    private static CreateCarouselTemplateMessage(attachments:HeroCard[]):Line.TemplateMessage{
        // Create Column object
        const columnObjects:Line.TemplateColumn[] = [];
        for (const attachment of attachments){
            columnObjects.push({
                actions: attachment.content.buttons ? this.CreateMessageActions(attachment.content.buttons) : [],
                text: attachment.content.text ? attachment.content.text : "",
                thumbnailImageUrl: attachment.content.images ? attachment.content.images[0].url : "",
                title : attachment.content.title,

            });
        }

        // Create Carousel
        const carousel:Line.TemplateCarousel = {
            columns: columnObjects,
            type: "carousel"
        }

        // Create Template Message
        const message:Line.TemplateMessage = {
            altText: "Loading..",
            template: carousel,
            type: "template"
        }
        return message;
    }

    private static CreateMessageActions(buttons:CardAction[]): Array<Line.TemplateAction<{label:string}>> {
        const messageActions:Array<Line.TemplateAction<{label:string}>> = [];
        for (const button of buttons){
            messageActions.push({
                label: button.title,
                text: button.value,
                type: "message",
            });
        }
        return messageActions;
    }
}