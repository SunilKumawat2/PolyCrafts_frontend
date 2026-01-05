import React, { useEffect, useRef, useState } from 'react'
import Footer from '../../common/footer/Footer';
import StepIcon from "../../../assets/images/step-active.svg";
import ListImg from "../../../assets/images/order-list.svg";
import commentImg from "../../../assets/images/comment.svg";
import playImg from "../../../assets/images/play-list.svg";
import { Modal, Button } from "react-bootstrap";
import Header from '../../common/header/Header';
import {
    User_Orders_Details, User_Orders_Get_Message, User_Orders_List,
    User_Orders_Revision_Requests, User_Orders_Send_Message,
    User_Orders_Update
} from '../../../api/product/Product';
import Header_Login from '../../common/header/Header_Login';
import { socket } from '../../../socket';
import { Link } from 'react-router-dom';

const My_Orders = () => {
    const messagesEndRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showRevisionFields, setShowRevisionFields] = useState(false);
    const [revisionMessage, setRevisionMessage] = useState("");
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatOrderId, setChatOrderId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const get_user_id = localStorage.getItem("user_id")
    const handleOpenDownloadModal = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setShowDownloadModal(true);
    };

    const handleCloseDownloadModal = () => {
        setShowDownloadModal(false);
        setSelectedVideo(null);
    };



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await User_Orders_List();
                if (res?.data?.status) {
                    setOrders(res.data.data); // set the "data" array
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Function to get className / background for status
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "initiated":
                return "bg-primary text-white"; // blue
            case "under review":
                return "bg-warning text-dark"; // yellow
            case "delivered":
                return "bg-success text-white"; // green
            case "cancelled":
                return "bg-danger text-white"; // red
            case "placed":
                return "bg-secondary text-white";
            default:
                return "bg-success text-white"; // grey
        }
    };

    // Fetch details when clicking Order Details
    const handleShowDetails = async (orderId) => {
        try {
            const res = await User_Orders_Details(orderId);
            if (res?.data?.status) {
                setOrderDetails(res.data.order);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    // ✅ Function to handle approve button click
    const handleApprovedProduct = async (id) => {
        try {
            setLoading(true);
            // ✅ Build formData
            const formData = new FormData();
            formData.append("_method", "PATCH");
            formData.append("status", "approved");
            const res = await User_Orders_Update(id, formData);
            setShowModal(false)

            if (res?.data?.status) {
                alert("Product approved successfully!");
                // you can also refresh orders if needed
                // fetchOrders();
            } else {
                alert("Failed to approve product.");
            }
        } catch (error) {
            console.error(error);
            alert("Error while approving product.");
        } finally {
            setLoading(false);
        }
    };

    const handleRevisionClick = () => {
        setShowRevisionFields(true);
    };

    const handleSubmitRevision = async (orderId) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("message", revisionMessage);

            const res = await User_Orders_Revision_Requests(orderId, formData);

            if (res?.data?.status) {
                alert("Revision request submitted successfully!");
                setShowRevisionFields(false);
                setRevisionMessage("");
                setShowModal(false);
            } else {
                alert("Failed to submit revision request.");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting revision request.");
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!chatOrderId || !showChatModal) return;

        let intervalId;

        const loadMessages = async () => {
            const data = await User_Orders_Get_Message(chatOrderId);
            setMessages(data?.data?.data?.data || []);
            scrollToBottom();
        };

        // Load initially
        loadMessages();

        // Poll every 3 seconds
        intervalId = setInterval(() => {
            loadMessages();
        }, 2000);

        return () => {
            clearInterval(intervalId); // stop polling when modal closes
        };
    }, [chatOrderId, showChatModal]);


    // Send message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("message", newMessage);

        try {
            const res = await User_Orders_Send_Message(chatOrderId, formData);
            console.log("sdfmnksdfj", res.data)
            setNewMessage("");

            // ✅ after successful send → refresh chat history
            const updatedData = await User_Orders_Get_Message(chatOrderId);
            console.log("updatedData", updatedData)
            setMessages(updatedData?.data?.data?.data);
            scrollToBottom();

        } catch (err) {
            console.error(err);
            alert("Error sending message.");
        } finally {
            setLoading(false);
        }
    };


    return (

        <main className="orders-page">
            {/* ===== HEADER ===== */}
            <Header_Login />
            {/* <Header /> */}
            <div className='content-outer'>
                <section className='orders-section px-85'>
                    <div className="container-fluid">
                        <div className='order-page-heading'>
                            <h1>My orders</h1>
                        </div>

                        <div className='order-table-outer'>
                            <div className='order-single-details'>
                                {/* <div className='order-table-head'>
                                    <div className='single-order-step'>
                                        <img src={StepIcon} alt="StepIcon" />
                                        <div className='text'>
                                            <h6>Order placed</h6>
                                            <p>May 20th, 2024 - 10:30PM</p>
                                        </div>
                                        <span className='line'></span>
                                    </div>
                                    <div className='single-order-step active'>
                                        <div className='nbr'>
                                            2
                                        </div>
                                        <div className='text'>
                                            <h6>Model initiated</h6>
                                            <p>Demo video in progress</p>
                                        </div>
                                        <span className='line'></span>
                                    </div>
                                    <div className='single-order-step'>
                                        <div className='nbr'>
                                            3
                                        </div>
                                        <div className='text'>
                                            <h6>Model under review</h6>
                                            <p>Demo video under customer review</p>
                                        </div>
                                        <span className='line'></span>
                                    </div>
                                    <div className='single-order-step'>
                                        <div className='nbr'>
                                            4
                                        </div>
                                        <div className='text'>
                                            <h6>Model to be approved</h6>
                                            <p>Awaiting customer approval</p>
                                        </div>
                                        <span className='line'></span>
                                    </div>
                                    <div className='single-order-step'>
                                        <div className='nbr'>
                                            5
                                        </div>
                                        <div className='text'>
                                            <h6>Final model delivered</h6>
                                            <p>Final video is ready to download</p>
                                        </div>
                                    </div>
                                </div> */}
                                {orders && orders?.map((order) => (
                                    <div key={order.id} className="order-details-info">
                                        <div className="left-info">
                                            <div className="single-info status">
                                                <p>Status</p>
                                                <span className={`badge-tag ${getStatusClass(order.status)}`}>
                                                    {order?.status}
                                                </span>
                                            </div>
                                            <div className="single-info">
                                                <p>Order ID</p>
                                                <span>{order?.order_number}</span>
                                            </div>
                                            <div className="single-info">
                                                <p>Total Price</p>
                                                <span>$ {order?.total_amount}</span>
                                            </div>
                                            {/* <div className="single-info">
                                                <p>Video Name</p>
                                                <span>
                                                    {order?.items?.[0]?.user_products?.[0]?.name || "N/A"}
                                                </span>
                                            </div> */}
                                            <div className="single-info date">
                                                <p>Date</p>
                                                <span>
                                                    {new Date(order?.created_at).toLocaleString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="right-action">
                                            <Link to={`/my-orders-details/${order.id}`}
                                                style={{ color: "#F87951", padding: "2px" }}>
                                                <button className="order-btn" variant="primary">

                                                    <img src={ListImg} alt="ListImg" />
                                                    <span>View details</span>

                                                </button>
                                            </Link>
                                            {/* <button
                                                className="order-btn"
                                                onClick={() => {
                                                    setChatOrderId(order?.id);
                                                    setShowChatModal(true);
                                                }}
                                            >
                                                <img src={commentImg} alt="comment" />
                                                <span>Chats</span>
                                            </button>

                                            <button
                                                className={`order-btn ${order.status != "approved" ? "disabled" : ""}`}
                                                onClick={() =>
                                                    order.status == "approved" &&
                                                    handleOpenDownloadModal(order?.final_video_url) // pass video url here
                                                }
                                            >
                                                <img src={playImg} alt="play" />
                                                <span>Download Video</span>
                                            </button> */}

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* <------------ Orders Details ---------> */}
                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="xl"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>📦 Order Details</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {orderDetails ? (
                            <div className="order-details-modal">
                                {/* Order Info */}
                                <div className="mb-4">
                                    <p><strong>Order Number:</strong> {orderDetails.order_number}</p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span className={`badge-tag ${getStatusClass(orderDetails?.status)}`}>
                                            {orderDetails?.status}
                                        </span>
                                    </p>
                                    <p><strong>Total Amount:</strong> ${orderDetails.total_amount}</p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(orderDetails.created_at).toLocaleString()}
                                    </p>
                                </div>

                                {/* Products */}
                                {/* Product Section */}
                                <h5 className="mb-3">🛒 Products</h5>
                                {orderDetails?.items?.map((item) => (
                                    <div key={item?.id} className="product-card mb-4">
                                        <p><strong>Product Price:</strong> ${item?.price}</p>
                                        <p><strong>Aspect Ratios:</strong> {item?.aspect_ratios}</p>

                                        {/* User Products */}
                                        <h6 className="mt-3">User Products:</h6>
                                        {item?.user_products?.map((prod) => (
                                            <div key={prod.id} className="user-product-card">
                                                <p><strong>Name:</strong> {prod?.name}</p>
                                                <p><strong>Comment:</strong> {prod?.comment}</p>
                                                <p><strong>Price:</strong> ${prod?.price}</p>

                                                {prod["3d_model_file_url"] && (
                                                    <a
                                                        href={prod["3d_model_file_url"]}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-sm btn-outline-primary mb-2"
                                                    >
                                                        ⬇️ Download 3D Model
                                                    </a>
                                                )}


                                                {/* ✅ Product Labels with Video */}
                                                {prod.user_product_labels?.length > 0 && (
                                                    <div className="mt-3">
                                                        <h6>Labels:</h6>
                                                        <div className="row">
                                                            {prod?.user_product_labels?.map((label) => (
                                                                <div key={label?.id} className="col-md-6 mb-3">
                                                                    <div className="label-card">
                                                                        {label?.image_url && (
                                                                            <img
                                                                                src={label.image_url}
                                                                                alt="Label"
                                                                                className="img-fluid rounded mb-2"
                                                                            />
                                                                        )}
                                                                        {label?.demo_video_url && (
                                                                            <video
                                                                                src={label?.demo_video_url}
                                                                                controls
                                                                                playsInline
                                                                                webkit-playsinline="true"
                                                                                preload="auto"
                                                                                className="w-100 rounded"
                                                                                style={{ maxHeight: "200px", objectFit: "cover" }}
                                                                            />
                                                                        )}
                                                                        <p className="mt-2 mb-0">
                                                                            <strong>Price:</strong> ${label.price}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Delivered Videos Section */}
                                                {prod?.user_product_labels?.length > 0 && (
                                                    <div className="mt-4">
                                                        <h5 className="text-secondary mb-3">Delivered Videos</h5>
                                                        <div className="row">
                                                            {prod.user_product_labels.map((label) => (
                                                                label?.delivered_videos?.length > 0 && (
                                                                    <div key={label.id} className="col-md-6 mb-4">
                                                                        <div className="card shadow-sm p-2">
                                                                            {/* Label Image */}
                                                                            {label.image_url && (
                                                                                <img
                                                                                    src={label.image_url}
                                                                                    alt="Label"
                                                                                    className="img-fluid rounded mb-2"
                                                                                    style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
                                                                                />
                                                                            )}

                                                                            {/* Delivered Videos */}
                                                                            {label?.delivered_videos?.map((videoItem) => (
                                                                                <div key={videoItem.id} className="mb-3">
                                                                                    <video
                                                                                        playsInline
                                                                                        webkit-playsinline="true"
                                                                                        preload="auto"
                                                                                        controls
                                                                                        src={videoItem?.video_url}
                                                                                        className="w-100 rounded"
                                                                                        style={{ maxHeight: "300px", objectFit: "cover" }}
                                                                                    >
                                                                                        Your browser does not support the video tag.
                                                                                    </video>
                                                                                    <small className="text-muted d-block mt-1">
                                                                                        Aspect Ratio: {videoItem.aspect_ratio}
                                                                                    </small>

                                                                                    {/* ✅ Download Button for each delivered video */}
                                                                                    <button
                                                                                        className="btn btn-sm btn-primary mt-2"
                                                                                        onClick={() => handleOpenDownloadModal(videoItem.video_url)}
                                                                                    >
                                                                                        ⬇️ Download
                                                                                    </button>
                                                                                </div>
                                                                            ))}


                                                                            {/* Price */}
                                                                            {label.price && (
                                                                                <p className="mt-2 mb-0">
                                                                                    <strong>Price:</strong> ₹{label.price}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {/* Revision Input Field */}
                                {showRevisionFields && (
                                    <div className="revision-message-box mt-3 p-3 border rounded">
                                        <label><strong>Revision Message:</strong></label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter your revision message..."
                                            value={revisionMessage}
                                            onChange={(e) => setRevisionMessage(e.target.value)}
                                        ></textarea>

                                        <div className="mt-2 text-end">
                                            <Button
                                                variant="primary"
                                                disabled={loading || !revisionMessage.trim()}
                                                onClick={() => handleSubmitRevision(orderDetails?.id)}
                                            >
                                                {loading ? "Submitting..." : "Submit Revision"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Loading details...</p>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        {/* Show both buttons when status is "under review" and not showing revision fields */}
                        {orderDetails?.status == "under review" && !showRevisionFields && (
                            <>
                                <Button variant="warning" onClick={handleRevisionClick}>
                                    Revised
                                </Button>

                                <Button
                                    variant="success"
                                    disabled={loading}
                                    onClick={() => handleApprovedProduct(orderDetails?.id, "approved")}
                                >
                                    {loading ? "Processing..." : "Approve"}
                                </Button>
                            </>
                        )}

                        {/* Show only revision fields when revised button clicked */}
                        {/* {showRevisionFields && orderDetails?.status == "under review" && (
                            <Button
                                variant="primary"
                                disabled={loading || !revisionMessage.trim()}
                                onClick={() => handleSubmitRevision(orderDetails?.id)}
                            >
                                {loading ? "Submitting..." : "Submit Revision"}
                            </Button>
                        )} */}


                    </Modal.Footer>
                </Modal>

                <Modal show={showDownloadModal} onHide={handleCloseDownloadModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Download Video</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to download this video?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDownloadModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (selectedVideo) {
                                    const link = document.createElement("a");
                                    link.href = selectedVideo;
                                    link.setAttribute("download", "video.mp4"); // force download
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                                handleCloseDownloadModal();
                            }}
                        >
                            Download
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* <----- chat modal -------> */}
                <Modal
                    show={showChatModal}
                    onHide={() => setShowChatModal(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Chats for Order #{chatOrderId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ display: "flex", flexDirection: "column", height: "500px", padding: "0" }}>
                        {/* Chat history */}
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "15px",
                                backgroundColor: "#f4f6f8",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            {[...messages].reverse().map((msg, idx) => {
                                const get_user_id = localStorage.getItem("user_id");

                                // conditions
                                const isUser = msg?.sender_type == "App\\Models\\User";
                                const isAdmin = msg?.sender_type == "App\\Models\\Admin";
                                const isCurrentUser = isUser && msg?.sender_id?.toString() == get_user_id?.toString();

                                // decide styles
                                let alignSelf = "flex-start";
                                let bgColor = "#fff";
                                let textColor = "#000"; // always black

                                if (isCurrentUser) {
                                    alignSelf = "flex-end";
                                    bgColor = "#F87951";   // user's own message
                                } else if (isAdmin) {
                                    alignSelf = "flex-start";
                                    bgColor = "#fff";   // admin message
                                } else if (isUser) {
                                    alignSelf = "flex-start";
                                    bgColor = "#ddd";      // other user message
                                }

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            alignSelf,
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            padding: "10px 15px",
                                            borderRadius: "15px",
                                            maxWidth: "70%",
                                            boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <div style={{ fontSize: "14px", marginBottom: "5px" }}>
                                            {msg.message}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: "#000", // keep time text black as well
                                                textAlign: "right",
                                            }}
                                        >
                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                );
                            })}





                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message input section */}
                        <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd", backgroundColor: "#fff" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type a message..."
                                style={{ flex: 1, borderRadius: "20px", padding: "10px" }}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                            />
                            <button
                                className="btn btn-primary ms-2"
                                style={{ borderRadius: "20px" }}
                                onClick={handleSendMessage}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowChatModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



            </div>


            {/* ===== FOOTER ===== */}
            <Footer />

        </main>
    )
}

export default My_Orders