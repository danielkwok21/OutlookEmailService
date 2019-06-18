const fs = require('fs')
const NotiEmail = function(content, recipients){
    return {
        message: {
            subject: "Outlook Mail Service Test",
            body: {
                contentType: "HTML",
                content: content || fs.readFileSync(__dirname+'/emailContent.html', 'utf8')
            },
            toRecipients: [
            {
                emailAddress: {
                    address: recipients || "kwokthedeveloper@gmail.com"
                }
            }
            ],
            // ccRecipients: [
            // {
            //     emailAddress: {
            //         address: "kwokthedeveloper@gmail.com"
            //     }
            // }
            // ]
        },
        saveToSentItems: "false"
    }
}

module.exports = NotiEmail