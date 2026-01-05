// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm";
// import Header_Login from "../components/common/header/Header_Login";
// import Footer from "../components/common/footer/Footer";
// import { Table, Spinner, Button } from "react-bootstrap";
// import { User_wallet_transactions } from "../api/product/Product"; // ← update path

// const stripePromise = loadStripe(
//     "pk_test_51S8c8FPX44LSQqJubLM9zik1ycbRa02AUF0uC8FR5bWANRhHVAQ1nlW4D8rigYJsp6CLdGQ2G5g6Z2nprRw3hfpQ00bHfjyM74"
// );

// export default function PayNowButton() {
//     const [open, setOpen] = useState(false);
//     const [amount, setAmount] = useState("");
//     const [currency, setCurrency] = useState("USD");

//     const [transactions, setTransactions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     // pagination state
//     const [pagination, setPagination] = useState(null);
//     const [page, setPage] = useState(1);
//     const perPage = 30;

//     const handleOpen = () => {
//         if (!amount || isNaN(amount) || amount <= 0) {
//             alert("Please enter a valid amount");
//             return;
//         }
//         setOpen(true);
//     };

//     const fetchTransactions = async (pageNumber = 1) => {
//         setLoading(true);
//         try {
//             const res = await User_wallet_transactions(pageNumber, perPage);
//             if (res?.data?.status) {
//                 setTransactions(res.data.data);
//                 setPagination(res.data.pagination);
//             } else {
//                 setTransactions([]);
//                 setPagination(null);
//             }
//         } catch (error) {
//             console.error("Error fetching transactions:", error);
//             setTransactions([]);
//             setPagination(null);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchTransactions(page);
//     }, [page]);


//     // Generate page numbers
//     const renderPagination = () => {
//         if (!pagination) return null;

//         const pages = [];
//         for (let i = 1; i <= pagination.last_page; i++) {
//             pages.push(
//                 <Button
//                     key={i}
//                     variant={i === page ? "primary" : "light"}
//                     className="mx-1"
//                     onClick={() => setPage(i)}
//                 >
//                     {i}
//                 </Button>
//             );
//         }

//         return (
//             <div className="d-flex justify-content-center align-items-center my-5">
//                 <Button
//                     variant="secondary"
//                     className="mx-1"
//                     disabled={page === 1}
//                     onClick={() => setPage(page - 1)}
//                 >
//                     Previous
//                 </Button>
//                 {pages}
//                 <Button
//                     variant="secondary"
//                     className="mx-1"
//                     disabled={page === pagination.last_page}
//                     onClick={() => setPage(page + 1)}
//                 >
//                     Next
//                 </Button>
//             </div>
//         );
//     };

//     return (
//         <main>
//             <Header_Login />
//             <div className='content-outer'>
//             <div className="payment-container">
//                 <h2 className="payment-title">Stripe Payment</h2>

//                 <div className="payment-form">
//                     <div className="input-group">
//                         <label>Amount</label>
//                         <input
//                             type="number"
//                             value={amount}
//                             onChange={(e) => setAmount(e.target.value)}
//                             placeholder="Enter amount"
//                             className="input-field"
//                         />
//                     </div>

//                     <div className="input-group">
//                         <label>Currency</label>
//                         <select
//                             value={currency}
//                             onChange={(e) => setCurrency(e.target.value)}
//                             className="input-field"
//                         >
//                             <option value="USD">USD</option>
//                             <option value="INR">INR</option>
//                             <option value="EUR">EUR</option>
//                         </select>
//                     </div>

//                     <Button variant="primary" onClick={handleOpen}>
//                         Pay Now
//                     </Button>
//                 </div>

//                 {/* Checkout Modal */}
//                 {open && (
//                     <div className="modal-overlay">
//                         <div className="modal-content">
//                             <Elements stripe={stripePromise}>
//                                 <CheckoutForm
//                                     amount={amount}
//                                     currency={currency}
//                                     onClose={() => setOpen(false)}
//                                     onPaymentSuccess={fetchTransactions}   // 👈 yahan pass kiya
//                                 />

//                             </Elements>
//                         </div>
//                     </div>
//                 )}


