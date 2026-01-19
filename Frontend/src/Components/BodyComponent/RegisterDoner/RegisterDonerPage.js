import React, { useState, useEffect } from 'react';
import './RegisterDonerPage.css';
import Server from 'axios';
import { useHistory } from 'react-router-dom';
import { isEmpty, isValid, isLength, isMatch, isValidPin, isValidPhone } from '../../Utilities/Validation';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

const initialState = {
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    Gender: "",
    Email: "",
    State: "",
    District: "",
    PinCode: "",
    MobileNumber: "",
    Password: "",
    ConfirmPassword: "",
    UserType: "",
    Error: "",
    Success: ""
};

function RegisterDonerPage() {

    const [user, setUser] = useState(initialState);
    const { FirstName, LastName, DateOfBirth, Gender, Email, State, District, PinCode, MobileNumber, Password, ConfirmPassword, UserType, Error, Success } = user;
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [token, setToken] = useState("");
    const history = useHistory();

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value, Error: "", Success: "" });
    };

    /********************* Get Location *********************/
    useEffect(() => {
        let isMount = true;
        if (isMount === true) {
            Server.get("/locations").then((Response) => {
                setState(Response.data.states);

            }).catch((Error) => {
                setUser({ ...user, Error: Error.response.data.message, Success: "" });
            });
        };
        return () => { isMount = false; };
    }, [user]);

    useEffect(() => {
        if (token) {
            setTimeout(() => {
                history.push({
                    pathname: "/user/activate",
                    state: {
                        token: token
                    }
                });
            }, 3000);
        }

    }, [history, token])

    /********************* Handle State *********************/
    const handleState = (e) => {
        const districtSelect = document.getElementById('district');
        if (districtSelect) districtSelect.value = "";
        setUser({ ...user, State: e.target.value, Error: "", Success: "" });
        const foundState = state.find(location => location.state === e.target.value);
        if (foundState && foundState.district) {
            try {
                const parsedDistricts = JSON.parse(foundState.district);
                setDistrict(parsedDistricts);
            } catch (error) {
                console.error("Error parsing districts:", error);
                setDistrict([]);
            }
        } else {
            setDistrict([]);
        }
    };

    /********************* Handle Pin Code *********************/
    const handlePinCode = (e) => {

        const { name, value } = e.target;
        setUser({ ...user, [name]: parseInt(value, 10), Error: "", Success: "" });

    };

    /********************* Handle Mobile Number *********************/
    const handleMobileNumber = (e) => {

        const { name, value } = e.target;
        setUser({ ...user, [name]: parseInt(value, 10), Error: "", Success: "" });

    };

    /********************* Handle Form Submit *********************/
    const handleSubmit = (e) => {

        e.preventDefault();

        if (isEmpty(FirstName) || isEmpty(DateOfBirth) || isEmpty(Gender) || isEmpty(Email) || isEmpty(State) || isEmpty(District) || isEmpty(PinCode) || isEmpty(MobileNumber) || isEmpty(Password) || isEmpty(ConfirmPassword) || isEmpty(UserType)) {
            return setUser({ ...user, Error: "Please fill in all fields...!", Success: "" });

        } else if (!isValid(Email)) {
            return setUser({ ...user, Error: "Invalid email...!", Success: "" });

        } else if (!isValidPin(PinCode)) {
            return setUser({ ...user, Error: "Invalid pincode...!", Success: "" });

        } else if (!isValidPhone(MobileNumber)) {
            return setUser({ ...user, Error: "Invalid mobile number...!", Success: "" });

        } else if (isLength(Password)) {
            return setUser({ ...user, Error: "Password must be at least 8 characters...!", Success: "" });

        } else if (!isMatch(Password, ConfirmPassword)) {
            return setUser({ ...user, Error: "Password did not match...!", Success: "" });

        } else {
            setLoading(true);
            Server.post('/user/register', { FirstName, LastName, DateOfBirth, Gender, Email, State, District, PinCode, MobileNumber, Password, UserType }).then(Response => {
                setLoading(false);
                setUser({ ...user, Error: "", Success: Response.data.message });
                setToken(Response.data.token);

            }).catch(Error => {
                setLoading(false);
                Error.response.data.message &&
                    setUser({ ...user, Error: Error.response.data.message, Success: "" });
            });
        };

    };

    return (
        <div className="RegisterDonerPage">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <div className="signup-body">
                <div className="signup-heding">Sign-Up</div>

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="row">
                        <div className="name">
                            <div>First Name<span style={{ color: "red" }}>*</span></div>
                            <input type="text" value={FirstName} name="FirstName" placeholder="First Name" onChange={handleChangeInput} />
                        </div>

                        <div className="name">
                            <div>Last Name</div>
                            <input type="text" value={LastName} name="LastName" placeholder="Last Name" onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="details">
                            <div>Date of Birth:<span style={{ color: "red" }}>*</span></div>
                            <input type="date" value={DateOfBirth} name="DateOfBirth" placeholder="dd-mm-yyyy" onChange={handleChangeInput} style={{ padding: "6px" }} />
                        </div>

                        <div className="details" style={{ "marginRight": "-4px" }}>
                            <div>Gender:<span style={{ color: "red" }}>*</span></div>

                            <select value={Gender} name="Gender" onChange={handleChangeInput}>
                                <option value="" disabled>Select Gender</option>
                                <option value="Female" >Female</option>
                                <option value="Male" >Male</option>
                                <option value="Transgender" >Transgender</option>
                            </select>
                        </div>

                        <div className="details">
                            <div>Email:<span style={{ color: "red" }}>*</span></div>
                            <input type="email" value={Email} name="Email" placeholder="Email" onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="details">
                            <div>State:<span style={{ color: "red" }}>*</span></div>

                            <select value={State} name="State" onChange={handleState}>
                                <option value="" disabled>Select State</option>

                                {
                                    state.map((element) => (
                                        <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="details" style={{ "marginRight": "-4px" }}>
                            <div>District:<span style={{ color: "red" }}>*</span></div>

                            <select value={District} name="District" id="district" onChange={handleChangeInput}>
                                <option value="" disabled>Select District</option>

                                {
                                    district.map((element) => (
                                        <option key={element.index} name="District" value={element.name}>{element.name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="details">
                            <div>PinCode:<span style={{ color: "red" }}>*</span></div>
                            <input type="text" value={PinCode} name="PinCode" placeholder="Pin Code" onChange={handlePinCode} />
                        </div>
                    </div>

                    <div className="row" style={{ "marginTop": "20px" }}>
                        <div className="details">
                            <div>Mobile No.:<span style={{ color: "red" }}>*</span></div>
                            <input type="text" value={MobileNumber} name="MobileNumber" placeholder="Mobile No." onChange={handleMobileNumber} />
                        </div>

                        <div className="details">
                            <div>Password<span style={{ color: "red" }}>*</span></div>
                            <input type="password" value={Password} name="Password" placeholder="Password" onChange={handleChangeInput} />
                        </div>

                        <div className="details">
                            <div>Confirm Password<span style={{ color: "red" }}>*</span></div>
                            <input type="password" value={ConfirmPassword} name="ConfirmPassword" placeholder="Confirm Password" onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row" style={{ "marginTop": "20px" }}>
                        <div className="details" style={{ "marginRight": "-4px" }}>
                            <div>User Type:<span style={{ color: "red" }}>*</span></div>

                            <select value={UserType} name="UserType" onChange={handleChangeInput}>
                                <option value="" disabled>Select User Type</option>
                                <option value="Single" >Single</option>
                                <option value="Organisation" >Organisation</option>
                            </select>
                        </div>
                    </div>

                    <div className="signup-btn">
                        <button type="submit" style={{ background: "red", border: "none", color: "white" }}><strong>Sign Up</strong></button>
                    </div>
                </form>

            </div>

        </div>
    );

};

export default RegisterDonerPage;