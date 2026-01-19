import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import Carousel from '../../HelperComponents/ReactCarousel/carousel';
import { Loading } from '../../Utilities/Notification';

function HomePage() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="HomePage">

            {loading && <Loading loading={loading} />}

            <Carousel className="carousel">
                <img src="https://www.eraktkosh.in/BLDAHIMS/bloodbank/transactions/assets/webp/updated_NewYear2022.webp" alt="" style={{ width: "100%", height: "100%" }} />
                <img src="https://www.eraktkosh.in/BLDAHIMS/bloodbank/transactions/assets/webp/ONE_NATION_2500_600.webp" alt="" style={{ width: "100%", height: "100%" }} />
                <img src="https://www.eraktkosh.in/BLDAHIMS/bloodbank/transactions/assets/webp/Blood_EHealthID_2500_600.webp" alt="" style={{ width: "100%", height: "100%" }} />
                <img src="https://www.eraktkosh.in/BLDAHIMS/bloodbank/transactions/assets/webp/mobile_banner_center_2500_600.webp" alt="" style={{ width: "100%", height: "100%" }} />
            </Carousel>

            <div className="black-box">
                <div className="box-container">
                    <div className="box-body">
                        <Link to="/bloodAvailability" style={{ "textDecoration": "none" }}>
                            <div className="box" style={{ "borderBottomRightRadius": "20px", "borderTopLeftRadius": "20px", background: "red" }}>
                                <i className="box-icon fas fa-tint"></i>
                                <div className="box-p">Blood Availability Search</div>
                            </div>

                            <div className="box-cover">
                                <div>
                                    Check availability of blood across blood banks.
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="box-body">
                        <Link to="/directory" style={{ "textDecoration": "none" }}>
                            <div className="box" style={{ "borderBottomLeftRadius": "20px", "borderTopRightRadius": "20px", background: "rgb(92, 209, 255)" }}>
                                <i className="box-icon far fa-hospital"></i>
                                <div className="box-p">Blood Bank Directory</div>
                            </div>

                            <div className="box-cover">
                                <div>
                                    Search for blood banks in India.
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="box-body">
                        <Link to="/donationCamps" style={{ "textDecoration": "none" }}>
                            <div className="box" style={{ "borderBottomRightRadius": "20px", "borderTopLeftRadius": "20px", background: "rgb(221, 188, 0)" }}>
                                <i className="box-icon far fa-clock"></i>
                                <div className="box-p">Blood Donation Camp</div>
                            </div>

                            <div className="box-cover">
                                <div>
                                    Donate blood at a blood donation camp.
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="box-body">
                        <Link to="/login" style={{ "textDecoration": "none" }}>
                            <div className="box" style={{ "borderBottomLeftRadius": "20px", "borderTopRightRadius": "20px", background: "rgb(255, 51, 0)" }}>
                                <i className="box-icon far fa-user-circle"></i>
                                <div className="box-p">Donor Login (Generate/Link ABDM Health ID)</div>
                            </div>

                            <div className="box-cover">
                                <div>
                                    Create donor profile and Generate/ Link Health ID.
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="white-box">
                <h3 className="heading">LEARN ABOUT DONATION</h3>

                <div className="box-container">
                    <section className="left-section">
                        <div className="image-body">
                            <img className="image" src="https://www.eraktkosh.in/BLDAHIMS/bloodbank/transactions/assets/webp/donationFact.webp" alt="" />
                        </div>

                        <p className="left-section-p">After donating blood, the body works to replenish the blood loss. This stimulates the production of new blood cells and in turn, helps in maintaining good health.</p>

                        <div className="left-section-btn">
                            <Link to="/directory" style={{ "textDecoration": "none", color: "white" }}>
                                <i className="fas fa-tint"></i> Donate Now
                            </Link>
                        </div>
                    </section>

                    <section className="right-section">
                        <h3 className="t-heading">Compatible Blood Type Donors</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Blood Type</th>
                                    <th>Donate Blood To</th>
                                    <th>Receive Blood From</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="b-head">A+</td>
                                    <td>A+ AB+</td>
                                    <td>A+ A- O+ O-</td>
                                </tr>

                                <tr>
                                    <td className="b-head">B+</td>
                                    <td>B+ AB+</td>
                                    <td>B+ B- O+ O-</td>
                                </tr>

                                <tr>
                                    <td className="b-head">O+</td>
                                    <td>O+ A+ B+ AB+</td>
                                    <td>O+ O-</td>
                                </tr>

                                <tr>
                                    <td className="b-head">AB+</td>
                                    <td>AB+</td>
                                    <td>Everyone</td>
                                </tr>

                                <tr>
                                    <td className="b-head">A-</td>
                                    <td>A+ A- AB+ AB-</td>
                                    <td>A- O-</td>
                                </tr>

                                <tr>
                                    <td className="b-head">B-</td>
                                    <td>B+ B- AB+ AB-</td>
                                    <td>B- O-</td>
                                </tr>

                                <tr>
                                    <td className="b-head">O-</td>
                                    <td>Everyone</td>
                                    <td>O-</td>
                                </tr>

                                <tr>
                                    <td className="b-head">AB-</td>
                                    <td>AB+ AB-</td>
                                    <td>AB- A- B- O-</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>

            <div className="information-box">
                <section className="top-section">
                    <div className="box-top-heading">TYPES OF DONATION</div>

                    <div className="paragraph">
                        <div className="p">The human body contains five liters of blood, which is made of several useful components i.e. Whole blood, Platelet, and Plasma.</div>

                        <div className="p">Each type of component has several medical uses and can be used for different medical treatments. your blood donation determines the best donation for you to make.</div>

                        <div className="p">For plasma and platelet donation you must have donated whole blood in past two years.</div>
                    </div>
                </section>

                <section className="bottom-section">
                    <input type="radio" id="btn-one" className="radio check-one" name="radioBtn" />
                    <input type="radio" id="btn-two" className="radio check-two" name="radioBtn" />
                    <input type="radio" id="btn-three" className="radio check-three" name="radioBtn" />

                    <label htmlFor="btn-one" className="buttons label-one"><div className="btn">Whole Blood</div></label>
                    <label htmlFor="btn-two" className="buttons label-two"><div className="btn">Plasma</div></label>
                    <label htmlFor="btn-three" className="buttons label-three"><div className="btn">Platelet</div></label>

                    <div id="whole-blood">
                        <div className="column-left p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">What is it?</div>

                                <div className="answer">Blood Collected straight from the donor after its donation usually separated into red blood cells, platelets, and plasma.</div>
                            </div>

                            <div className="para">
                                <div className="question">Who can donate?</div>

                                <div className="answer">You need to be 18-65 years old, weigh 45kg or more and be fit and healthy.</div>
                            </div>
                        </div>

                        <div className="column-center p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">User For?</div>

                                <div className="answer">Stomach disease, kidney disease, childbirth, operations, blood loss, trauma, cancer, blood diseases, haemophilia, anemia, heart disease.</div>
                            </div>

                            <div className="para">
                                <div className="question">Lasts For?</div>

                                <div className="answer">Red cells can be stored for 42 days.</div>
                            </div>
                        </div>

                        <div className="column-right p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">How long does it take?</div>

                                <div className="answer">15 minutes to donate.</div>
                            </div>

                            <div className="para">
                                <div className="question">How often can I donate?</div>

                                <div className="answer">Every 12 weeks</div>
                            </div>
                        </div>
                    </div>

                    <div id="plasma">
                        <div className="column-left p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">What is it?</div>

                                <div className="answer">The straw-coloured liquid in which red blood cells, white blood cells, and platelets float in.Contains special nutrients which can be used to create 18 different type of medical products to treat many different medical conditions.</div>
                            </div>

                            <div className="para">
                                <div className="question">Who can donate?</div>

                                <div className="answer">You need to be 18-70 (men) or 20-70 (women) years old, weigh 50kg or more and must have given successful whole blood donation in last two years.</div>
                            </div>
                        </div>

                        <div className="column-center p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">User For?</div>

                                <div className="answer">Immune system conditions, pregnancy (including anti-D injections), bleeding, shock, burns, muscle and nerve conditions, haemophilia, immunisations.</div>
                            </div>

                            <div className="para">
                                <div className="question">Lasts For?</div>

                                <div className="answer">Plasma can last up to one year when frozen.</div>
                            </div>
                        </div>

                        <div className="column-right p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">How does it work?</div>

                                <div className="answer">We collect your blood, keep plasma and return rest to you by apheresis donation.</div>
                            </div>

                            <div className="para">
                                <div className="question">How long does it take?</div>

                                <div className="answer">15 minutes to donate.</div>
                            </div>

                            <div className="para">
                                <div className="question">How often can I donate?</div>

                                <div className="answer">Every 2-3 weeks.</div>
                            </div>
                        </div>
                    </div>

                    <div id="platelet">
                        <div className="column-left p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">What is it?</div>

                                <div className="answer">The tiny 'plates' in blood that wedge together to help to clot and reduce bleeding. Always in high demand, Vital for people with low platelet count, like malaria and cancer patients.</div>
                            </div>

                            <div className="para">
                                <div className="question">Who can donate?</div>

                                <div className="answer">You need to be 18-70 years old (men), weigh 50kg or more and have given a successful plasma donation in the past 12 months</div>
                            </div>
                        </div>

                        <div className="column-center p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">User For?</div>

                                <div className="answer">Cancer, blood diseases, haemophilia, anaemia, heart disease, stomach disease, kidney disease, childbirth, operations, blood loss, trauma, burns.</div>
                            </div>

                            <div className="para">
                                <div className="question">Lasts For?</div>

                                <div className="answer">Just five days..</div>
                            </div>
                        </div>

                        <div className="column-right p-col" style={{ width: "350px" }}>
                            <div className="para">
                                <div className="question">How does it work?</div>

                                <div className="answer">We collect your blood, keep platelet and return rest to you by apheresis donation.</div>
                            </div>

                            <div className="para">
                                <div className="question">How long does it take?</div>

                                <div className="answer">45 minutes to donate.</div>
                            </div>

                            <div className="para">
                                <div className="question">How often can I donate?</div>

                                <div className="answer">Every 2 weeks</div>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-section-btn">
                        <Link to="directory" style={{ "textDecoration": "none", color: "white" }}>
                            Find Nearest Blood Bank To Donate
                        </Link>
                    </div>
                </section>
            </div>
        </div >
    );

};

export default HomePage;
