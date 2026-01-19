import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Server from 'axios';

function Header() {

    const userAuthentication = useSelector(State => State.userAuthentication);
    const { user, isLoggedIn } = userAuthentication;

    const LogOutHandler = () => {

        Server.get("/user/logout").then(() => {
            localStorage.removeItem("firstLogin");
            window.location.href = "/";

        }).catch(() => {
            window.location.href = "/";
        });

    };

    const uncheckStyle = () => {
        document.getElementById("Header-Dropdown-Icon").checked = false;
    };

    return (
        <header >

            <div className="Header">
                <div className="Logo"><Link to="/">BloodBank</Link></div>

                <section className="Header-Main-Navigation">

                    <ul className="Navigations">
                        <li className="Navigation-Options">
                            <div style={{ background: "red", color: "white" }}>About Us
                                <i style={{ transform: "translate(0)" }} className="fas fa-sort-up up-arrow"></i>
                            </div>

                            <ul className="Navigation-Links">
                                <Link to="/"><li>Home</li></Link>
                                <Link to="/about"><li>About eRaktkosh</li></Link>
                                <Link to="/notification"><li>Notifications</li></Link>
                                <Link to="/eraktkoshFAQs"><li>Eraktkosh FAQs</li></Link>
                                <Link to="/gallery"><li>Gallery</li></Link>
                                <Link to="/videoGallery"><li>Video Gallery</li></Link>
                                <Link to="/contact"><li>Contact Us</li></Link>
                            </ul>

                        </li>

                        <li className="Navigation-Options">
                            <div>Looking For Blood
                                <i className="fas fa-sort-up up-arrow"></i>
                            </div>

                            <ul className="Navigation-Links">
                                <Link to="/bloodAvailability"><li>Blood Availability</li></Link>
                                <Link to="/directory"><li>Blood Bank Directory</li></Link>
                            </ul>
                        </li>

                        <li className="Navigation-Options">
                            <div>Want To Donate
                                <i className="fas fa-sort-up up-arrow"></i>
                            </div>

                            <ul className="Navigation-Links">
                                <Link to="/donationCamps"><li>Blood Donation Camps</li></Link>
                                <Link to="/appointment"><li>Appointment for Blood Bank</li></Link>
                                {
                                    isLoggedIn === true
                                        ?
                                        <></>
                                        :
                                        <Link to="/login"><li>Donor Login</li></Link>
                                }
                                <Link to="/aboutDonation"><li>About Blood Donation</li></Link>
                            </ul>
                        </li>

                        <li className="Navigation-Options">
                            {
                                isLoggedIn === true
                                    ?
                                    <>
                                        <div>
                                            <span className="User-Profile-Name">
                                                <img src={user.Avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src = "https://www.w3schools.com/howto/img_avatar.png" }} />
                                                <strong>{user.FirstName}</strong>
                                            </span>
                                            <i className="fas fa-sort-up up-arrow"></i>
                                        </div>

                                        <ul className="Navigation-Links">
                                            <Link to="/profile"><li>Profile</li></Link>
                                            <Link to="/addBloodBank"><li>Add your Blood Bank</li></Link>
                                            <Link to="/create_camp"><li>Create a Camp</li></Link>
                                            <Link to="/" onClick={LogOutHandler}><li>Logout</li></Link>
                                        </ul>
                                    </>
                                    :
                                    <>
                                        <div><strong>Blood Bank Login</strong>
                                            <i className="fas fa-sort-up up-arrow"></i>
                                        </div>

                                        <ul className="Navigation-Links">
                                            <Link to="/login"><li>eRaktkosh Login</li></Link>
                                            <Link to="/addBloodBank"><li>Add your Blood Bank</li></Link>
                                        </ul>
                                    </>
                            }
                        </li>

                        <li className="Navigation-Options">
                            <Link to="/fundraising" style={{ "textDecoration": "none", color: "black" }}>
                                <div>fundraising
                                    <i className="fas fa-sort-up up-arrow"></i>
                                </div>
                            </Link>
                        </li>
                    </ul>

                </section>

                <section className="Header-Dropdown-Navigation">

                    <input type="checkbox" id="Header-Dropdown-Icon" className="checkbox" />
                    <label htmlFor="Header-Dropdown-Icon" className="Dropdown-Toggle">
                        <i className="fas fa-bars Dropdown-Toggle-Icon"></i>
                    </label>

                    <ul className="Dropdown-Navigations">

                        <li className="Dropdown-Navigation-Options">
                            <input type="checkbox" id="about-us" className="checkbox" />
                            <label htmlFor="about-us">
                                <div style={{ background: "red", color: "white", border: "1px solid white" }} className="nav-head">About Us
                                    <i className="fas fa-bars toggle-icon"></i>
                                </div>
                            </label>

                            <ul className="Dropdown-Navigation-Links one">
                                <Link to="/" onClick={uncheckStyle}><li>Home</li></Link>
                                <Link to="/about" onClick={uncheckStyle}><li>About eRaktkosh</li></Link>
                                <Link to="/notification" onClick={uncheckStyle}><li>Notifications</li></Link>
                                <Link to="/eraktkoshFAQs" onClick={uncheckStyle}><li>Eraktkosh FAQs</li></Link>
                                <Link to="/gallery" onClick={uncheckStyle}><li>Gallery</li></Link>
                                <Link to="/videoGallery" onClick={uncheckStyle}><li>Video Gallery</li></Link>
                                <Link to="/contact" onClick={uncheckStyle}><li>Contact Us</li></Link>
                            </ul>
                        </li>

                        <li className="Dropdown-Navigation-Options">
                            <input type="checkbox" id="for-blood" className="checkbox" />
                            <label htmlFor="for-blood">
                                <div className="nav-head">Looking For Blood
                                    <i className="fas fa-bars toggle-icon"></i>
                                </div>
                            </label>

                            <ul className="Dropdown-Navigation-Links two">
                                <Link to="/bloodAvailability" onClick={uncheckStyle}><li>Blood Availability</li></Link>
                                <Link to="/directory" onClick={uncheckStyle}><li>Blood Bank Directory</li></Link>
                            </ul>
                        </li>

                        <li className="Dropdown-Navigation-Options">
                            <input type="checkbox" id="donate" className="checkbox" />
                            <label htmlFor="donate">
                                <div className="nav-head">Want to Donate
                                    <i className="fas fa-bars toggle-icon"></i>
                                </div>
                            </label>

                            <ul className="Dropdown-Navigation-Links three">
                                <Link to="/donationCamps" onClick={uncheckStyle}><li>Blood Donation Camps</li></Link>
                                <Link to="/appointment" onClick={uncheckStyle}><li>Appointment for Blood Bank</li></Link>
                                <Link to="/login" onClick={uncheckStyle}><li>Donor Login</li></Link>
                                <Link to="/aboutDonation" onClick={uncheckStyle}><li>About Blood Donation</li></Link>
                            </ul>
                        </li>

                        {
                            isLoggedIn === true
                                ?
                                <li className="Dropdown-Navigation-Options">
                                    <input type="checkbox" id="profile" className="checkbox" />
                                    <label htmlFor="profile">
                                        <div className="nav-head"><strong>{user.FirstName}</strong>
                                            <i className="fas fa-bars toggle-icon"></i>
                                        </div>
                                    </label>

                                    <ul className="Dropdown-Navigation-Links four">
                                        <Link to="/profile" onClick={uncheckStyle}><li>Profile</li></Link>
                                        <Link to="/addBloodBank" onClick={uncheckStyle}><li>Add your Blood Bank</li></Link>
                                        <Link to="/create_camp" onClick={uncheckStyle}><li>Create a Camp</li></Link>
                                        <Link to="/" onClick={LogOutHandler}><li>Logout</li></Link>
                                    </ul>
                                </li>
                                :
                                <li className="Dropdown-Navigation-Options">
                                    <input type="checkbox" id="login" className="checkbox" />
                                    <label htmlFor="login">
                                        <div className="nav-head"><strong>Blood Bank Login</strong>
                                            <i className="fas fa-bars toggle-icon"></i>
                                        </div>
                                    </label>

                                    <ul className="Dropdown-Navigation-Links four">
                                        <Link to="/login" onClick={uncheckStyle}><li>eRaktkosh Login</li></Link>
                                        <Link to="/addBloodBank" onClick={uncheckStyle}><li>Add your Blood Bank</li></Link>
                                    </ul>
                                </li>
                        }

                        <li className="Dropdown-Navigation-Options">
                            <input type="checkbox" id="fundraising" className="checkbox" />
                            <label htmlFor="fundraising">
                                <Link to="fundraising" style={{ "textDecoration": "none" }} onClick={uncheckStyle}>
                                    <div className="nav-head">Fundraising</div>
                                </Link>
                            </label>
                        </li>

                    </ul>

                </section>
            </div>

        </header>
    );

};

export default Header;
