import React, { useState } from "react";
import Footer from "../footer/Footer";
import { User_Contact_Requests } from "../../../api/global/Global"; // adjust path if needed

const Reach_Us_Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_website: "",
    message: "",
    allow_newsletter: false, // checkbox state
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Convert checkbox boolean to "yes"/"no"
      const payload = {
        ...formData,
        allow_newsletter: formData.allow_newsletter ? "yes" : "no",
      };

      const response = await User_Contact_Requests(payload);

      if (response?.data?.status) {
        setSuccessMsg("Message sent successfully ✅");
        setFormData({
          name: "",
          email: "",
          company_website: "",
          message: "",
          allow_newsletter: false,
        });
      } else {
        setErrorMsg(response?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMsg(error?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="reach-form-sec">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="reach-form-outer">
                <h2>Reach out to us</h2>

                {/* Show success/error messages */}
                {successMsg && <p className="text-success">{successMsg}</p>}
                {errorMsg && <p className="text-danger">{errorMsg}</p>}

                <form onSubmit={handleSubmit}>
                  <div className="row form-row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Company Website</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your company website"
                          name="company_website"
                          value={formData.company_website}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows="5"
                          placeholder="Enter your message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-checkbox">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="newslettercheck"
                          name="allow_newsletter"
                          checked={formData.allow_newsletter}
                          onChange={handleChange}
                        />
                        <label className="form-check-label"
                          htmlFor="newslettercheck"
                        >
                          Sign up for our newsletter
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-action">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? "Sending..." : "Send Message"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Reach_Us_Form;
