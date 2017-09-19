const builder = require('botbuilder');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const line = require('botbuilder-line');
const line = require('./dist/LineConnector.js');

// const Util = require('./Util');
// const util = new Util();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//=========================================================
// Bot Setup
//=========================================================

const port = process.env.port || process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('bot is listening on port %s', port);
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);

let replyToken;
// for getting all user input
app.all('/api/messages', (req, res, next) => {
    if (req.body.type === 'message' && req.body.text) {
        console.log(req.body);
        replyToken = req.body;
    }
    next();
});
app.post('/api/messages', connector.listen());

app.get('/', (req, res) => {
    res.send(`Bot is running on port ${port}!\n`);
});

const lineOptions = {
    channelAccessToken: process.env.LINE_TOKEN,
}
const lineChannel = new line.LineConnector(lineOptions);
bot.connector(line.lineChannelId, lineChannel);
// app.use('/line/webhook', lineChannel.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// // When user joins, it begin Greeting dialog
// bot.on('conversationUpdate', message => {
//     if (message.membersAdded) {
//         message.membersAdded.forEach(identity => {
//             if (identity.id === message.address.bot.id) {
//                 bot.beginDialog(message.address, 'Greeting');
//             }
//         });
//     }
// });

const firstChoices = {
    "いいランチのお店": {
        value: 'lunch',
        title: '行列のできるタイ料理屋',
        subtitle: 'ランチセットがコスパ良し',
        text: '品川駅から徒歩10分くらいのところにあるタイ料理屋。トムヤムクンヌードルがおすすめ。',
        imageURL: 'https://sakkuru.github.io/simple-bot-nodejs/images/tom.jpg',
        button: '予約する',
        url: 'http://example.com/'
    },
    "飲めるところ": {
        value: 'drink',
        title: '落ち着いた雰囲気の個室居酒屋',
        subtitle: 'なんでも美味しいが、特に焼き鳥がおすすめ',
        text: '品川駅から徒歩5分くらいの路地裏にひっそりある。',
        imageURL: 'https://sakkuru.github.io/simple-bot-nodejs/images/yaki.jpg',
        button: '予約する',
        url: 'http://example.com/'
    },
    "画像認識": {
        value: 'imageRecognition'
    },
    "その他": {
        value: 'others'
    }
};

// default first dialog
bot.dialog('/', [
    session => {
        console.log('replyToken', replyToken);
        session.send("こんにちは。");
        session.beginDialog('Greeting');

    }
]);

bot.dialog('Greeting', [
    session => {
        session.send("ボットが自動でお答えします。");
        session.beginDialog('FirstQuestion');
    }
]);

bot.dialog('FirstQuestion', [
    (session, results, next) => {
        builder.Prompts.choice(session, "何をお探しですか。", firstChoices, { listStyle: 3 });
    },
    (session, results, next) => {
        const choice = firstChoices[results.response.entity];
        console.log(results.response);

        if (choice.value === 'others') {
            session.beginDialog('GetFreeText');
            return;
        } else if (choice.value === 'imageRecognition') {
            session.beginDialog('ImageRecognition');
            return;
        }

        session.send('%sですね。\n\nこちらはいかがでしょうか。', results.response.entity);

        const card = new builder.HeroCard(session)
            .title(choice.title)
            .subtitle(choice.subtitle)
            .text(choice.text)
            .images([
                builder.CardImage.create(session, choice.imageURL)
            ])
            .buttons([
                builder.CardAction.openUrl(session, choice.url, choice.button)
            ]);

        const msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.beginDialog('EndDialog');
    }
]);

bot.dialog('GetFreeText', [
    session => {
        builder.Prompts.text(session, "自由に入力してください。");
    },
    (session, results) => {
        console.log(results.response);
        const res = util.getLuis(results.response).then(res => {
            console.log('res', res);
            // process LUIS response
        });
    }
]);

bot.dialog('ImageRecognition', [
    session => {
        builder.Prompts.attachment(session, '画像をアップロードしてください。（複数可）');
    },
    (session, results) => {
        const promises = [];
        results.response.forEach(content => {
            if (content.contentType.match('image')) {
                promises.push(util.getCognitiveResults(content.contentUrl));
            }
        });

        Promise.all(promises).then(imageDescs => {
            imageDescs.forEach(res => {
                session.send(res.description.captions[0].text);
            });
        });
    }
]);

bot.dialog('EndDialog', [
    session => {
        builder.Prompts.confirm(session, "疑問は解決しましたか？", { listStyle: 3 });
    },
    (session, results) => {
        console.log(results.response);
        if (results.response) {
            session.send('ありがとうございました。');
            session.endDialog();
        } else {
            session.send('お役に立てず申し訳ありません。');
            session.beginDialog('FirstQuestion');
        }
    }
]);

// help command
bot.customAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        const helpTexts = [
            'help: このヘルプメニュー。前のdialogは続いています。',
            'exit: dialogを終わらせ、 最初に戻ります。',
        ]
        session.send(helpTexts.join('\n\n'));
    }
});

// exit command
bot.dialog('Exit', [
    session => {
        session.endDialog("スタックを消去して終了します。");
        session.beginDialog('FirstQuestion');
    },
]).triggerAction({
    matches: /^exit$/i
});

// // Always accepts free text input
// bot.dialog('Any', [
//     session => {
//         session.endDialog("自由入力を受け付けました。");
//         session.beginDialog('FirstQuestion');
//     },
// ]).triggerAction({
//     matches: /^.*$/i
// });