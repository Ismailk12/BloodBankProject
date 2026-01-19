import React, { useState, useEffect } from 'react';
import './DonationCampPage.css';
import Server from 'axios';
import ReactPaginate from 'react-paginate';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

function DonationCampPage() {

    const [pageLoad, setPageLoad] = useState(true);
    const [show, setShow] = useState(false);
    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [SearcByBLoodBank, setSearcByBLoodBank] = useState("");
    const [totalCamps, setTotalCamps] = useState([]);
    const [camps, setCamps] = useState([]);
    const [ConductedBy, setConductedBy] = useState("");
    const [Date, setDate] = useState("");
    const [limit, setLimit] = useState(4);
    const [page, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [getAll, setGetAll] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [Success, setSuccess] = useState("");
    const [Error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const handleShow = () => {
        if (show === false) {
            setShow(true);

        } else if (show === true) {
            setShow(false);
        };
    };

    useEffect(() => {
        Server.get("/locations").then((Response) => {
            setState(Response.data.states);

        }).catch((Error) => {
            setError(Error.response.data.message);
        });
    }, []);

    useEffect(() => {
        if (pageLoad === true) {
            Server.post("/filterDonationCamps", {
                State: selectedState,
                District: selectedDistrict,
                ConductedBy,
                Date,
                Limit: limit,
                Page: page
            }).then(Response => {
                setLoading(false);
                setSuccess(Response.data.message);
                const totalResults = Response.data.totalResultsCount;
                const PageSize = Response.data.limit;
                const numberOfPages = Math.ceil((totalResults / PageSize));

                setTotalCamps(Response.data.totalCamps);
                setCamps(Response.data.camps);
                setNumberOfPages(numberOfPages);

            }).catch(Error => {
                setError(Error.response.data.message);
            });

            setPageLoad(false);
        };
    }, [ConductedBy, Date, limit, page, pageLoad, selectedDistrict, selectedState]);

    const handleState = (e) => {
        document.getElementById('district').value = "Select District";
        setSelectedDistrict("");
        const value = e.target.value;
        setSelectedState(value);
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
        setPage(1);
    };

    const handleBottomState = (e) => {
        document.getElementById('district2').value = "Select District";
        setSelectedDistrict("");
        const value = e.target.value;
        setSelectedState(value);
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
        setPageLoad(true);
        setPage(1);
    };

    const handleDistrict = (e) => {
        const value = e.target.value;
        setSelectedDistrict(value);
        setPage(1);
    };

    const handleBottomDistrict = (e) => {
        const value = e.target.value;
        setSelectedDistrict(value);
        setPageLoad(true);
        setPage(1);
    };

    const handleSearcByBLoodBank = (e) => {
        const { value } = e.target;
        setSearcByBLoodBank(value);
    };

    const handleLimit = (e) => {
        const value = e.target.value;
        if (value === "All") {
            setGetAll(true);
            setPageLoad(true);
        } else {
            setGetAll(false);
            setLimit(value);
            setPageLoad(true);
        }
        setPage(1);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
    };

    const handleConductedBy = (e) => {
        const value = e.target.value;
        setConductedBy(value);
        setPageLoad(true);
    };

    const handleDate = (e) => {
        const value = e.target.value;
        setDate(value);
        setPageLoad(true);
    };

    const handlePageClick = (e) => {
        document.getElementById('search-blood-bank').value = "";
        setSearchText("");
        const CurrentPage = e.selected + 1;
        setPage(CurrentPage);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Server.post("/filterDonationCamps", {
            State: selectedState,
            District: selectedDistrict,
            ConductedBy,
            Date,
            Limit: limit,
            Page: page
        }).then(Response => {
            setLoading(false);
            setSuccess(Response.data.message);
            const totalResults = Response.data.totalResultsCount;
            const PageSize = Response.data.limit;
            const numberOfPages = Math.ceil((totalResults / PageSize));

            setTotalCamps(Response.data.totalCamps);
            setCamps(Response.data.camps);
            setNumberOfPages(numberOfPages);

        }).catch(Error => {
            setError(Error.response.data.message);
        });
    };

    return (
        <div className="DonationCamp">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <div className="DonationCamp_heading">Camp Schedule</div>

            <section className="DonationCamp_top">
                <div className="DonationCamp_comment" onClick={handleShow}>
                    Show Advance Search
                    {
                        show === true
                            ?
                            <i style={{ marginLeft: "10px" }} className="fas fa-angle-double-up"></i>
                            :
                            <i style={{ marginLeft: "10px" }} className="fas fa-angle-double-down"></i>
                    }

                </div>

                <div style={show === true ? { display: "block" } : { display: "none" }}>
                    <form className="DonationCamp_form" onSubmit={handleSubmit}>
                        <div className="DonationCamp_form_column">
                            <select style={{ width: "95%" }} defaultValue={"Select State"} onChange={handleState}>
                                <option value="Select State" disabled>Select State</option>

                                {
                                    state.map((element) => (
                                        <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="DonationCamp_form_column">
                            <select style={{ width: "95%" }} defaultValue={"Select District"} id="district" onChange={handleDistrict}>
                                <option value="Select District" disabled>Select District</option>

                                {
                                    district.map((element) => (
                                        <option key={element.index} name="District" value={element.name}>{element.name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="DonationCamp_form_column_input" onChange={handleSearcByBLoodBank}>
                            <input style={{ width: "95%" }} type="text" placeholder="Blood Bank or Hospital Name" />
                        </div>

                        <div className="DonationCamp_form_column" align="right">
                            <button type="submit">Search</button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="DonationCamp_bottom">
                <div className="DonationCamp_bottom_table_options">
                    <div className="DonationCamp_bottom_entry_limit">
                        <span style={{ "fontSize": "1.1rem", "marginRight": "5px" }}><strong>Show</strong></span>
                        <span>
                            <select style={{ padding: "5px", "fontSize": "1.1rem" }} onChange={handleLimit}>
                                <option value={4}>4</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={"All"}>All</option>
                            </select>
                        </span>
                        <span style={{ "fontSize": "1.1rem", "marginLeft": "5px" }}><strong>entries</strong></span>
                    </div>

                    <div className="DonationCamp_bottom_search_box">
                        <label htmlFor="search-blood-bank" style={{ "fontSize": "1.1rem", "marginRight": "5px" }}><strong>Search:</strong> </label>

                        <input type="text" id="search-blood-bank" style={{ padding: "5px", "fontSize": "1.1rem" }} onChange={handleSearch} />
                    </div>
                </div>

                <table className="DonationCamp_table">
                    <thead className="DonationCamp_table_head">
                        <tr>
                            <th style={{ maxWidth: "5%" }}>S.NO.</th>
                            <th style={{ width: "10%" }}>Date</th>
                            <th style={{ width: "10%" }}>Time</th>
                            <th style={{ width: "14%" }}>Camp Name</th>
                            <th style={{ width: "15%" }}>Address</th>
                            <th style={{ width: "8%" }}>State</th>
                            <th style={{ width: "8%" }}>District</th>
                            <th style={{ width: "10%" }}>Contct</th>
                            <th style={{ width: "10%" }}>Conducted By</th>
                            <th style={{ width: "5%" }}>Organized By</th>
                            <th style={{ width: "5%" }}>Register</th>
                        </tr>
                    </thead>

                    <tbody className="DonationCamp_table_body">
                        {
                            SearcByBLoodBank.length > 0
                                ?
                                totalCamps &&
                                totalCamps.filter(item => (item.CampName || "").toLowerCase().includes(SearcByBLoodBank.toLowerCase())).map((element, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{element.Date}</td>
                                        <td>{element.Time}</td>
                                        <td>{element.CampName}</td>
                                        <td>{element.Address}</td>
                                        <td>{element.State}</td>
                                        <td>{element.District}</td>
                                        <td>{element.Contact}</td>
                                        <td>{element.ConductedBy}</td>
                                        <td>{element.OrganizedBy}</td>
                                        <td>{(element.Register || "").length === 0 ? "NA" : element.Register}</td>
                                    </tr>
                                ))
                                :
                                getAll === true
                                    ? totalCamps &&
                                    totalCamps.filter(item => (item.CampName || "").toLowerCase().includes(searchText.toLowerCase()) || (item.Address || "").toLowerCase().includes(searchText.toLowerCase())).map((element, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{element.Date}</td>
                                            <td>{element.Time}</td>
                                            <td>{element.CampName}</td>
                                            <td>{element.Address}</td>
                                            <td>{element.State}</td>
                                            <td>{element.District}</td>
                                            <td>{element.Contact}</td>
                                            <td>{element.ConductedBy}</td>
                                            <td>{element.OrganizedBy}</td>
                                            <td>{(element.Register || "").length === 0 ? "NA" : element.Register}</td>
                                        </tr>
                                    ))

                                    : camps &&
                                    camps.filter(item => (item.CampName || "").toLowerCase().includes(searchText.toLowerCase()) || (item.Address || "").toLowerCase().includes(searchText.toLowerCase())).map((element, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{element.Date}</td>
                                            <td>{element.Time}</td>
                                            <td>{element.CampName}</td>
                                            <td>{element.Address}</td>
                                            <td>{element.State}</td>
                                            <td>{element.District}</td>
                                            <td>{element.Contact}</td>
                                            <td>{element.ConductedBy}</td>
                                            <td>{element.OrganizedBy}</td>
                                            <td>{(element.Register || "").length === 0 ? "NA" : element.Register}</td>
                                        </tr>
                                    ))
                        }

                        <tr>
                            <td></td>
                            <td>
                                <select style={{ width: "95%" }} onChange={handleDate}>
                                    <option>All</option>

                                    {
                                        totalCamps.map((element, index) => (
                                            <option key={index} name="District" value={element.Date}>{element.Date}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <select style={{ width: "95%" }} defaultValue={"Select State"} onChange={handleBottomState}>
                                    <option value="Select State" disabled>All</option>

                                    {
                                        state.map((element) => (
                                            <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select style={{ width: "95%" }} defaultValue={"Select District"} id="district2" onChange={handleBottomDistrict}>
                                    <option value="Select District" disabled>All</option>

                                    {
                                        district.map((element) => (
                                            <option key={element.index} name="District" value={element.name}>{element.name}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td></td>
                            <td>
                                <select style={{ width: "95%" }} onChange={handleConductedBy}>
                                    <option>All</option>
                                    {
                                        totalCamps.map((element, index) => (
                                            <option key={index} name="District" value={element.ConductedBy}>{element.ConductedBy}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                {
                    camps.length > 0
                        ?
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={1}
                            pageCount={numberOfPages}
                            previousLabel="< previous"
                            renderOnZeroPageCount={null}
                            containerClassName={"paginationBtn"}
                            previousLinkClassName={"previousBtn"}
                            nextLinkClassName={"nextBtn"}
                            disabledClassName={"paginationDisabled"}
                            activeClassName={"paginationActive"}
                        />
                        :
                        null
                }
            </section>

        </div>
    );
};

export default DonationCampPage;