import React, { useEffect, useState } from "react";
import Footer from "../../common/footer/Footer";
import Header from "../../common/header/Header";
import ProdOne from "../../../assets/images/prod1.png";
import ProdTwo from "../../../assets/images/prod2.png";
import priceListIcon from "../../../assets/images/price-list-icon.svg";
import CheckIcon from "../../../assets/images/checkicon.svg";
import Book_Call from "../../common/book_call_popup/Book_Call";
import MissionImg from "../../../assets/images/mission.jpg";
import { Current_User_subscribe, User_Upgrdae_Subscription_Plan, get_subscription_plans } from "../../../api/product/Product";
import Header_Login from "../../common/header/Header_Login";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_CLIENT_ID } from "../../../config/Config";
import { Get_Global_About_us_content, Get_Global_Page_content, Get_Global_Subscription_Plan } from "../../../api/global/Global";
import DynamicSEO from "../../../seo/DynamicSEO";

// ⚠️ Replace with your Stripe Publishable Key
// const stripePromise = loadStripe(
//   "pk_test_51S8c8FPX44LSQqJubLM9zik1ycbRa02AUF0uC8FR5bWANRhHVAQ1nlW4D8rigYJsp6CLdGQ2G5g6Z2nprRw3hfpQ00bHfjyM74"
// );
// ⚠️ Replace with your Stripe Publishable Key
const stripePromise = loadStripe(STRIPE_CLIENT_ID);
const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [isYearly, setIsYearly] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openFeature, setOpenFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Bookshow, setBookShow] = useState(false);
  const get_polycarft_user_token = localStorage.getItem("polycarft_user_token");
  const [subscriptionData, setSubscriptionData] = useState(null);
  const handleBookShow = () => setBookShow(true);
  const handleBookClose = () => setBookShow(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    plan: null,
  });
  const [vision, setVision] = useState(null);
  const [pricingContent, setPricingContent] = useState(null);
  const toggleFeatures = (id) =>
    setOpenFeature((prev) => (prev === id ? null : id));

  // fetch plans dynamically
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const interval = isYearly ? "year" : "month";
        const res = await get_subscription_plans("month");
        setPlans(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load subscription plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [isYearly]);

  useEffect(() => {
    Get_Global_Page_content("pricing").then(res => {
      const formatted = formatPricingContent(res.data.data);
      setPricingContent(formatted);
    });
  }, []);

  const getContent = (section, key) => {
    return pricingContent?.[section]?.[key]?.value || "";
  };

  const getImage = (section, key) => {
    const file = pricingContent?.[section]?.[key];

    if (!file || file.type !== "file") return null;

    return file.value;  // This already contains full URL
  };



  const formatPricingContent = (data) => {
    const result = {};

    data.forEach(item => {
      if (!result[item.section_key]) {
        result[item.section_key] = {};
      }

      result[item.section_key][item.content_key] = {
        type: item.content_type,
        value: item.content_value,
        imageUrl: item.image_url ?? null
      };
    });

    return result;
  };


  // ✅ Fetch current subscription
  const fetchCurrentSubscription = async () => {
    setLoading(true);
    try {
      const res = await Current_User_subscribe();
      if (res?.data?.status) {
        setSubscriptionData(res.data);
      } else {
        setSubscriptionData(null);
      }
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      setSubscriptionData(null);
    }
    setLoading(false);
  };

  const handleChangePlan = (plan) => {
    setConfirmModal({
      open: true,
      plan: plan
    });
  };

  const confirmUpgradePlan = async () => {
    const plan = confirmModal.plan;
    setConfirmModal({ open: false, plan: null });

    try {
      setLoadingPlanId(plan.id);

      const formData = new FormData();
      formData.append("new_plan_id", plan.id);

      const res = await User_Upgrdae_Subscription_Plan(formData);

      if (res?.data?.status) {
        alert("Your plan has been successfully upgraded!");
        window.location.reload();
        await fetchCurrentSubscription();
      } else {
        alert(res?.data?.message || "Failed to change plan");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while upgrading your plan.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  useEffect(() => {
    fetchCurrentSubscription()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await Get_Global_Subscription_Plan();

      if (res?.data?.status) {
        setPlans(res.data.data);  // <--- 👈 storing API response
      } else {
        setErrorMsg("Unable to fetch subscription plans.");
      }
    } catch (error) {
      console.log("API Error:", error);
      setErrorMsg("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="upload-modals-page">
      <DynamicSEO pageKey="price" />
      {/* ===== HEADER ===== */}
      {get_polycarft_user_token ? <Header_Login /> : <Header />}
      <div className='content-outer'>
        <section className="pricing-banner-sec px-85">
          <div className="container-fluid">
            <div className="page-banner">
              <div className="page-banner-text">
                <h1>{getContent("hero", "heading")}</h1>
                <p>{getContent("hero", "subheading")}</p>
              </div>
            </div>

            <div className="pricing-model-row">
              <div className="col-pricing-text">
                <div className="left-text">
                  <span className="step-nbr">STEP 1</span>
                  <h2>{getContent("step_1", "heading")}</h2>
                  <div className="inner-product-row">
                    <div className="single-product-box">
                      <div className="text-box">
                        <h3>{getContent("step_1", "item_1_text")}</h3>
                        <p>{getContent("step_1", "item_1_price")}</p>
                      </div>
                      <div className="img-box">
                        {/* <img src={ProdOne} alt="ProdTwo" /> */}
                        {/* <img src={getImage("step_1", "item_1_image")} alt="" /> */}
                        <img src={getImage("step_1", "item_1_image")} alt="" />
                      </div>
                    </div>
                    <div className="single-product-box">
                      <div className="text-box">
                        <h3>{getContent("step_1", "item_2_text")}</h3>
                        <p>{getContent("step_1", "item_2_price")}</p>
                      </div>
                      <div className="img-box">
                        {/* <img src={ProdTwo} alt="ProdTwo" /> */}
                        <img src={getImage("step_1", "item_2_image")} alt="" />
                      </div>
                    </div>
                  </div>
                  <ul className="price-model-list">
                    <li>
                      Create a professional 3D model of your product for a
                      fraction of the cost
                    </li>
                    <li>
                      Add an extra label for the same product with just a few
                      additional credits
                    </li>
                    <div dangerouslySetInnerHTML={{ __html: getContent("step_1", "description") }} />

                  </ul>
                </div>
              </div>
              <div className="col-pricing-img">
             
                    <img src={getImage("step_1", "image")} alt="Our Vision"  />

              
              </div>
            </div>
            <div className="pricing-model-row pb-0 mb-0 border-0">
              <div className="col-pricing-text">
                <div className="left-text">
                  <span className="step-nbr">STEP 2</span>
                  <h3>{getContent("step_2", "heading")}</h3>
                </div>
              </div>
            </div>
            <div className="pricing-table-row">
              <div className="pricing-table-outer">
                <div className="pricing-table-heading">
                  <h4>{getContent("step_2", "subheading_1")}</h4>
                  <p>{getContent("step_2", "subheading_2")}</p>
                </div>
                {/* <div class="form-check form-switch">
                  <label
                    className={`form-check-label ${!isYearly ? "active" : ""}`}
                  >
                    Monthly
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switchCheckPrice"
                    checked={isYearly}
                    onChange={handleToggle}
                  />
                  <label
                    className={`form-check-label ${isYearly ? "active" : ""}`}
                  >
                    Yearly
                  </label>
                </div> */}
              </div>

              <div className="table-inner-row row">
                <div className="container py-4">
                  <div className="row">
                    {plans.length === 0 ? (
                      <p className="text-center">No plans found</p>
                    ) : (
                      plans.map((plan) => (
                        <div className="col-lg-3" key={plan.id}>
                          <div className="pricing-box">
                            <div className="pricing-label-outer">
                              <div className="pricing-info">
                                <h3 style={{ fontWeight: "500" }}>
                                  {plan?.plan_name}
                                </h3>


                                <h4>
                                  ${Math.floor(plan?.amount)} <span>USD</span>
                                </h4>
                                <span className="period">
                                  {plan.interval === "year" ? "year" : "month"}
                                </span>

                                {/* 👇 show monthly equivalent when plan is yearly */}
                                {plan.interval === "year" && (
                                  <p style={{ fontSize: "14px", color: "#6c757d", marginTop: "4px" }}>
                                    ≈ ${(plan.amount / 12).toFixed(2)} / month
                                  </p>
                                )}

                              </div>
                              <div className="bonus-box-outer">
                                <h5>+{plan?.bonus_credits}</h5>
                                <p>Monthly Bonus credits</p>
                              </div>
                            </div>

                            {/* Features Section */}
                            {/* Features Section */}
                            <div className="features-div-outer">
                              <div className="features-content-outer">
                                <button
                                  className="features-toggle-button"
                                  onClick={() => toggleFeatures(plan.id)}
                                >
                                  <span>Features </span>
                                  <img src={priceListIcon} alt="priceListIcon" />
                                </button>

                                <div
                                  className={`features-content mt-3 ${openFeature === plan.id ? "open" : ""
                                    }`}
                                >
                                  {/* Membership */}
                                  <h6 className="list-heading">Membership Includes:</h6>
                                  <ul className="check-list">
                                    {plan?.features?.membership?.length > 0 ? (
                                      plan.features.membership.map((item, i) => (
                                        <li key={i}>
                                          <img src={CheckIcon} alt="CheckIcon" />
                                          <span>{item}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <li>No membership features</li>
                                    )}
                                  </ul>

                                  {/* Creative */}
                                  <h6 className="creative-heading">CREATIVE</h6>
                                  <ul className="creative-list">
                                    {plan?.features?.creative?.length > 0 ? (
                                      plan.features.creative.map((item, i) => (
                                        <li key={i}>
                                          <img src={CheckIcon} alt="CheckIcon" />
                                          <span>{item}</span>
                                        </li>
                                      ))
                                    ) : (
                                      <li>No creative features</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>


                            {
                              get_polycarft_user_token ? (
                                <>
                                  {subscriptionData?.subscription?.stripe_status === "active" &&
                                    subscriptionData?.plan?.id === plan?.id ? (
                                    // ✅ CURRENT PLAN
                                    <button className="btn btn-primary w-100 mt-3" disabled>
                                      CURRENT PLAN
                                    </button>
                                  ) : subscriptionData?.subscription?.stripe_status === "active" &&
                                    subscriptionData?.plan?.id !== plan?.id ? (
                                    // ✅ CHANGE PLAN — only clicked one shows processing
                                    <button
                                      className="btn btn-primary w-100 mt-3"
                                      onClick={() => handleChangePlan(plan)}
                                      disabled={loadingPlanId === plan.id} // 👈 only disable current one
                                    >
                                      {loadingPlanId === plan.id ? "Processing..." : "UPGRDAE PLAN"}
                                    </button>
                                  ) : (
                                    // ✅ GET STARTED
                                    <button className="btn btn-primary w-100 mt-3">
                                      <Link
                                        to={`/pricing-details/${plan.id}`}
                                        state={{
                                          plan_name: plan.plan_name,
                                          amount: Math.floor(plan.amount),
                                          interval: plan.interval,
                                        }}
                                        style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                          display: "block",
                                          width: "100%",
                                          height: "100%",
                                        }}
                                      >
                                        GET STARTED
                                      </Link>
                                    </button>
                                    // <button
                                    //   className="btn btn-primary w-100 mt-3"
                                    //   onClick={() => handleStripeCheckout(plan)}
                                    // >
                                    //   GET STARTED
                                    // </button>

                                  )}
                                </>
                              ) : (
                                <button
                                  className="btn btn-primary w-100 mt-3"
                                  onClick={() => alert("Please login first")}
                                >
                                  GET STARTED
                                </button>
                              )
                            }



                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="book-call-btn">
          <div className="container-fluid">
            <div className="col-book-btn about-us">
              <button className="btn btn-primary" onClick={handleBookShow}>
                Book A Call
              </button>
              <Book_Call
                Bookshow={Bookshow}
                handleBookClose={handleBookClose}
              />
            </div>
          </div>
        </section>

        <section className="pricing-works px-85">
          <div className="container-fluid">
            <div className="col-pricing-works">
              <div className="pricing-works-box">
                {/* <h2>How it works</h2>
                <h6>Intelligent automation with a human touch</h6>
                <p>
                  Our 3D models, pre-designed video templates, and
                  high-performance rendering engine make it easy to produce
                  captivating videos that showcase your products in full detail.
                </p> */}
                <section>
                  <h2>{getContent("how_it_works", "heading")}</h2>
                  <p dangerouslySetInnerHTML={{ __html: getContent("how_it_works", "description") }} />
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
      {confirmModal.open && (
        <div className="modal-overlay1">
          <div className="modal-box1">
            <h3>Confirm Upgrade</h3>

            <p>
              We’ll switch you to the new plan instantly and charge the upgrade
              automatically. No extra checkout steps.
            </p>

            <div className="modal-buttons1">
              <button
                className="cancel-btn1"
                onClick={() => setConfirmModal({ open: false, plan: null })}
              >
                Cancel
              </button>

              <button
                className="btn-primary text-light"
                onClick={confirmUpgradePlan}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <Footer />
    </main>

  );
};

export default Pricing;
