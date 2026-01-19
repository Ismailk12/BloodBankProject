import React, { useState, useEffect } from 'react';
import './DonationRequestPage.css';
import Server from 'axios';
import { useHistory } from 'react-router-dom';
import { isEmpty, isValidPhone } from '../../Utilities/Validation';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

const initialState = {
    Name: "",
    Gender: "",
    DateOfBirth: "",
    MobileNumber: "",
    Address: "",
    TentativeDate: "",
    BloodGroup: "",
    GoIID: "",
    GoIIDNumber: "",
    Error: "",
    Success: ""
};

function DonationRequestPage() {

    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [district, setDistrict] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [bloodBanks, setBloodBanks] = useState([]);
    const [selectedBloodBank, setSelectedBloodBank] = useState("");
    const [changed, setChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(initialState);
    const { Name, Gender, DateOfBirth, MobileNumber, Address, TentativeDate, BloodGroup, GoIID, GoIIDNumber, Error, Success } = data;
    const history = useHistory();

    useEffect(() => {
        let isMount = true;

        Server.get("/locations").then((Response) => {
            if (isMount) {
                setState(Response.data.states);
            };

        }).catch((Error) => {
            setData({ ...data, Success: "", Error: Error.response.data.message });
        });

        return () => { isMount = false; };
    }, [data]);

    useEffect(() => {
        if (changed === true) {
            if (selectedState.length > 0 && selectedDistrict.length > 0) {
                setLoading(true);
                Server.post("/getBloodBanksByLocation", { state: selectedState, district: selectedDistrict }).then(Response => {
                    setLoading(false);
                    setBloodBanks(Response.data.result);
                    setData({ ...data, Success: Response.data.message, Error: "" });

                }).catch(Error => {
                    setLoading(false);
                    setData({ ...data, Success: "", Error: Error.response.data.message });
                });
            };

            setChanged(false);
        }
    }, [changed, data, selectedDistrict, selectedState]);

    useEffect(() => {
        if (GoIID.length > 0) {
            document.getElementById("GoI_ID_Num").style.display = 'block';
        } else {
            document.getElementById("GoI_ID_Num").style.display = 'none';
        }
    }, [GoIID]);

    const handleState = (e) => {
        const districtSelect = document.getElementById('district');
        if (districtSelect) districtSelect.value = "Select District";
        setSelectedDistrict("");
        const value = e.target.value;
        setSelectedState(value)
        const foundState = state.find(location => location.state === value);
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

    const handleDistrict = (e) => {
        const bloodBankSelect = document.getElementById('bloodBank');
        if (bloodBankSelect) bloodBankSelect.value = "Select Blood Bank";
        setSelectedBloodBank("");
        const value = e.target.value;
        setSelectedDistrict(value);
        setChanged(true);
    };

    const handleBloodBank = (e) => {
        const value = e.target.value;
        setSelectedBloodBank(value)
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({ ...data, [name]: value, Error: "", Success: "" })
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEmpty(Name) || isEmpty(Gender) || isEmpty(DateOfBirth) || isEmpty(MobileNumber) || isEmpty(selectedState) || isEmpty(selectedDistrict) || isEmpty(selectedBloodBank)) {
            return setData({ ...data, Error: "Please fill in all fields...!", Success: "" });

        } else if (!isValidPhone(MobileNumber)) {
            return setData({ ...data, Error: "Invalid mobile number...!", Success: "" });

        } else {
            setLoading(true);
            Server.post("/saveDonationRequest", { Name, Gender, DateOfBirth, MobileNumber, Address, TentativeDate, State: selectedState, District: selectedDistrict, BloodBankName: selectedBloodBank, BloodGroup, GoIID, GoIIDNumber }).then(Response => {
                setLoading(false);
                setData({ ...data, Error: "", Success: Response.data.message });

                setTimeout(() => {
                    history.push("/");
                }, 3000);

            }).catch(Error => {
                setLoading(false);
                Error.response.data.message &&
                    setData({ ...data, Error: Error.response.data.message, Success: "" });
            });
        };
    };


    return (
        <div className="DonationRequest">

            <div className="DonationRequest_heading">Online Donation Request</div>

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <div className="DonationRequest_container">
                <div className="DonationRequest_container_heading">Donor Details</div>

                <div className="DonationRequest_container_form">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="DonationRequest_container_form_input">
                                <div>Name<span style={{ color: "red" }}>*</span></div>

                                <input style={{ padding: "10px 7px", width: "225px" }} name="Name" value={Name} type="text" onChange={handleChange} />
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>Gender<span style={{ color: "red" }}>*</span></div>

                                <select style={{ padding: "10px", width: "240px" }} name="Gender" value={Gender} onChange={handleChange}>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Female" >Female</option>
                                    <option value="Male" >Male</option>
                                    <option value="Transgender" >Transgender</option>
                                </select>
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>Date Of Birth<span style={{ color: "red" }}>*</span></div>

                                <input style={{ padding: "8px 7px", width: "225px" }} type="date" name="DateOfBirth" value={DateOfBirth} placeholder="dd-mm-yyyy" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="DonationRequest_container_form_input">
                                <div>Mobile Number<span style={{ color: "red" }}>*</span></div>

                                <input style={{ padding: "10px 7px", width: "225px" }} type="text" name="MobileNumber" value={MobileNumber} onChange={handleChange} />
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>Address</div>

                                <input style={{ padding: "10px 7px", width: "225px" }} type="text" name="Address" value={Address} onChange={handleChange} />
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>Tentative Date</div>

                                <input style={{ padding: "8px 7px", width: "225px" }} type="date" placeholder="dd-mm-yyyy" value={TentativeDate} name="TentativeDate" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="DonationRequest_container_form_input">
                                <div>State<span style={{ color: "red" }}>*</span></div>

                                <select style={{ padding: "10px", width: "240px" }} defaultValue={"Select State"} onChange={handleState}>
                                    <option value="Select State" disabled>Select State</option>

                                    {
                                        state.map((element) => (
                                            <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>District/City<span style={{ color: "red" }}>*</span></div>

                                <select style={{ padding: "10px", width: "240px" }} defaultValue={"Select District"} id="district" onChange={handleDistrict}>
                                    <option value="Select District" disabled>Select District</option>

                                    {
                                        district.map((element) => (
                                            <option key={element.index} value={element.name}>{element.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>Blood Bank Name<span style={{ color: "red" }}>*</span></div>

                                <select style={{ padding: "10px", width: "240px" }} defaultValue={"Select Blood Bank"} id="bloodBank" onChange={handleBloodBank}>
                                    <option value="Select Blood Bank" disabled>Select Blood Bank</option>

                                    {
                                        bloodBanks.map((element) => (
                                            <option key={element.id} value={element.BloodBank} >{element.BloodBank}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="DonationRequest_container_form_input">
                                <div>Blood Group</div>

                                <select style={{ padding: "10px", width: "240px" }} name="BloodGroup" value={BloodGroup} onChange={handleChange}>
                                    <option value="">Select Blood Group</option>
                                    <option value="AB-Ve">AB-Ve</option>
                                    <option value="AB+Ve">AB+Ve</option>
                                    <option value="A-Ve">A-Ve</option>
                                    <option value="A+Ve">A+Ve</option>
                                    <option value="B-Ve">B-Ve</option>
                                    <option value="B+Ve">B+Ve</option>
                                    <option value="O-Ve">O-Ve</option>
                                    <option value="O+Ve">O+Ve</option>
                                </select>
                            </div>

                            <div className="DonationRequest_container_form_input">
                                <div>GoI ID</div>

                                <select style={{ padding: "10px", width: "240px" }} name="GoIID" value={GoIID} onChange={handleChange}>
                                    <option value="">Select Value</option>
                                    <option value="AadharNumber" >Aadhar Number</option>
                                    <option value="DrivingLicense" >Driving License</option>
                                    <option value="GovtAuthorityIdentifier" >Govt Authority Identifier</option>
                                    <option value="PAN" >PAN</option>
                                    <option value="PassportNumber" >Passport Number</option>
                                    <option value="VoterID" >Voter ID</option>
                                </select>
                            </div>

                            <div className="DonationRequest_container_form_input" id="GoI_ID_Num">
                                <div>GoI ID Number</div>

                                <input style={{ padding: "10px 7px", width: "225px" }} type="text" placeholder="GoI ID Number" name="GoIIDNumber" value={GoIIDNumber} onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>

        </div>
    );

};

export default DonationRequestPage;