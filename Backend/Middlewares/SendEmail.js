/********************* Import All The Required Pakages *********************/

const Nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";



const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env



const OAuth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
);



/********************* Define Send Email Controller Functionality *********************/

const SendEmail = (To, VerificationCode, TXT, DESCRIPTION) => {

    if (!MAILING_SERVICE_CLIENT_ID || MAILING_SERVICE_CLIENT_ID.includes("xxxx")) {
        console.log("------------------------------------------");
        console.log("SKIP EMAIL: Mailing credentials not configured.");
        console.log(`TO: ${To}`);
        console.log(`CODE: ${VerificationCode}`);
        console.log("------------------------------------------");
        return;
    }

    OAuth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    });

    const AccessToken = OAuth2Client.getAccessToken();
    const SMTP_Transport = Nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            AccessToken
        }
    });

    const MailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: To,
        subject: "noreply",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ufrhub repository.</h2>
            <p>${DESCRIPTION}</p>
        
            <p style="max-width: 200px; margin:auto;">${TXT}</p>
        
            <div style=" max-width: 300px; margin:auto; color: blue; font-weight: 700; letter-spacing: 1rem; border: 10px solid #ddd; padding: 20px 20px; font-size: 3rem; text-align: center; ">${VerificationCode}</div>
            </div>
        `
    };

    SMTP_Transport.sendMail(MailOptions, (error, information) => {
        if (error) {
            console.error("Email Error:", error.message);
            return error;
        } else {
            return information;
        }
    });

};



/********************* Export Send Email Controller Functionality *********************/

module.exports = SendEmail;