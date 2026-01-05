import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WorksVideo from "../../../../src/assets/images/HomePage_Gif_02 - 3420x420.mp4";
import HeroVideo from "../../../../src/assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import HeroVideo_thumbnail from "../../../../src/assets/images/Home_Page_Intro_002 - thumbnail.jpg";
import { Get_Global_Page_content, Get_Global_seo_content } from "../../../api/global/Global";
import { useLoginModal } from "../../../context/LoginModalContext"; // ✅ import context

const Herosection = () => {
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();
  const { setLoginShow } = useLoginModal(); // ✅ get modal control from context
  const get_polycarft_user_token = localStorage.getItem("polycarft_user_token")
  const handleBuyCredits = () => {
    // ✅ store the redirect path temporarily
    localStorage.setItem("redirect_after_login", "/purchase");

    // ✅ open login modal
    setLoginShow(true);
  };

  const handleAfterLoginBuyCredits = () => {
    navigate("/purchase")
  };

  // ✅ Fetch SEO content dynamically
  useEffect(() => {
    const fetchSEOContent = async () => {
      try {
        const res = await Get_Global_Page_content("home");
        const contentArray = res?.data?.data || [];

        // Convert array → object { heading: '', description: '' }
        const formattedData = contentArray.reduce((acc, item) => {
          acc[item.content_key] = item.content_value;
          return acc;
        }, {});

        setSeoData(formattedData);
      } catch (error) {
        console.error("Error fetching SEO content:", error);
      }
    };

    fetchSEOContent();
  }, []);

  return (
    <>
      <section className="hero-section px-85">
        <div className="container-fluid">
          <div className="row hero-row">
            <div className="col-hero-text">
              <div className="hero-text">
                {/* ✅ Dynamic Title */}
                <h1>{seoData?.heading || "Loading..."}</h1>

                <p
                  dangerouslySetInnerHTML={{
                    __html: seoData?.description || "Loading description...",
                  }}
                ></p>

                {
                  get_polycarft_user_token ? (
                    <button
                      onClick={handleAfterLoginBuyCredits}
                      className="btn btn-primary"
                      type="button"
                    >
                      Buy credits
                    </button>
                  ) : (
                    <button
                      onClick={handleBuyCredits}
                      className="btn btn-primary"
                      type="button"
                    >
                      Buy credits
                    </button>
                  )
                }


                <span className="mini-msg">
                  Get 50 free credits when you sign up for your first template!
                </span>
              </div>
            </div>

            <div className="col-video-text">
              <div className="hero-video">
                <video controls muted playsInline
                  webkit-playsinline="true"
                  preload="auto" poster={HeroVideo_thumbnail}>
                  <source src={HeroVideo} />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-works-video px-85">
        <div className="container-fluid">
          <div className="video-outer">
            {/* <video autoPlay loop muted playsInline>
              <source src={WorksVideo} />
            </video> */}
            <video
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              preload="auto"
            >
              <source src={WorksVideo} type="video/mp4" />
            </video>

          </div>
        </div>
      </section>
    </>
  );
};

export default Herosection;
