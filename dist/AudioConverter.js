"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractConverter_1 = require("./AbstractConverter");
class AudioConverter extends AbstractConverter_1.AbstractConverter {
    constructor() {
        super();
    }
    DirectLineToLine(attachment) {
        const message = {
            duration: "99999999999",
            originalContentUrl: attachment.content.media ? attachment.content.media[0].url : "",
            type: "audio"
        };
        return message;
    }
}
exports.AudioConverter = AudioConverter;
//# sourceMappingURL=AudioConverter.js.map