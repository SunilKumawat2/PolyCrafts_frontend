import React, { useState } from "react";
import Header_Login from "../../common/header/Header_Login";
import Footer from "../../common/footer/Footer";
import HeroVideo from "../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import { User_Change_Password, User_Update_Profile } from "../../../api/profile/Profile";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Change_Password = () => {
  const [profile, setProfile] = useState({
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (profile.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (profile.password !== profile.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const updatedData = {
        password: profile.password,
        password_confirmation: profile.password_confirmation,
      };

      const res = await User_Change_Password(updatedData);
      console.log("Profile updated:", res.data);
      alert("Password updated successfully!");
      setProfile({ password: "", password_confirmation: "" }); // Reset form
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update password.");
    }
  };

  return (
    <main className="user-profile-page">
      {/* ===== HEADER ===== */}
      <Header_Login />
      <div className='content-outer'>

        {/* ========== Change Password Section ======= */}
        <section className="user-profile-section px-85">
          <div className="container-fluid">
            <div className="row profile-row">
              <div className="col-profile-form">
                <div className="profile-form">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="row inner-row">
                      <div className="col-12">
                        <div className="form-group">
                          <label>
                            New Password  <span className="text-danger">*</span>
                          </label>
                          <div className="form-group position-relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="form-control"
                              placeholder="Enter new password"
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


                          </div>

                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>
                            Confirm Password  <span className="text-danger">*</span>
                          </label>
                          <div className="form-group position-relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="password_confirmation"
                              className="form-control"
                              placeholder="Confirm new password"
                              value={profile.password_confirmation}
                              onChange={handleChange}
                              required
                            />
                            {/* Toggle Icon */}
                            <span
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>


                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-profile-video">
                <video controls muted playsInline
                  webkit-playsinline="true"
                  preload="auto">
                  <source src={HeroVideo} />
                </video>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  );
};

export default Change_Password;
