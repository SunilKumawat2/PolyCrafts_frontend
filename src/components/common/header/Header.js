import React, { useState } from "react";
import Logo from "../../../assets/images/LOGO.svg";
import LoginImg from "../../../assets/images/login-img.png";
import GoogleImg from "../../../assets/images/icon-google.png";
import HeroVideo from "../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap";
import {
  User_Google_Login,
  User_Login,
  User_Otp_verify,
  User_Register,
  User_reset_password,
  User_send_Otp_forgot_password,
  User_send_Otp_verify,
} from "../../../api/auth/Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLoginModal } from "../../../context/LoginModalContext";

const Header = () => {
  const navigate = useNavigate();
  const get_send_otp_email_id = localStorage.getItem("send_otp_email_id");
  // const [Loginshow, setLoginShow] = useState(false);
  const { Loginshow, setLoginShow } = useLoginModal();
  console.log("sdmkfhskdjf", Loginshow)

  const [Send_Otp_show, setSend_Otp_Show] = useState(false);
  const [Otp_Verify_show, setOtp_Verify_show] = useState(false);
  const [Signupshow, setSignupShow] = useState(false);
  const [Forgotshow, setForgotShow] = useState(false);
  const [ForgotPasswordshow, setForgotPasswordShow] = useState(false);
  const [regsiter_error, set_Register_Error] = useState({});
  const [regsiterformData, setRegisterFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    acceptTerms: false,
  });
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [send_otp_FormData, set_send_otp_FormData] = useState({
    email: "",
  });

  const [send_otp_forgot_FormData, set_send_otp_forgot_FormData] = useState({
    email: "",
  });

  const [
    send_otp_forgot_password_FormData,
    set_send_otp_forgot_password_FormData,
  ] = useState({
    code: "", // <-- backend expects "code"
    password: "",
    password_confirmation: "",
  });

  const [loginErrors, setLoginErrors] = useState({});
  const [ForgotPasswordErrors, setForgotPasswordErrors] = useState({});
  const [send_otp_Errors, set_Send_otp_Errors] = useState({});
  const [send_otp_forgot_Errors, set_Send_otp_Forgot_Errors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [show_register_Password, set_Show_register_password] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] =
    useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const handleLoginClose = () => setLoginShow(false);
  const handleSendOtpClose = () => setOtp_Verify_show(false);
  const handle_Otp_Verify_Close = () => setOtp_Verify_show(false);
  const handleSignupClose = () => setSignupShow(false);

  const handleForgotClose = () => setForgotShow(false);
  const handleForgotPasswordClose = () => setForgotPasswordShow(false);

  const handleLoginShow = () => {
    setSignupShow(false);
    setLoginShow(true);
    setForgotShow(false);
  };

  const handleSignupShow = () => {
    setLoginShow(false);
    setSignupShow(true);
  };

  const handleForgotShow = () => {
    setLoginShow(false);
    setSignupShow(false);
    setForgotShow(true);
  };

  // <------------ toggle for the login form ---------->
  const toggleLoginPassword = () => {
    setShowLoginPassword((prev) => !prev);
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword((prev) => !prev);
  };

  const toggleForgotConfirmPassword = () => {
    setShowForgotConfirmPassword((prev) => !prev);
  };

  // <---------- change the login form ------->
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // <---------- change the login form ------->
  const handlesend_otp_Change = (e) => {
    const { name, value, type, checked } = e.target;
    set_send_otp_FormData({
      ...send_otp_FormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // <---------- change the login form ------->
  const handlesend_otp_forgot_Change = (e) => {
    const { name, value, type, checked } = e.target;
    set_send_otp_forgot_FormData({
      ...send_otp_forgot_FormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // <---------- change the login form ------->
  const handlesend_otp_forgot_password_Change = (e) => {
    const { name, value, type, checked } = e.target;
    set_send_otp_forgot_password_FormData({
      ...send_otp_forgot_password_FormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // <---------- Login Form Validation ------------->
  const validateLoginForm = () => {
    let errors = {};
    if (!loginFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginFormData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!loginFormData.password.trim()) {
      errors.password = "Password is required";
    } else if (loginFormData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // <---------- Login Form Submit ---------->
  // const handleLoginSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateLoginForm()) return;
  //   try {
  //     const payload = {
  //       email: loginFormData.email,
  //       password: loginFormData.password,
  //       remember: loginFormData.remember,
  //     };
  //     const response = await User_Login(payload);
  //     if (response?.data?.status === true) {
  //       alert("Login successful!");
  //       localStorage.setItem("polycarft_user_token", response?.data?.token);
  //       setLoginShow(false);
  //       setLoginFormData({
  //         email: "",
  //         password: "",
  //         remember: false,
  //       });
  //       setLoginErrors({});
  //       const redirectPath = localStorage.getItem("redirect_after_login");
  //       if (redirectPath) {
  //         localStorage.removeItem("redirect_after_login");
  //         navigate(redirectPath);
  //       } else {
  //         window.location.reload();
  //         navigate(`/`);
  //       }
  //     } else {
  //       let apiErrors = {};
  //       if (response?.data?.errors) {
  //         for (const field in response.data.errors) {
  //           apiErrors[field] = response.data.errors[field][0];
  //         }
  //       }
  //       if (response?.data?.message && Object.keys(apiErrors).length === 0) {
  //         apiErrors.general = response.data.message;
  //       }
  //       setLoginErrors(apiErrors);
  //     }
  //   } catch (error) {
  //     if (error?.status === 422) {
  //       const apiErrors = {};
  //       if (error?.data?.errors) {
  //         for (const field in error.data.errors) {
  //           const errorMsg = error.data.errors[field][0];
  //           if (errorMsg === "The provided email is not verified") {
  //             apiErrors[field] = (
  //               <>
  //                 {errorMsg}{" "}
  //                 <span
  //                   onClick={() => {
  //                     setSend_Otp_Show(true);
  //                     setLoginShow(false);
  //                   }}
  //                   style={{
  //                     color: "blue",
  //                     textDecoration: "underline",
  //                     cursor: "pointer",
  //                   }}
  //                 >
  //                   Verify Now
  //                 </span>
  //               </>
  //             );
  //           } else {
  //             apiErrors[field] = errorMsg;
  //           }
  //         }
  //       }
  //       if (error?.data?.message && Object.keys(apiErrors).length === 0) {
  //         apiErrors.general = error.data.message;
  //       }
  //       setLoginErrors(apiErrors);
  //     } else {
  //       setLoginErrors({
  //         general: "Something went wrong. Please try again later.",
  //       });
  //     }
  //   }
  // };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    try {
      const payload = {
        email: loginFormData.email,
        password: loginFormData.password,
        remember: loginFormData.remember,
      };

      const response = await User_Login(payload);

      if (response?.data?.status === true) {
        alert("Login successful!");
        localStorage.setItem("polycarft_user_token", response?.data?.token);
        setLoginShow(false);

        // Reset form state
        setLoginFormData({
          email: "",
          password: "",
          remember: false,
        });
        setLoginErrors({});

        // Check if we have a redirect path (e.g., from Buy Credit)
        const redirectPath = localStorage.getItem("redirect_after_login");

        if (redirectPath) {
          localStorage.removeItem("redirect_after_login");
          navigate(redirectPath); // 🚀 Go to /purchase if set
        } else {
          window.location.reload();
          navigate(`/`);
        }
      } else {
        // Handle API validation errors
        let apiErrors = {};
        if (response?.data?.errors) {
          for (const field in response.data.errors) {
            apiErrors[field] = response.data.errors[field][0];
          }
        }

        if (response?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = response.data.message;
        }

        setLoginErrors(apiErrors);
      }
    } catch (error) {
      if (error?.status === 422) {
        const apiErrors = {};

        if (error?.data?.errors) {
          for (const field in error.data.errors) {
            const errorMsg = error.data.errors[field][0];
            if (errorMsg === "The provided email is not verified") {
              apiErrors[field] = (
                <>
                  {errorMsg}{" "}
                  <span
                    onClick={() => {
                      setSend_Otp_Show(true);
                      setLoginShow(false);
                    }}
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Verify Now
                  </span>
                </>
              );
            } else {
              apiErrors[field] = errorMsg;
            }
          }
        }

        if (error?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = error.data.message;
        }

        setLoginErrors(apiErrors);
      } else {
        setLoginErrors({
          general: "Something went wrong. Please try again later.",
        });
      }
    }
  };


  // <---------- handle send otp Form Submit ---------->
  const handle_send_otp_submit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    try {
      const payload = {
        email: send_otp_FormData.email,
      };
      const response = await User_send_Otp_verify(payload);
      if (response?.data?.status == true) {
        alert("sent otp successfully !");
        setSend_Otp_Show(false);
        setOtp_Verify_show(true);
        localStorage.setItem("send_otp_email_id", loginFormData.email);
        set_send_otp_FormData({
          email: "",
        });
        set_Send_otp_Errors({});
      } else {
        let apiErrors = {};
        if (response?.data?.errors) {
          for (const field in response.data.errors) {
            apiErrors[field] = response.data.errors[field][0];
          }
        }
        if (response?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = response.data.message;
        }
        set_Send_otp_Errors(apiErrors);
      }
    } catch (error) {
      if (error?.status === 422) {
        const apiErrors = {};
        if (error?.data?.errors) {
          for (const field in error.data.errors) {
            const errorMsg = error.data.errors[field][0];
            if (errorMsg === "The provided email is not verified") {
              apiErrors[field] = (
                <>
                  {errorMsg}{" "}
                  <span
                    onClick={() => {
                      setSend_Otp_Show(true);
                      setLoginShow(false);
                    }}
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Verify Now
                  </span>
                </>
              );
            } else {
              apiErrors[field] = errorMsg;
            }
          }
        }
        // ✅ General message fallback
        if (error?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = error.data.message;
        }
        setLoginErrors(apiErrors);
      } else {
        // For other errors (500, network, etc.)
        setLoginErrors({
          general: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  // <---------- send otp forgot submit ---------->
  const handle_send_otp_forgot_submit = async (e) => {
    e.preventDefault();

    // if (!validateLoginForm()) return;

    try {
      const payload = {
        email: send_otp_forgot_FormData.email,
      };

      const response = await User_send_Otp_forgot_password(payload);
      if (response?.data?.status == true) {
        alert(" OTP sent successfully.");
        localStorage.setItem("Forgot_password_otp_code", response?.data?.code);
        localStorage.setItem(
          "send_otp_email_id",
          send_otp_forgot_FormData.email
        );
        setSend_Otp_Show(false);
        setForgotShow(false);
        setForgotPasswordShow(true);
        set_send_otp_forgot_FormData({
          email: "",
        });
        set_send_otp_forgot_FormData({});
      } else {
        let apiErrors = {};
        if (response?.data?.errors) {
          for (const field in response.data.errors) {
            apiErrors[field] = response.data.errors[field][0]; // take first error message
          }
        }
        if (response?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = response.data.message;
        }

        send_otp_forgot_Errors(apiErrors);
      }
    } catch (error) {
      if (error?.status === 422) {
        const apiErrors = {};

        if (error?.data?.errors) {
          for (const field in error.data.errors) {
            const errorMsg = error.data.errors[field][0];

            // ✅ Special case: email not verified
            if (errorMsg === "The provided email is not verified") {
              apiErrors[field] = (
                <>
                  {errorMsg}{" "}
                  <span
                    onClick={() => {
                      setSend_Otp_Show(true);
                      setLoginShow(false);
                    }}
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Verify Now
                  </span>
                </>
              );
            } else {
              apiErrors[field] = errorMsg;
            }
          }
        }

        // ✅ General message fallback
        if (error?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = error.data.message;
        }

        setLoginErrors(apiErrors);
      } else {
        // For other errors (500, network, etc.)
        setLoginErrors({
          general: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  // <---------- forgot password Form Submit ---------->
  const handle_forgot_password_submit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append(
        "email",
        send_otp_forgot_FormData.email || get_send_otp_email_id
      );
      formData.append("code", send_otp_forgot_password_FormData.code); // <-- fixed
      formData.append("password", send_otp_forgot_password_FormData.password);
      formData.append(
        "password_confirmation",
        send_otp_forgot_password_FormData.password_confirmation
      );

      const response = await User_reset_password(formData);

      if (response?.data?.status === true) {
        alert("Password reset successfully!");
        setForgotPasswordShow(false);

        // reset form + errors
        set_send_otp_forgot_password_FormData({
          code: "",
          password: "",
          password_confirmation: "",
        });
        setForgotPasswordErrors({});
      } else {
        let apiErrors = {};
        if (response?.data?.errors) {
          for (const field in response.data.errors) {
            apiErrors[field] = response.data.errors[field];
          }
        }

        if (response?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = [response.data.message];
        }

        setForgotPasswordErrors(apiErrors);
      }
    } catch (error) {
      if (error?.status === 422 && error?.data?.errors) {
        const apiErrors = {};
        for (const field in error.data.errors) {
          apiErrors[field] = error.data.errors[field];
        }
        if (error?.data?.message && Object.keys(apiErrors).length === 0) {
          apiErrors.general = [error.data.message];
        }
        setForgotPasswordErrors(apiErrors);
      } else {
        setForgotPasswordErrors({
          general: ["Something went wrong. Please try again later."],
        });
      }
    }
  };

  // <--------- toggle register form ---------->
  const toggle_Register_Password = () => {
    set_Show_register_password((prev) => !prev);
  };

  // <------------- register form input changes ------------>
  const RegisterhandleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setRegisterFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // 🟢 Clear specific field error immediately when user fixes it
    set_Register_Error((prev) => {
      const newErrors = { ...prev };

      if (name === "name" && fieldValue.trim().length >= 3) {
        delete newErrors.name;
      }

      if (name === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
        delete newErrors.email;
      }

      if (name === "password" && fieldValue.length >= 6) {
        delete newErrors.password;
      }

      if (name === "acceptTerms" && checked) {
        delete newErrors.acceptTerms;
      }

      return newErrors;
    });
  };

  // <---------- Registration Form Validation ------------->
  const Register_Validation_Form = () => {
    let newErrors = {};

    if (!regsiterformData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (regsiterformData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    if (!regsiterformData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regsiterformData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!regsiterformData.password) {
      newErrors.password = "Password is required";
    } else if (regsiterformData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!regsiterformData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms of Service";
    }

    set_Register_Error(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // <----------- Submit the Register form ---------->
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!Register_Validation_Form()) {
      return;
    }

    const payload = {
      name: regsiterformData.name,
      email: regsiterformData.email,
      company: regsiterformData.company,
      phone_number: regsiterformData.phone_number,
      password: regsiterformData.password,
      password_confirmation: regsiterformData.password,
    };

    try {
      const response = await User_Register(payload);

      if (response?.data?.status === true) {
        setSignupShow(false);
        setOtp_Verify_show(true);
        setRegisteredEmail(payload.email);

        // reset form
        setRegisterFormData({
          name: "",
          email: "",
          company: "",
          phone_number: "",
          password: "",
          password_confirmation: "",
          acceptTerms: false,
        });
        set_Register_Error({});
      }
    } catch (error) {
      console.error("Registration failed:", error);

      if (error && error.status === 422) {
        let apiErrors = {};
        if (error.data.errors) {
          for (const field in error.data.errors) {
            apiErrors[field] = error.data.errors[field][0];
          }
        }
        set_Register_Error(apiErrors);
      }
    }
  };

  // <------- handle otp change ------------>
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto focus next input
    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // <---------------- OTP verify Submit Handler --------------->
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      setOtpError("Please enter the complete 4-digit code.");
      return;
    }

    const finalOtp = otp.join("");

    try {
      const response = await User_Otp_verify({
        email: registeredEmail || get_send_otp_email_id,
        code: finalOtp,
      });

      if (response?.data?.status === true) {
        alert("OTP verified successfully!");
        setOtpError("");
        setOtp(["", "", "", ""]);
        setOtp_Verify_show(false);
        setLoginShow(true);
      } else {
        setOtpError(
          response?.data?.message || "Invalid OTP, please try again."
        );
      }
    } catch (error) {
      console.error("OTP Verification failed:", error.data);

      // ✅ Proper error handling for Axios
      if (error) {
        const serverMessage = error?.data?.message;
        setOtpError(serverMessage || "Invalid OTP, please try again.");
      } else {
        setOtpError("Something went wrong. Please try again.");
      }
    }
  };

  const Google_login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // response contains access_token
        const accessToken = response.access_token;

        // get user info from Google
        const { data: userInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const formData = new FormData();
        formData.append("token", accessToken);

        const result = await User_Google_Login(formData);
        console.log("Login success:", result.data);
        localStorage.setItem("polycarft_user_token", result.data.token);

        const redirectPath = localStorage.getItem("redirect_after_login");
        if (redirectPath) {
          localStorage.removeItem("redirect_after_login");
          navigate(redirectPath);
        } else {
          window.location.reload();
          navigate(`/`);
        }
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
    },
  });

  return (
    <>
      <header className="main-header px-85">
        <Navbar expand="lg" className="header-inner p-0">
          <Container fluid>
            <div className="logo-toggler">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Link to="/" className="nav-logo">
                <img src={Logo} alt="Logo" className="main-logo" />
              </Link>
            </div>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="navbar-links">
                <Nav.Link
                  as={NavLink}
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  About Us
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/pricing"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  Pricing
                </Nav.Link>

                {/* <Nav.Link
                  as={NavLink}
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  Services
                </Nav.Link> */}

                <Nav.Link
                  as={NavLink}
                  to="/faq"
                  className={({ isActive }) =>
                    isActive ? "active nav-link" : "nav-link"
                  }
                >
                  FAQ's
                </Nav.Link>

              </Nav>
            </Navbar.Collapse>
            <Button
              className="login-btn"
              variant="primary"
              onClick={handleLoginShow}
            >
              Sign Up / Sign In
            </Button>
          </Container>
        </Navbar>
      </header>
      {/* <----- login modal ------------> */}
      <Modal
        className="login-modal"
        show={Loginshow}
        onHide={handleLoginClose}
        centered
      >
        <Modal.Body>
          <div className="login-modal-outer">
            <div className="login-modal-body">
              <div className="modal-head text-center">
                <img src={Logo} alt="Logo" className="main-logo" />
                <p>Please enter your details.</p>
              </div>
              <div className="login-form-outer">
                <form onSubmit={handleLoginSubmit}>
                  <div className="row">
                    {/* Email */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="text"
                          className={`form-control ${loginErrors.email ? "is-invalid" : ""
                            }`}
                          name="email"
                          value={loginFormData.email}
                          onChange={handleLoginChange}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>Password</label>
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          className={`form-control ${loginErrors.password ? "is-invalid" : ""
                            }`}
                          name="password"
                          value={loginFormData.password}
                          onChange={handleLoginChange}
                          placeholder="**********"
                        />
                        {/* Toggle Icon */}
                        <span
                          onClick={toggleLoginPassword}
                          style={{
                            position: "absolute",
                            top: "38px",
                            right: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                        {loginErrors.password && (
                          <div className="invalid-feedback d-block">
                            {loginErrors.password}
                          </div>
                        )}
                      </div>
                    </div>
                    {loginErrors.email && (
                      <div className="invalid-feedback d-block">
                        {loginErrors.email}
                      </div>
                    )}
                    {/* Remember Me + Forgot */}
                    <div className="col-remember-div">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="remember"
                          checked={loginFormData.remember}
                          onChange={handleLoginChange}
                          id="remembercheck"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="remembercheck"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="forgot-link-div">
                        <Link onClick={handleForgotShow}>Reset Password</Link>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="form-action">
                      <button type="submit" className="btn btn-primary">
                        Sign in
                      </button>
                      <button
                        type="button"
                        className="sign-google"
                        onClick={() => Google_login()} // <--- trigger Google login popup
                      >
                        <img src={GoogleImg} alt="Google Sign" />
                        <span>Sign in with Google</span>
                      </button>
                    </div>

                    <div className="signup-modal">
                      Don’t have an account?{" "}
                      <Link onClick={handleSignupShow}>Sign up for free!</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="login-body-img">
              <img src={LoginImg} alt="Login Picture" />
              {/* <video autoPlay loop muted>
                <source src={HeroVideo} />
              </video> */}
              <video
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
              >
                <source src={HeroVideo} type="video/mp4" />
              </video>

            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* OTP modal start  */}
      <Modal
        className="reset-modal"
        show={Otp_Verify_show}
        onHide={handle_Otp_Verify_Close}
        centered
      >
        <Modal.Body>
          <div className="login-modal-outer">
            <div className="login-modal-body w-100">
              <div className="modal-head text-center">
                <img src={Logo} alt="Logo" className="main-logo" />
                <h2>Email Verification</h2>
              </div>
              <div className="login-form-outer">
                <form onSubmit={handleOtpSubmit}>
                  <div className="row otp">
                    <div className="otp-desc">
                      <p className="mt-3">
                        We’ve sent you the verification code on
                      </p>
                      <div className="email-box">
                        <p className="email-text">
                          {registeredEmail || get_send_otp_email_id}
                        </p>
                        {/* <Link className='change-btn'>
                          <img src={PencilOtp} alt="PencilOtp" /> Change
                        </Link> */}
                      </div>
                    </div>

                    <div className="col-otp-div">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      ))}
                    </div>

                    {otpError && <p className="text-danger mt-2">{otpError}</p>}

                    <div className="form-action">
                      <button type="submit" className="btn btn-primary mb-0">
                        Verify
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Signup modal start  */}
      <Modal
        className="login-modal"
        show={Signupshow}
        onHide={handleSignupClose}
        centered
      >
        <Modal.Body>
          <div className="login-modal-outer">
            <div className="login-modal-body">
              <div className="modal-head text-center">
                <img src={Logo} alt="Logo" className="main-logo" />
                <h2>Sign Up</h2>
                <p>Please enter your details.</p>
              </div>
              <div className="login-form-outer">
                <form onSubmit={handleRegisterSubmit} noValidate>
                  <div className="row signup">
                    {/* Name */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${regsiter_error.name ? "is-invalid" : ""
                            }`}
                          name="name"
                          value={regsiterformData.name}
                          onChange={RegisterhandleChange}
                          placeholder="Enter your name"
                        />
                        {regsiter_error.name && (
                          <div className="invalid-feedback">
                            {regsiter_error.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${regsiter_error.email ? "is-invalid" : ""
                            }`}
                          name="email"
                          value={regsiterformData.email}
                          onChange={RegisterhandleChange}
                          placeholder="Enter your email"
                        />
                        {regsiter_error.email && (
                          <div className="invalid-feedback">
                            {regsiter_error.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Company <span>(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="company"
                          value={regsiterformData.company}
                          onChange={RegisterhandleChange}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type={show_register_Password ? "text" : "password"}
                          className={`form-control ${regsiter_error.password ? "is-invalid" : ""
                            }`}
                          name="password"
                          value={regsiterformData.password}
                          onChange={RegisterhandleChange}
                          placeholder="**********"
                        />
                        {/* Toggle Icon */}
                        <span
                          onClick={toggle_Register_Password}
                          style={{
                            position: "absolute",
                            top: "38px",
                            right: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {show_register_Password ? <FaEyeSlash /> : <FaEye />}
                        </span>

                        {regsiter_error.password && (
                          <div className="invalid-feedback">
                            {regsiter_error.password}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="col-remember-div justify-content-center">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${regsiter_error.acceptTerms ? "is-invalid" : ""
                            }`}
                          type="checkbox"
                          name="acceptTerms"
                          checked={regsiterformData.acceptTerms}
                          onChange={RegisterhandleChange}
                          id="acceptcheck"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="acceptcheck"
                        >
                          I agree to <Link to="/terms-conditions">Terms of service</Link> | <Link to="/privacy-policy">Privacy policy</Link>
                        </label>
                        {regsiter_error.acceptTerms && (
                          <div className="invalid-feedback d-block">
                            {regsiter_error.acceptTerms}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="form-action">
                      <button type="submit" className="btn btn-primary">
                        Sign up
                      </button>
                      <button type="button" className="sign-google">
                        <img src={GoogleImg} alt="Google Sign" />
                        <span>Sign up with Google</span>
                      </button>
                    </div>

                    <div className="signup-modal">
                      Have an account?{" "}
                      <Link onClick={handleLoginShow}>Sign In now</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="login-body-img">
              <img src={LoginImg} alt="Login Picture" />
              {/* <video autoPlay loop muted>
                <source src={HeroVideo} />
              </video> */}
              <video
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
              >
                <source src={HeroVideo} type="video/mp4" />
              </video>

            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* <---------- send otp for otp verify ---------> */}
      <Modal
        className="login-modal"
        show={Send_Otp_show}
        onHide={handleSendOtpClose}
        centered
      >
        <Modal.Body>
          <div className="login-modal-outer">
            <div className="login-modal-body">
              <div className="modal-head text-center">
                <img src={Logo} alt="Logo" className="main-logo" />
                <p>Please enter your details.</p>
              </div>
              <div className="login-form-outer">
                <form onSubmit={handle_send_otp_submit}>
                  <div className="row">
                    {/* Email */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="text"
                          className={`form-control ${send_otp_Errors.email ? "is-invalid" : ""
                            }`}
                          name="email"
                          value={send_otp_FormData.email}
                          onChange={handlesend_otp_Change}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {send_otp_Errors.email && (
                      <div className="invalid-feedback d-block">
                        {send_otp_Errors.email}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="form-action">
                      <button type="submit" className="btn btn-primary">
                        Send Otp
                      </button>
                    </div>

                    <div className="signup-modal">
                      Don’t have an account?{" "}
                      <Link onClick={handleSignupShow}>Sign up for free!</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="login-body-img">
              <img src={LoginImg} alt="Login Picture" />
              {/* <video autoPlay loop muted>
                <source src={HeroVideo} />
              </video> */}
              <video
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
              >
                <source src={HeroVideo} type="video/mp4" />
              </video>

            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Forgot Password Email modal start  */}
      <Modal
        className="reset-modal"
        show={Forgotshow}
        onHide={handleForgotClose}
        centered
      >
        <Modal.Body>
          <div className="login-modal-outer">
            <div className="login-modal-body w-100">
              <div className="modal-head text-center">
                <img src={Logo} alt="Logo" className="main-logo" />
                <h2>Reset Password</h2>
                <p>Please enter your details.</p>
              </div>
              <div className="login-form-outer">
                <form onSubmit={handle_send_otp_forgot_submit}>
                  <div className="row signup">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Email<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${send_otp_forgot_Errors.email ? "is-invalid" : ""
                            }`}
                          name="email"
                          value={send_otp_forgot_FormData.email}
                          onChange={handlesend_otp_forgot_Change}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* <div className='col-remember-div justify-content-center'>
                      <div class="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="acceptcheck" />
                        <label className="form-check-label" htmlFor="acceptcheck">
                          I agree to Terms of service | Privacy policy
                        </label>
                      </div>
                    </div> */}

                    <div className="form-action">
                      <button className="btn btn-primary mb-0" type="submit">
                        Submit
                      </button>

                    </div>
                    <div className="signup-modal">
                      Have an account?{" "}
                      <Link onClick={handleLoginShow}>Sign In now</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* <div className='login-body-img'>
              <img src={LoginImg} alt="Login Picture" />
              <video autoPlay loop muted>
                <source src={HeroVideo} />
              </video>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>

      {/* Fporgot Password OTP verify  modal start  */}
      {/* <Modal className='reset-modal' show={Forgot_Password_Otp_Verify_show} onHide={handle_Forgot_Password_Otp_Verify_Close} centered>
        <Modal.Body>
          <div className='login-modal-outer'>
            <div className='login-modal-body w-100'>
              <div className='modal-head text-center'>
                <img src={Logo} alt="Logo" className="main-logo" />
                <h2>Forgot Password Email Verification</h2>
              </div>
              <div className='login-form-outer'>
                <form onSubmit={handle_Otp_verify_Forgot_password_Submit}>
                  <div className='row otp'>
                    <div className='otp-desc'>
                      <p className='mt-3'>We’ve sent you the verification code on</p>
                      <div className='email-box'>
                        <p className='email-text'>{registeredEmail || get_send_otp_email_id}</p>
                       
                      </div>
                    </div>

                    <div className='col-otp-div'>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      ))}
                    </div>

                    {otpError && <p className="text-danger mt-2">{otpError}</p>}

                    <div className='form-action'>
                      <button type="submit" className='btn btn-primary mb-0'>
                        Verify
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* <----- forgot password modal ------------> */}
      <Modal
        className="login-modal"
        show={ForgotPasswordshow}
        onHide={handleForgotPasswordClose}
        centered
      >
        <Modal.Body>
          <div className="login-modal-outer">
            <div className="login-modal-body">
              <div className="modal-head text-center">
                <img src={Logo} alt="Logo" className="main-logo" />
                <p>Please enter your details.</p>
              </div>
              <div className="login-form-outer">
                <form onSubmit={handle_forgot_password_submit}>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>OTP</label>
                        <input
                          type="number"
                          className={`form-control ${ForgotPasswordErrors.code ? "is-invalid" : ""
                            }`}
                          name="code" // must match state key
                          value={send_otp_forgot_password_FormData.code}
                          onChange={handlesend_otp_forgot_password_Change}
                          placeholder="Enter OTP"
                        />

                        {ForgotPasswordErrors.code && (
                          <div className="invalid-feedback d-block">
                            {ForgotPasswordErrors.code.map((err, i) => (
                              <div key={i}>{err}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>Password</label>
                        <input
                          type={showForgotPassword ? "text" : "password"}
                          className={`form-control ${ForgotPasswordErrors.password ? "is-invalid" : ""
                            }`}
                          name="password"
                          value={send_otp_forgot_password_FormData.password}
                          onChange={handlesend_otp_forgot_password_Change}
                          placeholder="**********"
                        />

                        <span
                          onClick={toggleForgotPassword}
                          style={{
                            position: "absolute",
                            top: "38px",
                            right: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {showForgotPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                        {ForgotPasswordErrors.password && (
                          <div className="invalid-feedback d-block">
                            {ForgotPasswordErrors.password.map((err, i) => (
                              <div key={i}>{err}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group position-relative">
                        <label>Confirm Password</label>
                        <input
                          type={showForgotConfirmPassword ? "text" : "password"}
                          className={`form-control ${ForgotPasswordErrors.password_confirmation
                            ? "is-invalid"
                            : ""
                            }`}
                          name="password_confirmation"
                          value={
                            send_otp_forgot_password_FormData.password_confirmation
                          }
                          onChange={handlesend_otp_forgot_password_Change}
                          placeholder="**********"
                        />

                        <span
                          onClick={toggleForgotConfirmPassword}
                          style={{
                            position: "absolute",
                            top: "38px",
                            right: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {showForgotConfirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </span>

                        {ForgotPasswordErrors.password_confirmation && (
                          <div className="invalid-feedback d-block">
                            {ForgotPasswordErrors.password_confirmation.map(
                              (err, i) => (
                                <div key={i}>{err}</div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {loginErrors.email && (
                      <div className="invalid-feedback d-block">
                        {loginErrors.email}
                      </div>
                    )}

                    <div className="form-action">
                      <button type="submit" className="btn btn-primary">
                        Reset Password
                      </button>
                    </div>

                    <div className="signup-modal">
                      Don’t have an account?{" "}
                      <Link onClick={handleSignupShow}>Sign up for free!</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="login-body-img">
              <img src={LoginImg} alt="Login Picture" />
              {/* <video autoPlay loop muted>
                <source src={HeroVideo} />
              </video> */}
              <video
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
              >
                <source src={HeroVideo} type="video/mp4" />
              </video>

            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
