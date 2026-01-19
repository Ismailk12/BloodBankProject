import React, { useEffect, useState } from 'react';
import './FundraisingPage.css';
import { useSelector } from 'react-redux';
import Server from 'axios';
import { useHistory } from 'react-router-dom';
import { isEmpty } from '../../Utilities/Validation';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

const initialState = {
    Heading: "",
    Amount: 0,
    Description: "",
    Success: "",
    Error: ""
}

function FundraisingPage() {

    const [fundraisings, setFundraisings] = useState([]);
    const [data, setData] = useState(initialState);
    const [File, setFile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [image, setImage] = useState("");
    const [proceed, setProceed] = useState(false);
    const [submit, setSubmit] = useState(false);
    const { Heading, Amount, Description, Success, Error } = data
    const [clearInputFile, setClearInputFile] = useState(false);

    const userAuthentication = useSelector(State => State.userAuthentication);
    const token = useSelector(State => State.token);
    const { isLoggedIn, user } = userAuthentication;
    const User_ID = user._id;
    const User_Email = user.Email;
    const history = useHistory();

    useEffect(() => {
        Server.get("/getallfundraisings").then(Response => {
            const fundraisingList = Response.data.result;
            const reverseFundraisingList = [...fundraisingList].reverse();
            setFundraisings(reverseFundraisingList);

        }).catch(Error => {
            setData({ ...data, Success: "", Error: Error.response.data.message });
        });
    }, [data]);

    useEffect(() => {
        if (proceed === true) {
            if (!File) {
                setProceed(false);
                setData({ ...data, Success: "", Error: "No files were uploaded...!" });

            } else if (File.size > 1024 * 1024) {
                setClearInputFile(true);
                setProceed(false);
                setData({ ...data, Success: "", Error: "Size too large...!" });

            } else if (File.type !== 'image/jpeg' && File.type !== 'image/png') {
                setClearInputFile(true);
                setProceed(false);
                setData({ ...data, Success: "", Error: "File format is incorrect...!" });

            } else {
                let formData = new FormData();
                formData.append("File", File);

                setLoading(true);
                Server.post("/api/upload_fundraising_image", formData, {
                    headers: { "content-type": "multipart/form-data", Authorization: token }
                }).then(Response => {
                    setLoading(false);
                    setProceed(false);
                    setImage(Response.data.url);
                    setSubmit(true);

                }).catch(Error => {
                    setLoading(false);
                    setProceed(false);
                    setData({ ...data, Success: "", Error: Error.response.data.message });
                });
            };
        };
    }, [File, data, proceed, token]);

    useEffect(() => {
        if (submit === true) {
            setProcessing(true);

            if (image.length > 0) {
                setLoading(true);
                Server.post("rais_fund", {
                    UserID: User_ID, Email: User_Email, Heading, Amount, Description, Image: image
                }, {
                    headers: { Authorization: token }
                }).then(Response => {
                    setLoading(false);
                    setImage("");
                    setData({ ...data, Success: Response.data.message, Error: "" });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                }).catch(Error => {
                    setLoading(false);
                    setData({ ...data, Success: "", Error: Error.response.data.message });
                });
            };

            setSubmit(false);
        };
    }, [Amount, Description, Heading, User_Email, User_ID, data, image, submit, token]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    useEffect(() => {
        if (clearInputFile) {
            document.getElementById("fundraisingImage").value = null;
            setClearInputFile(false);
        };

        let isMount = true;
        if (Error.length > 0) {
            if (isMount === true) {
                setTimeout(() => {
                    setData({ ...data, Error: "" });
                }, 5000);
            };
        };

        return () => { isMount = false; };
    }, [Error.length, clearInputFile, data]);

    const handleDonate = (e) => {
        const value = e.target.value;
        history.push(`/find_profile?User-ID=${value}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEmpty(Heading) || isEmpty(Amount) || isEmpty(Description)) {
            return setData({ ...data, Success: "", Error: "Please fill in all the fields...!" });

        } else if (File.length < 1) {
            return setData({ ...data, Success: "", Error: "Please select an Image...!" });

        } else {
            setProceed(true);
        };
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="Fundraising">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <h2 className="Fundraising-heading">Fundraising</h2>

            <div className="Fundraising-body">
                <div className="Fundraising-body-row">
                    {
                        isLoggedIn === true
                            ?
                            <div className="Fundraising-donation-card">
                                <form onSubmit={handleSubmit}>
                                    <h2>RAIS YOUR FUND</h2>

                                    <label>Heading</label>
                                    <input type="text" name="Heading" value={Heading} onChange={handleChange} />
                                    <label>Amount</label>
                                    <input type="number" name="Amount" onChange={handleChange} />
                                    <label>Description</label>
                                    <textarea style={{ maxHeight: "78px", height: "78px", minHeight: "78px", maxWidth: "100%", minWidth: "80%" }} name="Description" value={Description} onChange={handleChange} ></textarea>
                                    <input type="file" id="fundraisingImage" onChange={handleImage} />

                                    <button type="submit">RAIS FUND</button>
                                </form>
                            </div>
                            :
                            <></>
                    }

                    {
                        fundraisings.map((element, index) => (
                            <div key={index} className="Fundraising-card">
                                <img src={element.Image} alt="" />
                                <h3 className="Fundraising-card-heading">{element.Heading}</h3>
                                <h3 className="Fundraising-card-amount"> Rs {element.Amount}</h3>
                                <p className="Fundraising-card-description">{element.Description}</p>
                                <button className="Fundraising-card-btn" value={element.UserID} disabled={processing === true} onClick={e => handleDonate(e)}>Donate</button>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div >
    );

};

export default FundraisingPage;