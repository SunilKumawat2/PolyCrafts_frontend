import React, { useEffect, useRef, useState } from "react";
import Footer from "../../common/footer/Footer";
import HeroVideo from "../../../assets/images/How it works - 1280x720.mp4";
import HeroVideo_thumbnail from "../../../assets/images/How it works - 1280x720.mp4";
import DltIcon from "../../../assets/images/dlt-modal-icon.svg";
import TrashIcon from "../../../assets/images/trash.svg";
import UploadIcon from "../../../assets/images/uplaod-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { CloseButton, Modal } from "react-bootstrap";
import Header_Login from "../../common/header/Header_Login";
import {
  User_Delete_Cart_Item,
  User_Get_Cart_list,
} from "../../../api/cart/Cart";

const Upload_Products = () => {
  const [Dltshow, setDltShow] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const get_cart_item_id = localStorage.getItem("cart_item_id");

  const [Bookshow, setBookShow] = useState(false);

  const handleBookShow = () => setBookShow(true);
  const handleBookClose = () => setBookShow(false);

  const navigate = useNavigate();
  // Close modal and reset ID
  const handleDltClose = () => {
    setDltShow(false);
    setDeleteId(null);
  };

  const handleDltShow = (item) => {
    setDltShow(true);
    setSelectedItem(item);
    // setDeleteId(null);
  };

  const handle_delete_cart_list = async (id) => {
    try {
      const res = await User_Delete_Cart_Item(id);
      if (res?.data?.status) {
        // Remove from frontend state also
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        setDltShow(false);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await User_Get_Cart_list();
        if (res?.data?.status) {
          setCartItems(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  const videoRef = useRef(null);

  useEffect(() => {
    // Autoplay the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        // Browser may block autoplay if not muted
        console.log("Autoplay prevented:", err);
      });
    }
  }, []);

  return (
    <>
      <main className="upload-products-page">
        {/* ===== HEADER ===== */}
        <Header_Login />
        <div className='content-outer'>
          {/* ========== My Profile start ======= */}

          <section className="upload-products-section px-85">
            <div className="container-fluid">
              <div className="row upload-row">
                <div className="col-uplaod-form">
                  <div className="upload-form">
                    <div className="heading">Checkout</div>
                    <div className="step-actions">
                      <div className="inner-step active">
                        <span className="nbr">1</span>
                        <div className="">
                          <h6>Upload products</h6>
                          <p>Images & 3D models</p>
                        </div>
                        <span className="border-line"></span>
                      </div>
                      <div className="inner-step">
                        <span className="nbr">2</span>
                        <div className="">
                          <h6>Payment details</h6>
                          <p>Review payment & checkout</p>
                        </div>
                      </div>
                    </div>
                    <div className="cart-div">
                      <h3>Upload products ({cartItems.length})</h3>

                      {cartItems?.length > 0 ? (
                        cartItems?.map((item) => (
                          <div className="single-cart-product" key={item.id}>
                            {/* Left Side Image */}
                            <div className="left-image">
                              <img
                                src={item?.product?.video_image_url}
                                alt={item?.product?.video_name}
                              />
                            </div>

                            {/* Right Side Info */}
                            <div className="right-info">
                              <div className="head">
                                <div className="name-outer">
                                  <div className="name">
                                    <h6 className="info-title">
                                      {item?.product?.video_name}
                                    </h6>
                                    <p>{item?.product?.video_number}</p>
                                  </div>

                                  <div className="credits-info">
                                    <h6 className="info-title">Credits</h6>
                                    <p>
                                      {Number(item?.price) % 1 === 0
                                        ? Number(item?.price)
                                        : item?.price}{" "}
                                      {/* <span>
                                      {Number(item?.price) % 1 === 0
                                        ? Number(item?.price)
                                        : item?.price}
                                    </span> */}
                                    </p>
                                  </div>
                                </div>

                                <div className="credits-dlt">
                                  <div className="aspect-div">
                                    <h6 className="info-title">
                                      Aspect ratio selected
                                    </h6>
                                    <ul>
                                      {item?.aspect_ratios?.map((ratio, idx) => (
                                        <li key={idx}>{ratio}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <button
                                    className="dlt-btn"
                                    onClick={() => handleDltShow(item)}
                                  >
                                    <img src={TrashIcon} alt="Delete" />
                                  </button>
                                </div>
                              </div>

                              <div className="upload-action">
                                <h6 className="info-title mb-0">
                                  Upload product
                                </h6>
                                <p>
                                  Please upload your product to complete the
                                  checkout.
                                </p>
                                <div
                                  className="upload-btn-outer"
                                  onClick={() => {
                                    localStorage.setItem(
                                      "cart_item_id",
                                      item?.id
                                    );
                                    localStorage.setItem(
                                      "cart_cardit_price",
                                      item?.price
                                    );
                                    localStorage.setItem(
                                      "cart_cardit_video_name",
                                      item?.product?.video_name
                                    );

                                    // Store only available_aspect_ratios as a string
                                    localStorage.setItem(
                                      "cart_available_aspect_ratios",
                                      JSON.stringify(item?.aspect_ratios)
                                    );

                                    navigate(`/upload-3d-modal`, {
                                      state: { item },
                                    });
                                  }}
                                >
                                  <Link
                                    // to="/upload-3d-modal"
                                    className="btn btn-primary"
                                  >
                                    <span className="me-2"> Upload </span>
                                    <img src={UploadIcon} alt="Upload" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No items in the cart.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-uplaod-video">
                  {/* Static video (if needed) */}
                  <video controls muted playsInline
                    webkit-playsinline="true"
                    preload="auto">
                    <source src={HeroVideo} type="video/mp4" />
                  </video>

                  {/* Dynamic videos from API */}
                  {/* {cartItems?.length > 0 &&
                                    cartItems?.map((item) => (
                                        <video
                                            key={item?.id}
                                            ref={videoRef}
                                            poster={item?.product?.video_image_url} // thumbnail
                                            muted
                                            playsInline
                                            controls// optional styling
                                        >
                                            <source src={item?.product?.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ))} */}
                </div>
              </div>
            </div>
          </section>

          <section className="back-upload-btn px-85">
            <div className="container-fluid">
              <div className="col-back-btn">
                <Link
                  to={`/choose-video/${get_cart_item_id}`}
                  className="btn btn-primary"
                >
                  Back
                </Link>
              </div>
            </div>
          </section>
          {/* ========== My Profile End ======= */}

          {/* ============== Book A Call ============ */}
          {/* <section className='book-call-btn'>
                    <div className="container-fluid">
                        <div className='col-book-btn about-us'>
                            <button className='btn btn-primary' onClick={handleBookShow}>
                                Book A Call
                            </button>
                            <Book_Call Bookshow={Bookshow} handleBookClose={handleBookClose} />
                        </div>
                    </div>
                </section> */}

          {/* ===== FOOTER ===== */}
        </div>
        <Footer />

        <Modal
          className="cancel-modal"
          show={Dltshow}
          onHide={handleDltClose}
          centered
        >
          <Modal.Body>
            <div className="cancel-modal-outer delete-modal">
              <div className="modal-head">
                <CloseButton onClick={handleDltClose} />
                <img src={DltIcon} alt="Delete Icon" />
                <div>
                  <h2>Delete video?</h2>
                  <p>
                    Deleting{" "}
                    <b>
                      {selectedItem?.product?.video_name}{" "}
                      {selectedItem?.product?.video_number}
                    </b>{" "}
                    is permanent. Are you sure you want to proceed?
                  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleDltClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handle_delete_cart_list(selectedItem?.id)}
            >
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default Upload_Products;
