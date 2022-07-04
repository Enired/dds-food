const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const twilio = require('twilio');
const client = new twilio(accountSID, authToken);

module.exports = (receiver, message) => {
  client.messages.create({
    from: twilioNumber,
    to: receiver,
    body: message
  })
    .then((message) => console.log(message));
};
