import React, { useEffect, useState } from "react";
import Footer from "../../../common/footer/Footer";
import HeroVideo from "../../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import {
  Admin_Update_Profile,
  Get_Admin_Profile,
} from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";

const Admin_Profile = () => {
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ loading state

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await Get_Admin_Profile();
        console.log("Profile:", res?.data);
        setProfile({
          ...res?.data?.user,
          image: null, // reset file input
        });
        setPreviewImage(res?.data?.user?.image_url || null); // show current image if available
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setPreviewImage(URL.createObjectURL(file)); // preview
    }
  };

  // Handle update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ start loading

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (profile.image) {
        formData.append("image", profile.image);
      }

      const res = await Admin_Update_Profile(formData); // must handle multipart/form-data
      console.log("Profile updated:", res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);

      const errorData = err?.response?.data || err?.data;

      if (errorData?.errors) {
        const messages = Object.values(errorData.errors).flat().join("\n");
        alert(messages); // show all errors nicely
      } else if (errorData?.message) {
        alert(errorData.message);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <main className="user-profile-page">
      {/* ===== HEADER ===== */}
      <Header_Admin />

      {/* ========== My Profile start ======= */}
      <section className="user-profile-section px-85">
        <div className="container-fluid">
          <div className="row profile-row">
            <div className="col-profile-form">
              <div className="profile-form">
                <form
                  onSubmit={handleUpdateProfile}
                  encType="multipart/form-data"
                >
                  <div className="row inner-row">
                    <div className="col-12">
                      <div className="profile-id">
                        <span>ID: {profile?.id || "00001"}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          <span className="text-danger">*</span> Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Enter full name"
                          value={profile?.name || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          <span className="text-danger">*</span> Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          value={profile?.email || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Image */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>Profile Image</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="form-control"
                          onChange={handleImageChange}
                        />
                        {previewImage && (
                          <div style={{ marginTop: "10px" }}>
                            <img
                              src={previewImage}
                              alt="Profile Preview"
                              style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading} // ✅ disable while uploading
                      >
                        {loading ? "Uploading..." : "Update Profile"} {/* ✅ text switch */}
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

      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  );
};

export default Admin_Profile;
