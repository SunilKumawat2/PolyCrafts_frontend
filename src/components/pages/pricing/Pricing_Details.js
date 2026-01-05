import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header_Login from "../../common/header/Header_Login";
import Footer from "../../common/footer/Footer";
import { Spinner, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Current_User_subscribe, User_Cancel_Subscription_Plan, User_Subscription_CheckOut } from "../../../api/product/Product";
import Pricing_plan_Subscription from "./Pricing_plan_Subscription";
import { CheckCircle, CreditCard, Calendar, Zap } from "lucide-react"; // modern icons
import { Modal } from "react-bootstrap";
import { STRIPE_CLIENT_ID } from "../../../config/Config";

// const stripePromise = loadStripe(
//     "pk_test_51S8c8FPX44LSQqJubLM9zik1ycbRa02AUF0uC8FR5bWANRhHVAQ1nlW4D8rigYJsp6CLdGQ2G5g6Z2nprRw3hfpQ00bHfjyM74"
// );
const stripePromise = loadStripe(STRIPE_CLIENT_ID)
export default function Pricing_Details() {
    const { id: planId } = useParams();
    const location = useLocation();
    const planData = location.state;

    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(planData?.amount || "");
    const [currency, setCurrency] = useState("USD");
    const [planName, setPlanName] = useState(planData?.plan_name || "");
    const [interval, setInterval] = useState(planData?.interval || "");
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const navigate = useNavigate();

    // ✅ Fetch current subscription
    const fetchCurrentSubscription = async () => {
        setLoading(true);
        try {
            const res = await Current_User_subscribe();
            if (res?.data?.status) {
                setSubscriptionData(res.data);
            } else {
                setSubscriptionData(null);
            }
        } catch (error) {
            console.error("Error fetching current subscription:", error);
            setSubscriptionData(null);
        }
        setLoading(false);
    };

    // 🟥 Cancel plan function
    const handleCancelPlan = async () => {
        if (!subscription?.id) {
            alert("No active subscription found.");
            return;
        }

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel your current subscription?"
        );
        if (!confirmCancel) return;

        try {
            setCancelLoading(true);

            const formData = new FormData();
            formData.append("subscription_id", subscription.id);
            // 👆 If your API expects `stripe_id`, replace with:
            // formData.append("stripe_id", subscription.stripe_id);

            const res = await User_Cancel_Subscription_Plan(formData);

            if (res?.data?.status) {
                alert("Your subscription has been cancelled successfully!");
                fetchCurrentSubscription(); // ✅ refresh data after cancel
            } else {
                alert(res?.data?.message || "Failed to cancel plan.");
            }
        } catch (error) {
            console.error("Cancel error:", error);
            alert(
                error?.data?.message || "Something went wrong while cancelling plan."
            );
        } finally {
            setCancelLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentSubscription();
    }, []);

    // const handleOpen = () => {
    //     if (!amount || isNaN(amount) || amount <= 0) {
    //         alert("Please enter a valid amount");
    //         return;
    //     }
    //     setOpen(true);
    // };

    const handleCheckout = async () => {
        try {
            setLoading(true); 
            const stripe = await stripePromise;

            // Send all required fields to backend
            const payload = {
                plan_id: planId, 
                success_url: `${window.location.origin}/payment-success`,
                cancel_url: `${window.location.origin}/pricing-payment-cancel`,
            };

            const res = await User_Subscription_CheckOut(payload);

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

    const currentPlan = subscriptionData?.plan;
    const subscription = subscriptionData?.subscription;

    // 🟥 When user clicks the Cancel button
    const handleCancelClick = () => {
        if (!subscription?.id) {
            alert("No active subscription found.");
            return;
        }
        setShowConfirmModal(true);
    };

    // ✅ Confirm cancellation
    const handleConfirmCancel = async () => {
        try {
            setCancelLoading(true);

            const formData = new FormData();
            formData.append("subscription_id", subscription.id);

            const res = await User_Cancel_Subscription_Plan(formData);

            if (res?.data?.status) {
                // close confirm popup, show success popup
                setShowConfirmModal(false);
                setShowSuccessModal(true);

                fetchCurrentSubscription(); // refresh data
            } else {
                alert(res?.data?.message || "Failed to cancel plan.");
            }
        } catch (error) {
            console.error("Cancel error:", error);
            alert(error?.data?.message || "Something went wrong while cancelling plan.");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleUpgradePlan = () => {
        setShowUpgradeModal(true);
    };

    return (
        <main>
            <Header_Login />
            <div className="content-outer">
                <div className="payment-container">
                    <h2 className="payment-title">Stripe Payment</h2>

                    {/* 🟢 Selected Plan Details */}
                    <div className="payment-form">
                        <div className="input-group">
                            <label>Plan Name</label>
                            <input type="text" value={planName} readOnly className="input-field" />
                        </div>

                        <div className="input-group">
                            <label>Plan Duration</label>
                            <input
                                type="text"
                                value={interval === "year" ? "Yearly Plan" : "Monthly Plan"}
                                readOnly
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label>Amount</label>
                            <input type="number" value={amount} readOnly className="input-field" />
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

                        {/* <Button variant="primary" onClick={handleOpen}>
                            Subscribe Now
                        </Button> */}

                        <Button variant="primary" disabled={loading}  onClick={handleCheckout}>
                        Subscribe Now
                        </Button>
                    </div>

                    {/* 💳 Checkout Modal */}
                    {open && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <Elements stripe={stripePromise}>
                                    <Pricing_plan_Subscription
                                        amount={amount}
                                        currency={currency}
                                        planId={planId}
                                        onClose={() => setOpen(false)}
                                        onPaymentSuccess={fetchCurrentSubscription}
                                    />
                                </Elements>
                            </div>
                        </div>
                    )}
                </div>

                {/* 🟦 Current Subscription Section */}
                <div className="current-subscription mt-5 container">
                    <h3>Current Subscription Plan</h3>

                    {loading ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                            <p>Loading current subscription...</p>
                        </div>
                    ) : currentPlan && subscription ? (
                        <Card className="shadow-lg border-0 p-4 mt-3">
                            {/* 🟢 Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="text-capitalize fw-bold mb-1">
                                        {currentPlan.plan_name} Plan
                                    </h4>
                                    <small className="text-muted">
                                        {subscription.stripe_status === "active" ? (
                                            <span className="text-success">
                                                <CheckCircle size={16} /> Active
                                            </span>
                                        ) : (
                                            <span className="text-danger">Inactive</span>
                                        )}
                                    </small>
                                </div>
                                <div className="text-end">
                                    {/* {
                                        subscription.stripe_status == "active" && (
                                            <Button
                                                type="button"
                                                variant="primary"
                                                disabled={cancelLoading}
                                                onClick={handleCancelClick}
                                            >
                                                {cancelLoading ? "Cancelling..." : "Cancel Plan"}
                                            </Button>
                                        )
                                    } */}

                                    <h3 className="fw-bold mb-0">
                                        ${parseFloat(currentPlan.amount).toFixed(2)}
                                    </h3>
                                    <span className="text-muted text-capitalize">
                                        / {currentPlan.interval}
                                    </span>
                                </div>
                            </div>

                            <hr />

                            {/* 🧾 Plan Details */}
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <p className="mb-1 text-muted">
                                        <Zap size={16} className="me-2 text-warning" />
                                        Total Credits
                                    </p>
                                    <h6>{currentPlan.total_credits}</h6>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <p className="mb-1 text-muted">
                                        <CreditCard size={16} className="me-2 text-primary" />
                                        Stripe Plan ID
                                    </p>
                                    <h6 className="text-truncate">{currentPlan.price_id}</h6>
                                </div>
                                <div className="col-md-3">
                                    <p className="mb-1 text-muted">Plan Credits</p>
                                    <h6>{currentPlan.credits}</h6>
                                </div>
                                <div className="col-md-3">
                                    <p className="mb-1 text-muted">Bonus Credits</p>
                                    <h6 className="text-success">{currentPlan.bonus_credits}</h6>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <p className="mb-1 text-muted">
                                        <Calendar size={16} className="me-2 text-secondary" />
                                        Plan Created on
                                    </p>
                                    <h6>{new Date(subscription?.created_at).toLocaleDateString()}</h6>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <p className="mb-1 text-muted">
                                        <Calendar size={16} className="me-2 text-secondary" />
                                        Plan Ends On
                                    </p>
                                    <h6>{new Date(subscription?.ends_at).toLocaleDateString()}</h6>
                                </div>
                            </div>

                            <hr />

                            {/* 💳 Subscription Details */}
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <p className="mb-1 text-muted">Subscription ID</p>
                                    <h6 className="text-truncate">{subscription.id}</h6>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <p className="mb-1 text-muted">Stripe Subscription ID</p>
                                    <h6 className="text-truncate">{subscription.stripe_id}</h6>
                                </div>
                                <div className="col-md-3">
                                    <p className="mb-1 text-muted">Subscription Status</p>
                                    <h6
                                        className={
                                            subscription.stripe_status === "active"
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        {subscription.stripe_status}
                                    </h6>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <p className="mb-1 text-muted">Stripe Price</p>
                                    <h6>{subscription.stripe_price}</h6>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <p className="mb-1 text-muted">Quantity</p>
                                    <h6>{subscription.quantity}</h6>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            disabled={cancelLoading}
                                            onClick={handleUpgradePlan}
                                            className="m-1"
                                        >
                                            Upgrade Plan
                                        </Button>
                                        {
                                            subscriptionData?.on_grace_period != true && (
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    disabled={cancelLoading}
                                                    onClick={handleCancelClick}
                                                    className="m-1"
                                                >
                                                    {cancelLoading ? "Cancelling..." : "Cancel Plan"}
                                                </Button>
                                            )
                                        }

                                    </span>
                                </div>
                            </div>
                            <hr />

                           
                        </Card>
                    ) : (
                        <div className="text-center my-4">
                            <p>No active subscription found.</p>
                        </div>
                    )}
                </div>

                <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Upgrade Plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to upgrade your current plan?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => navigate("/pricing")}>
                        Yes, Upgrade
                    </Button>
                </Modal.Footer>
            </Modal>

                {/* 🧩 Confirm Cancel Modal */}
                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Cancel Subscription</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Cancelling Subscription for ID 0001.Are you sure you want to proceed?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                            No, Keep Plan
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirmCancel}
                            disabled={cancelLoading}
                        >
                            {cancelLoading ? "Cancelling..." : "Yes, Cancel Plan"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* 🟩 Success Modal */}
                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Subscription Cancelled</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <h5>🎉 You have successfully cancelled your subscription plan.</h5>
                        <p className="text-muted">You can subscribe anytime you want.</p>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Footer />
        </main>
    );
}
