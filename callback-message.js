const fetchMails = require('./mail');
const ex =require('./ex');
const client = require('twilio')(ex.ACCOUNT_SID, ex.ACCOUNT_TOKEN, {
   lazyLoading: true
});

// Function to send message to WhatsApp
const sendMessage = async (message, senderID) => {
   console.log(message);
   if (message == 'check') {
     
      try {
         fetchMails().then(display => {
            client.messages.create({
               from: `whatsapp:+14155238886`,
               body:display,
               to: senderID
            });
           
         })
      } catch (error) {
         console.log(`Error at sendMessage --> ${error}`);
      }
   }
   else {
      try {
         await client.messages.create({
            from: `whatsapp:+14155238886`,
            body: message,
            to: senderID
         });
         
         
      } catch (error) {
         console.log(`Error at sendMessage --> ${error}`);
      }
   }
};

module.exports = {
   sendMessage
};

