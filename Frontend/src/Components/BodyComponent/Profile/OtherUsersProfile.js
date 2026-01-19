import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { useLocation, useHistory } from 'react-router-dom';
import Server from 'axios';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

const initialState = {
    Success: "",
    Error: ""
};

function OtherUsersProfile() {
    let { search } = useLocation();
    const QueryString = new URLSearchParams(search);
    const UserID = QueryString.get("User-ID");
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const [data, setData] = useState(initialState);
    const { Success, Error } = data;
    const [clickedAbout, setClickedAbout] = useState(true);
    const [clickedBloodBank, setClickedBloodBank] = useState(false);
    const [clickedDonationCamp, setClickedDonationCamp] = useState(false);
    const [clickedDonationRequest, setClickedDonationRequest] = useState(false);
    const [bloodBank, setBloodBank] = useState([]);
    const [donationCamp, setDonationCamp] = useState([]);
    const [donationRequest, setDonationRequest] = useState([]);

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

    const [userData, setUserData] = useState({
        FirstName: "",
        LastName: "",
        Avatar: "",
        Background: "",
        Email: "",
        DateOfBirth: "",
        Gender: "",
        MobileNumber: "",
        State: "",
        District: "",
        BankAccountNumber: "",
        IFSC: "",
        UPI: "",
    });

    useEffect(() => {
        Server.get("/user/find",
            {
                params: { user: UserID }

            }).then(Response => {
                setUserData(Response.data.user);

            }).catch(Error => {
                console.log(Error)
            });
    }, [UserID]);

    /********************* Get Blood Bank By Email *********************/
    useEffect(() => {
        let isMount = true;

        if (isMount === true && userData.Email) {
            Server.post("/getBloodBanksByEmail", { Email: userData.Email }).then(Response => {
                setBloodBank(Response.data.result);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

        return () => {
            isMount = false;
        }
    }, [data, userData.Email]);

    /********************* Get Donation Camp By Email *********************/
    useEffect(() => {
        let isMount = true;

        if (isMount === true && userData.Email) {
            Server.post("/getDonationCampsByEmail", { Email: userData.Email }).then(Response => {
                setDonationCamp(Response.data.camps);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

        return () => {
            isMount = false;
        };
    }, [data, userData.Email]);

    /********************* Get Fundraising By Email *********************/
    useEffect(() => {
        let isMount = true;

        if (isMount === true && userData.Email) {
            Server.post("/getfundraisingbyemail", { Email: userData.Email }).then(Response => {
                setDonationRequest(Response.data.result);

            }).catch(Error => {
                setData({ ...data, Success: "", Error: Error.response.data.message });
            });
        };

        return () => {
            isMount = false;
        };
    }, [data, userData.Email]);

    /********************* Handle Donate *********************/
    const handleDonate = (e) => {
        history.push({
            pathname: "/payment",
            params: {
                RecieverRequestID: e._id,
                RecieverUserEmail: e.Email
            }
        });
    };

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

    useEffect(() => {
        setLoading(false);
    }, []);

    if (!userData) {
        return <div className="UserProfile">
            <h1 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>User Not Found</h1>
        </div>
    };

    return (
        <div className="UserProfile">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <section className="UserProfile_TopSection">
                <div className="UserProfile_Image_body">
                    <img className="UserProfile_Background_Image" src={userData.Background} alt="" onError={(e) => { e.target.onerror = null; e.target.src = "https://www.w3schools.com/w3css/img_lights.jpg" }} />

                    <div className="UserProfile_Profile_Image">
                        <img src={userData.Avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src = "https://www.w3schools.com/howto/img_avatar.png" }} />
                    </div>

                    <div className="UserProfile_User_Name">{userData.FirstName + " " + userData.LastName}</div>
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
                <div style={clickedAbout === true ? { display: "block" } : { display: "none" }} className="UserProfile_BottomSection_Box About reveal">
                    <h3 className="UserProfile_Box_heading">User Details</h3>
                    <div className="UserProfile_Box_body">
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Email:</div>
                            <div className="UserProfile_Box_col2"> {userData.Email} </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Date Of Birth:</div>
                            <div className="UserProfile_Box_col2"> {userData.DateOfBirth} </div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Gender:</div>
                            <div className="UserProfile_Box_col2">{userData.Gender}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Mobile Number:</div>
                            <div className="UserProfile_Box_col2">{userData.MobileNumber}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">State:</div>
                            <div className="UserProfile_Box_col2">{userData.State}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">District:</div>
                            <div className="UserProfile_Box_col2">{userData.District}</div>
                        </div>
                    </div>

                    <h3 className="UserProfile_Box_heading">User's Bank Details</h3>
                    <div className="UserProfile_Box_body">
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">Account no.:</div>
                            <div className="UserProfile_Box_col2">{userData.BankAccountNumber}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">IFSC:</div>
                            <div className="UserProfile_Box_col2">{userData.IFSC}</div>
                        </div>
                        <div className="UserProfile_Box_row">
                            <div className="UserProfile_Box_col1">UPI:</div>
                            <div className="UserProfile_Box_col2">{userData.UPI}</div>
                        </div>
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
                        <div key={index} style={clickedDonationRequest === true ? { display: "block" } : { display: "none" }} className="UserProfile_DonationRequest_card reveal">
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
                                <button className="Edit_btn" onClick={() => handleDonate(items)}>Donate</button>
                            </div>
                        </div>
                    ))
                }
            </section>

        </div>
    );

};

export default OtherUsersProfile;