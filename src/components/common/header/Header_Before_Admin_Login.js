import React, { useState } from 'react';
import Logo from "../../../assets/images/LOGO.svg";
import LoginImg from "../../../assets/images/login-img.png";
import GoogleImg from "../../../assets/images/icon-google.png";
import HeroVideo from "../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Container, Modal } from 'react-bootstrap';
import { User_Login, User_Otp_verify, User_Register } from '../../../api/auth/Auth';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PencilOtp from "../../../assets/images/pencil-otp.svg";

const Header_Before_Admin_Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let base_url = process.env.REACT_APP_BASE_URL;
    const [Loginshow, setLoginShow] = useState(false);
    const [Otp_Verify_show, setOtp_Verify_show] = useState(false);
    const [Signupshow, setSignupShow] = useState(false);
    const [Forgotshow, setForgotShow] = useState(false);
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

    const [loginErrors, setLoginErrors] = useState({});
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [show_register_Password, set_Show_register_password] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [otpError, setOtpError] = useState("");


    const handleLoginClose = () => setLoginShow(false);
    const handle_Otp_Verify_Close = () => setOtp_Verify_show(false);
    const handleSignupClose = () => setSignupShow(false);

    const handleForgotClose = () => setForgotShow(false);

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

    // <---------- change the login form ------->
    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginFormData({
            ...loginFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // <---------- Login Form Validation ------------->
    const validateLoginForm = () => {
        let errors = {};

        // Email
        if (!loginFormData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginFormData.email)) {
            errors.email = "Enter a valid email address";
        }

        // Password
        if (!loginFormData.password.trim()) {
            errors.password = "Password is required";
        } else if (loginFormData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }

        setLoginErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // <---------- Login Form Submit ----------> 
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) return;

        try {
            const payload = {
                email: loginFormData.email,
                password: loginFormData.password,
                remember: loginFormData.remember,
            };

            const response = await User_Login(payload); // global API call
            console.log("Login response:", response);

            if (response?.data?.status === true) {
                alert("Login successful!");
                localStorage.setItem("polycarft_user_token", response?.data?.token);

                setLoginShow(false); // close modal
                setLoginFormData({
                    email: "",
                    password: "",
                    remember: false,
                });
                setLoginErrors({});

                // ✅ check redirect path
                const redirectPath = localStorage.getItem("redirect_after_login");
                if (redirectPath) {
                    localStorage.removeItem("redirect_after_login"); // clear after use
                    navigate(redirectPath);
                } else {
                    window.location.reload()
                    navigate(`/`); // default redirect
                }
            }
            else {
                // Backend validation errors
                let apiErrors = {};
                if (response?.data?.errors) {
                    for (const field in response.data.errors) {
                        apiErrors[field] = response.data.errors[field][0];
                    }
                }
                setLoginErrors(apiErrors);

                if (response?.data?.message) {
                    alert(response.data.message);
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Something went wrong. Please try again later.");
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

            // if (name === "password_confirmation" && fieldValue === regsiterformData.password) {
            //   delete newErrors.password_confirmation;
            // }

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
        } else if (regsiterformData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }

        // if (!regsiterformData.password_confirmation) {
        //   newErrors.password_confirmation = "Confirm your password";
        // } else if (regsiterformData.password !== regsiterformData.password_confirmation) {
        //   newErrors.password_confirmation = "Passwords do not match";
        // }

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
            return; // stop if frontend validation errors exist
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
            console.log("User_Register success:", response.data);

            if (response?.data?.status === true) {
                // ✅ Registration success
                setSignupShow(false); // close signup modal
                setOtp_Verify_show(true); // open OTP modal

                // save registered email for OTP modal
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
        console.log("OTP entered:", finalOtp);

        try {
            const response = await User_Otp_verify({
                email: registeredEmail,
                code: finalOtp,
            });

            console.log("OTP Verify Response:", response.data);

            if (response?.data?.status === true) {
                alert("OTP verified successfully!");
                setOtpError("");
                setOtp(["", "", "", ""]);
                setOtp_Verify_show(false);
                setLoginShow(true)
            } else {
                setOtpError(response?.data?.message || "Invalid OTP, please try again.");
            }
        } catch (error) {
            console.error("OTP Verification failed:", error);

            if (error?.status === 422 && error?.data?.errors) {
                const errMsg = Object.values(error.data.errors)[0][0];
                setOtpError(errMsg);
            } else {
                setOtpError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <>
            <header className="main-header px-85">
                <Navbar expand="lg" className="header-inner p-0">
                    <Container fluid>
                        <div className='logo-toggler'>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Link to={`/admin-login`} className='nav-logo'>
                                <img src={Logo} alt="Logo" className="main-logo" />
                            </Link>
                        </div>
                        {/* <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="navbar-links">
                <Nav.Link className={`${location.pathname === `/about` ? "active" : ""}`} href={`/about`}>About Us</Nav.Link>
                <Nav.Link className={`${location.pathname === `/pricing` ? "active" : ""}`} href={`/pricing`}>Pricing</Nav.Link>
                <Nav.Link className={`${location.pathname === `/services` ? "active" : ""}`} href={`/`}>Sevices</Nav.Link>
                <Nav.Link className={`${location.pathname === `/faq` ? "active" : ""}`} href={`/faq`}>FAQ's</Nav.Link>


              </Nav>
            </Navbar.Collapse> */}
                        <Button className='login-btn' variant="primary">
                            Admin Sign In
                        </Button>
                    </Container>
                </Navbar>


            </header>
            {/* <----- login modal ------------> */}
            <Modal className='login-modal' show={Loginshow} onHide={handleLoginClose} centered>
                <Modal.Body>
                    <div className='login-modal-outer'>
                        <div className='login-modal-body'>
                            <div className='modal-head text-center'>
                                <img src={Logo} alt="Logo" className="main-logo" />
                                <p>Please enter your details.</p>
                            </div>
                            <div className='login-form-outer'>
                                <form onSubmit={handleLoginSubmit}>
                                    <div className='row'>
                                        {/* Email */}
                                        <div className='col-12'>
                                            <div className='form-group'>
                                                <label>Email</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${loginErrors.email ? "is-invalid" : ""}`}
                                                    name="email"
                                                    value={loginFormData.email}
                                                    onChange={handleLoginChange}
                                                    placeholder="Enter your email"
                                                />
                                                {loginErrors.email && (
                                                    <div className="invalid-feedback d-block">{loginErrors.email}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="col-12">
                                            <div className="form-group position-relative">
                                                <label>Password</label>
                                                <input
                                                    type={showLoginPassword ? "text" : "password"}
                                                    className={`form-control ${loginErrors.password ? "is-invalid" : ""}`}
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

                                        {/* Remember Me + Forgot */}
                                        <div className='col-remember-div'>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="remember"
                                                    checked={loginFormData.remember}
                                                    onChange={handleLoginChange}
                                                    id="remembercheck"
                                                />
                                                <label className="form-check-label" htmlFor="remembercheck">
                                                    Remember me
                                                </label>
                                            </div>
                                            <div className='forgot-link-div'>
                                                <Link onClick={handleForgotShow}>Forgot password</Link>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className='form-action'>
                                            <button type="submit" className='btn btn-primary'>
                                                Sign in
                                            </button>
                                            <button type="button" className='sign-google'>
                                                <img src={GoogleImg} alt="Google Sign" /><span>Sign in with Google</span>
                                            </button>
                                        </div>

                                        <div className='signup-modal'>
                                            Don’t have an account? <Link onClick={handleSignupShow}>Sign up for free!</Link>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                        <div className='login-body-img'>
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

            <Modal className='reset-modal' show={Otp_Verify_show} onHide={handle_Otp_Verify_Close} centered>
                <Modal.Body>
                    <div className='login-modal-outer'>
                        <div className='login-modal-body w-100'>
                            <div className='modal-head text-center'>
                                <img src={Logo} alt="Logo" className="main-logo" />
                                <h2>Email Verification</h2>
                            </div>
                            <div className='login-form-outer'>
                                <form onSubmit={handleOtpSubmit}>
                                    <div className='row otp'>
                                        <div className='otp-desc'>
                                            <p className='mt-3'>We’ve sent you the verification code on</p>
                                            <div className='email-box'>
                                                <p className='email-text'>{registeredEmail}</p>
                                                {/* <Link className='change-btn'>
                          <img src={PencilOtp} alt="PencilOtp" /> Change
                        </Link> */}
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
            </Modal>


            {/* OTP modal end  */}

            {/* Signup modal start  */}
            <Modal className='login-modal' show={Signupshow} onHide={handleSignupClose} centered>
                <Modal.Body>
                    <div className='login-modal-outer'>
                        <div className='login-modal-body'>
                            <div className='modal-head text-center'>
                                <img src={Logo} alt="Logo" className="main-logo" />
                                <h2>Sign Up</h2>
                                <p>Please enter your details.</p>
                            </div>
                            <div className='login-form-outer'>
                                <form onSubmit={handleRegisterSubmit} noValidate>
                                    <div className='row signup'>

                                        {/* Name */}
                                        <div className='col-12'>
                                            <div className='form-group'>
                                                <label>Name <span className='text-danger'>*</span></label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${regsiter_error.name ? "is-invalid" : ""}`}
                                                    name="name"
                                                    value={regsiterformData.name}
                                                    onChange={RegisterhandleChange}
                                                    placeholder='Enter your name'
                                                />
                                                {regsiter_error.name && <div className="invalid-feedback">{regsiter_error.name}</div>}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className='col-12'>
                                            <div className='form-group'>
                                                <label>Email <span className='text-danger'>*</span></label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${regsiter_error.email ? "is-invalid" : ""}`}
                                                    name="email"
                                                    value={regsiterformData.email}
                                                    onChange={RegisterhandleChange}
                                                    placeholder='Enter your email'
                                                />
                                                {regsiter_error.email && <div className="invalid-feedback">{regsiter_error.email}</div>}
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div className='col-12'>
                                            <div className='form-group'>
                                                <label>Company <span>(Optional)</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="company"
                                                    value={regsiterformData.company}
                                                    onChange={RegisterhandleChange}
                                                    placeholder='Enter company name'
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
                                                    <div className="invalid-feedback">{regsiter_error.password}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Terms */}
                                        <div className='col-remember-div justify-content-center'>
                                            <div className="form-check">
                                                <input
                                                    className={`form-check-input ${regsiter_error.acceptTerms ? "is-invalid" : ""}`}
                                                    type="checkbox"
                                                    name="acceptTerms"
                                                    checked={regsiterformData.acceptTerms}
                                                    onChange={RegisterhandleChange}
                                                    id="acceptcheck"
                                                />
                                                <label className="form-check-label" htmlFor="acceptcheck">
                                                    I agree to Terms of service | Privacy policy
                                                </label>
                                                {regsiter_error.acceptTerms && <div className="invalid-feedback d-block">{regsiter_error.acceptTerms}</div>}
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className='form-action'>
                                            <button type="submit" className='btn btn-primary'>
                                                Sign up
                                            </button>
                                            <button type="button" className='sign-google'>
                                                <img src={GoogleImg} alt="Google Sign" /><span>Sign up with Google</span>
                                            </button>
                                        </div>

                                        <div className='signup-modal'>
                                            Have an account? <Link onClick={handleLoginShow}>Sign In now</Link>
                                        </div>

                                    </div>
                                </form>

                            </div>
                        </div>
                        <div className='login-body-img'>
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
            {/* Signup modal end  */}

            {/* Forgot modal start  */}

            <Modal className='reset-modal' show={Forgotshow} onHide={handleForgotClose} centered>
                <Modal.Body>
                    <div className='login-modal-outer'>
                        <div className='login-modal-body w-100'>
                            <div className='modal-head text-center'>
                                <img src={Logo} alt="Logo" className="main-logo" />
                                <h2>Forgot Password</h2>
                                <p>Please enter your details.</p>
                            </div>
                            <div className='login-form-outer'>
                                <form>
                                    <div className='row signup'>

                                        <div className='col-12'>
                                            <div className='form-group'>
                                                <label>Email<span className='text-danger'>*</span></label>
                                                <input type="email" className='form-control' placeholder='Enter your email' />
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

                                        <div className='form-action'>
                                            <button className='btn btn-primary mb-0'>
                                                Submit
                                            </button>

                                        </div>
                                        <div className='signup-modal'>
                                            Have an account? <Link onClick={handleLoginShow}>Sign In now</Link>
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

            {/* Forgot modal end  */}

        </>
    );
};

export default Header_Before_Admin_Login;
