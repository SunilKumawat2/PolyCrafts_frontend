import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import VisionImg from "../../../assets/images/vision.jpg";
import MissionImg from "../../../assets/images/mission.jpg";
import ReachStartImg from "../../../assets/images/about-start-img.png";
import { Link } from 'react-router-dom';
import Book_Call from '../../common/book_call_popup/Book_Call';
import Reach_Us_Form from '../../common/reach_out_form/Reach_Us_Form';
import Header_Login from '../../common/header/Header_Login';
import { Get_Global_About_us_content, Get_Global_Page_content, Get_Global_seo_content } from '../../../api/global/Global';
import DynemicSeo_About from '../../../seo/DynemicSeo_About';
import { useLoginModal } from "../../../context/LoginModalContext";




const About = () => {
  const token = localStorage.getItem("polycarft_user_token");
  const [Bookshow, setBookShow] = useState(false);
  const [pageContent, setPageContent] = useState({});
  const [vision, setVision] = useState(null);
  const [mission, setMission] = useState(null);
  const handleBookShow = () => setBookShow(true);
  const handleBookClose = () => setBookShow(false);
  const { setLoginShow } = useLoginModal();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  // ✅ Fetch SEO content dynamically
  useEffect(() => {
    const fetchSEOContent = async () => {
      try {
        const res = await Get_Global_Page_content("about");
        const contentArray = res?.data?.data || [];

        // Convert to structured format grouped by section
        const structuredData = contentArray.reduce((acc, item) => {
          if (!acc[item.section_key]) acc[item.section_key] = {};

          acc[item.section_key][item.content_key] = item.content_value;

          return acc;
        }, {});

        setPageContent(structuredData);

        // Set hero, vision, and mission
        setVision({
          title: structuredData?.our_vision?.heading || "",
          description: structuredData?.our_vision?.description || "",
          image_url: structuredData?.our_vision?.image || "",
        });

        setMission({
          title: structuredData?.our_mission?.heading || "",
          description: structuredData?.our_mission?.description || "",
          image_url: structuredData?.our_mission?.image || "",
        });

      } catch (error) {
        console.error("Error fetching About content:", error);
      }
    };

    fetchSEOContent();
  }, []);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      const visionRes = await Get_Global_About_us_content("our_vision");
      const missionRes = await Get_Global_About_us_content("our_mission");

      if (visionRes?.data?.status) setVision(visionRes.data.data);
      if (missionRes?.data?.status) setMission(missionRes.data.data);

    } catch (error) {
      console.error("Failed to load About Us data:", error);
    }
  };

  return (

    <main className="about-page">
  <DynemicSeo_About pageKey="about" />
      {/* ===== HEADER ===== */}
      {
        token ? (
          <Header_Login />
        ) : (

          <Header />
        )
      }
      <div className='content-outer'>

        <section className='about-banner px-85'>
          <div className="container-fluid">
            <div className='row banner-row'>
              <div className="col-about-banner">
                <div className='page-heading'>

                  <h1>{pageContent?.hero?.heading || "Loading..."}</h1>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: pageContent?.hero?.description || ""
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>



        <section className='about-content-sec px-85'>
          <div className="container-fluid">
            {/* VISION SECTION */}
            {vision && (
              <div className="about-content-row">
                <div className="col-text-box">
                  <div className="text-box">
                    <h2>{vision.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: vision.description }} />
                  </div>
                </div>

                <div className="col-img-box">
                  <img src={vision.image_url || VisionImg} alt="Our Vision" />
                </div>
              </div>
            )}


            {/* MISSION SECTION */}
            {mission && (
              <div className="about-content-row">
                <div className="col-img-box">
                  <img src={mission.image_url || MissionImg} alt="Our Mission" />
                </div>

                <div className="col-text-box">
                  <h2>{mission.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: mission.description }} />
                </div>
              </div>
            )}


          </div>
        </section>
        {
          !token && (
            <section className="px-85">
              <div className="container-fluid">
                <div className='ready-start-bg'>
                  <div className='reach-start-row'>
                    <div className='reach-start-text'>
                      <h2 className='gradient-text'>Ready to Start Creating?</h2>
                      <p>Sign up for a free account or explore our membership plans to unlock the full Poly Craft experience.</p>
                      {/* <Link to='#' className='btn btn-primary'>
                        Let's Start
                      </Link> */}
                      <Link
              to="#"
              className="btn btn-primary"
              onClick={() => setLoginShow(true)}
            >
              Let's Start
            </Link>
                    </div>
                    <div className='reach-start-img'>
                      <img src={ReachStartImg} alt="ReachStartImg" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        }


        <section className='book-call-btn'>
          <div className="container-fluid">
            <div className='col-book-btn about-us'>
              <button className='btn btn-primary' onClick={handleBookShow}>
                Book A Call
              </button>
              <Book_Call Bookshow={Bookshow} handleBookClose={handleBookClose} />
            </div>
          </div>
        </section>

        <Reach_Us_Form />
      </div>

      {/* <Footer /> */}
    </main>

  )
}

export default About