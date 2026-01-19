/********************* Import The Models *********************/

const Location = require("../Models/LocationModel");

/********************* Export The Controller Functionality *********************/

///**************** (1) Get All Locations ****************///

exports.GetAllLocations = (Request, Response) => {

    Location.findAll().then(Result => {
        Response.status(200).json(
            {
                message: "Location Fetched",
                states: Result
            }
        );

    }).catch(Error => {
        Response.status(500).json(
            {
                message: "Error in Database",
                error: Error.message
            }
        )
    });

};