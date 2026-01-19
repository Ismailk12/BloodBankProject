/********************* Import The Models *********************/

const UserModel = require("../Models/UserModel");
const Token = require("../Models/TokenModel");
const { Op } = require("sequelize");

/********************* Import All The Required Pakages *********************/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendEmail = require("../Middlewares/SendEmail");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const Client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);
const Fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));



/********************* Export The Controller Functionality *********************/

///**************** (1) Register New Users ****************///

exports.RegisterNewUsers = (Request, Response) => {

    const {
        FirstName,
        LastName,
        DateOfBirth,
        Gender,
        Email,
        State,
        District,
        PinCode,
        MobileNumber,
        Password,
        UserType
    } = Request.body;

    function prepareDate(DOB) {
        const [d, m, y] = DOB.split("-"); //Split the string
        return [y, m - 1, d]; //Return as an array with y,m,d sequence
    };

    const str1 = DateOfBirth.slice(0, 4);
    const str2 = DateOfBirth.slice(4, 8);
    const str3 = DateOfBirth.slice(8);
    let DateOfBirthString = str3 + str2 + str1;
    let DateOfBirthInMilliseconds = new Date(...prepareDate(DateOfBirthString));
    const NewDate = new Date().getTime();
    const ValidDate = NewDate - DateOfBirthInMilliseconds;
    const DateOfBirthArray = DateOfBirthString.split("");
    let newDateOfBirth = "";

    if (!FirstName || !DateOfBirth || !Gender || !Email || !State || !District || !PinCode || !MobileNumber || !Password) {
        Response.status(400).json({
            status: "Failed",
            message: "Empty fields"
        });

    } else if (!/^[a-z A-Z]*$/.test(FirstName)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid First Name entered",
        });

    } else if (!/^[a-z A-Z]*$/.test(LastName)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid Last Name entered",
        });

    } else if (ValidDate < 567993600000) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid date of birth, you should be 18+",
        });

    } else if (!validateEmail(Email)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid email entered",
        });

    } else if (!validPinCode(PinCode)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid Pin Code entered",
        });

    } else if (!validateMobileNumber(MobileNumber)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid Mobile Number entered",
        });

    } else if (Password.length < 8) {
        Response.status(400).json({
            status: "Failed",
            message: "Passeord too short",
        });

    } else {
        UserModel.findAll({ where: { Email } }).then(Result => {
            if (Result.length) {
                Response.status(400).json({
                    status: "Failed",
                    message: "User already exists...!",
                });

            } else {

                const emailVerificationCode = generateCode();
                console.log("------------------------------------------");
                console.log(`VERIFICATION CODE FOR ${Email}: ${emailVerificationCode}`);
                console.log("------------------------------------------");
                const saltRounds = 12;

                bcrypt.hash(emailVerificationCode, saltRounds).then((hashedEmailVerificationCode) => {

                    bcrypt.hash(Password, saltRounds).then((hashedPassword) => {

                        if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "1") {
                            DateOfBirthArray.splice(3, 2, "Jan");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "2") {
                            DateOfBirthArray.splice(3, 2, "Feb");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "3") {
                            DateOfBirthArray.splice(3, 2, "Mar");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "4") {
                            DateOfBirthArray.splice(3, 2, "Apr");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "5") {
                            DateOfBirthArray.splice(3, 2, "May");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "6") {
                            DateOfBirthArray.splice(3, 2, "Jun");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "7") {
                            DateOfBirthArray.splice(3, 2, "Jul");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "8") {
                            DateOfBirthArray.splice(3, 2, "Aug");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "0" && DateOfBirthString.charAt(4) === "9") {
                            DateOfBirthArray.splice(3, 2, "Sep");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "1" && DateOfBirthString.charAt(4) === "0") {
                            DateOfBirthArray.splice(3, 2, "Oct");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "1" && DateOfBirthString.charAt(4) === "1") {
                            DateOfBirthArray.splice(3, 2, "Nov");
                            newDateOfBirth = DateOfBirthArray.join("");

                        } else if (DateOfBirthString.charAt(3) === "1" && DateOfBirthString.charAt(4) === "2") {
                            DateOfBirthArray.splice(3, 2, "Dec");
                            newDateOfBirth = DateOfBirthArray.join("");
                        }

                        const NewRequest = {
                            FirstName,
                            LastName,
                            DateOfBirth: newDateOfBirth,
                            Gender,
                            Email,
                            State,
                            District,
                            PinCode,
                            MobileNumber,
                            Password: hashedPassword,
                            UserType,
                            EmailVerificationCode: hashedEmailVerificationCode,
                        };

                        const Activation_Token = createActivationToken(NewRequest);

                        const DESCRIPTION = `Congratulations! You're almost set to start using My Website.
                                    Just copy the verification code below to verify your email address. The Code Will Expire in Five Minutes...!`

                        SendEmail(Email, emailVerificationCode, "Your Email Verification Code...!", DESCRIPTION);

                        Response.status(200).json({
                            status: "SUCCESS",
                            message: "Verification Email Sent. Verify Your Email...!",
                            token: Activation_Token
                        });

                    }).catch(Error => {
                        Response.status(500).json({
                            error: Error.message,
                            message: "An error occured while encrypting Password...!",
                        });
                    });

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error.message,
                        message: "An error occured while encrypting Email Verification Code...!",
                    });
                });
            };

        }).catch(Error => {
            Response.status(500).json({
                error: Error.message,
                message: "An error occured while finding the older new user request...!",
            });
        });

    };

};



