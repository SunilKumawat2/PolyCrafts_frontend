import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import NotepadIcon from "../../../../assets/images/notepad.svg";
import { Link, useNavigate } from "react-router-dom";
import "../../../../assets/css/custom.css";
import {
  Get_video_templates,
  Get_video_templates_details,
} from "../../../../api/global/Global";

const Tamplates_Sections = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [hoveredVideoUrl, setHoveredVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await Get_video_templates();
        if (res?.data?.status && res?.data?.data) {
          const allVideos = res.data.data.flatMap(
            (item) => item.video_templates || []
          );
          setTemplates(allVideos);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // ✅ Hover handler (fetch only when a new template is hovered)
  const handleHover = async (template) => {
    if (hoveredTemplate?.id === template.id) return; // prevent duplicate modals
    setHoveredTemplate(template);
    setHoveredVideoUrl(null);
    setLoading(true);

    try {
      const res = await Get_video_templates_details(template.id);
      if (res?.data?.status) {
        setHoveredVideoUrl(res.data.data.video_url);
      }
    } catch (err) {
      console.error("Video fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTemplate(null);
    setHoveredVideoUrl(null);
  };

  const handle_details_tamplates = (id) => {
    const token = localStorage.getItem("polycarft_user_token");
    if (!token) {
      alert("Please login first!");
      localStorage.setItem("redirect_after_login", `/choose-video/${id}`);
      localStorage.setItem("cart_item_id", `${id}`);
    } else {
      localStorage.setItem("cart_item_id", `${id}`);
      navigate(`/choose-video/${id}`);
    }
  };

  // ✅ Group in rows of 3
  const groupedSlides = Array.from({
    length: Math.ceil(templates.length / 3),
  }).map((_, colIndex) => templates.slice(colIndex * 3, colIndex * 3 + 3));

  const renderSwiperDesktop = () => (
    <div className="row image-row">
      <div className="image-slider-outer">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={5}
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
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1600: { slidesPerView: 6 },
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.params.pagination.el = paginationRef.current;
          }}
        >
          {groupedSlides.map((group, colIndex) => (
            <SwiperSlide key={colIndex}>
              <div className="multi-row-column">
                {group.map((template) => (
                  <div
                    key={template.id}
                    className="img-box open-modal"
                    onMouseEnter={() => handleHover(template)}
                    onMouseLeave={handleMouseLeave}
                    style={{ position: "relative" }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={template.video_image_url}
                      alt={template.video_name}
                      className="inner-pic"
                    />

                    {/* Hover video popup */}
                    {hoveredTemplate?.id === template.id && (
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
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Left side: Video */}
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
                            <div style={{ fontSize: "16px", fontWeight: 500 }}>
                              Loading video...
                            </div>
                          ) : hoveredVideoUrl ? (
                            // <video
                            //   src={hoveredVideoUrl}
                            //   autoPlay
                            //   loop
                            //   muted
  //                           playsInline
  // webkit-playsinline="true"
  //                         preload="auto"
                            //   style={{
                            //     width: "100%",
                            //     height: "100%",
                            //     objectFit: "cover",
                            //     backgroundColor: "#000",
                            //     borderRadius: "8px",
                            //   }}
                            // />
                            < video
                              src={hoveredVideoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          webkit-playsinline="true"
                          preload="auto"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            backgroundColor: "#000",
                            borderRadius: "8px",
                          }}
                            />

                          ) : (
                          <img
                            src={template.video_image_url}
                            alt={template.video_name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                          )}
                        </div>

                        {/* Right side: Text */}
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
                              onClick={() =>
                                handle_details_tamplates(template.id)
                              }
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
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );



  const renderSwiperMobile = () => (
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
            onClick={() =>
              handle_details_tamplates(item.id)
            }
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
            />

            <h6>{item.video_name}</h6>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );



  return (
    <section className="image-slider">
      <div className="container-fluid">
        <div className="section-heading">
          <h2>
            <b>Want to see more?</b> <span>Login</span> to view all templates
          </h2>
        </div>

        <div className="row head-row">
          <div className="col-lg-6 col-9">
            <div className="headings">
              <h2>Custom Lighting & Unboxing</h2>
              <p>
                Create custom 3D ads that are as unique as your brand with
                Polycrafts.
              </p>
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

        {/* ✅ Swiper */}
        {/* <div className="row image-row">
          <div className="image-slider-outer">
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
                0: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
                1600: { slidesPerView: 6 },
              }}

              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.params.pagination.el = paginationRef.current;
              }}
            >
              {groupedSlides.map((group, colIndex) => (
                <SwiperSlide key={colIndex}>
                  <div className="multi-row-column">
                    {group.map((template) => (
                      <div
                        key={template.id}
                        className="img-box open-modal"
                        onMouseEnter={() => handleHover(template)}
                        onMouseLeave={handleMouseLeave}
                        style={{ position: "relative" }}
                      >
                        <img
                          src={template.video_image_url}
                          alt={template.video_name}
                          className="inner-pic"
                        />

                        {hoveredTemplate?.id === template.id && (
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
                              backdropFilter: "blur(20px)"
                            }}
                            onMouseLeave={handleMouseLeave}
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
                                height: "100%"
                              }}
                            >
                              {loading ? (
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Loading video...
                                </div>
                              ) : hoveredVideoUrl ? (
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
                                />
                              ) : (
                                <img
                                  src={template.video_image_url}
                                  alt={template.video_name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              )}
                            </div>

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
                                <h5 className="list-heading">
                                  Things you can change
                                </h5>
                                <ul>
                                  <li>
                                    <img src={NotepadIcon} alt="" />
                                    <span>Product & Ingredients</span>
                                  </li>
                                  <li>
                                    <img src={NotepadIcon} alt="" />
                                    <span>Background / Colors</span>
                                  </li>
                                  <li>
                                    <img src={NotepadIcon} alt="" />
                                    <span>Text</span>
                                  </li>
                                </ul>

                                <h6 className="desc-heading">
                                  Available aspect ratio
                                </h6>
                                <p className="aspect-desc">
                                  1:1 (1080x1080), 9:16 (1080x1920), 16:9
                                  (1920x1080), 4:5 (1080x1350)
                                </p>

                                <div
                                  className="text-end"
                                  onClick={() =>
                                    handle_details_tamplates(template.id)
                                  }
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
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div> */}

        <div className="row image-row">
          <div className="image-slider-outer">

            {isMobile
              ? renderSwiperMobile()
              : renderSwiperDesktop()
            }

          </div>
        </div>
      </div>
    </section>
  );
};

export default Tamplates_Sections;
