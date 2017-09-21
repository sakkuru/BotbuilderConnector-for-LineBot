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
        let lineVideoMessage: Line.VideoMessage;
        if(event.attachments!=null && event.attachments[0].contentType ==  "application/vnd.microsoft.card.video"){
            let videoCard = event.attachments[0] as VideoCard;
            lineVideoMessage = {
                type:'video',
                originalContentUrl: videoCard.content.media[0].url,
                previewImageUrl:videoCard.content.image.url
            }
        }
        else{
            //return empty video message
            lineVideoMessage = {
                type:'video',
                originalContentUrl:'',
                previewImageUrl:''
            }
        }
        console.log("VideoConverter.DirectLineToLine Completed");
        return lineVideoMessage;
    };
}