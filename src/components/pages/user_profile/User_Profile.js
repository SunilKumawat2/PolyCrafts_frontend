// import React, { useEffect, useState } from "react";
// import Header_Login from "../../common/header/Header_Login";
// import Footer from "../../common/footer/Footer";
// import HeroVideo from "../../../assets/images/placeholder-video.mp4";
// import DltIcon from "../../../assets/images/dlt-modal-icon.svg";
// import { Link } from "react-router-dom";
// import { CloseButton, Modal } from "react-bootstrap";
// import { User_Change_Password, User_Get_Profile, User_Update_Profile } from "../../../api/profile/Profile";

// const User_Profile = () => {
//   const [Cancelshow, setCancelShow] = useState(false);
//   const [Dltshow, setDltShow] = useState(false);

//   const [profile, setProfile] = useState({
//     id: "",
//     name: "",
//     email: "",
//     company: "",
//     phone_number: "",
//   });

//   // Modal handlers
//   const handleCancelClose = () => setCancelShow(false);
//   const handleDltClose = () => setDltShow(false);
//   const handleDltShow = () => setDltShow(true);
//   const handleCancelShow = () => setCancelShow(true);

//   // Fetch profile on mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await User_Get_Profile();
//         console.log("Profile:", res?.data);
//         setProfile(res?.data?.user);
//       } catch (err) {
//         console.error("Profile fetch error:", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   // Handle update profile
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedData = {
//         name: profile.name,
//         company: profile.company,
//         phone_number: profile.phone_number,
//         email:profile.email
//       };

//       const res = await User_Update_Profile(updatedData);
//       console.log("Profile updated:", res.data);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Failed to update profile.");
//     }
//   };

//   return (
//     <main className="user-profile-page">
//       {/* ===== HEADER ===== */}
//       <Header_Login />

//       {/* ========== My Profile start ======= */}
//       <section className="user-profile-section px-85">
//         <div className="container-fluid">
//           <div className="row profile-row">
//             <div className="col-profile-form">
//               <div className="profile-form">
//                 <form onSubmit={handleUpdateProfile}>
//                   <div className="row inner-row">
//                     <div className="col-12">
//                       <div className="profile-id">
//                         <span>ID: {profile?.id || "00001"}</span>
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="form-group">
//                         <label>
//                           <span className="text-danger">*</span> Full Name
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           className="form-control"
//                           placeholder="Enter additional details"
//                           value={profile?.name || ""}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="form-group">
//                         <label>
//                           <span className="text-danger">*</span> Email
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           className="form-control"
//                           placeholder="Enter additional details"
//                           value={profile?.email || ""}
//                           readOnly // cannot update email
//                         />
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="form-group">
//                         <label>Company</label>
//                         <input
//                           type="text"
//                           name="company"
//                           className="form-control"
//                           placeholder="Enter additional details"
//                           value={profile?.company || ""}
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <div className="form-group">
//                         <label>Phone no</label>
//                         <input
//                           type="tel"
//                           name="phone_number"
//                           placeholder="Enter additional details"
//                           className="form-control"
//                           value={profile?.phone_number || ""}
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-12">
//                       <button type="submit" className="btn btn-primary">
//                         Update Profile
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             <div className="col-profile-video">
//               <video controls muted playsInline
// webkit-playsinline="true"
// preload="auto">
//                 <source src={HeroVideo} />
//               </video>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===== Subscription Buttons ===== */}
//       <section className="subscribe-btns px-85">
//         <div className="container-fluid">
//           <div className="btn-row">
//             <div className="col-btn">
//               <Link onClick={handleCancelShow}>Cancel Subscription</Link>
//             </div>
//             <div className="col-btn">
//               <Link onClick={handleDltShow}>Delete Account</Link>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* ========== My Profile End ======= */}

//       {/* ===== FOOTER ===== */}
//       <Footer />

//       {/* Cancel Subscription Modal */}
//       <Modal className="cancel-modal" show={Cancelshow} onHide={handleCancelClose}>
//         <Modal.Body>
//           <div className="cancel-modal-outer">
//             <div className="modal-head">
//               <CloseButton onClick={handleCancelClose} />
//               <h2>Cancel subscription</h2>
//               <p>
//                 Canceling Subscription for <b>ID {profile?.id || "0001"}.</b> Are
//                 you sure you want to proceed?
//               </p>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-secondary" onClick={handleCancelClose}>
//             Undo
//           </button>
//           <button className="btn btn-primary" onClick={() => alert("Cancel Subscription API pending")}>
//             Cancel
//           </button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Account Modal */}
//       <Modal className="cancel-modal" show={Dltshow} onHide={handleDltClose}>
//         <Modal.Body>
//           <div className="cancel-modal-outer delete-modal">
//             <div className="modal-head">
//               <CloseButton onClick={handleDltClose} />
//               <img src={DltIcon} alt="Delete Icon" />
//               <div>
//                 <h2>Delete account?</h2>
//                 <p>
//                   Deleting <b>ID {profile?.id || "0001"}</b> is permanent. Are
//                   you sure you want to proceed?
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-secondary" onClick={handleDltClose}>
//             Undo
//           </button>
//           <button className="btn btn-primary" onClick={() => alert("Delete Account API pending")}>
//             Delete
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </main>
//   );
// };

// export default User_Profile;

import React, { useEffect, useState } from "react";
import Header_Login from "../../common/header/Header_Login";
import Footer from "../../common/footer/Footer";
import HeroVideo from "../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import DltIcon from "../../../assets/images/dlt-modal-icon.svg";
import { Link } from "react-router-dom";
import { CloseButton, Modal } from "react-bootstrap";
import {
  User_Change_Password,
  User_Get_Profile,
  User_Update_Profile,
} from "../../../api/profile/Profile";

const User_Profile = () => {
  const [Cancelshow, setCancelShow] = useState(false);
  const [Dltshow, setDltShow] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    company: "",
    phone_number: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Modal handlers
  const handleCancelClose = () => setCancelShow(false);
  const handleDltClose = () => setDltShow(false);
  const handleDltShow = () => setDltShow(true);
  const handleCancelShow = () => setCancelShow(true);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await User_Get_Profile();
        console.log("Profile:", res?.data);
        setProfile({
          ...res?.data?.user,
          image: null, // Initially no uploaded image
        });
        setPreviewImage(res?.data?.user?.image_url || null); // show existing image
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
      setPreviewImage(URL.createObjectURL(file)); // preview new image
    }
  };

  // Handle update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("company", profile.company || "");
      formData.append("phone_number", profile.phone_number || "");
      formData.append("email", profile.email);
      if (profile.image) {
        formData.append("image", profile.image);
      }

      const res = await User_Update_Profile(formData); // backend should handle multipart/form-data
      console.log("Profile updated:", res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <main className="user-profile-page">
      <Header_Login />
      <div className='content-outer'>
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
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Company */}
                      <div className="col-12">
                        <div className="form-group">
                          <label>Company</label>
                          <input
                            type="text"
                            name="company"
                            className="form-control"
                            placeholder="Enter company"
                            value={profile?.company || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-12">
                        <div className="form-group">
                          <label>Phone no</label>
                          <input
                            type="tel"
                            name="phone_number"
                            placeholder="Enter phone number"
                            className="form-control"
                            value={profile?.phone_number || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Profile Image */}
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
                                style={{ maxWidth: "90px", height: "80px", borderRadius: "50%" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Update button */}
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          Update Profile
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

        {/* Cancel Subscription Modal */}
        <Modal
          className="cancel-modal"
          show={Cancelshow}
          onHide={handleCancelClose}
        >
          <Modal.Body>
            <div className="cancel-modal-outer">
              <div className="modal-head">
                <CloseButton onClick={handleCancelClose} />
                <h2>Cancel subscription</h2>
                <p>
                  Canceling Subscription for <b>ID {profile?.id || "0001"}.</b>{" "}
                  Are you sure you want to proceed?
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleCancelClose}>
              Undo
            </button>
            <button
              className="btn btn-primary"
              onClick={() => alert("Cancel Subscription API pending")}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>

        {/* Delete Account Modal */}
        <Modal className="cancel-modal" show={Dltshow} onHide={handleDltClose}>
          <Modal.Body>
            <div className="cancel-modal-outer delete-modal">
              <div className="modal-head">
                <CloseButton onClick={handleDltClose} />
                <img src={DltIcon} alt="Delete Icon" />
                <div>
                  <h2>Delete account?</h2>
                  <p>
                    Deleting <b>ID {profile?.id || "0001"}</b> is permanent. Are
                    you sure you want to proceed?
                  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleDltClose}>
              Undo
            </button>
            <button
              className="btn btn-primary"
              onClick={() => alert("Delete Account API pending")}
            >
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </main>
  );
};

export default User_Profile;