///**************** (2) Activate Email For The New User ****************///

exports.ActivateEmail = (Request, Response) => {

    const { Activation_Token, emailVerificationCode } = Request.body;

    jwt.verify(Activation_Token, process.env.ACTIVATION_TOKEN_SECRET, (Error, Decoded) => {
        if (Error) {
            Response.status(500).json({
                error: Error.message,
                message: "Code Expired... Try Again...!",
            });

        } else {
            const {
                FirstName,
                LastName,
                DateOfBirth,
                Gender,
                Email,
                State,
                District,
                PinCode,
                MobileNumber,
                Password,
                UserType,
                EmailVerificationCode,
            } = Decoded;

            UserModel.findAll({ where: { Email } }).then(Result => {
                if (Result.length > 0) {
                    Response.status(400).json({
                        message: "Account record doesn't exist or has been verified already. Please sign up or log in."
                    });

                } else {
                    bcrypt.compare(emailVerificationCode, EmailVerificationCode).then((isMatched) => {
                        if (isMatched) {
                            const NewUser = new UserModel({
                                FirstName,
                                LastName,
                                DateOfBirth,
                                Gender,
                                Email,
                                State,
                                District,
                                PinCode,
                                MobileNumber,
                                Password,
                                UserType,
                                Verified: true
                            });

                            NewUser.save().then(Result => {
                                Response.status(200).json({
                                    user: Result.FirstName,
                                    message: "Account has been activated successfully...!"
                                });

                            }).catch(Error => {
                                Response.status(500).json({
                                    error: Error.message,
                                    message: "An error occured while saving new user...!"
                                });
                            });

                        } else {
                            Response.status(400).json({
                                message: "Incorrect Code...!"
                            });
                        };

                    }).catch(Error => {
                        Response.status(500).json({
                            error: Error.message,
                            message: "An error occured while comparing email verification code...!"
                        });
                    });

                };

            }).catch(Error => {
                Response.status(500).json({
                    error: Error.message,
                    message: "An error occured while finding existing user...!"
                });
            });

        };
    });

};



///**************** (3) User Login ****************///

