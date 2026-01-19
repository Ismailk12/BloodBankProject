/********************* Import The Models *********************/

const DonationRequest = require("../Models/DonationRequestModel");

/********************* Export The Controller Functionality *********************/

///**************** Save Donation Request ****************///

exports.SaveDonationRequest = (Request, Response) => {

    const {
        Name,
        Gender,
        DateOfBirth,
        MobileNumber,
        Address,
        TentativeDate,
        State,
        District,
        BloodBankName,
        BloodGroup,
        GoIID,
        GoIIDNumber
    } = Request.body;

    DonationRequest.create({
        Name,
        Gender,
        DateOfBirth,
        MobileNumber,
        Address,
        TentativeDate,
        State,
        District,
        BloodBankName,
        BloodGroup,
        GoIID,
        GoIIDNumber
    }).then(Result => {
        Response.status(200).json(
            {
                message: "Request Saved",
                result: Result
            }
        );

    }).catch(Error => {
        Response.status(500).json(
            {
                error: Error.message,
                message: "An error occured while saving donation request"
            }
        )
    });

};