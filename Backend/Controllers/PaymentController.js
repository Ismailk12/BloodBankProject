/********************* Import All The Required Pakages *********************/

require("dotenv").config();
const Formidable = require("formidable");
const HTTPS = require("https");
const { v4: uuidv4 } = require("uuid");
const PaymentRequest = require("../Models/PaymentRequestModel");
const Payment = require("../Models/PaymentModel");

/********************* Import The PaytmChecksum File To Authenticate The Payment Requests *********************/

const PaytmChecksumFile = require("./PaytmChecksum");

/********************* Export The Controller Functionality *********************/

///**************** (1) Payments ****************///

exports.Payment = (Request, Response) => {

    const {
        PayableAmmount,
        CustomerEmail,
        CustomerMobileNumber,
        RecieverRequestID,
        RecieverUserEmail
    } = Request.body;

    const TotalAmount = JSON.stringify(PayableAmmount);

    /////**************** Prepare The Request Object ****************/////

    let Parameters = {
        MID: process.env.PAYTM_MERCHANT_ID,
        WEBSITE: process.env.PAYTM_WEBSITE,
        CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
        INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
        ORDER_ID: uuidv4(),
        CUST_ID: CustomerEmail,
        TXN_AMOUNT: TotalAmount,
        EMAIL: CustomerEmail,
        MOBILE_NO: CustomerMobileNumber,
        CALLBACK_URL: "http://localhost:5000/PaymentCallback"
    };

    /*** Save The Parameter In Database ***/

    PaymentRequest.create({
        ORDERID: Parameters.ORDER_ID,
        EMAIL: Parameters.EMAIL,
        MOBILE_NO: Parameters.MOBILE_NO,
        RECIEVER_RREQUEST_ID: RecieverRequestID,
        RECIEVER_EMAIL: RecieverUserEmail
    }).then(Update => {
        /////**************** Use PaytmChecksum To Generate A Signature ****************/////
        let Signature = PaytmChecksumFile.generateSignature(Parameters, process.env.PAYTM_MERCHANT_KEY);

        Signature.then(Result => {
            let PaytmChecksumResponce = {
                ...Parameters,
                "CHECKSUMHASH": Result
            };
            Response.json(PaytmChecksumResponce);

        }).catch(Error => {
            Response.status(500).json({
                message: "Error in Payment",
                error: Error.message
            });
        });

    }).catch(Error => {
        Response.status(500).json({
            message: "Error in Payment Request Saving",
            error: Error.message
        });
    });

};

/********************* It Is Called By The Paytm Server, And Paytm Server Will Send The Transaction Status *********************/

///**************** (2) Payments Callback ****************///

exports.PaymentCallback = (Request, Response) => {

    const Form = new Formidable.IncomingForm();

    Form.parse(Request, (Error, Fields, File) => {
        if (Error) {
            console.log(Error);
            return Response.status(500).json({ Error: Error.message });
        };

        const ChecksumHash = Fields.CHECKSUMHASH;
        delete Fields.CHECKSUMHASH;

        const IsVerified = PaytmChecksumFile.verifySignature(Fields, process.env.PAYTM_MERCHANT_KEY, ChecksumHash);
        if (IsVerified) {

            let Parameter = {
                MID: Fields.MID,
                ORDERID: Fields.ORDERID
            };

            PaytmChecksumFile.generateSignature(Parameter, process.env.PAYTM_MERCHANT_KEY).then(Chucksum => {
                Parameter["CHECKSUMHASH"] = Chucksum;
                const Data = JSON.stringify(Parameter);
                const RequestObject = {
                    hostname: "securegw-stage.paytm.in",
                    port: 443,
                    path: "/order/status",
                    method: "POST",
                    header: {
                        "Content-Type": "application/json",
                        "content-Length": Data.length
                    },
                    data: Data
                };

                let RESPONSE = "";
                let REQUEST = HTTPS.request(RequestObject, (ResponseFromPaytmServer) => {
                    ResponseFromPaytmServer.on("data", (Chunk) => {
                        RESPONSE += Chunk;
                    });

                    ResponseFromPaytmServer.on("end", () => {
                        let Result = JSON.parse(RESPONSE);
                        const {
                            TXNID, BANKTXNID, ORDERID, TXNAMOUNT, STATUS, TXNTYPE,
                            GATEWAYNAME, RESPCODE, RESPMSG, BANKNAME, MID,
                            PAYMENTMODE, REFUNDAMT, TXNDATE
                        } = Result;

                        PaymentRequest.update({ TXNID, BANKTXNID, ORDERID, TXNAMOUNT }, { where: { ORDERID: Result.ORDERID } }).then((affected) => {
                            if (affected[0] > 0) {
                                PaymentRequest.findOne({ where: { ORDERID: Result.ORDERID } }).then(Updated => {
                                    const EMAIL = Updated.EMAIL;
                                    const MOBILE_NO = Updated.MOBILE_NO;
                                    const RECIEVER_RREQUEST_ID = Updated.RECIEVER_RREQUEST_ID;
                                    const RECIEVER_EMAIL = Updated.RECIEVER_EMAIL;

                                    Payment.create({
                                        EMAIL, MOBILE_NO, RECIEVER_RREQUEST_ID, RECIEVER_EMAIL,
                                        TXNID, BANKTXNID, ORDERID, TXNAMOUNT, STATUS, TXNTYPE,
                                        GATEWAYNAME, RESPCODE, RESPMSG, BANKNAME, MID,
                                        PAYMENTMODE, REFUNDAMT, TXNDATE
                                    }).then((Success) => {
                                        PaymentRequest.destroy({ where: { ORDERID: Result.ORDERID } }).then(() => {
                                            Response.redirect(`http://localhost:3000/payment_status/${Result.ORDERID}`);
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                });
                            } else {
                                console.log("An error occured while Updating Payment Details");
                            };
                        }).catch(err => console.log(err));
                    });
                });

                REQUEST.write(Data);
                REQUEST.end();

            }).catch(Error => {
                Response.status(500).json({
                    message: "Error in Payment",
                    error: Error.message
                });
            });

        } else {
            console.log("Checksum Mismatched");
            Response.status(500).json({ Error: "It's a Hacker" });
        };
    });

};

///**************** (3) Transactions ****************///

exports.GetTransaction = (Request, Response) => {
    const { ORDERID } = Request.body;

    Payment.findOne({ where: { ORDERID: ORDERID } }).then((Result) => {
        Response.status(200).json({
            status: "Success",
            details: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured while finding transaction...!",
        });
    });

};