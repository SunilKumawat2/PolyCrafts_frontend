import React, { useState } from "react";
import Header_Login from "../../../common/header/Header";
import Footer from "../../../common/footer/Footer";
import HeroVideo from "../../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Admin_Login_post } from "../../../../api/admin/Admin";
import { useNavigate } from "react-router-dom";
import Header_Before_Admin_Login from "../../../common/header/Header_Before_Admin_Login";

const Admin_Login = () => {
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        email: "",
        password: ""
    });
    let base_url = process.env.REACT_APP_BASE_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({}); // store validation errors

    // Handle input change
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
    };

    // Form validation
    const validateForm = () => {
        let newErrors = {};

        // Email validation
        if (!profile.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        // Password validation
        if (!profile.password) {
            newErrors.password = "Password is required.";
        } else if (profile.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; // stop if invalid

        try {
            const updatedData = {
                password: profile.password,
                email: profile.email,
            };

            const res = await Admin_Login_post(updatedData);
            console.log("Profile updated:", res.data);
            localStorage.setItem("ploycartfts_admin_token", res.data.token)
            alert("Admin Login Successfully !");
            navigate(`/admin-orders`)
            setProfile({ password: "", email: "" }); // Reset form
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to admin login.");
        }
    };

    return (
        <main className="user-profile-page">
            {/* ===== HEADER ===== */}
            <Header_Before_Admin_Login />

            {/* ========== Change Password Section ======= */}
            <section className="user-profile-section px-85 py-85">
                <div className="container-fluid">
                    <div className="row profile-row">
                        <div className="col-profile-form">
                            <div className="profile-form">
                                <form onSubmit={handleUpdateProfile} noValidate>
                                    <div className="row inner-row">
                                        {/* Email */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    Email <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                                    placeholder="Enter your email"
                                                    value={profile.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                {errors.email && (
                                                    <div className="invalid-feedback">{errors.email}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    Password <span className="text-danger">*</span>
                                                </label>
                                                <div className="form-group position-relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                        placeholder="Enter your password"
                                                        value={profile.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {/* Toggle Icon */}
                                                    <span
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{
                                                            position: "absolute",
                                                            top: "8px",
                                                            right: "12px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </span>
                                                    {errors.password && (
                                                        <div className="invalid-feedback">{errors.password}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary w-100">
                                                Admin Login
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Video Preview */}
                        <div className="col-profile-video">
                            <video muted autoPlay>
                                <source src={HeroVideo} />
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <Footer />
        </main>
    );
};

export default Admin_Login;
