## How to get going with line

1. Download the line app and sign up for line, if you don't have an account yet

2. Make sure you set up an email address and passwort for line, for example if you signed with facebook (App -> Settings -> Account)

3. Create LINE Business account
    * [LINE BUSINESS CENTER](https://business.line.me)
    * Messaging API -> Developer Trial

3. Get you account set up and get the channel access token
    * LINE BUSINESS CENTER > Accounts > Your Account > Messaging API > Line Developers
    * Create and save you Channel Access Token

4. Whitelist your server or dev machine
    * To send messages to the the line messages endpoint you need to whitelist you local dev machines or server where you run you bot or connector
    * [Line Developers Portal](https://developers.line.me/ba) -> Server IP Whitelist

5. Set up your webhook URL for line
    * [Line Developers Portal](https://developers.line.me/ba) -> Edit -> Webhook URL
    * You will need to set an https endpoint
    * After saving the Webhook you can go back and click verify to test you endpoint

6. Connect the your Webhook to your Line account / Bot
    * Visit the [Line@ Manager] -> Your Account -> Setting -> Messaging API -> Settings -> Use Webhooks -> Allow 

## Links

* [Simple LINE Bot in Node.js](https://github.com/sakkuru/line-bot-nodejs)