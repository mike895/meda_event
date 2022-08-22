process.env.AFRICAS_TALKING_API_KEY;
process.env.AFRICAS_TALKING_SMS_USERNAME;
// ! Running as a sandbox
// const credentials = {
//   apiKey: "42ddb9e4e8a87f9a4bc3e82aaf00112b0229940ddd702504c9aafe9e31d552ba", // use your sandbox app API key for development in the test environment
//   username: "sandbox", //"century-cinema-app", // use 'sandbox' for development in the test environment
// };
const credentials = {
  apiKey:
    process.env.AFRICAS_TALKING_API_KEY ||
    '114d3daf3d5a88d146b68c7361ecbb9a537ff28ad30cce528e8b7326d369bbfa', // use your sandbox app API key for development in the test environment
  username: process.env.AFRICAS_TALKING_SMS_USERNAME || 'meda', // "century-cinema-app", // use 'sandbox' for development in the test environment
};
const { Telegraf } = require("telegraf")
// require("dotenv").config();
const QRCode = require('qrcode')

const bot = new Telegraf(process.env.BOT_TOKEN);
const Africastalking = require('africastalking')(credentials);

const sms = Africastalking.SMS;

async function sendSmsMessage(recipients, message) {
  try {
    await Promise.all(recipients.map((e) => sendMessage(e, message)));
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

async function sendMessage(recipient, message) {
  try {
    const result = await sms.send({
      from: '8165',
      to: recipient,
      message,
    });
    console.log('Message sent successfully');
  } catch (ex) {
    console.error(ex);
    console.log('Error sending a message');
  }
}

async function sendToBot(chatid, tickets_on_seats , msg){
  const images = []

//console.log("asdf",chatid,tickets_on_seats, msg);
  tickets_on_seats.map(ticketKey=>{
     //  console.log("fghjk",ticketKey)
       QRCode.toDataURL(ticketKey.ticketKey, function (err, url) {
	//console.log(url)
          let image = url.split(",")[1];
          bot.telegram.sendPhoto(chatid, {source: Buffer.from(image, "base64"),})
      })
  })
  await bot.telegram.sendMessage(chatid, msg)
}        

export { sendSmsMessage, sendMessage, sendToBot };
