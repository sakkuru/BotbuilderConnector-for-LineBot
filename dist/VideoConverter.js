"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VideoConverter {
    DirectLineToLine(attachment) {
        const message = {
            originalContentUrl: attachment.content.media ? attachment.content.media[0].url : "",
            previewImageUrl: attachment.content.image ? attachment.content.image.url : "",
            type: "video"
        };
        return message;
    }
}
exports.VideoConverter = VideoConverter;
//# sourceMappingURL=VideoConverter.js.map