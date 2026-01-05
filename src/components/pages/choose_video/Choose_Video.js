
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import tamplates from "../../../assets/images/tamplates.png";
import HeroVideo from "../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import Footer from "../../common/footer/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Get_video_templates_details } from "../../../api/global/Global";
import { User_add_to_cart } from "../../../api/cart/Cart";
import Header_Login from "../../common/header/Header_Login";
import { Get_User_Related_Details } from "../../../api/product/Product";
import NotepadIcon from "../../../assets/images/notepad.svg";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

const Choose_Video = () => {
  const params = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [templateDetail, setTemplateDetail] = useState(null);
  const [RelatedDetails, setRelatedDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRatios, setSelectedRatios] = useState([]);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [hoveredVideoUrl, setHoveredVideoUrl] = useState(null);
  const [hoverLoading, setHoverLoading] = useState(false);

  // ======================== FETCH MAIN TEMPLATE DETAILS ========================
  const handle_get_the_choose_details = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Get_video_templates_details(params.id);
      setTemplateDetail(data.data.data);
    } catch (err) {
      console.error("Failed to fetch template details:", err);
      setError("Failed to fetch template details");
    } finally {
      setLoading(false);
    }
  };

  // ======================== FETCH RELATED VIDEOS ========================
  const handle_get_the_Related_details = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Get_User_Related_Details(params.id);
      setRelatedDetails(data.data.data);
    } catch (err) {
      console.error("Failed to fetch related templates:", err);
      setError("Failed to fetch related templates");
    } finally {
      setLoading(false);
    }
  };

  // ======================== ON MOUNT ========================
  useEffect(() => {
    if (params.id) {
      handle_get_the_choose_details();
      handle_get_the_Related_details();
    }
  }, [params.id]);

  // ======================== SELECT ASPECT RATIOS ========================
  useEffect(() => {
    if (
      templateDetail?.available_aspect_ratios?.length > 0 &&
      selectedRatios.length === 0
    ) {
      setSelectedRatios([templateDetail.available_aspect_ratios[0]]);
    }
  }, [templateDetail]);

  const handleRatioChange = (ratio) => {
    setSelectedRatios((prev) =>
      prev.includes(ratio)
        ? prev.filter((item) => item !== ratio)
        : [...prev, ratio]
    );
  };

  // ======================== CALCULATE PRICE ========================
  const basePrice = parseFloat(templateDetail?.base_price) || 0;
  const additionalPrice = parseFloat(templateDetail?.additional_video_selection_price) || 0;
  const allVideoPrice = parseFloat(templateDetail?.all_video_selection_price) || 0;

  const totalRatios = templateDetail?.available_aspect_ratios?.length || 0;
  const selectedCount = selectedRatios.length;

  // ✅ If all ratios selected → use all_video_selection_price
  let totalPrice;

  if (selectedCount === totalRatios && totalRatios > 0) {
    totalPrice = allVideoPrice;
  } else {
    const extraSelections = selectedCount > 1 ? selectedCount - 1 : 0;
    totalPrice = basePrice + additionalPrice * extraSelections;
  }


  // ======================== ADD TO CART ========================
  const handle_add_to_cart = async () => {
    try {
      if (!templateDetail?.id) {
        alert("Product not found!");
        return;
      }
      if (selectedRatios.length === 0) {
        alert("Please select at least one aspect ratio.");
        return;
      }

      const payload = {
        product_id: templateDetail.id,
        aspect_ratios: selectedRatios,
      };

      const response = await User_add_to_cart(payload);
      alert("Video added to cart");
      navigate(`/upload-products`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      const data = error?.response?.data || error?.data || {};
      if (data.errors?.product_id?.length > 0) {
        alert(data.errors.product_id[0]);
      } else if (data.message) {
        alert(data.message);
      } else {
        alert("Failed to add to cart");
      }
    }
  };

  // ======================== VIDEO AUTOPLAY ========================
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, []);

  // ======================== SCROLL TO TOP ========================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  // ======================== HANDLE HOVER VIDEO ========================
  const handleHoverEnter = async (itemId) => {
    setHoveredItemId(itemId);
    setHoverLoading(true);
    setHoveredVideoUrl(null);
    try {
      const response = await Get_video_templates_details(itemId);
      const url = response?.data?.data?.video_url;
      if (url) setHoveredVideoUrl(url);
    } catch (err) {
      console.error("Error fetching hover video:", err);
    } finally {
      setHoverLoading(false);
    }
  };

  const handleHoverLeave = () => {
    setHoveredItemId(null);
    setHoveredVideoUrl(null);
  };

  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const renderSwiperDesktop = () => (
    <div className="row image-row">
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
            0: { slidesPerView: 1.00 },
            576: { slidesPerView: 1.00 },
            768: { slidesPerView: 2.00 },
            1025: { slidesPerView: 4.99 },
            1450: { slidesPerView: 5.00 },
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.params.pagination.el = paginationRef.current;
          }}
        >
          {RelatedDetails.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <div
                className="img-box"
                style={{ position: "relative" }}
                onMouseEnter={() => handleHoverEnter(item.id)}
                onMouseLeave={handleHoverLeave}
              >
                <img
                  src={item.video_image_url}
                  alt={item.video_name}
                  className="inner-pic"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />

                {hoveredItemId === item.id && (
                  <div
                    className="template-mobile-modal"
                    style={{
                      position: "absolute",
                      top: "-50px",
                      left: "50%",
                      transform: "translateX(-50%)",
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
                        <h5 className="list-heading">Things you can change</h5>
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
                        <h6 className="desc-heading">Available aspect ratio</h6>
                        <p className="aspect-desc">
                          1:1 (1080x1080), 9:16 (1080x1920), 16:9 (1920x1080), 4:5
                          (1080x1350)
                        </p>
                        <div
                          className="text-end"
                          onClick={() => {
                            localStorage.setItem("cart_item_id", `${item?.id}`);
                            navigate(`/choose-video/${item?.id}`);
                          }}
                        >
                          <Link className="btn btn-primary">View details</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
      {RelatedDetails?.map((item) => (
        <SwiperSlide key={item.id} style={{ width: "270px" }}>
          <div
            onClick={() => {
              localStorage.setItem("cart_item_id", `${item?.id}`);
              navigate(`/choose-video/${item?.id}`);
            }}
            className="img-box open-modal"
            style={{ position: "relative" }}
          >
            <video src={item.video_url} className="inner-pic" autoPlay loop muted playsInline
              webkit-playsinline="true"
              preload="auto" />
            <h6>{item.video_name}</h6>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );

  // ======================== RENDER ========================
  return (
    <main>
      <Header_Login />

      <div className="content-outer">
        {/* ------------------- MAIN VIDEO SECTION ------------------- */}
        <section className="choose-video-sec px-85">
          <div className="container-fluid">
            <div className="choose-video-outer">
              <div className="heading">Video {templateDetail?.video_number}</div>

              <div className="choose-video-left">
                <div className="left-video">
                  <div className="video-outer">
                    {templateDetail?.video_url && (
                      <video
                        ref={videoRef}
                        poster={templateDetail?.video_image_url}
                        muted
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                        controls
                      >
                        <source
                          src={templateDetail?.video_url}
                          type="video/mp4"
                        />
                      </video>
                    )}
                  </div>
                </div>

                <div className="video-info-outer">
                  <div className="credit-div">
                    <div className="head">
                      <div className="price">
                        <span>Credits</span>
                        <h6>{totalPrice.toFixed(2)}</h6>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={handle_add_to_cart}
                      >
                        Add to Cart
                      </button>
                    </div>

                    <div className="aspect-ratio">
                      <h6>Select aspect ratio</h6>
                      <ul>
                        {templateDetail?.available_aspect_ratios?.map(
                          (ratio, index) => (
                            <li key={index}>
                              <input
                                type="checkbox"
                                className="btn-check"
                                id={`btn-check-${index}`}
                                autoComplete="off"
                                checked={selectedRatios.includes(ratio)}
                                onChange={() => handleRatioChange(ratio)}
                              />
                              <label
                                className="btn"
                                htmlFor={`btn-check-${index}`}
                              >
                                {ratio}
                              </label>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="video-desc">
                    <h6 className="fw-semibold">Video Description:</h6>
                    <p className="fw-medium">{templateDetail?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="idea-section px-85">
          <div className="container-fluid">
            <div className="your-ideas-box">
              <div className="col-video">
                <video controls muted playsInline
                  webkit-playsinline="true"
                  preload="auto">
                  <source src={HeroVideo} />
                </video>
              </div>
              <div className="col-text">
                <h2>See how Polycrafts brings your ideas to life!</h2>
                <p>
                  Watch this video to see how you can use Polycrafts to create
                  stunning custom 3D ads that elevates your brand.
                </p>
                <h6>What can be customized</h6>
                <ul>
                  <li>
                    <button>Products</button>
                  </li>
                  <li>
                    <button>Environments</button>
                  </li>
                  <li>
                    <button>Colors</button>
                  </li>
                  <li>
                    <button>Ingredients</button>
                  </li>
                  <li>
                    <button>Multiple Products</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------- RELATED TEMPLATES SECTION ------------------- */}
        <section className="image-slider pt-0">
          <div className="container-fluid">
            <span className="like-text">You may also like</span>
            <div className="row head-row">
              <div className="col-lg-6 col-9">
                <div className="headings">
                  <h2>Related Templates</h2>
                  {/* <p>Each template is valued at 250 credits.</p> */}
                </div>
              </div>

              <div className="col-lg-6 col-3">
                <div className="swiper-custom-nav">
                  <button ref={prevRef} className="custom-button">‹</button>
                  <div ref={paginationRef} className="custom-pagination"></div>
                  <button ref={nextRef} className="custom-button">›</button>
                </div>
              </div>
            </div>

            <div className="row image-row">
              <div className="image-slider-outer login-home">
                {/* {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : RelatedDetails.length === 0 ? (
                  <p>No related videos found</p>
                ) : (
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
                      0: { slidesPerView: 1.00 },
                      576: { slidesPerView: 1.00 },
                      768: { slidesPerView: 2.00 },
                      1025: { slidesPerView: 4.99 },
                      1450: { slidesPerView: 5.00 },
                    }}
                    onBeforeInit={(swiper) => {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.params.pagination.el = paginationRef.current;
                    }}
                  >
                    {RelatedDetails.map((item, index) => (
                      <SwiperSlide key={item.id || index}>
                        <div
                          className="img-box"
                          style={{ position: "relative" }}
                          onMouseEnter={() => handleHoverEnter(item.id)}
                          onMouseLeave={handleHoverLeave}
                        >
                          <img
                            src={item.video_image_url}
                            alt={item.video_name}
                            className="inner-pic"
                            style={{
                              width: "100%",
                              borderRadius: "8px",
                              display: "block",
                            }}
                          />

                          {hoveredItemId === item.id && (
                            <div
                              className="template-mobile-modal"
                              style={{
                                position: "absolute",
                                top: "-50px",
                                left: "50%",
                                transform: "translateX(-50%)",
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
                                  <h5 className="list-heading">Things you can change</h5>
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
                                  <h6 className="desc-heading">Available aspect ratio</h6>
                                  <p className="aspect-desc">
                                    1:1 (1080x1080), 9:16 (1080x1920), 16:9 (1920x1080), 4:5
                                    (1080x1350)
                                  </p>
                                  <div
                                    className="text-end"
                                    onClick={() => {
                                      localStorage.setItem("cart_item_id", `${item?.id}`);
                                      navigate(`/choose-video/${item?.id}`);
                                    }}
                                  >
                                    <Link className="btn btn-primary">View details</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )} */}
                {isMobile
                  ? renderSwiperMobile()
                  : renderSwiperDesktop()
                }

              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default Choose_Video;
