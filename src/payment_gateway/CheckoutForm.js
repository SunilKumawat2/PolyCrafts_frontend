import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { User_Get_Profile } from "../api/profile/Profile";
import { Button } from "react-bootstrap";
import { useWallet } from "../context/WalletContext";  // 👈 add this
import { User_Payment_order } from "../api/product/Product";

export default function CheckoutForm({ amount, currency, onClose, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { setWalletBalance } = useWallet(); // 👈 use context

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
      const res = await User_Payment_order({
        amount,
        currency,
        payment_method_id: paymentMethod.id,
      });

      if (res.data?.status) {
        alert("Payment successful!");
        window.location.reload()
        // ✅ Fetch new profile balance and update context
        const profileRes = await User_Get_Profile();
        setWalletBalance(profileRes?.data?.user?.wallet_balance || 0);

        // ✅ Trigger parent update (transactions refresh)
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        alert("Payment failed. " + (res.data?.message || ""));
      }
    } catch (err) {
      alert("Error: " + (err?.data?.message || err.message));
    }

    setProcessing(false);
    onClose();
  };

  return (
    <>
      <div className="checkout-modal">
        <h2>Complete Payment</h2>
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
              {processing ? "Processing…" : "Confirm Payment"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
