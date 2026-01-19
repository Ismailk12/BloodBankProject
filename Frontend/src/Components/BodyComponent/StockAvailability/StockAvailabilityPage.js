import React, { useState, useEffect } from 'react';
import './StockAvailabilityPage.css';
import Server from 'axios';
import ReactPaginate from 'react-paginate';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

function StockAvailabilityPage() {

    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [bloodBanks, setBloodBanks] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [Success, setSuccess] = useState("");
    const [Error, setError] = useState("");

    useEffect(() => {
        Server.get("/locations").then((Response) => {
            setState(Response.data.states);
        }).catch((Error) => {
            console.log(Error);
        });
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (clicked === true) {
            const Request = {
                State: selectedState,
                District: selectedDistrict,
                Limit: limit,
                Page: page
            };
            setLoading(true);
            Server({
                method: "POST",
                url: "/filterBloodBanks",
                headers: { "Content-Type": "application/json" },
                data: Request

            }).then(Response => {
                if (isMounted) {
                    setLoading(false);
                    const totalResults = Response.data.totalResultsCount;
                    const PageSize = Response.data.limit;
                    const numberOfPages = Math.ceil((totalResults / PageSize));
                    const Result = Response.data.bloodBanks;

                    setBloodBanks(Result);
                    setNumberOfPages(numberOfPages)
                    setSuccess(Response.data.message);
                };

            }).catch(Error => {
                setLoading(false);
                setError(Error.response.data.message);
            });
        };

        return () => { isMounted = false };
    }, [selectedState, selectedDistrict, limit, page, clicked]);

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

    const handleDistrict = (e) => {
        const value = e.target.value;
        setSelectedDistrict(value);
        setPage(1);
    };

    const handleLimit = (e) => {
        const value = e.target.value;
        setLimit(value);
        setPage(1);
    };

    const handlePageClick = (e) => {
        document.getElementById('search-blood-bank').value = "";
        setSearchText("");
        const CurrentPage = e.selected + 1;
        setPage(CurrentPage);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setClicked(true);
    };

    return (

        <div className="StockAvailabilityPage">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <div className="heading">Blood Stock Availability</div>

            <section className="top-section" >
                <div className="form-heading">
                    <div className="heading-text">Search Blood Stock</div>
                </div>

                <form className="top-section-form" onSubmit={handleSubmit}>
                    <div className="form">
                        <div className="select-state-form">
                            <select defaultValue="Select State" className="select-state" onChange={handleState}>
                                <option value="Select State" disabled>Select State</option>

                                {
                                    state.map((element) => (
                                        <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="select-district-form">
                            <select defaultValue="Select District" className="select-district" id="district" onChange={handleDistrict}>
                                <option value="Select District">Select District</option>

                                {
                                    district.map((element) => (
                                        <option key={element.index} name="District" value={element.name}>{element.name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="select-blood-group-form">
                            <select defaultValue={"Select Blood Group"} className="select-blood-group">
                                <option value="Select Blood Group" disabled>Select Blood Group</option>
                                <option value="AB-Ve">AB-Ve</option>
                                <option value="AB+Ve">AB+Ve</option>
                                <option value="A-Ve">A-Ve</option>
                                <option value="A+Ve">A+Ve</option>
                                <option value="B-Ve">B-Ve</option>
                                <option value="B+Ve">B+Ve</option>
                                <option value="Oh-VE">Oh-VE</option>
                                <option value="Oh+VE">Oh+VE</option>
                                <option value="O-Ve">O-Ve</option>
                                <option value="O+Ve">O+Ve</option>
                                <option value="All">All Blood Groups</option>
                            </select>
                        </div>

                        <div className="select-blood-component-form">
                            <select defaultValue={"Select Blood Component"} className="select-blood-component">
                                <option value="Select Blood Component" disabled>Select Blood Component</option>
                                <option value="Whole Blood">Whole Blood</option>
                                <option value="Single Donor Platelet">Single Donor Platelet</option>
                                <option value="Single Donor Plasma">Single Donor Plasma</option>
                                <option value="Plasma">Plasma</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="search-btn">Search</button>
                </form>
            </section>

            <section className="bottom-section">
                <div className="table-options">
                    <div className="entry-limit">
                        <span style={{ "fontSize": "1.1rem", "marginRight": "5px" }}><strong>Show</strong></span>
                        <span>
                            <select style={{ padding: "5px", "fontSize": "1.1rem" }} onChange={handleLimit}>
                                <option name="limit" value={10}>10</option>
                                <option name="limit" value={25}>25</option>
                                <option name="limit" value={50}>50</option>
                                <option name="limit" value={100}>100</option>
                            </select>
                        </span>
                        <span style={{ "fontSize": "1.1rem", "marginLeft": "5px" }}><strong>entries</strong></span>
                    </div>

                    <div className="search-box">
                        <label htmlFor="search-blood-bank" style={{ "fontSize": "1.1rem", "marginRight": "5px" }}><strong>Search:</strong> </label>

                        <input type="text" id="search-blood-bank" style={{ padding: "5px", "fontSize": "1.1rem" }} onChange={handleSearch} />
                    </div>
                </div>

                <table className="result-table">
                    <thead className="table-head">
                        <tr>
                            <th>S.NO.</th>
                            <th className="b_bank">Blood Bank</th>
                            <th>Category</th>
                            <th>Availability</th>
                            <th>Last Updated</th>
                            <th>Type</th>
                        </tr>
                    </thead>

                    <tbody className="table-body">
                        {bloodBanks &&
                            bloodBanks.filter(item => (item.BloodBank).toLowerCase().includes(searchText.toLowerCase()) || (item.Address).toLowerCase().includes(searchText.toLowerCase())).map((items, index) => (
                                <tr key={index} >
                                    <td>{index + 1}</td>
                                    <td className="b_bank">{items.BloodBank}, {items.Address}</td>
                                    <td>{items.Category}</td>
                                    <td>{items.Availability}</td>
                                    <td>{items.LastUpdated}</td>
                                    <td>{items.type}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <div>
                    {
                        bloodBanks.length > 0
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
                </div>
            </section>

        </div >
    );

};

export default StockAvailabilityPage;