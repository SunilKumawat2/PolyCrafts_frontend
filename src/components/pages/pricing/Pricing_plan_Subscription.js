import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import { useWallet } from "../../../context/WalletContext";
import { User_Get_Profile } from "../../../api/profile/Profile";
import { User_subscribe } from "../../../api/product/Product";

export default function Pricing_plan_Subscription({
  amount,
  currency,
  planId,
  onClose,
  onPaymentSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { setWalletBalance } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      alert(error.message);
      setProcessing(false);
      return;
    }

    try {
      // ✅ Call subscription API with plan_id + payment_method_id
      const subscribeRes = await User_subscribe({
        plan_id: planId,
        payment_method_id: paymentMethod.id,
      });

      if (subscribeRes.data?.status) {
        alert("Subscription successful!");
       window.location.reload()
        // ✅ Optional: Update wallet balance
        try {
          const profileRes = await User_Get_Profile();
          setWalletBalance(profileRes?.data?.user?.wallet_balance || 0);
        } catch (err) {
          console.warn("Failed to update wallet:", err);
        }

        // ✅ Trigger parent update
        if (onPaymentSuccess) onPaymentSuccess();

        onClose();
      } else {
        alert("Subscription failed. " + (subscribeRes.data?.message || ""));
      }
    } catch (err) {
      console.error("Subscription Error:", err);
      alert("Error: " + (err?.data?.message || err.message));
    }

    setProcessing(false);
  };

  return (
    <div className="checkout-modal">
      <h2>Subscribe Now</h2>
      <p>
        <strong>Amount:</strong> {amount} {currency}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="card-element-box">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        <div className="checkout-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <Button type="submit" variant="primary" disabled={!stripe || processing}>
            {processing ? "Processing…" : "Confirm Subscription"}
          </Button>
        </div>
      </form>
    </div>
  );
}


// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import axios from "axios";

// export default function Pricing_plan_Subscription({ amount, currency, planId, interval }) {
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.post("/api/create-checkout-session", {
//         planId,
//         amount,
//         currency,
//         interval,
//       });

//       // ✅ Redirect to Stripe-hosted checkout
//       window.location.href = data.url;
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.error || "Payment setup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="checkout-container text-center">
//       <h3>Secure Checkout</h3>
//       <p><strong>Plan:</strong> {interval === "year" ? "Yearly" : "Monthly"} Plan</p>
//       <p><strong>Amount:</strong> {amount} {currency}</p>

//       <Button
//         variant="primary"
//         onClick={handleCheckout}
//         disabled={loading}
//         style={{ minWidth: "200px" }}
//       >
//         {loading ? "Redirecting…" : "Pay with Stripe"}
//       </Button>
//     </div>
//   );
// }