exports.UserLogin = (Request, Response) => {

    const {
        Email,
        Password
    } = Request.body;

    if (!Email || !Password) {
        Response.status(400).json({
            status: "Failed",
            message: "Empty fields"
        });

    } else {
        UserModel.findOne({ where: { Email } }).then(Result => {
            if (!Result) {
                Response.status(400).json({
                    message: "This email does not exist...!"
                });

            } else {
                const userPassword = Result.Password;

                bcrypt.compare(Password, userPassword).then(isMatched => {
                    if (isMatched) {
                        const Refresh_Token = createRefreshToken({ id: Result.id });

                        Response.cookie("refreshtoken", Refresh_Token, {
                            httpOnly: true,
                            path: '/user/refresh_token',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                        });

                        Response.status(200).json({
                            message: "User Logged In Successfully...!",
                        });

                    } else {
                        Response.status(400).json({
                            message: "Password is incorrect...!"
                        });
                    };

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error.message,
                        message: "An error occured while comparing password...!"
                    });
                });
            };

        }).catch(Error => {
            Response.status(500).json({
                error: Error.message,
                message: "An error occured while searching for existing user...!"
            });
        });
    };

};



///**************** (4) User Login Access Token ****************///

exports.GetAccessToken = (Request, Response) => {

    try {
        const Refresh_Token = Request.cookies.refreshtoken
        if (!Refresh_Token) {
            return Response.status(400).json({
                message: "Please login now...!"
            });

        } else {
            jwt.verify(Refresh_Token, process.env.REFRESH_TOKEN_SECRET, (Error, Decoded) => {
                if (Error) {
                    Response.status(400).json({
                        message: "Please login now...!"
                    });

                } else {
                    const Access_Token = createAccessToken({ id: Decoded.id })
                    Response.json({ Access_Token });
                };
            });
        };

    } catch (Error) {
        return Response.status(500).json({
            message: Error.message
        });
    };

};



///**************** (5) Forgot Password ****************///

exports.ForgotPassword = (Request, Response) => {

    const { Email } = Request.body;

    UserModel.findOne({ where: { Email } }).then(Result => {
        if (Result) {
            const VerificationCode = generateCode();
            console.log("------------------------------------------");
            console.log(`PASSWORD RESET CODE FOR ${Email}: ${VerificationCode}`);
            console.log("------------------------------------------");
            const saltRounds = 12;

            bcrypt.hash(VerificationCode, saltRounds).then((hashedVerificationCode) => {
                const UserData = {
                    _id: Result._id,
                    Email,
                    VerificationCode: hashedVerificationCode
                };

                const Access_Token = createAccessToken(UserData);
                Token.create({
                    token: Access_Token,
                    createdAt: Date.now().toString(),
                    expiresAt: (Date.now() + 900000).toString()
                }).then(() => {
                    const DESCRIPTION = "To Reset Your Password Verify Your Email. The Code Will Expire in 15 Minutes...!";

                    SendEmail(Email, VerificationCode, "Reset your password", DESCRIPTION);

                    Response.status(200).json({
                        status: "SUCCESS",
                        message: "Verification Code Sent. To Reset password, please check your email...!",
                        token: Access_Token
                    });

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error.message,
                        message: "An error occured while saving access token...!"
                    });
                });

            }).catch(Error => {
                Response.status(500).json({
                    error: Error.message,
                    message: "An error occured while encrypting verification code...!"
                });
            });

        } else {
            Response.status(400).json({
                message: "This email does not exist...!"
            });
        };

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while searching for an existing user...!"
        });
    });

};



///**************** (5) Forgot Password ****************///

