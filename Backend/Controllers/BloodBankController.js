/********************* Import The Models *********************/

const BloodBankModel = require("../Models/BloodBankModel");
const { Op } = require("sequelize");

/********************* Export The Controller Functionality *********************/

///**************** (1) Add New Blood Bank ****************///

exports.AddNewBloodBank = (Request, Response) => {

    const {
        State,
        District,
        City,
        BloodBank,
        ParentHospital,
        ShortName,
        Category,
        ContactPerson,
        Email,
        Phone,
        FAX,
        Licence,
        FromDate,
        ToDate,
        ComponentFacility,
        ApheresisFacility,
        HelplineNumber,
        Address,
        PinCode,
        Website,
        NumberOfBeds,
        DonorType,
        DonationType,
        ComponentType,
        BagType,
        TTIType,
        Remarks,
        ChargeTarrifDetails,
        AreaDetails,
        StorageDetails,
        RefreshmentDetails,
        UserType,
        Availability,
        Type,
        BloodType,
        LastUpdated
    } = Request.body;

    if (!State || !District || !BloodBank || !Category || !ContactPerson || !Email || !Phone || !Address || !PinCode || !DonorType || !DonationType || !AreaDetails || !StorageDetails || !RefreshmentDetails || !UserType) {
        Response.status(400).json({
            status: "Failed",
            message: "Empty fields"
        });

    } else if (Email && !validateEmail(Email)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid email entered",
        });

    } else if (!validPinCode(PinCode)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid Pin Code entered",
        });

    } else if (!validateMobileNumber(Phone)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid Mobile Number entered",
        });

    } else {
        BloodBankModel.create({
            State,
            District,
            City,
            BloodBank,
            ParentHospital,
            ShortName,
            Category,
            ContactPerson,
            Email,
            Phone,
            FAX,
            Licence,
            FromDate,
            ToDate,
            ComponentFacility,
            ApheresisFacility,
            HelplineNumber,
            Address,
            PinCode,
            Website,
            NumberOfBeds,
            DonorType,
            DonationType,
            ComponentType,
            BagType,
            TTIType,
            Remarks,
            ChargeTarrifDetails,
            AreaDetails,
            StorageDetails,
            RefreshmentDetails,
            UserType,
            Availability,
            Type,
            BloodType,
            LastUpdated
        }).then((Result) => {
            Response.status(200).json({
                message: "Blood Bank Added Successfully",
                bloodBankName: Result.BloodBank
            });

        }).catch(Error => {
            Response.status(500).json({
                error: Error.message,
                message: "An Error Occured While Adding New Blood Bank"
            })
        });
    }

};

///**************** (2) Filter Blood Banks ****************///

exports.FilterBloodBanks = (Request, Response) => {

    const {
        State,
        District,
        Limit,
        Page = 1
    } = Request.body;

    let Filters = {};

    if (State && !District) {
        Filters.State = State;
    }

    if (District) {
        Filters.District = District;
    }

    BloodBankModel.findAll({ where: Filters }).then(Result => {
        let PageLimit = Limit || Result.length;
        let PageNumber = parseInt(Page);

        const Paginate = (Array, PageSize, PageNumber) => {
            let PaginatedResult = Array.slice((PageNumber - 1) * PageSize, PageNumber * PageSize);
            return PaginatedResult;
        };

        let TemporaryArray = Paginate(Result, PageLimit, PageNumber);

        Response.status(200).json({
            message: "Blood Bank Filtered List",
            totalResult: Result,
            bloodBanks: TemporaryArray,
            totalResultsCount: Result.length,
            pageNumber: PageNumber,
            limit: PageLimit
        });

    }).catch(Error => {
        Response.status(500).json(
            {
                error: Error.message,
                message: "An error occured while filtering blood banks"
            }
        );
    });

};

///**************** (3) Get Blood Banks By Email ****************///

exports.GetBloodBanksByEmail = (Request, Response) => {
    const { Email } = Request.body;

    BloodBankModel.findAll({ where: { Email } }).then(Result => {
        Response.status(200).json({
            message: "Blood Banks Fetched",
            result: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            message: "An error occured while searching for blood banks",
            error: Error.message
        });
    });
};

///**************** (4) Get Blood Banks By Location ****************///

exports.GetBloodBanksByLocation = (Request, Response) => {
    const { state, district } = Request.body;

    BloodBankModel.findAll({ where: { State: state, District: district } }).then(Result => {
        Response.status(200).json({
            message: "Blood Banks Fetched",
            result: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            message: "An error occured while searching for blood banks",
            error: Error.message
        });
    });
};

///**************** (5) Delete Blood Bank ****************///

exports.DeleteBloodBank = (Request, Response) => {
    const { BloodBank } = Request.body;

    BloodBankModel.destroy({ where: { BloodBank } }).then((Result) => {
        if (Result > 0) {
            Response.status(200).json({
                message: "Successfully deleted Blood Bank",
                deletedBloodBank: BloodBank
            });
        } else {
            Response.status(404).json({
                message: "Blood Bank Not Found"
            });
        }

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured while finding Blood Bank...!"
        });
    });

};

/********************* Function To Validate Email *********************/

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

/********************* Function To Validate Pin Code *********************/

function validPinCode(pin) {
    if (/^[1-9][0-9]{5}$/.test(pin)) {
        return true;
    } else { return false; }
};

/********************* Function To Validate Mobile Number *********************/

function validateMobileNumber(number) {
    const re = /^[6-9]\d{9}$/gi;
    return re.test(number);
};