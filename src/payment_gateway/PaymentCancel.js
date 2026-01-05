import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>❌</span>
        </div>

        <h1 style={styles.title}>Payment Cancelled</h1>
        <p style={styles.subtitle}>
          Your payment was not completed.  
          If this was a mistake, you can try again anytime.
        </p>

        <div style={styles.buttons}>
          <Link to="/" style={styles.homeBtn}>Go to Home</Link>

          <Link to="/purchase" style={styles.retryBtn}>
            Try Again
          </Link>
        </div>

        <p style={styles.smallText}>
          If the issue keeps happening, please contact support.
        </p>
      </div>
    </div>
  );
};

// -------- Inline Styles (Clean + Responsive) ----------
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "20px",
    background: "#f5f7fa",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "450px",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#ffe3e3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: "40px",
    color: "#d63636",
  },
  title: {
    fontSize: "26px",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px",
    lineHeight: "1.5",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  retryBtn: {
    background: "#0066ff",
    color: "white",
    padding: "10px 22px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },
  homeBtn: {
    background: "#eee",
    color: "#333",
    padding: "10px 22px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },
  smallText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#999",
  },
};

export default PaymentCancel;
