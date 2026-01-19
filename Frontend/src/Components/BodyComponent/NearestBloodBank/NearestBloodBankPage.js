import React, { useState, useEffect } from 'react';
import './NearestBloodBankPage.css';
import Server from 'axios';
import ReactPaginate from 'react-paginate';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

function NearestBloodBankPage() {

    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [limit, setLimit] = useState(4);
    const [page, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [getAll, setGetAll] = useState(false);
    const [totalBloodBanks, setTotalBloodBanks] = useState([]);
    const [bloodBanks, setBloodBanks] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [searchByName, setSearchByName] = useState("");
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
                setLoading(false);
                const totalResults = Response.data.totalResultsCount;
                const PageSize = Response.data.limit;
                const numberOfPages = Math.ceil((totalResults / PageSize));

                setTotalBloodBanks(Response.data.totalResult)
                setBloodBanks(Response.data.bloodBanks);
                setNumberOfPages(numberOfPages);
                setSuccess(Response.data.message);

            }).catch(Error => {
                setLoading(false);
                setError(Error.response.data.message);
            });

        };

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
        if (value === "All") {
            setGetAll(true)
        } else {
            setGetAll(false);
            setLimit(value);
        }
        setPage(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedState.length > 0) {
            setClicked(true);
        }
    };

    const handlePageClick = (e) => {
        document.getElementById('search-blood-bank').value = "";
        setSearchText("");
        const CurrentPage = e.selected + 1;
        setPage(CurrentPage);
    };

    const handleSearchByName = (e) => {
        const value = e.target.value;
        setSearchByName(value);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
    };

    return (
        <div className="NearestBloodBankPage">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <div className="heading">Nearest Blood Bank(BB)/ Blood Storage Unit(BSU)</div>

            <section className="top-section">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="select-state-form">
                        <select defaultValue={"Select State"} className="select-state" onChange={handleState}>
                            <option value="Select State" disabled>Select State</option>

                            {
                                state.map((element) => (
                                    <option key={element.index} name="State" value={element.state}>{element.state}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="select-district-form">
                        <select defaultValue={"Select District"} className="select-district" id="district" onChange={handleDistrict}>
                            <option value="Select District" disabled>Select District</option>

                            {
                                district.map((element) => (
                                    <option key={element.index} name="District" value={element.name}>{element.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <input type="text" placeholder="Blood Bank or Hospital Name" className="top-input" onChange={handleSearchByName} />

                    <button type="submit" className="top-search-btn">Search</button>
                </form>
            </section>

            <section className="bottom-section">
                <div className="table-options">
                    <div className="entry-limit">
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

                    <div className="search-box">
                        <label htmlFor="search-blood-bank" style={{ "fontSize": "1.1rem", "marginRight": "5px" }}><strong>Search:</strong> </label>

                        <input type="text" id="search-blood-bank" style={{ padding: "5px", "fontSize": "1.1rem" }} onChange={handleSearch} />
                    </div>
                </div>

                <table className="bottom-result-table">
                    <thead className="table-head">
                        <tr>
                            <th>S.NO.</th>
                            <th className="name">Name</th>
                            <th className="name">Address</th>
                            <th className="name">Phone</th>
                            <th>Email</th>
                            <th>Category</th>
                            <th>Distance (km)</th>
                            <th>Type</th>
                        </tr>
                    </thead>

                    <tbody className="table-body">
                        {
                            searchByName.length > 0
                                ?
                                totalBloodBanks &&
                                totalBloodBanks.filter(item => (item.BloodBank || "").toLowerCase().includes(searchText.toLowerCase()) || (item.Address || "").toLowerCase().includes(searchText.toLowerCase())).map((items, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{items.BloodBank}</td>
                                        <td>{items.Address}</td>
                                        <td>{items.Phone}</td>
                                        <td>{items.Email}</td>
                                        <td>{items.Category}</td>
                                        <td>-</td>
                                        <td>{items.type}</td>
                                    </tr>
                                ))
                                :
                                getAll === true
                                    ? totalBloodBanks &&
                                    totalBloodBanks.filter(item => (item.BloodBank || "").toLowerCase().includes(searchText.toLowerCase()) || (item.Address || "").toLowerCase().includes(searchText.toLowerCase())).map((items, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{items.BloodBank}</td>
                                            <td>{items.Address}</td>
                                            <td>{items.Phone}</td>
                                            <td>{items.Email}</td>
                                            <td>{items.Category}</td>
                                            <td>-</td>
                                            <td>{items.type}</td>
                                        </tr>
                                    ))
                                    :
                                    bloodBanks &&
                                    bloodBanks.filter(item => (item.BloodBank || "").toLowerCase().includes(searchText.toLowerCase()) || (item.Address || "").toLowerCase().includes(searchText.toLowerCase())).map((items, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{items.BloodBank}</td>
                                            <td>{items.Address}</td>
                                            <td>{items.Phone}</td>
                                            <td>{items.Email}</td>
                                            <td>{items.Category}</td>
                                            <td>-</td>
                                            <td>{items.type}</td>
                                        </tr>
                                    ))
                        }
                    </tbody>
                </table>

                {
                    getAll === true
                        ?
                        <></>
                        :
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
            </section>

        </div>
    );

};

export default NearestBloodBankPage;
