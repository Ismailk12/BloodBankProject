import React, { useEffect, useState } from 'react';
import Server from 'axios';
import { Loading, SuccessMessage, ErrorMessage } from '../../Utilities/Notification';

function TransactionDetails(props) {

    const [orderID, setOrderID] = useState("");
    const [txnID, setTxnID] = useState("");
    const [txnDate, setTxnDate] = useState("");
    const [txnAmount, setTxnAmount] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [Success, setSuccess] = useState("");
    const [Error, setError] = useState("");
    const OrderID = props.history.location.state.OrderID;

    useEffect(() => {
        if (OrderID.length > 0) {
            setLoading(true);
            Server.post("/CurrentTransaction", { ORDERID: OrderID }).then((Response) => {
                const currTxnAmount = Number(Response.data.details.TXNAMOUNT);

                Server.post("/getfundraisingbyID", { ID: Response.data.details.RECIEVER_RREQUEST_ID }).then((Result) => {
                    const totalRecievedFunds = Result.data.result.RecievedFunds;
                    const TotalRecievedFunds = totalRecievedFunds + currTxnAmount;

                    if (status === "TXN_SUCCESS") {
                        Server.patch("/updatefundraising", { FundID: Response.data.details.RECIEVER_RREQUEST_ID, RecievedFunds: TotalRecievedFunds }).then(() => {
                            setLoading(false);
                            setOrderID(Response.data.details.ORDERID);
                            setTxnID(Response.data.details.TXNID);
                            setTxnDate(Response.data.details.TXNDATE);
                            setTxnAmount(Response.data.details.TXNAMOUNT);
                            setStatus(Response.data.details.STATUS);
                            setSuccess(Response.data.message);

                        }).catch(Error => {
                            setLoading(false);
                            setError(Error.response.data.message);
                        });

                    } else {
                        setLoading(false);
                        setOrderID(Response.data.details.ORDERID);
                        setTxnID(Response.data.details.TXNID);
                        setTxnDate(Response.data.details.TXNDATE);
                        setTxnAmount(Response.data.details.TXNAMOUNT);
                        setStatus(Response.data.details.STATUS);
                        setSuccess(Response.data.message);
                    };

                }).catch(Error => {
                    setLoading(false);
                    setError(Error.response.data.message);
                });

            }).catch(Error => {
                setLoading(false);
                setError(Error.response.data.message);
            });
        };
    }, [OrderID, status, txnAmount]);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="TransactionDetails">

            {loading && <Loading loading={loading} />}
            {Success && <SuccessMessage message={Success} />}
            {Error && <ErrorMessage message={Error} />}

            <div className="item-container">
                <div><div className="TransactionDetails_head">Status:</div> <div className="TransactionDetails_body">{status}</div></div>

                <div><div className="TransactionDetails_head">Order ID:</div> <div className="TransactionDetails_body">{orderID}</div></div>

                <div><div className="TransactionDetails_head">Transaction ID:</div> <div className="TransactionDetails_body">{txnID}</div></div>

                <div><div className="TransactionDetails_head">Transaction Date:</div> <div className="TransactionDetails_body">{txnDate}</div></div>

                <div><div className="TransactionDetails_head">Transaction Amount:</div> <div className="TransactionDetails_body">{txnAmount}</div></div>
            </div>

        </div>
    );

};

export default TransactionDetails;