exports.VerifyUser = (Request, Response) => {

    const { Access_Token, Verification_Code } = Request.body;

    Token.findOne({ where: { token: Access_Token } }).then((Data) => {
        if (!Data) {
            return Response.status(404).json({ message: "Token not found" });
        }
        if (Date.now() >= parseInt(Data.expiresAt)) {
            Token.destroy({ where: { token: Access_Token } }).then(() => {
                Response.status(500).json({
                    message: "Code Expired... Try Again...!"
                });

            }).catch(Error => {
                Response.status(500).json({
                    error: Error,
                    message: "An error occured while deleting old token...!"
                });
            });

        } else {
            jwt.verify(Access_Token, process.env.ACCESS_TOKEN_SECRET, (Error, Decoded) => {
                if (Error) {
                    Response.status(500).json({
                        error: Error.message,
                        message: "Code Expired... Try Again...!",
                    });

                } else {
                    const {
                        _id,
                        Email,
                        VerificationCode
                    } = Decoded;

                    bcrypt.compare(Verification_Code, VerificationCode).then((isMatched) => {
                        if (isMatched) {
                            Token.destroy({ where: { token: Access_Token } }).then(() => {
                                const user_Data = {
                                    _id,
                                    Email,
                                    VerificationCode
                                };

                                const NewAccessToken = createAccessToken(user_Data);
                                Token.create({
                                    token: NewAccessToken,
                                    createdAt: Date.now().toString(),
                                    expiresAt: (Date.now() + 900000).toString()
                                }).then(() => {
                                    Response.status(200).json({
                                        status: "SUCCESS",
                                        message: "Code Verified Successfully...!",
                                        user_id: _id,
                                        user_Email: Email,
                                        token: NewAccessToken
                                    });

                                }).catch(Error => {
                                    Response.status(500).json({
                                        error: Error.message,
                                        message: "An error occured while saving new access token...!"
                                    });
                                });

                            }).catch(Error => {
                                Response.status(500).json({
                                    error: Error.message,
                                    message: "An error occured while deleting access token...!"
                                });
                            });

                        } else {
                            Response.status(400).json({
                                message: "Incorrect Code...!"
                            });
                        };

                    }).catch(Error => {
                        Response.status(500).json({
                            error: Error.message,
                            message: "An error occured while comparing varification code...!"
                        });
                    });
                };
            });
        };

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured while finding access token...!",
        });
    });

};



///**************** (6) Reset Password ****************///

exports.ResetPassword = (Request, Response) => {

    const { user_id, token, Password } = Request.body;

    Token.findOne({ where: { token: token } }).then((Data) => {
        if (!Data) {
            return Response.status(404).json({ message: "Token not found" });
        }
        if (Date.now() >= parseInt(Data.expiresAt)) {
            Token.destroy({ where: { token: token } }).then(() => {
                Response.status(500).json({
                    message: "Code Expired... Try Again...!"
                });

            }).catch(Error => {
                Response.status(500).json({
                    error: Error,
                    message: "An error occured while deleting old token...!"
                });
            });

        } else {
            const saltRounds = 12;

            bcrypt.hash(Password, saltRounds).then(hashedPassword => {

                UserModel.update({ Password: hashedPassword }, { where: { id: user_id } }).then((affectedCount) => {
                    if (affectedCount[0] > 0) {
                        Token.destroy({ where: { token: token } }).then(() => {
                            Response.status(200).json({
                                status: "SUCCESS",
                                message: "Password successfully changed...!"
                            });

                        }).catch(Error => {
                            Response.status(500).json({
                                error: Error.message,
                                message: "An error occured while deleting new token...!"
                            });
                        });
                    };

                }).catch(Error => {
                    Response.status(500).json({
                        error: Error,
                        message: "An error occured while updating new password...!"
                    });
                });

            }).catch(Error => {
                Response.status(500).json({
                    error: Error,
                    message: "An error occured while encrypting the user's password...!"
                });
            });
        };

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "Token Expired...!"
        });
    });

};



///**************** (7) Get User Information ****************///

exports.GetUserInformation = (Request, Response) => {

    UserModel.findByPk(Request.user.id, { attributes: { exclude: ['Password'] } }).then(Result => {
        Response.status(200).json({
            user: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while finding the user's detail...!"
        });
    });

};



///**************** (8) Get All Users Information ****************///

exports.GetAllUsersInformation = (Request, Response) => {

    UserModel.findAll({ attributes: { exclude: ['Password'] } }).then(Result => {
        Response.status(200).json({
            users: Result
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error,
            message: "An error occured while finding the user's detail...!"
        });
    });

};



