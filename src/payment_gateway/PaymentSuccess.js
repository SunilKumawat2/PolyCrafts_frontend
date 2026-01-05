import React, { useEffect, useState } from "react";
import axios from "axios";
import { User_checkout_session_details } from "../api/product/Product";

const PaymentSuccess = () => {
  const [session, setSession] = useState(null);
  const [session_receipt_url, setSession_Receipt_Url] = useState(null);
  console.log("s,djfsdf", session)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");

    if (!sessionId) {
      setError("Session ID missing from URL");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await User_checkout_session_details(sessionId);
        setSession(res.data?.session); // if your backend sends {data:{...}}
        setSession_Receipt_Url(res.data)
      } catch (err) {
        console.error(err);
        setError("Failed to load payment details");
      }

      setLoading(false);
    };

    fetchSession();
  }, []);


  if (loading)
    return <h2 style={{ textAlign: "center", marginTop: 100 }}>Loading payment details...</h2>;

  if (error)
    return <h2 style={{ textAlign: "center", marginTop: 100, color: "red" }}>{error}</h2>;

  return (
    <div style={{ maxWidth: 650, margin: "50px auto", textAlign: "center" }}>
      <h2 style={{ color: "green" }}>✅ Payment Successful!</h2>
      <p>
        Thank you for your purchase, <b>{session?.customer_details?.name}</b>!
      </p>

      <hr />

      <h3>🧾 Order Summary</h3>
      <p>
        <b>Payment Status:</b> {session?.payment_status}
      </p>
      <p>
        <b>Email:</b> {session?.customer_details?.email}
      </p>
      <p>
        <b>Amount Paid:</b>{" "}
        {(session?.amount_total / 100).toFixed(2)} {session?.currency?.toUpperCase()}
      </p>

      <hr />

      <h3>📍 Billing Address</h3>
      <p>
        {session?.customer_details?.address?.line1}<br />
        {session?.customer_details?.address?.city},{" "}
        {session?.customer_details?.address?.state},{" "}
        {session?.customer_details?.address?.postal_code}<br />
        {session?.customer_details?.address?.country}
      </p>


      <hr />

      {session_receipt_url?.receipt_url ? (
        <a
          href={session_receipt_url.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#635BFF",
            color: "white",
            textDecoration: "none",
            padding: "12px 25px",
            borderRadius: 6,
            display: "inline-block",
            marginTop: 20,
          }}
        >
          📄 View Receipt
        </a>
      ) : (
        <p>No receipt available</p>
      )}
      <a
        // href="/raj-web/polycraft"
          href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#635BFF",
          color: "white",
          textDecoration: "none",
          padding: "12px 25px",
          borderRadius: 6,
          display: "inline-block",
          marginTop: 20,
          marginLeft:10
        }}
      >
        📄 Back Home
      </a>
    </div>
  );
};

export default PaymentSuccess;