//             </div>
//             {/* Transaction History Table */}
//             <div className="transaction-history mt-4 container">
//                 <h3>Transaction History</h3>
//                 {loading ? (
//                     <div className="text-center my-4">
//                         <Spinner animation="border" />
//                         <p>Loading transactions...</p>
//                     </div>
//                 ) : (
//                     <Table striped bordered hover responsive>
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Type</th>
//                                 <th>Amount</th>
//                                 <th>Description</th>
//                                 <th>Date</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {transactions.length == 0 ? (
//                                 <tr>
//                                     <td colSpan="5" className="text-center">
//                                         No transactions found
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 transactions.map((txn, index) => (
//                                     <tr key={txn.id}>
//                                         <td>{(txn - 1) * (pagination?.per_page || 10) + index + 1}</td>
//                                         <td
//                                             className={
//                                                 txn.type === "credit"
//                                                     ? "text-success"
//                                                     : "text-danger"
//                                             }
//                                         >
//                                             {txn.type}
//                                         </td>
//                                         <td>{txn.amount}</td>
//                                         <td>{txn.description}</td>
//                                         <td>
//                                             {new Date(
//                                                 txn.created_at
//                                             ).toLocaleString()}
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </Table>
//                 )}
//             </div>
//             {renderPagination()}
// </div>
//             <Footer />
//         </main>
//     );
// }


import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Header_Login from "../components/common/header/Header_Login";
import Footer from "../components/common/footer/Footer";
import { Table, Spinner, Button } from "react-bootstrap";
import { User_checkout_single_payment, User_wallet_transactions } from "../api/product/Product";
import { STRIPE_CLIENT_ID } from "../config/Config";

// const stripePromise = loadStripe("pk_test_51S8c8FPX44LSQqJubLM9zik1ycbRa02AUF0uC8FR5bWANRhHVAQ1nlW4D8rigYJsp6CLdGQ2G5g6Z2nprRw3hfpQ00bHfjyM74");  // your public key
const stripePromise = loadStripe(STRIPE_CLIENT_ID);  // your public key

export default function PayNowButton() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 30;

    const handleCheckout = async () => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            setLoading(true); 
            const stripe = await stripePromise;

            // Send all required fields to backend
            const payload = {
                amount: amount,
                currency: currency,
                // success_url: `${window.location.origin}/raj-web/polycraft/payment-success`,
                // cancel_url: `${window.location.origin}/raj-web/polycraft/payment-cancel`,
                success_url: `${window.location.origin}/payment-success`,
                cancel_url: `${window.location.origin}/payment-cancel`,
            };

            const res = await User_checkout_single_payment(payload);

            if (!res?.data?.sessionId) {
                setLoading(false);
                alert("Unable to create Stripe session");
                return;
            }

            const sessionId = res.data.sessionId;

            // Redirect user to checkout.stripe.com
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                alert(result.error.message);
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.error(error);
            alert("Checkout failed");
        }
    };



    // Fetch history
    const fetchTransactions = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await User_wallet_transactions(pageNumber, perPage);
            if (res?.data?.status) {
                setTransactions(res.data.data);
                setPagination(res.data.pagination);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);

    return (
        <main>
            <Header_Login />

            <div className="content-outer">

                <div className="payment-container">
                    <h2 className="payment-title">Stripe Payment</h2>

                    <div className="payment-form">

                        <div className="input-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label>Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="input-field"
                            >
                                <option value="USD">USD</option>
                                {/* <option value="INR">INR</option>
                                <option value="EUR">EUR</option> */}
                            </select>
                        </div>

                        <Button variant="primary" disabled={loading}  onClick={handleCheckout}>
                            Pay Now
                        </Button>

                    </div>
                </div>

                {/* Transaction history */}
                <div className="transaction-history mt-4 container">
                    <h3>Transaction History</h3>

                    {loading ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                            <p>Loading transactions...</p>
                        </div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((txn, i) => (
                                        <tr key={txn.id}>
                                            <td>{i + 1}</td>
                                            <td className={txn.type === "credit" ? "text-success" : "text-danger"}>
                                                {txn.type}
                                            </td>
                                            <td>{txn.amount}</td>
                                            <td>{txn.description}</td>
                                            <td>{new Date(txn.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>

                {/* Pagination */}
                {pagination && (
                    <div className="d-flex justify-content-center my-3">
                        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                            Previous
                        </Button>
                        <span className="mx-3">Page {page}</span>
                        <Button disabled={page === pagination.last_page} onClick={() => setPage(page + 1)}>
                            Next
                        </Button>
                    </div>
                )}

            </div>

            <Footer />
        </main>
    );
}
