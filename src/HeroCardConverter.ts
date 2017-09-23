import {HeroCard,CardAction} from "botframework-directlinejs";

//Want to consolidate with Interface like AbstractConverter for maintain easily
export class HeroCardConverter{
    public static DirectLineToLine (attachments: HeroCard[]): Line.TemplateMessage{
        //We expects there is at least 1 attachment
        if(attachments.length === 1){
            return this.CreateButtonTemplateMessage(attachments[0]);
        }
        else{
            return this.CreateCarouselTemplateMessage(attachments);
        }
    }

    private static CreateButtonTemplateMessage(attachment:HeroCard):Line.TemplateMessage{
        //Create Buttons
        const buttonsTemplate:Line.TemplateButtons ={
            type:"buttons",
            thumbnailImageUrl:attachment.content.images? attachment.content.images[0].url : "",
            title: attachment.content.title,
            text:attachment.content.text ? attachment.content.text : "",
            actions: attachment.content.buttons ? this.CreateMessageActions(attachment.content.buttons) : []
        };
        //Create Message
        const message:Line.TemplateMessage = {
            type:"template",
            altText:"Loading..", //TODO: Confirm what is good for this property and will modify.
            template:buttonsTemplate
        }
        return message;
    }

    private static CreateCarouselTemplateMessage(attachments:HeroCard[]):Line.TemplateMessage{
        //Create Column object
        const columnObjects:Line.TemplateColumn[] = [];
        for (let attachment of attachments){
            columnObjects.push({
               thumbnailImageUrl: attachment.content.images ? attachment.content.images[0].url : "",
               title : attachment.content.title,
               text: attachment.content.text ? attachment.content.text : "",
               actions: attachment.content.buttons ? this.CreateMessageActions(attachment.content.buttons) : [],
            });
        }

        //Create Carousel
        const carousel:Line.TemplateCarousel = {
            type:"carousel",
            columns: columnObjects
        }

        //Create Template Message
        const message:Line.TemplateMessage = {
            type:"template",
            altText:"Loading..",
            template:carousel
        }
        return message;
    }

    private static CreateMessageActions(buttons:CardAction[]):Line.TemplateAction<{label:string}>[]{
        const messageActions:Line.TemplateAction<{label:string}>[] = [];
        for (let button of buttons){
            messageActions.push({
                type:"message",
                label:button.title,
                text:button.value,
            });
        }
        return messageActions;
    }
}