import {AbstractConverter} from './AbstractConverter';
import {Message as DirectLineActivity,VideoCard} from "botframework-directlinejs";

export class VideoConverter extends AbstractConverter{
    constructor(){super();}
    public lineToDirectLine(event: Line.MessageEvent): DirectLineActivity {
        //Convert Line Video Data to Botframework Video data
        //TODO : need to impelment. I need to handle content object to get binary video data https://devdocs.line.me/en/#webhook-event-object
    };

    public DirectLineToLine(event: DirectLineActivity): Line.Message{
        console.log("VideoConverter.DirectLineToLine started");
        const lineVideoMessage: Line.VideoMessage = {
            type: "video",
            originalContentUrl:"",
            previewImageUrl:""
        }
        if(event.attachments && event.attachments[0].contentType ===  "application/vnd.microsoft.card.video"){
            for (const attachment of event.attachments) {
                let videoCard = attachment as VideoCard;
                if (videoCard.content && videoCard.content.media && videoCard.content.image) {
                    lineVideoMessage.originalContentUrl = videoCard.content.media[0].url;
                    lineVideoMessage.previewImageUrl = videoCard.content.image.url;
                }
            }
        }
        console.log("VideoConverter.DirectLineToLine Completed");
        return lineVideoMessage;
    };
}