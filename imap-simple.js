/*
const imaps = require('imap-simple');
const _ = require('lodash');

async function fetchMails() {
   const config = {
      imap: {
         user: 'nellitharun444@gmail.com',
         password: 'lnlevnotiedxwdvd',
         host: 'imap.gmail.com',
         port: 993,
         tls: true,
         authTimeout: 10000,
         tlsOptions: { rejectUnauthorized: false }
      }
   };

   let display = "";

   await imaps.connect(config).then(function (connection) {
      return connection.openBox('INBOX').then(function () {
         const searchCriteria = ['UNSEEN'];
         const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
         };

         return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            const subjects = messages.map(function (res) {
               return res.parts.filter(function (part) {
                  return part.which === 'HEADER';
               })[0].body.subject[0];
            });

            // console.log(subjects);

            const from = messages.map(function (res) {
               return res.parts.filter(function (part) {
                  return part.which === 'HEADER';
               })[0].body.from[0];
            });

            // console.log(from);

            const body = [];
            messages.forEach(function (item) {
               const all = _.find(item.parts, { "which": "TEXT" });
               // const html = (Buffer.from(all.body, 'base64').toString('ascii'));

               const needle = 'Content-Type: text/plain; charset="UTF-8"';
               const re = new RegExp(needle, 'gi');

               let result = 4;
               while (re.exec(all.body)) {
                  result += re.lastIndex;
               }
               body.push(all.body.substring(result, result + 5));
            });
            
            for (let i = 0; i < subjects.length; i++) {
               display += 'From: ' + from[i] + '\nSubject: ' + subjects[i] +
                  '\nMessage: ' + body[i] + '...\n\n';
            }

         });
      });
   });

   console.log( display);
}
fetchMails();
*/


//main function 
async function fetchMails() {
    //message configurations
    var imaps = require('imap-simple');
    const _ = require('lodash');
    const simpleParser = require('mailparser').simpleParser;

    const config = {
        imap: {
            user: 'nellitharun444@gmail.com',
            password: 'lnlevnotiedxwdvd',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000,
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
                        let currmail = `Sender: ${senders[i]} \n Subject: ${subjects[i] }\n \n`;
                        console.log(currmail);
                        display += currmail;
                    console.log(display);

                    }
                    connection.end();
                });
            });
        }).catch(function (connection) {
            console.log("connection falied");
          
           // console.log (display);
        });
    }
    fetchMails() ;

   


