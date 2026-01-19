import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useSelector } from 'react-redux';
import Server from 'axios';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';
import { isValidPin, isValidPhone } from '../../Utilities/Validation';

const initialState = {
    Success: "",
    Error: ""
};

function UserProfile() {

    const [data, setData] = useState(initialState);
    const { Success, Error } = data;
    const [avatar, setAvatar] = useState("");
    const [background, setBackground] = useState("");
    const [bloodBank, setBloodBank] = useState([]);
    const [donationCamp, setDonationCamp] = useState([]);
    const [donationRequest, setDonationRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const userAuthentication = useSelector(State => State.userAuthentication);
    const token = useSelector(State => State.token);
    const { user } = userAuthentication;

    const [clickedAbout, setClickedAbout] = useState(true);
    const [editUserDetails, setEditUserDetails] = useState(false);
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [DateOfBirth, setDateOfBirth] = useState("");
    const [Gender, setGender] = useState("");
    const [SelectedState, setSelectedState] = useState("");
    const [SelectedDistrict, setSelectedDistrict] = useState("");
    const [PinCode, setPinCode] = useState("");
    const [MobileNumber, setMobileNumber] = useState("");
    const [BankAccountNumber, setBankAccountNumber] = useState("");
    const [IFSC, setIFSC] = useState("");
    const [UPI, setUPI] = useState("");
    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [updateUser, setUpdateUser] = useState(false);

    const [clickedBloodBank, setClickedBloodBank] = useState(false);

    const [clickedDonationCamp, setClickedDonationCamp] = useState(false);

    const [clickedDonationRequest, setClickedDonationRequest] = useState(false);
    const [editDonationRequest, setEditDonationRequest] = useState(false);
    const [donationRequestEdited, setDonationRequestEdited] = useState(false);
    const [proceedDonationRequest, setProceedDonationRequest] = useState(false);
    const [saveDonationRequest, setSaveDonationRequest] = useState(false);
    const [donationRequestID, setDonationRequestID] = useState("");
    const [donationRequestHeading, setDonationRequestHeading] = useState("");
    const [donationRequestAmount, setDonationRequestAmount] = useState("");
    const [donationRequestDescription, setDonationRequestDescription] = useState("");
    const [donationRequestImage, setDonationRequestImage] = useState("");
    const [clearInputFile, setClearInputFile] = useState(false);
    const [donationRequestImg, setDonationRequestImg] = useState([]);
    const [isImgFile, setIsImgFile] = useState(false);

    // ON SCROLL ANIMATION
    useEffect(() => {
        function reveal() {
            var reveals = document.querySelectorAll(".reveal");

            for (var i = 0; i < reveals.length; i++) {
                var windowHeight = window.innerHeight;
                var elementTop = reveals[i].getBoundingClientRect().top;
                var elementVisible = 150;

                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                } else {
                    reveals[i].classList.remove("active");
                };
            };
        };

        window.addEventListener("scroll", reveal);
    }, []);

    // POPUP IMAGE
    useEffect(() => {
        document.querySelectorAll(".UserProfile_TopSection img").forEach(image => {
            image.onclick = () => {
                document.querySelector(".UserProfile_TopSection").style.opacity = "0.6";
                document.querySelector(".UserProfile_BottomSection").style.opacity = "0.6";
                document.querySelector(".Popup_Image").style.display = "block";
                document.querySelector(".Popup_Image img").src = image.getAttribute("src");
            };
        });

        document.querySelector(".Popup_Image span").onclick = () => {
            document.querySelector(".Popup_Image").style.display = "none";
            document.querySelector(".UserProfile_TopSection").style.opacity = "1";
            document.querySelector(".UserProfile_BottomSection").style.opacity = "1";
        }

        document.querySelectorAll(".UserProfile_BottomSection img").forEach(image => {
            image.onclick = () => {
                document.querySelector(".UserProfile_TopSection").style.opacity = "0.6";
                document.querySelector(".UserProfile_BottomSection").style.opacity = "0.6";
                document.querySelector(".Popup_Image").style.display = "block";
                document.querySelector(".Popup_Image img").src = image.getAttribute("src");
            };
        });

        document.querySelector(".Popup_Image span").onclick = () => {
            document.querySelector(".Popup_Image").style.display = "none";
            document.querySelector(".UserProfile_TopSection").style.opacity = "1";
            document.querySelector(".UserProfile_BottomSection").style.opacity = "1";
        }
    }, []);

    /********************* Get Location *********************/
    useEffect(() => {
        let isMount = true;
        if (isMount === true) {
            Server.get("/locations").then((Response) => {
                setState(Response.data.states);

            }).catch((Error) => {
                setData({ ...data, Error: Error.response.data.message, Success: "" });
            });
        };
        return () => { isMount = false; };
    }, [data]);

    /********************* Handle Input Change *********************/
    const handleChangeInput = (e) => {
        const { name, value } = e.target;

        if (name === "FirstName") {
            setFirstName(value);

        } else if (name === "LastName") {
            setLastName(value);

        } else if (name === "DateOfBirth") {
            setDateOfBirth(value);

        } else if (name === "Gender") {
            setGender(value);

        } else if (name === "State") {
            document.getElementById('district').value = "SelectDistrict";
            setSelectedState(e.target.value);
            const selectedStateObj = state.find(location => location.state === e.target.value);
            setDistrict(JSON.parse(selectedStateObj.districts));

        } else if (name === "District") {
            setSelectedDistrict(value);

        } else if (name === "PinCode") {
            setPinCode(value);

        } else if (name === "MobileNumber") {
            setMobileNumber(value);

        } else if (name === "BankAccountNumber") {
            setBankAccountNumber(value);

        } else if (name === "IFSC") {
            setIFSC(value);

        } else if (name === "UPI") {
            setUPI(value);
        };
    };

    /********************* Handle Date OF Birth *********************/
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
    var newDateOfBirth = "";

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

    };

    /********************* Handle Update User *********************/
    const handleUpdateUser = () => {
        if (PinCode.length > 0 && MobileNumber.length > 0 && DateOfBirth) {
            if (!isValidPin(PinCode)) {
                return setData({ ...data, Error: "Invalid pincode...!", Success: "" });

            } else if (!isValidPhone(MobileNumber)) {
                return setData({ ...data, Error: "Invalid mobile number...!", Success: "" });

            } else if (ValidDate < 567993600000) {
                return setData({ ...data, Error: "Invalid date of birth, you should be 18+", Success: "" });

            } else {
                setUpdateUser(true);
            };

        } else if (PinCode.length > 0) {
            if (!isValidPin(PinCode)) {
                return setData({ ...data, Error: "Invalid pincode...!", Success: "" });

            } else {
                setUpdateUser(true);
            };

        } else if (MobileNumber.length > 0) {
            if (!isValidPhone(MobileNumber)) {
                return setData({ ...data, Error: "Invalid mobile number...!", Success: "" });

            } else {
                setUpdateUser(true);
            };

        } else if (DateOfBirth) {
            if (ValidDate < 567993600000) {
                return setData({ ...data, Error: "Invalid date of birth, you should be 18+", Success: "" });

            } else {
                setUpdateUser(true);
            };

        } else {
            setUpdateUser(true);
        };
    };

    useEffect(() => {
        if (updateUser) {
            setLoading(true);
            Server.patch("/user/update", {
                FirstName: FirstName ? FirstName : user.FirstName,
                LastName: LastName ? LastName : user.LastName,
                DateOfBirth: DateOfBirth ? newDateOfBirth : user.DateOfBirth,
                Gender: Gender ? Gender : user.Gender,
                State: SelectedState ? SelectedState : user.State,
                District: SelectedDistrict ? SelectedDistrict : user.District,
                PinCode: PinCode ? PinCode : user.PinCode,
                MobileNumber: MobileNumber ? MobileNumber : user.MobileNumber,
                BankAccountNumber: BankAccountNumber ? BankAccountNumber : user.BankAccountNumber,
                IFSC: IFSC ? IFSC : user.IFSC,
                UPI: UPI ? UPI : user.UPI,
            }, {
                headers: { Authorization: token }
            }).then(Response => {
                setLoading(false);
                setUpdateUser(false);
                setData({ ...data, Success: Response.data.message, Error: "" });
                setTimeout(() => {
                    window.location.reload(false);
                }, 1000);

            }).catch(Error => {
                setLoading(false);
                setUpdateUser(false);
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };
    }, [BankAccountNumber, DateOfBirth, FirstName, Gender, IFSC, LastName, MobileNumber, PinCode, SelectedDistrict, SelectedState, UPI, data, newDateOfBirth, token, updateUser, user.BankAccountNumber, user.DateOfBirth, user.District, user.FirstName, user.Gender, user.IFSC, user.LastName, user.MobileNumber, user.PinCode, user.State, user.UPI]);


    /********************* Get Blood Bank By Email *********************/
    useEffect(() => {
        let isMount = true;

        if (isMount === true && user.Email) {
            Server.post("/getBloodBanksByEmail", { Email: user.Email }).then(Response => {
                setBloodBank(Response.data.result);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

        return () => {
            isMount = false;
        }
    }, [data, user.Email]);

    /********************* Get Donation Camp By Email *********************/
    useEffect(() => {
        let isMount = true;

        if (isMount === true && user.Email) {
            Server.post("/getDonationCampsByEmail", { Email: user.Email }).then(Response => {
                setDonationCamp(Response.data.camps);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

        return () => {
            isMount = false;
        };
    }, [data, user.Email]);

    /********************* Get Fundraising By Email *********************/
    useEffect(() => {
        let isMount = true;

        if (isMount === true && user.Email) {
            Server.post("/getfundraisingbyemail", { Email: user.Email }).then(Response => {
                setDonationRequest(Response.data.result);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

        return () => {
            isMount = false;
        };
    }, [data, user.Email]);


    /********************* Handle Update User Avatar *********************/
    const updateUserAvatar = async (e) => {
        e.preventDefault();

        const File = e.target.files[0];

        if (!File) {
            return setData({ ...data, Success: "", Error: "No files were uploaded...!" });

        } else if (File.size > 1024 * 1024) {
            return setData({ ...data, Success: "", Error: "Size too large...!" });

        } else if (File.type !== 'image/jpeg' && File.type !== 'image/png') {
            setData({ ...data, Success: "", Error: "File format is incorrect...!" });

        } else {
            let formData = new FormData();
            formData.append("File", File);

            setLoading(true);

            Server.post("/api/upload_avatar", formData, {
                headers: { "content-type": "multipart/form-data", Authorization: token }
            }).then(Response => {
                setLoading(false);
                setAvatar(Response.data.url);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };
    };

    /********************* Handle Update User Background *********************/
    const updateUserBackground = async (e) => {
        e.preventDefault();

        const File = e.target.files[0];

        if (!File) {
            return setData({ ...data, Success: "", Error: "No files were uploaded...!" });

        } else if (File.size < 900 * 300) {
            return setData({ ...data, Success: "", Error: "Size too small...!" });

        } else if (File.type !== 'image/jpeg' && File.type !== 'image/png') {
            return setData({ ...data, Success: "", Error: "File format is incorrect...!" });

        } else {
            let formData = new FormData();
            formData.append("File", File);

            setLoading(true);

            Server.post("/api/upload_background", formData, {
                headers: { "content-type": "multipart/form-data", Authorization: token }
            }).then(Response => {
                setLoading(false);
                setBackground(Response.data.url);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };
    };

    useEffect(() => {
        if (avatar || background) {
            Server.patch("/user/update", {
                Avatar: avatar ? avatar : user.Avatar,
                Background: background ? background : user.Background
            }, {
                headers: { Authorization: token }
            }).then(Response => {
                setAvatar("");
                setBackground("");
                setData({ ...data, Success: "Updated Successfully", Error: "" });
                setTimeout(() => {
                    window.location.reload(false);
                }, 2000);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };
    }, [avatar, background, data, token, user.Avatar, user.Background]);

    useEffect(() => {
        if (proceedDonationRequest === true) {
            const File = donationRequestImg;
            if (!File) {
                setProceedDonationRequest(false);
                setData({ ...data, Success: "", Error: "No files were uploaded...!" });

            } else if (File.size > 1024 * 1024) {
                setClearInputFile(true);
                setProceedDonationRequest(false);
                setData({ ...data, Success: "", Error: "Size too large...!" });

            } else if (File.type !== 'image/jpeg' && File.type !== 'image/png') {
                setClearInputFile(true);
                setProceedDonationRequest(false);
                setData({ ...data, Success: "", Error: "File format is incorrect...!" });

            } else {
                let formData = new FormData();
                formData.append("File", File);

                setLoading(true);
                Server.post("/api/upload_fundraising_image", formData, {
                    headers: { "content-type": "multipart/form-data", Authorization: token }
                }).then(Response => {
                    setLoading(false);
                    setProceedDonationRequest(false);
                    setDonationRequestImage(Response.data.url);
                    setSaveDonationRequest(true);

                }).catch(Error => {
                    setLoading(false);
                    setProceedDonationRequest(false);
                    setData({ ...data, Success: "", Error: Error.response.data.message });
                });
            };
        };
    }, [data, donationRequestImg, proceedDonationRequest, token]);

    useEffect(() => {
        if (clearInputFile) {
            document.getElementById("fundraisingImage").value = null;
            setClearInputFile(false);
        };

        let isMount = true;
        if (Error > 0) {
            if (isMount === true) {
                setTimeout(() => {
                    setData({ ...data, Error: "" });
                }, 5000);
            };
        };

        return () => { isMount = false; };
    }, [Error, clearInputFile, data]);


    /********************* Handle Update Fundraising *********************/
    useEffect(() => {
        if (saveDonationRequest === true) {
            setLoading(true);
            Server.patch("updatefundraising", { FundID: donationRequestID, Heading: donationRequestHeading, Amount: donationRequestAmount, Description: donationRequestDescription, Image: donationRequestImage }).then(Response => {
                setLoading(false);
                setSaveDonationRequest(false);
                setData({ ...data, Success: Response.data.message, Error: "" });
                setTimeout(() => {
                    window.location.reload(false);
                }, 1000);

            }).catch(Error => {
                setLoading(false);
                setSaveDonationRequest(false);
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };
    }, [data, donationRequestAmount, donationRequestDescription, donationRequestHeading, donationRequestID, donationRequestImage, saveDonationRequest]);

    const handleAboutBtn = () => {
        setClickedAbout(true);
        setClickedBloodBank(false);
        setClickedDonationCamp(false);
        setClickedDonationRequest(false);
    };

    const handleBloodBankBtn = () => {
        setClickedBloodBank(true);
        setClickedAbout(false);
        setClickedDonationCamp(false);
        setClickedDonationRequest(false);
    };

    const handleDonationCampBtn = () => {
        setClickedDonationCamp(true);
        setClickedAbout(false);
        setClickedBloodBank(false);
        setClickedDonationRequest(false);
    };

    const handleDonationRequestBtn = () => {
        setClickedDonationRequest(true);
        setClickedAbout(false);
        setClickedBloodBank(false);
        setClickedDonationCamp(false);
    };

    const handleDeleteFundraising = (id) => {
        if (window.confirm("Are You Sure Want To Delete ?")) {
            Server.delete(`/deletefundraising/${id}`, {
                headers: { Authorization: token }

            }).then(Response => {
                setData({ ...data, Success: Response.data.message, Error: "" });
                setTimeout(() => {
                    window.location.reload(false);
                }, 2000);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };
    };

    const handleEditFundraising = (e) => {
        setEditDonationRequest(true);
        setDonationRequestID(e._id);
        setDonationRequestHeading(e.Heading);
        setDonationRequestAmount(e.Amount);
        setDonationRequestDescription(e.Description);
        setDonationRequestImage(e.Image);
    };

    const handleDonationRequestImageChange = (e) => {
        setDonationRequestImg(e.target.files[0]);
        setIsImgFile(true);
    };

    const handleEditDonationRequest = (e) => {
        const { name, value } = e.target;
        if (name === "DonationRequestHeading") {
            setDonationRequestHeading(value);

        } else if (name === "DonationRequestAmount") {
            setDonationRequestAmount(value);

        } else if (name === "DonationRequestDescription") {
            setDonationRequestDescription(value);
        };

        setDonationRequestEdited(true);
    };

    const handleSaveDonationRequest = () => {
        if (isImgFile === true) {
            setProceedDonationRequest(true);
            setIsImgFile(false);
            console.log("proceed true")

        } else if (donationRequestEdited === true) {
            setSaveDonationRequest(true);
            console.log("save true")
        };
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    return (

        <div className="UserProfile">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <section className="UserProfile_TopSection">
                <div className="UserProfile_Image_body">
                    <img className="UserProfile_Background_Image" src={user.Background} alt="" onError={(e) => { e.target.onerror = null; e.target.src = "https://www.w3schools.com/w3css/img_lights.jpg" }} />
                    <i className="fas fa-edit Background_Edit">Edit Background <input type="file" onChange={updateUserBackground} /></i>

                    <div className="UserProfile_Profile_Image">
                        <img src={user.Avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src = "https://www.w3schools.com/howto/img_avatar.png" }} />
                        <i className="fas fa-edit Avatar_Edit">
                            <input type="file" onChange={updateUserAvatar} />
                        </i>
                    </div>

                    <div className="UserProfile_User_Name">{user.FirstName ? user.FirstName + " " + user.LastName : ""}</div>
                </div>

                <div className="UserProfile_TopSection_btns">
                    <div style={clickedAbout === true ? { opacity: "0.6" } : { opacity: "1" }} className="UserProfile_TopSection_btn" onClick={handleAboutBtn}>About</div>
                    {
                        bloodBank.length > 0
                            ?
                            <div style={clickedBloodBank === true ? { opacity: "0.6" } : { opacity: "1" }} className="UserProfile_TopSection_btn" onClick={handleBloodBankBtn}>Blood Bank</div>
                            :
                            <></>
                    }
                    {
                        donationCamp.length > 0
                            ?
                            <div style={clickedDonationCamp === true ? { opacity: "0.6" } : { opacity: "1" }} className="UserProfile_TopSection_btn" onClick={handleDonationCampBtn}>Donation Camp</div>
                            :
                            <></>
                    }
                    {
                        donationRequest.length > 0
                            ?
                            <div style={clickedDonationRequest === true ? { opacity: "0.6" } : { opacity: "1" }} className="UserProfile_TopSection_btn" onClick={handleDonationRequestBtn}>Donation Request</div>
                            :
                            <></>
                    }
                </div>
            </section>

            <div className="Popup_Image">
                <span>&times;</span>
                <img src="" alt="" />
            </div>

            <section className="UserProfile_BottomSection">
                {/* ----- About Section ----- */}
                <div style={clickedAbout === true && editUserDetails === false ? { display: "block" } : { display: "none" }} className="UserProfile_BottomSection_Box About reveal">
                    <div style={{ display: "flex" }}>
                        <h3 className="UserProfile_Box_heading">User Details</h3>
                        <i className="fas fa-user-edit edit_user_icon" onClick={() => setEditUserDetails(true)}></i>
                    </div>
                    <div className="UserProfile_Box_body">
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">First Name:</div>
                            <div className="UserProfile_Box_col2"> {user.FirstName}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Last Name:</div>
                            <div className="UserProfile_Box_col2"> {user.LastName}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Email:</div>
                            <div className="UserProfile_Box_col2"> {user.Email}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Date Of Birth:</div>
                            <div className="UserProfile_Box_col2"> {user.DateOfBirth} </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Gender:</div>
                            <div className="UserProfile_Box_col2">{user.Gender}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Mobile Number:</div>
                            <div className="UserProfile_Box_col2">{user.MobileNumber}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">State:</div>
                            <div className="UserProfile_Box_col2">{user.State}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">District:</div>
                            <div className="UserProfile_Box_col2">{user.District}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Pin Code:</div>
                            <div className="UserProfile_Box_col2">{user.PinCode}</div>
                        </div>
                    </div>

                    <h3 className="UserProfile_Box_heading">User Bank Details</h3>
                    <div className="UserProfile_Box_body">
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Account no.:</div>
                            <div className="UserProfile_Box_col2">{user.BankAccountNumber}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">IFSC:</div>
                            <div className="UserProfile_Box_col2">{user.IFSC}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">UPI:</div>
                            <div className="UserProfile_Box_col2">{user.UPI}</div>
                        </div>
                    </div>
                </div>

                <div style={clickedAbout === true && editUserDetails === true ? { display: "block" } : { display: "none" }} className="UserProfile_BottomSection_Box About">
                    <h3 className="UserProfile_Box_heading"> Edit User Details</h3>
                    <div className="UserProfile_Box_body">
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">First Name:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="text" name="FirstName" defaultValue={user.FirstName} onChange={handleChangeInput} />
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Last Name:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="text" name="LastName" defaultValue={user.LastName} onChange={handleChangeInput} />
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Date Of Birth:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="date" name="DateOfBirth" placeholder="dd-mm-yyyy" onChange={handleChangeInput} />
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Gender:</div>
                            <div className="UserProfile_Box_col2">
                                <select style={{ width: "106%" }} defaultValue="Select Gender" name="Gender" onChange={handleChangeInput}>
                                    <option value="Select Gender" disabled>{user.Gender}</option>
                                    <option value="Female" >Female</option>
                                    <option value="Male" >Male</option>
                                    <option value="Transgender" >Transgender</option>
                                </select>
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Mobile Number:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="number" defaultValue={user.MobileNumber} name="MobileNumber" onChange={handleChangeInput} />
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">State:</div>
                            <div className="UserProfile_Box_col2">
                                <select style={{ width: "106%" }} defaultValue={user.State} name="State" onChange={handleChangeInput}>
                                    <option value={user.State}>{user.State}</option>

                                    {
                                        state.map((element) => (
                                            <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">District:</div>
                            <div className="UserProfile_Box_col2">
                                <select style={{ width: "106%" }} defaultValue={user.District} name="District" id="district" onChange={handleChangeInput}>
                                    <option value={user.District}>{user.District}</option>
                                    <option value="SelectDistrict" disabled>Select District</option>

                                    {
                                        district.map((element, index) => (
                                            <option key={index} name="District" value={element.name}>{element.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Pin Code:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="text" defaultValue={user.PinCode} name="PinCode" onChange={handleChangeInput} />
                            </div>
                        </div>
                    </div>

                    <h3 className="UserProfile_Box_heading">User Bank Details</h3>
                    <div className="UserProfile_Box_body">
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Account no.:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="text" defaultValue={user.BankAccountNumber} name="BankAccountNumber" onChange={handleChangeInput} />
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">IFSC:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="text" defaultValue={user.IFSC} name="IFSC" onChange={handleChangeInput} />
                            </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">UPI:</div>
                            <div className="UserProfile_Box_col2">
                                <input type="text" defaultValue={user.UPI} name="UPI" onChange={handleChangeInput} />
                            </div>
                        </div>
                    </div>

                    <div className="UserProfile_BottomSection_Edit_Btn">
                        <button className="Edit_btn" onClick={handleUpdateUser}>Save</button>
                        <button className="Delete_btn" onClick={() => setEditUserDetails(false)}>Back</button>
                    </div>
                </div>


                {/* ----- Blood Bank Section ----- */}
                {
                    bloodBank.map((item, index) => (
                        <div key={index} style={clickedBloodBank === true ? { display: "block" } : { display: "none" }} className="UserProfile_BottomSection_Box BloodBank reveal">
                            <h2 style={{ textAlign: "center" }} className="UserProfile_Box_heading">My Blood Bank</h2>
                            <h3 className="UserProfile_Box_heading">Blood Bank Details</h3>
                            <div className="UserProfile_Box_body_BloodBank">
                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">ID:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item._id}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Blood Bank:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.BloodBank}</div>
                                </div>

                                {
                                    item.ParentHospital
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Parent Hospital:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.ParentHospital}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.ShortName
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">ShortName:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.ShortName}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Category:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.Category}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Contact Person:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.ContactPerson}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Email:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.Email}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Contact Number:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.Phone}</div>
                                </div>

                                {
                                    item.FAX
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">FAX Number:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.FAX}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.Licence
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Licence:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.Licence}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.FromDate
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">From Date:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.FromDate}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.ToDate
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">To Date:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.ToDate}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.ComponentFacility
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Component Facility:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.ComponentFacility}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.ApheresisFacility
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Apheresis Facility:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.ApheresisFacility}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.HelplineNumber
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Helpline Number:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.HelplineNumber}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">State:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.State}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">District:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.District}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">City:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.City}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Address:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.Address}</div>
                                </div>

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">Pin Code:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.PinCode}</div>
                                </div>

                                {
                                    item.Website
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Website:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.Website}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.NumberOfBeds
                                        ?
                                        <div className="UserProfile_Box_row_BloodBank">
                                            <div className="UserProfile_Box_col1_BloodBank">Number Of Beds:</div>
                                            <div className="UserProfile_Box_col2_BloodBank"> {item.NumberOfBeds}</div>
                                        </div>
                                        :
                                        <></>
                                }

                                {
                                    item.DonorType ?
                                        item.DonorType.map((items, index) => (
                                            <div key={index} className="UserProfile_Box_row_BloodBank">
                                                {
                                                    index === 0
                                                        ?
                                                        <div className="UserProfile_Box_col1_BloodBank">Donor Type:</div>
                                                        :
                                                        <></>
                                                }
                                                <div className="UserProfile_Box_col2_BloodBank"> {items}</div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }

                                {
                                    item.DonationType ?
                                        item.DonationType.map((items, index) => (
                                            <div key={index} className="UserProfile_Box_row_BloodBank">
                                                {
                                                    index === 0
                                                        ?
                                                        <div className="UserProfile_Box_col1_BloodBank">Donation Type:</div>
                                                        :
                                                        <></>
                                                }
                                                <div className="UserProfile_Box_col2_BloodBank"> {items}</div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }

                                {
                                    item.ComponentType ?
                                        item.ComponentType.map((items, index) => (
                                            <div key={index} className="UserProfile_Box_row_BloodBank">
                                                {
                                                    index === 0
                                                        ?
                                                        <div className="UserProfile_Box_col1_BloodBank">Component Type:</div>
                                                        :
                                                        <></>
                                                }
                                                <div className="UserProfile_Box_col2_BloodBank"> {items}</div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }

                                {
                                    item.BagType ?
                                        item.BagType.map((items, index) => (
                                            <div key={index} className="UserProfile_Box_row_BloodBank">
                                                {
                                                    index === 0
                                                        ?
                                                        <div className="UserProfile_Box_col1_BloodBank">Bag Type:</div>
                                                        :
                                                        <></>
                                                }
                                                <div className="UserProfile_Box_col2_BloodBank"> {items}</div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }

                                {
                                    item.TTIType ?
                                        item.TTIType.map((items, index) => (
                                            <div key={index} className="UserProfile_Box_row_BloodBank">
                                                {
                                                    index === 0
                                                        ?
                                                        <div className="UserProfile_Box_col1_BloodBank">TTI Type:</div>
                                                        :
                                                        <></>
                                                }
                                                <div className="UserProfile_Box_col2_BloodBank"> {items}</div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }

                                <div className="UserProfile_Box_row_BloodBank">
                                    <div className="UserProfile_Box_col1_BloodBank">User Type:</div>
                                    <div className="UserProfile_Box_col2_BloodBank"> {item.UserType}</div>
                                </div>
                            </div>

                            <h3 className="UserProfile_Box_heading">Charge/Tarrif Details</h3>
                            <div className="UserProfile_Box_body_BloodBank">
                                {
                                    item.ChargeTarrifDetails
                                        ?
                                        item.ChargeTarrifDetails.map((items, index) => (
                                            <div key={index} >
                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Tarrif Name:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.TarrifName}</div>
                                                </div>

                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Charges In Rs:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.ChargesInRs}</div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }
                            </div>

                            <h3 className="UserProfile_Box_heading">Area Details</h3>
                            <div className="UserProfile_Box_body_BloodBank">
                                {
                                    item.AreaDetails
                                        ?
                                        item.AreaDetails.map((items, index) => (
                                            <div key={index} >
                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Area Name:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.AreaName}</div>
                                                </div>

                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Area Usability:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.AreaUsability}</div>
                                                </div>

                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Room Number:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.RoomNumber}</div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }
                            </div>

                            <h3 className="UserProfile_Box_heading">Storage Details</h3>
                            <div className="UserProfile_Box_body_BloodBank">
                                {
                                    item.StorageDetails
                                        ?
                                        item.StorageDetails.map((items, index) => (
                                            <div key={index} >
                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Area Name:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.AreaName}</div>
                                                </div>

                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Storage Name:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.StorageName}</div>
                                                </div>

                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">StorageType:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.StorageType}</div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }
                            </div>

                            <h3 className="UserProfile_Box_heading">Refreshment Details</h3>
                            <div className="UserProfile_Box_body_BloodBank">
                                {
                                    item.RefreshmentDetails
                                        ?
                                        item.RefreshmentDetails.map((items, index) => (
                                            <div key={index} >
                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Refreshment Name:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.RefreshmentName}</div>
                                                </div>

                                                <div className="UserProfile_Box_row_BloodBank">
                                                    {
                                                        index === 0
                                                            ?
                                                            <div className="UserProfile_Box_col1_BloodBank">Refreshment Quantity:</div>
                                                            :
                                                            <></>
                                                    }
                                                    <div className="UserProfile_Box_col2_BloodBank"> {items.RefreshmentQuantity}</div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                    ))
                }


                {/* ----- Donation Camp Section ----- */}
                {
                    donationCamp.map((item, index) => (
                        <div key={index} style={clickedDonationCamp === true ? { display: "block" } : { display: "none" }} className="UserProfile_BottomSection_Box About reveal">
                            <h3 className="UserProfile_Box_heading">Donation Camp</h3>
                            <div className="UserProfile_Box_body">
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Camp Name:</div>
                                    <div className="UserProfile_Box_col2"> {item.CampName}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Conducted By:</div>
                                    <div className="UserProfile_Box_col2"> {item.ConductedBy} </div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Organized By:</div>
                                    <div className="UserProfile_Box_col2">{item.OrganizedBy}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">State:</div>
                                    <div className="UserProfile_Box_col2">{item.State}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">District:</div>
                                    <div className="UserProfile_Box_col2">{item.District}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Register:</div>
                                    <div className="UserProfile_Box_col2">{item.Register}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Date:</div>
                                    <div className="UserProfile_Box_col2">{item.Date}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Time:</div>
                                    <div className="UserProfile_Box_col2">{item.Time}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Contact:</div>
                                    <div className="UserProfile_Box_col2">{item.Contact}</div>
                                </div>
                                <div className="UserProfile_Box_row">
                                    <div className="UserProfile_Box_col1">Address:</div>
                                    <div className="UserProfile_Box_col2">{item.Address}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }


                {/* ----- Donation Request Section ----- */}
                {
                    donationRequest.map((items, index) => (
                        <div key={index} style={clickedDonationRequest === true && editDonationRequest === false ? { display: "block" } : { display: "none" }} className="UserProfile_DonationRequest_card reveal">
                            <div className="UserProfile_DonationRequest_card_top">
                                <img src={items.Image} alt="" />
                                <div className="UserProfile_DonationRequest_card_headings">
                                    <h3 style={{ marginBottom: "10px" }}>{items.Heading}</h3>
                                    <h3 style={{ marginBottom: "10px", color: "red" }}>Requested Amount: {items.Amount}</h3>
                                    <h3 style={{ marginBottom: "10px", color: "green" }}>Recieved Amount: {items.RecievedFunds}</h3>
                                    <h3 style={{ marginBottom: "10px", color: "blue" }}>Total Due Amount: {items.Amount - items.RecievedFunds}</h3>
                                </div>
                            </div>

                            <div className="UserProfile_DonationRequest_card_bottom">
                                <p>{items.Description}</p>
                            </div>

                            <div className="UserProfile_BottomSection_Edit_Btn">
                                <button className="Edit_btn" onClick={() => handleEditFundraising(items)}>Edit</button>
                                <button className="Delete_btn" onClick={() => handleDeleteFundraising(items._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }

                <div style={editDonationRequest === true && clickedDonationRequest === true ? { display: "block" } : { display: "none" }} className="UserProfile_DonationRequest_card">
                    <div className="UserProfile_DonationRequest_card_top">
                        <div style={{ position: "relative", width: "200px", height: "200px" }} className="UserProfile_DonationRequest_Input_Img">
                            <img style={{ position: "absolute", width: "100%", height: "100%" }} src={donationRequestImage} alt="" />
                            <input type="file" id="fundraisingImage" placeholder="Select Image" name="DonationRequestImage" onChange={handleDonationRequestImageChange} />
                        </div>

                        <div className="UserProfile_DonationRequest_card_headings">
                            <div>
                                <label style={{ marginBottom: "10px", fontSize: "21px", padding: "10px", fontWeight: "700" }}>Heading:</label>
                                <input style={{ marginBottom: "10px", fontSize: "21px", maxWidth: "90%", padding: "5px 10px", borderRadius: "10px" }} type="text" defaultValue={donationRequestHeading} name="DonationRequestHeading" onChange={handleEditDonationRequest} />
                            </div>
                            <div>
                                <label style={{ marginBottom: "10px", fontSize: "21px", padding: "10px", fontWeight: "700" }}>Amount:</label>
                                <input style={{ marginBottom: "10px", fontSize: "21px", maxWidth: "90%", padding: "5px 10px", borderRadius: "10px" }} type="number" defaultValue={donationRequestAmount} name="DonationRequestAmount" onChange={handleEditDonationRequest} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-evenly" }} className="UserProfile_DonationRequest_card_bottom">
                        <div style={{ marginBottom: "10px", fontSize: "21px", padding: "10px", fontWeight: "700", width: "150px" }}>Description:</div>
                        <textarea style={{ width: "100%", minHeight: "100px", maxHeight: "500px", borderRadius: "10px", padding: "10px", fontSize: "21px" }} defaultValue={donationRequestDescription} name="DonationRequestDescription" onChange={handleEditDonationRequest} />
                    </div>

                    <div className="UserProfile_BottomSection_Edit_Btn">
                        <button className="Edit_btn" onClick={handleSaveDonationRequest}>Save</button>
                        <button className="Delete_btn" onClick={() => setEditDonationRequest(false)}>Back</button>
                    </div>
                </div>
            </section>

        </div>
    );

};

export default UserProfile;