import {AbstractConverter} from './AbstractConverter';
import {Message as DirectLineActivity,VideoCard} from "botframework-directlinejs";

export class VideoConverter extends AbstractConverter{
    constructor(){super();}
    public lineToDirectLine(event: Line.MessageEvent): DirectLineActivity {
        //Convert Line Video Data to Botframework Video data
        //TODO : need to impelment. I need to handle content object to get binary video data https://devdocs.line.me/en/#webhook-event-object
    };

    public DirectLineToLine(event: DirectLineActivity): Line.Message[]{
        console.log("VideoConverter.DirectLineToLine started");
        const lineVideoMessageArray: Line.VideoMessage[] = new Array();
        if(event.attachments){
            for (let attachment of event.attachments) {
                if(attachment.contentType === "application/vnd.microsoft.card.video"){
                    let videoCard = attachment as VideoCard;
                    if (videoCard.content && videoCard.content.media && videoCard.content.image) {
                        const lineVideoMessage: Line.VideoMessage = {
                            type: "video",
                            originalContentUrl:videoCard.content.media[0].url,
                            previewImageUrl:videoCard.content.image.url
                        }
                        lineVideoMessageArray.push(lineVideoMessage);
                    }
                }
            }
        }
        console.log("VideoConverter.DirectLineToLine Completed");
        return lineVideoMessageArray;
    };
}