import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import NotepadIcon from "../../../../assets/images/notepad.svg";
import { Link, useNavigate } from "react-router-dom";
import { Get_video_templates, Get_video_templates_details } from "../../../../api/global/Global";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const Template_Slider = () => {
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  const [sections, setSections] = useState([]);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [hoveredSectionId, setHoveredSectionId] = useState(null);
  const [hoveredVideoUrl, setHoveredVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);



  // Fetch all templates sections
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await Get_video_templates();
        if (res?.data?.status) {
          setSections(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };
    fetchTemplates();
  }, []);

  // Fetch video details for hovered item
  const handleHover = async (itemId, sectionId) => {
    setHoveredItemId(itemId);
    setHoveredSectionId(sectionId);
    setHoveredVideoUrl(null);
    setLoading(true);
    try {
      const res = await Get_video_templates_details(itemId);
      if (res?.data?.status) {
        setHoveredVideoUrl(res.data.data.video_url);
      }
    } catch (err) {
      console.error("Video fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderSwiperDesktop = (templates, sectionId) => (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={5.65}
      spaceBetween={24}
      navigation={{
        prevEl: prevRef.current,
        nextEl: nextRef.current,
      }}
      pagination={{
        el: paginationRef.current,
        clickable: true,
      }}
      breakpoints={{
        0: { slidesPerView: 1.0 },
        576: { slidesPerView: 1.0 },
        768: { slidesPerView: 2.0 },
        1025: { slidesPerView: 4.99 },
        1450: { slidesPerView: 5.0 },
      }}
      onBeforeInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.params.pagination.el = paginationRef.current;
      }}
    >
      {templates?.map((item) => (
        <SwiperSlide key={item.id}>
          <div
            className="img-box open-modal"
            onMouseEnter={() => handleHover(item.id, sectionId)}
            onMouseLeave={() => {
              setHoveredItemId(null);
              setHoveredSectionId(null);
              setHoveredVideoUrl(null);
            }}
            style={{ position: "relative" }}
          >
            <img src={item.video_image_url} alt={item.video_name} className="inner-pic" />
            <h6>{item.video_name}</h6>

            {hoveredItemId === item.id && hoveredSectionId === sectionId && (
              <div
                className="template-mobile-modal hover-popup"
                style={{
                  position: "absolute",
                  top: "-50px",
                  left: "0%",
                  width: "600px",
                  height: "350px",
                  background: "#ffffff45",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  zIndex: 100,
                  transition: "all 0.3s ease",
                  padding: "16px",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="template-mobile-video"
                  style={{
                    width: "70%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    padding: "4px",
                    height: "100%",
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      Loading video...
                    </div>
                  ) : hoveredVideoUrl ? (
                    // <video
                    //   src={hoveredVideoUrl}
                    //   style={{
                    //     width: "100%",
                    //     height: "100%",
                    //     objectFit: "cover",
                    //     backgroundColor: "#000",
                    //     borderRadius: "8px",
                    //   }}
                    //   autoPlay
                    //   loop
                    //   muted
                    // />
                    <video
                      src={hoveredVideoUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundColor: "#000",
                        borderRadius: "8px",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      webkit-playsinline="true"
                      preload="auto"
                    />

                  ) : (
                    <img
                      src={item.video_image_url}
                      alt={item.video_name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  )}
                </div>

                {/* <div
                  className="template-mobile-text-outer"
                  style={{
                    width: "30%",
                    paddingLeft: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <h5 className="list-heading">Things you can change</h5>
                  <ul>
                    <li><img src={NotepadIcon} /><span>Product & Ingredients</span></li>
                    <li><img src={NotepadIcon} /><span>Background / Colors</span></li>
                    <li><img src={NotepadIcon} /><span>Text</span></li>
                  </ul>
  
                  <h6 className="desc-heading">Available aspect ratio</h6>
                  <p className="aspect-desc">
                    1:1, 9:16, 16:9, 4:5
                  </p>
  
                  <div
                    className="text-end"
                    onClick={() => {
                      localStorage.setItem("cart_item_id", `${item.id}`);
                      navigate(`/choose-video/${item.id}`);
                    }}
                  >
                    <Link className="btn btn-primary">View details</Link>
                  </div>
                </div> */}

                <div
                  className="template-mobile-text-outer"
                  style={{
                    width: "30%",
                    paddingLeft: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="template-modal-text">
                    <h5 className="list-heading">Things you can change</h5>
                    <ul>
                      <li>
                        <img src={NotepadIcon} alt="" />{" "}
                        <span>Product & Ingredients</span>
                      </li>
                      <li>
                        <img src={NotepadIcon} alt="" />{" "}
                        <span>Background / Colors</span>
                      </li>
                      <li>
                        <img src={NotepadIcon} alt="" /> <span>Text</span>
                      </li>
                    </ul>

                    <h6 className="desc-heading">
                      Available aspect ratio
                    </h6>
                    <p className="aspect-desc">
                      1:1 (1080x1080), 9:16 (1080x1920), 16:9 (1920x1080),
                      4:5 (1080x1350)
                    </p>

                    <div
                      className="text-end"
                      onClick={() => {
                        localStorage.setItem("cart_item_id", `${item.id}`);
                        navigate(`/choose-video/${item.id}`);
                      }}
                    >
                      <Link className="btn btn-primary">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );


  const renderSwiperMobile = (templates, sectionId) => (
    <Swiper
      modules={[Navigation, Pagination, EffectCoverflow]}
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      spaceBetween={24}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      }}
      navigation={{
        prevEl: prevRef.current,
        nextEl: nextRef.current,
      }}
      pagination={{
        el: paginationRef.current,
        clickable: true,
      }}
      onBeforeInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.params.pagination.el = paginationRef.current;
      }}
    >
      {templates?.map((item) => (
        <SwiperSlide key={item.id} style={{ width: "270px" }}>
          <div
            onClick={() => {
              localStorage.setItem("cart_item_id", `${item.id}`);
              navigate(`/choose-video/${item.id}`);
            }}
            className="img-box open-modal"
            style={{ position: "relative" }}
          >
            {/* <video src={item.video_url} className="inner-pic" autoPlay loop muted /> */}
            <video
              src={item.video_url}
              className="inner-pic"
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              preload="auto"
            />

            <h6>{item.video_name}</h6>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );



  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="image-slider pt-0">
          <div className="container-fluid">
            {/* Header */}
            <div className="row head-row">
              <div className="col-lg-6 col-9">
                <div className="headings">
                  <h2>{section.heading}</h2>
                  <p>{section.subheading}</p>
                </div>
              </div>
              <div className="col-lg-6 col-3">
                <div className="swiper-custom-nav">
                  <button ref={prevRef} className="custom-button">
                    <svg width="16" height="16" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 1.96141L2 13.4999L14 25.0383" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div ref={paginationRef} className="custom-pagination"></div>
                  <button ref={nextRef} className="custom-button">
                    <svg width="16" height="16" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 25L14 13.5L2 2" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Swiper Row */}
            <div className="row image-row">
              <div className="image-slider-outer login-home">
                {isMobile
                  ? renderSwiperMobile(section.video_templates, section.id)
                  : renderSwiperDesktop(section.video_templates, section.id)
                }
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default Template_Slider;
