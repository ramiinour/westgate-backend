
const ejs = require("ejs"),
    path = require("path"),
    transporter = require("../constants/email");
/**
 * 
 * @param {String} senderEmail sender email
 * @param {String} senderPassword sender password
 * @param {String} receiverEmail receiver Email
 * @param {String} template name of the template
 * @param {Object} templateData Object containing all the data of template
 * @param {String} subject subject of the Email
 * @returns 
 */
const sendEmail = (senderEmail = null, senderPassword = null, receiverEmail, template, templateData, subject) => {
    try {
        return ejs.renderFile(
            path.join(__dirname, `../templates/emails/${template}.ejs`),
            templateData,
            (err, data) => {
                if (err) {
                    console.log('error is here', err);
                } else {
                    let mainOptions = {
                        to: receiverEmail,
                        subject: subject,
                        html: data,
                        // cc: ['jawad@leadvy.com','sales@homesandbeyond.com.tr']
                        cc: ['mahmoud@leadvy.com',
                        'sufian@leadvy.com'
                    ]
                    };
                    let SendEmail = transporter(senderEmail, senderPassword);
                    return SendEmail.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                            return false;
                        } else {
                            console.log("Message sent: " + info.response);
                            return true;
                        }
                    });
                }
            }
        );
    } catch (error) {
        console.log(error)
        return false;
    }
}

module.exports = { sendEmail }