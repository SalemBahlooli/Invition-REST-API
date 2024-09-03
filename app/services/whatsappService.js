// app/services/whatsappService.js
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: "whatsapp:+14155238886", // this is default number for twilio using sandbox , change later
      to: `whatsapp:${to}`,
    });
    console.log(`Message sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

module.exports = {
  sendWhatsAppMessage,
};
