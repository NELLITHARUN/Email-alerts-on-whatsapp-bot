const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const ex =require('./ex');
// Start the webapp
const webApp = express();

// Webapp settings
webApp.use(bodyParser.urlencoded({
    extended: true
}));

webApp.use(bodyParser.json());

// Server Port

const PORT = ex.port;

// Home route
webApp.get('/', (req, res) => {
    res.send('Hello World!');
});

const WA = require('./callback-message');
const about = require('./about');

// Route for WhatsApp
webApp.post('/whatsapp', async (req, res) => {
    let message = req.body;
    let senderID = req.body.From;

    // Write a function to send message back to WhatsApp
    if(message.Body.toLowerCase() === 'check'){
        await WA.sendMessage('check', senderID);
    }
    else if(message.Body.toLowerCase() === 'about'){
        await about.aboutMessage(senderID);
    }
    else{
        await WA.sendMessage('Welcome to Email Alerts on WhatsApp, ' + 
        'Please send "check" to check your emails.', senderID);
    }

});

// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);


    //touch emailalert-unseen.js   yarn add imap mailparser

});