///**************** (9) Logout User ****************///

exports.LogoutUser = (Request, Response) => {

    try {
        Response.clearCookie("refreshtoken", { path: "/user/refresh_token" });
        Response.status(200).json({
            message: "Logged Out...!"
        });

    } catch (Error) {
        Response.status(500).json({
            error: Error.message
        });
    };

};



///**************** (10) Update User ****************///

exports.UpdateUser = (Request, Response) => {

    const { FirstName, LastName, DateOfBirth, Avatar, Background, Gender, MobileNumber, State, District, PinCode, BankAccountNumber, IFSC, UPI } = Request.body;

    if (FirstName && !/^[a-z A-Z]*$/.test(FirstName)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid First Name entered",
        });

    } else if (LastName && !/^[a-z A-Z]*$/.test(LastName)) {
        Response.status(400).json({
            status: "Failed",
            message: "Invalid Last Name entered",
        });

    } else {
        UserModel.update({ FirstName, LastName, DateOfBirth: DateOfBirth, Avatar, Background, Gender, MobileNumber, State, District, PinCode, BankAccountNumber, IFSC, UPI }, { where: { id: Request.user.id } }).then(() => {
            UserModel.findByPk(Request.user.id).then(Result => {
                Response.status(200).json({
                    message: "Successfully updated user...!",
                    result: Result
                });
            });

        }).catch(Error => {
            Response.status(500).json({
                error: Error.message,
                message: "An error occured while finding or updating user...!"
            });
        });
    };

};



///**************** (11) Update User Role ****************///

exports.UpdateUserRole = (Request, Response) => {

    const { isAdmin } = Request.body;

    UserModel.update({ isAdmin }, { where: { id: Request.params.id } }).then(() => {
        UserModel.findByPk(Request.params.id).then(Result => {
            Response.status(200).json({
                message: "Successfully updated user...!",
                Name: Result.FirstName, // UserModel has FirstName, not Name
                isAdmin: Result.isAdmin
            });
        });

    }).catch(Error => {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured while finding or updating user...!"
        });
    });

};



///**************** (12) Delete User ****************///

exports.DeleteUser = (Request, Response) => {

    try {
        UserModel.destroy({ where: { id: Request.params.id } }).then(Result => {
            Response.status(200).json({
                message: "User Deleted Successfully...!"
            });

        }).catch(Error => {
            Response.status(500).json({
                error: Error.message,
                message: "An error occured while deleting user...!"
            })
        });

    } catch (Error) {
        Response.status(500).json({
            error: Error.message,
            message: "An error occured finding or deleting user...!"
        })
    };

};



///**************** (13) Find User ****************///

exports.FindUser = (Request, Response) => {

    const user_ID = Request.query.user;

    UserModel.findByPk(user_ID, { attributes: { exclude: ['Password'] } }).then(User => {
        Response.status(200).json({
            message: "User Fetched",
            user: User
        });

    }).catch(Error => {
        Response.status(500).json({
            message: "An error occured while fetching user",
            error: Error.message
        });
    });

};

/********************* Function To Validate Email *********************/

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

/********************* Function To Validate Pin Code *********************/

const validPinCode = (pin) => {
    if (/^[1-9][0-9]{5}$/.test(pin)) {
        return true;
    } else { return false; }
};

/********************* Function To Validate Mobile Number *********************/

const validateMobileNumber = (number) => {
    const re = /^[6-9]\d{9}$/gi;
    return re.test(number);
};

/********************* Function To Generate Code *********************/

const generateCode = () => {
    let Code = "";
    for (let i = 0; i < 6; i++) {
        Code += Math.floor(Math.random() * 10);
    }
    return Code;
};

/********************* Function To Create ACTIVATION_TOKEN_SECRET *********************/

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' });
};

/********************* Function To Create ACCESS_TOKEN_SECRET *********************/

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

/********************* Function To Create REFRESH_TOKEN_SECRET *********************/

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};