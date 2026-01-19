/********************* Import The Required Pakages *********************/

require("dotenv").config();
const Express = require("express");
const BodyParser = require("body-parser");
const sequelize = require("./Database/Database"); // Sequelize instance
const CookieParser = require("cookie-parser");
const FileUpload = require("express-fileupload");

/********************* Import The Routes *********************/

const UserRouter = require("./Routes/UserRouter");
const UploadRouter = require("./Routes/UploadRouter");
const LocationRouter = require("./Routes/LocationRouter");
const BloodBankRouter = require("./Routes/BloodBankRouter");
const DonationCampRouter = require("./Routes/DonationCampRouter");
const DonationRequestRouter = require("./Routes/DonationRequestRouter");
const PaymentsRouter = require("./Routes/PaymentsRouter");

/********************* Initialise The Libraries *********************/

const App = Express();
App.use(BodyParser.json());
// App.use(Express.urlencoded({ extended: true }));
App.use(CookieParser());
App.use(FileUpload({
    useTempFiles: true
}));

/********************* Handle The CORS *********************/

App.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

/********************* Start Using The Routes *********************/

App.use("/", UserRouter);
App.use("/", UploadRouter);
App.use("/", LocationRouter);
App.use("/", BloodBankRouter);
App.use("/", DonationCampRouter);
App.use("/", DonationRequestRouter);
App.use("/", PaymentsRouter);

/********************* Declare The PORT *********************/

const PORT = process.env.PORT || 5000;

/********************* Connect To SQLite & Sync Models *********************/

sequelize.sync({ force: false }).then(() => {
    console.log("Connected to SQLite and Models Synced");

    /**************** Start The Server ****************/

    App.listen(PORT, () => {
        console.log(`Server is listening at Port : ${PORT}`)
    });
}).catch(error => {
    console.error("Database Connection Error:", error);
});