const ex =require('./ex');
const client = require('twilio')(ex.ACCOUNT_SID, ex.ACCOUNT_TOKEN, {
   lazyLoading: true
});

// Function to send message to WhatsApp
const aboutMessage = async (senderID) => {
      try {
         await client.messages.create({
            from: `whatsapp:+14155238886`,
            body: 'Hello there, welcome to Email alerts on Whatsapp.\n\n' + 
                  'This is a major college project made by THARUN (19C95a0505) and ' +
                  'sharadha(19c95a0506) of B.tech Computer Engineering with Specialization ' +
                  'in cse (4th year) under the guidance of mrs Ramya sri.\n' +
                  'Department of Computer Enginnering\nHoly Mary instuite of technology and science ' +
                  ', Hits',
            to: senderID
         });
      } catch (error) {
         console.log(`Error at sendMessage --> ${error}`);
      }
};

module.exports = {
   aboutMessage
};