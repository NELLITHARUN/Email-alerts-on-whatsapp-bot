async function fetchMails() {
   //message configurations
   var imaps = require('imap-simple');
   const _ = require('lodash');
   const simpleParser = require('mailparser').simpleParser;

   const config = {
       imap: {
           user: 'mailid',
           password: 'password',
           host: 'imap.gmail.com',
           port: 993,
           tls: true,
           authTimeout: 10000,
           tlsOptions: { rejectUnauthorized: false }
       }};
       let display = "";
       const result = await imaps.connect(config).then(function (connection) {
           console.log("connected");

           return connection.openBox('INBOX').then(function () {
               console.log("opened Inbox");

               //different search criteria with different keywords
               var searchCriteria;
              
                   searchCriteria = [
                       'UNSEEN'
                   ];
           
              searchCriteria = [
                       '1:2'
                   ];
             


                var fetchOptions = {
                   bodies: ['HEADER', 'TEXT'],
                   markSeen: false
               };
               return connection.search(searchCriteria, fetchOptions).then(function (results) {
                   var subjects = results.map(function (res) {
                       return res.parts.filter(function (part) {
                           return part.which === 'HEADER';
                       })[0].body.subject[0];
                   });

                   var senders = results.map(function (res) {
                       return res.parts.filter(function (part) {
                           return part.which === 'HEADER';
                       })[0].body.from[0];
                   });

                   //console.log(subjects);
                   for (let i = 0; i < subjects.length && i < 5; i++) {
                       let currmail = `From: ${senders[i]} \n Subject: ${subjects[i] } \n }\n \n`;
                       console.log(currmail);
                       display += currmail;
                     //  console.log(display);

                   }
                   connection.end();
               });
           });
       }).catch(function (connection) {
           console.log("connection falied");
         
       });

       return display;
   }
  

module.exports = fetchMails;
