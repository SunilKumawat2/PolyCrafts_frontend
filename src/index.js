import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/css/custom.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

// ✅ your Google Client ID (safe to expose on frontend)
const GOOGLE_CLIENT_ID =
  "287282810461-humsi6ir11ji5o1bf6eva6208dti99sg.apps.googleusercontent.com";

const base = process.env.REACT_APP_BASE_URL
  ? `/${process.env.REACT_APP_BASE_URL}`
  : "/";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>

  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
  </HelmetProvider>
);
