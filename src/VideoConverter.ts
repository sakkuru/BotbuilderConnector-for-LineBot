import {AbstractConverter} from './AbstractConverter';
import {Message as DirectLineActivity,VideoCard} from "botframework-directlinejs";
// import {Client as LineClient} from "@line/bot-sdk"

export class VideoConverter extends AbstractConverter{
    constructor(){super();}
    public lineToDirectLine(event: Line.MessageEvent): DirectLineActivity {
        //Convert Line Video Data to Botframework Video data
        // var eventMessage: Line.EventMessageBase = event.message;
        // var moc:DirectLineActivity = new ;
    };

    public DirectLineToLine(event: DirectLineActivity): Line.Message{
        console.log("VideoConverter.DirectLineToLine started");
        if(event.attachments!=null && event.attachments[0].contentType ==  "application/vnd.microsoft.card.video"){
            let videoCard = event.attachments[0] as VideoCard;
            let lineVideoMessage: Line.VideoMessage = {
                type:'video',
                originalContentUrl: videoCard.content.media[0].url,
                previewImageUrl:videoCard.content.image.url
            }
            console.log("VideoConverter.DirectLineToLine Completed");
            return lineVideoMessage;
        }
        //For testing of null data from DirectLine
        let lineVideoMessage:Line.VideoMessage = {
                type:'video',
                // originalContentUrl:'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
                // previewImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'
                originalContentUrl:'',
                previewImageUrl:''
        }
        return lineVideoMessage;
    };
}