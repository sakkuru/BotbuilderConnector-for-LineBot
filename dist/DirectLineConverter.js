"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AudioConverter_1 = require("./AudioConverter");
const HeroCardConverter_1 = require("./HeroCardConverter");
const VideoConverter_1 = require("./VideoConverter");
class DirectLineConverter {
    static convertDirectLineToLine(dlMessage) {
        const lineMessages = [];
        if (dlMessage.text) {
            lineMessages.push({
                text: dlMessage.text,
                type: "text"
            });
        }
        // Iterate over all possible attachments and add them to message array
        //Viode, Audio card will be single message.
        //Hero card may transform to carousel(inclues multiple items in single message)
        const heroCards = [];
        for (const attachment of dlMessage.attachments || []) {
            let isSupported = false;
            let converter = null;
            switch (attachment.contentType) {
                case "application/vnd.microsoft.card.video":
                    converter = new VideoConverter_1.VideoConverter();
                    break;
                case "application/vnd.microsoft.card.audio":
                    converter = new AudioConverter_1.AudioConverter();
                    break;
                case "application/vnd.microsoft.card.hero":
                    heroCards.push(attachment);
                    isSupported = true;
                    break;
                default:
                    break;
            }
            if (converter) {
                lineMessages.push(converter.DirectLineToLine(attachment));
            }
            else if (isSupported) {
                //TODO: It is dirty conditionnal junp.. will consolidate if statement above.
            }
            else {
                lineMessages.push({
                    text: `Unsupported DirectLine type: ${attachment.contentType}`,
                    type: "text"
                });
            }
        }
        if (heroCards.length > 0) {
            lineMessages.push(HeroCardConverter_1.HeroCardConverter.DirectLineToLine(heroCards));
        }
        return lineMessages;
    }
}
exports.DirectLineConverter = DirectLineConverter;
//# sourceMappingURL=DirectLineConverter.js.map