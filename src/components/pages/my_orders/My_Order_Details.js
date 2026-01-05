import React, { useEffect, useRef, useState } from 'react'
import Footer from '../../common/footer/Footer';
import StepIcon from "../../../assets/images/step-active.svg";
import ListImg from "../../../assets/images/order-list.svg";
import { Modal, Button } from "react-bootstrap";
import commentImg from "../../../assets/images/comment.svg";
import {
    Show_User_Order_Label,
    Show_User_Order_Label_Details,
    Update_User_Order_Label_Status,
    User_Orders_Get_Message,
    User_Orders_Revision_Requests, User_Orders_Send_Message,
    User_Show_Orders_Revision_Requests
} from '../../../api/product/Product';
import Header_Login from '../../common/header/Header_Login';
import { socket } from '../../../socket';
import { Link, useParams } from 'react-router-dom';
import { Get_video_templates_details } from '../../../api/global/Global';

const My_Order_Details = () => {
    const messagesEndRef = useRef(null);
    const get_order_id = useParams();
    const order_id = get_order_id && get_order_id.id
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderProductDetails, setOrderProductDetails] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showRevisionFields, setShowRevisionFields] = useState(false);
    const [revisionMessage, setRevisionMessage] = useState("");
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatOrderId, setChatOrderId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [revisionRequests, setRevisionRequests] = useState([]);
    const [loadingRevisions, setLoadingRevisions] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [templateDetails, setTemplateDetails] = useState(null);

    const get_user_id = localStorage.getItem("user_id")
    const handleOpenDownloadModal = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setShowDownloadModal(true);
    };

    const handleCloseDownloadModal = () => {
        setShowDownloadModal(false);
        setSelectedVideo(null);
    };


    const steps = [
        { key: "placed", label: "Order placed", desc: "Order received" },
        { key: "initiated", label: "Model initiated", desc: "Demo video in progress" },
        { key: "under_review", label: "Model under review", desc: "Demo under customer review" },
        { key: "approved", label: "Model approved", desc: "Awaiting delivery" },
        { key: "delivered", label: "Final model delivered", desc: "Video ready to download" },
    ];

    const getActiveCount = (status) => {
        switch (status) {
            case "placed":
                return 1;
            case "initiated":
                return 2;
            case "under_review":
                return 3;
            case "approved":
                return 4;
            case "delivered":
                return 5;
            case "cancelled":
                return 1; // only placed visible, then cancelled path
            default:
                return 0;
        }
    };



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await Show_User_Order_Label(order_id);
                if (res?.data?.status) {
                    setLabels(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching labels:", error);
            } finally {
                setLoading(false);
            }
        };

        if (order_id) fetchOrders();
    }, [order_id]);

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
    const handleShowDetails = async (label_id) => {
        try {
            const res = await Show_User_Order_Label_Details(order_id, label_id);
            if (res?.data?.status) {
                setOrderDetails(res.data.order);
                setOrderProductDetails(res?.data?.data)
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    // ✅ Function to handle approve button click
    const handleApprovedProduct = async (order_id, label_id) => {
        try {
            setLoading(true);

            // ✅ Build FormData properly
            const formData = new FormData();
            formData.append("_method", "PATCH");
            formData.append("status", "approved");

            // ✅ API call
            const res = await Update_User_Order_Label_Status(order_id, label_id, formData);

            setShowModal(false);
            window.location.reload()
            if (res?.data?.status) {
                alert("Product approved successfully!");
                // Optionally refresh data here
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

    const handleSubmitRevision = async ({ orderId, productId }) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("message", revisionMessage);

            const res = await User_Orders_Revision_Requests(orderId, productId, formData);

            if (res?.data?.status) {
                alert("Revision request submitted successfully!");
                setShowRevisionFields(false);
                setRevisionMessage("");
                setShowModal(false);
            } else {
                alert("Failed to submit revision request.");
            }
        } catch (error) {
            if (error?.data?.status == false) {
                alert(error?.data?.message);
            } else {
                console.error(error);
                alert("Error submitting revision request.");
            }

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

    const fetchRevisionRequests = async (orderId, labelId) => {
        try {
            setLoadingRevisions(true);
            const res = await User_Show_Orders_Revision_Requests(orderId, labelId);
            setRevisionRequests(res?.data?.data || []);
        } catch (err) {
            console.error("Error fetching revision requests:", err);
        } finally {
            setLoadingRevisions(false);
        }
    };

    useEffect(() => {
        if (showModal && orderDetails?.id && orderProductDetails?.id) {
            fetchRevisionRequests(orderDetails.id, orderProductDetails.id);
        }
    }, [showModal, orderDetails, orderProductDetails]);

    // ✅ Status progress JSX (comes right above return)
    const OrderStatusProgress = ({ status }) => {
        const activeCount = getActiveCount(status);

        if (status === "cancelled") {
            return (
                <div className="order-table-head">
                    <div className="single-order-step active">
                        <img src={StepIcon} alt="StepIcon" />
                        <div className="text">
                            <h6>Order placed</h6>
                        </div>
                        <span className="line"></span>
                    </div>
                    <div className="single-order-step cancel">
                        <div className="nbr">✖</div>
                        <div className="text">
                            <h6>Cancelled</h6>
                            <p>Order cancelled</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="order-table-head">
                {steps.map((step, index) => {
                    const isActive = index < activeCount;
                    return (
                        <div
                            key={step.key}
                            className={`single-order-step ${isActive ? "active" : ""}`}
                        >
                            {index === 0 ? (
                                <img src={StepIcon} alt="StepIcon" />
                            ) : (
                                <div className="nbr">{index + 1}</div>
                            )}
                            <div className="text">
                                <h6>{step.label}</h6>
                                <p>{step.desc}</p>
                            </div>
                            {index < steps.length - 1 && <span className="line"></span>}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Fetch video details for selected template
    const handleSeeTemplates = async (productId) => {
        if (!productId) return;

        setLoading(true);

        try {
            const res = await Get_video_templates_details(productId);

            if (res?.data?.status) {
                setTemplateDetails(res.data.data);
                setShowTemplates(true);
            }
        } catch (error) {
            console.error("Error fetching template:", error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <main className="labels-page">
            {/* ===== HEADER ===== */}
            <Header_Login />
            {/* <Header /> */}
            <div className='content-outer'>
                <section className='labels-section px-85'>
                    <div className="container-fluid">
                        <div className='order-page-heading'>
                            <h1>My Orders Details</h1>
                        </div>

                        <div className='order-table-outer'>
                            <div className='order-single-details table-responsive'>

                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Product Name</th>
                                            <th>Product Label Price</th>
                                            <th>Date</th>
                                            <th>Product Label</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {labels &&
                                            labels.map((order) => {
                                                const stepOrder = ["placed", "initiated", "under_review", "approved", "delivered"];
                                                const currentIndex = stepOrder.indexOf(order.status);
                                                const isCancelled = order.status === "cancelled";
                                                const isDelivered = order.status === "delivered";

                                                return (
                                                    <React.Fragment key={order.id}>
                                                        {/* 👇 Progress Steps Row */}
                                                        <tr>
                                                            <td colSpan="6">
                                                                <div className="order-table-head">
                                                                    {isCancelled ? (
                                                                        <>
                                                                            {/* 🔴 Step 1: Placed (Red) */}
                                                                            <div className="single-order-step cancelled-step">
                                                                                <img src={StepIcon} alt="StepIcon" />
                                                                                <div className="text">
                                                                                    <h6>Order placed</h6>
                                                                                    <p>
                                                                                        {new Date(order?.created_at).toLocaleString("en-US", {
                                                                                            month: "short",
                                                                                            day: "numeric",
                                                                                            year: "numeric",
                                                                                            hour: "2-digit",
                                                                                            minute: "2-digit",
                                                                                        })}
                                                                                    </p>
                                                                                </div>
                                                                                {/* Red line only between placed and cancelled */}
                                                                                <span className="line red-line"></span>
                                                                            </div>

                                                                            {/* 🔴 Step 2: Cancelled */}
                                                                            <div className="single-order-step cancelled-step">
                                                                                <div className="nbr">✖</div>
                                                                                <div className="text">
                                                                                    <h6>Cancelled</h6>
                                                                                    <p>Order cancelled</p>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {/* Normal Progress Steps */}
                                                                            <div
                                                                                className={`single-order-step ${currentIndex > 0 || isDelivered
                                                                                    ? "completed"
                                                                                    : currentIndex === 0
                                                                                        ? "active"
                                                                                        : ""
                                                                                    }`}
                                                                            >
                                                                                <img src={StepIcon} alt="StepIcon" />
                                                                                <div className="text">
                                                                                    <h6>Order placed</h6>
                                                                                    <p>
                                                                                        {new Date(order?.created_at).toLocaleString("en-US", {
                                                                                            month: "short",
                                                                                            day: "numeric",
                                                                                            year: "numeric",
                                                                                            hour: "2-digit",
                                                                                            minute: "2-digit",
                                                                                        })}
                                                                                    </p>
                                                                                </div>
                                                                                <span className="line"></span>
                                                                            </div>

                                                                            <div
                                                                                className={`single-order-step ${currentIndex > 1 || isDelivered
                                                                                    ? "completed"
                                                                                    : currentIndex === 1
                                                                                        ? "active"
                                                                                        : ""
                                                                                    }`}
                                                                            >
                                                                                <div className="nbr">2</div>
                                                                                <div className="text">
                                                                                    <h6>Model initiated</h6>
                                                                                    <p>Demo video in progress</p>
                                                                                </div>
                                                                                <span className="line"></span>
                                                                            </div>

                                                                            <div
                                                                                className={`single-order-step ${currentIndex > 2 || isDelivered
                                                                                    ? "completed"
                                                                                    : currentIndex === 2
                                                                                        ? "active"
                                                                                        : ""
                                                                                    }`}
                                                                            >
                                                                                <div className="nbr">3</div>
                                                                                <div className="text">
                                                                                    <h6>Model under review</h6>
                                                                                    <p>Demo video under customer review</p>
                                                                                </div>
                                                                                <span className="line"></span>
                                                                            </div>

                                                                            <div
                                                                                className={`single-order-step ${currentIndex > 3 || isDelivered
                                                                                    ? "completed"
                                                                                    : currentIndex === 3
                                                                                        ? "active"
                                                                                        : ""
                                                                                    }`}
                                                                            >
                                                                                <div className="nbr">4</div>
                                                                                <div className="text">
                                                                                    <h6>Model to be approved</h6>
                                                                                    <p>Awaiting customer approval</p>
                                                                                </div>
                                                                                <span className="line"></span>
                                                                            </div>

                                                                            <div
                                                                                className={`single-order-step ${isDelivered ? "completed" : currentIndex === 4 ? "active" : ""
                                                                                    }`}
                                                                            >
                                                                                <div className="nbr">5</div>
                                                                                <div className="text">
                                                                                    <h6>Final model delivered</h6>
                                                                                    <p>Final video is ready to download</p>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        {/* 👇 Order Row */}
                                                        <tr>
                                                            <td>
                                                                <span className={`badge-tag ${getStatusClass(order.status)}`}>
                                                                    {order?.status}
                                                                </span>
                                                            </td>
                                                            <td>{order?.user_product?.name}</td>
                                                            <td>$ {order?.price}</td>
                                                            <td>
                                                                {new Date(order?.created_at).toLocaleString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </td>
                                                            <td>
                                                                {order?.image_url ? (
                                                                    <img src={order?.image_url} alt="Product Label" className="order-image" />
                                                                ) : (
                                                                    <span>No image</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="order-btn"
                                                                    onClick={() => handleShowDetails(order?.id)}
                                                                    style={{
                                                                        borderRadius: "10px",
                                                                        padding: "8px",
                                                                        border: "1px solid #F87951",
                                                                    }}
                                                                >
                                                                    <img src={ListImg} alt="ListImg" />
                                                                    <span style={{ color: "#F87951" }}>View details</span>
                                                                </button>

                                                                <button
                                                                    className="order-btn"
                                                                    style={{
                                                                        color: "#F87951",
                                                                        borderRadius: "10px",
                                                                        margin: "10px",
                                                                        padding: "8px",
                                                                        border: "1px solid #F87951",
                                                                    }}
                                                                    onClick={() => {
                                                                        setChatOrderId(order?.id);
                                                                        setShowChatModal(true);
                                                                    }}
                                                                >
                                                                    <img src={commentImg} alt="comment" />
                                                                    <span>Chats</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </tbody>



                                </table>


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
                                <div className="row">
                                    {/* Left Column */}
                                    <div className="col-md-6 col-sm-12 mb-4">
                                        <p><strong>Order Number:</strong> {orderDetails.order_number}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className={`badge-tag ${getStatusClass(orderDetails?.status)}`}>
                                                {orderDetails?.status}
                                            </span>
                                        </p>
                                        <p><strong>Total Amount:</strong> $ {orderDetails.total_amount}</p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(orderDetails.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Right Column */}
                                    <div className="col-md-6 col-sm-12 mb-4">
                                        <p><strong>Aspect Ratios:</strong></p>
                                        <div>
                                            {orderProductDetails?.user_product?.reference?.aspect_ratios ? (
                                                JSON.parse(orderProductDetails.user_product.reference.aspect_ratios).map(
                                                    (ratio, index) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                display: "inline-block",
                                                                backgroundColor: "#f0f2f5",
                                                                color: "#333",
                                                                padding: "5px 10px",
                                                                borderRadius: "6px",
                                                                marginRight: "8px",
                                                                marginBottom: "6px",
                                                                fontSize: "14px",
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {ratio}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </div>
                                    </div>

                                </div>



                                {/* Products */}
                                {/* Product Section */}
                                <h5 className="mb-3">🛒 Products</h5>
                                <div className="product-card mb-4">
                                    {/* <p><strong>Product Price:</strong> ${item?.price}</p>
                                        <p><strong>Aspect Ratios:</strong> {item?.aspect_ratios}</p> */}

                                    {/* User Products */}
                                    <h6 className="mt-3">User Products:</h6>
                                    <div className="user-product-card">
                                        <p><strong>Name:</strong> {orderProductDetails?.user_product?.name}</p>
                                        <p><strong>Comment:</strong> {orderProductDetails?.user_product?.comment}</p>
                                        <p><strong>Price:</strong> $ {orderProductDetails?.user_product?.price}</p>

                                        {orderProductDetails?.user_product?.["3d_model_file_url"] && (
                                            <a
                                                href={orderProductDetails.user_product["3d_model_file_url"]}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-sm btn-outline-primary mb-2"
                                            >
                                                ⬇️ Download 3D Model
                                            </a>
                                        )}

                                        <div className="row">
                                            {/* {prod?.user_product_labels?.map((label) => ( */}
                                            <h6 style={{ marginTop: '10px', marginBottom: "10px" }}>Product Dimensions </h6>
                                            <div className="col-md-4 mb-3">
                                                <p><strong>Product Height:</strong> {orderProductDetails?.user_product?.height}</p>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <p><strong>Product Width:</strong> {orderProductDetails?.user_product?.width}</p>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <p><strong>Product Depth:</strong> {orderProductDetails?.user_product?.depth}</p>
                                            </div>
                                            {/* ))} */}
                                        </div>

                                        <div className="row">
                                            {/* {prod?.user_product_labels?.map((label) => ( */}
                                            <h4 style={{ marginTop: '10px', marginBottom: "10px", color: "#df5a17" }}>Product Images</h4>
                                            <div className="col-md-2 mb-3">
                                                <div className="label-card">
                                                    {orderProductDetails?.user_product?.front_view_image_url && (
                                                        <img
                                                            src={orderProductDetails?.user_product?.front_view_image_url}
                                                            alt="Label"
                                                            className="img-fluid rounded mb-2"
                                                        />
                                                    )}
                                                    Front View
                                                </div>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <div className="label-card">
                                                    {orderProductDetails?.user_product?.side_view_image_url && (
                                                        <img
                                                            src={orderProductDetails?.user_product?.side_view_image_url}
                                                            alt="Label"
                                                            className="img-fluid rounded mb-2"
                                                        />
                                                    )}
                                                    Side View
                                                </div>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <div className="label-card">
                                                    {orderProductDetails?.user_product?.rear_view_image_url && (
                                                        <img
                                                            src={orderProductDetails?.user_product?.rear_view_image_url}
                                                            alt="Label"
                                                            className="img-fluid rounded mb-2"
                                                        />
                                                    )}
                                                    Rear View
                                                </div>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <div className="label-card">
                                                    {orderProductDetails?.user_product?.bottom_view_image_url && (
                                                        <img
                                                            src={orderProductDetails?.user_product?.bottom_view_image_url}
                                                            alt="Label"
                                                            className="img-fluid rounded mb-2"
                                                        />
                                                    )}
                                                    Bottom View
                                                </div>
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <div className="label-card">
                                                    {orderProductDetails?.user_product?.top_view_image_url && (
                                                        <img
                                                            src={orderProductDetails?.user_product?.top_view_image_url}
                                                            alt="Label"
                                                            className="img-fluid rounded mb-2"
                                                        />
                                                    )}
                                                    Top View
                                                </div>
                                            </div>
                                            {/* ))} */}
                                        </div>



                                        {orderProductDetails?.image_url && (
                                            <div className="mt-3">
                                                <h6>Labels:</h6>
                                                <div className="row">
                                                    {/* {prod?.user_product_labels?.map((label) => ( */}
                                                    <div className="col-md-12 mb-3">
                                                        <div className="label-card">
                                                            {orderProductDetails?.image_url && (
                                                                <img
                                                                    src={orderProductDetails?.image_url}
                                                                    alt="Label"
                                                                    className="img-fluid rounded mb-2"
                                                                />
                                                            )}
                                                            {orderProductDetails?.demo_video_url && (
                                                                <video
                                                                    src={orderProductDetails?.demo_video_url}
                                                                    controls
                                                                    playsInline
                                                                    webkit-playsinline="true"
                                                                    preload="auto"
                                                                    className="w-100 rounded"
                                                                    style={{ maxHeight: "500px", objectFit: "cover" }}
                                                                />
                                                            )}
                                                            <p className="mt-2 mb-0">
                                                                <strong>Price:</strong> ${orderProductDetails?.user_product?.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* ))} */}
                                                </div>
                                            </div>
                                        )}
                                        {
                                            !showTemplates && (
                                                <button
                                                    className="btn btn-primary mt-3"
                                                    onClick={() => handleSeeTemplates(orderProductDetails?.user_product?.reference?.product_id)}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Loading..." : "See Video Templates"}
                                                </button>
                                            )
                                        }



                                        {showTemplates && templateDetails && (
                                            <div className="mt-4 p-3 border rounded">
                                                <h5>🎬 Video Template Preview</h5>

                                                {/* Video Preview */}
                                                <video
                                                    width="100%"
                                                    height="auto"
                                                    controls
                                                    src={templateDetails.video_url}
                                                />

                                                {/* Additional Template Info */}
                                                <div className="mt-3">
                                                    <p><strong>Template Name:</strong> {templateDetails?.video_name}</p>
                                                    <p><strong>Description:</strong> {templateDetails?.description}</p>
                                                    <p><strong>Duration:</strong> {templateDetails?.duration}s</p>
                                                    <p><strong>Resolution:</strong> {templateDetails?.resolution}</p>
                                                </div>
                                            </div>
                                        )}

                                        {orderProductDetails?.delivered_videos?.length > 0 && (
                                            <div className="mt-4">
                                                <h5 className="text-secondary mb-3">Delivered Videos</h5>
                                                <div className="row">
                                                    {orderProductDetails?.delivered_videos?.map((label) => (
                                                        orderProductDetails?.delivered_videos?.length > 0 && (
                                                            <div key={label.id} className="col-md-12 mb-4">
                                                                <div className="card shadow-sm p-2">
                                                                    {label.image_url && (
                                                                        <img
                                                                            src={label.image_url}
                                                                            alt="Label"
                                                                            className="img-fluid rounded mb-2"
                                                                            style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
                                                                        />
                                                                    )}

                                                                    <div key={label.id} className="mb-3">
                                                                        <video
                                                                            playsInline
                                                                            webkit-playsinline="true"
                                                                            preload="auto"
                                                                            controls
                                                                            src={label?.video_url}
                                                                            className="w-100 rounded"
                                                                            style={{ maxHeight: "500px", objectFit: "cover" }}
                                                                        >
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <small className="text-muted d-block mt-1">
                                                                            Aspect Ratio: {label?.aspect_ratio}
                                                                        </small>


                                                                        <button
                                                                            className="btn btn-sm btn-primary mt-2"
                                                                            onClick={() => handleOpenDownloadModal(label.video_url)}
                                                                        >
                                                                            ⬇️ Download
                                                                        </button>
                                                                    </div>

                                                                    {/* === Button to Show Templates === */}



                                                                    {showTemplates && templateDetails && (
                                                                        <div className="mt-4 p-3 border rounded">
                                                                            <h5>🎬 Video Template Preview</h5>

                                                                            {/* Video Preview */}
                                                                            <video
                                                                                width="100%"
                                                                                height="auto"
                                                                                controls
                                                                                src={templateDetails.video_url}
                                                                            />

                                                                            {/* Additional Template Info */}
                                                                            <div className="mt-3">
                                                                                <p><strong>Template Name:</strong> {templateDetails?.video_name}</p>
                                                                                <p><strong>Description:</strong> {templateDetails?.description}</p>
                                                                                <p><strong>Duration:</strong> {templateDetails?.duration}s</p>
                                                                                <p><strong>Resolution:</strong> {templateDetails?.resolution}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}

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
                                </div>


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
                                                onClick={() =>
                                                    handleSubmitRevision({
                                                        orderId: orderDetails?.id,
                                                        productId: orderProductDetails?.id,
                                                    })
                                                }


                                            >
                                                {loading ? "Submitting..." : "Submit Revision"}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Revision Requests Table */}
                                <div className="mt-4">
                                    <h5 className="mb-3 text-primary">📋 Revision Requests</h5>

                                    {loadingRevisions ? (
                                        <p>Loading revision requests...</p>
                                    ) : revisionRequests.length === 0 ? (
                                        <p className="text-muted">No revision requests found.</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Request Number</th>
                                                        <th>Message</th>
                                                        <th>Price ($)</th>
                                                        <th>Status</th>
                                                        <th>Requested At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {revisionRequests.map((req, index) => (
                                                        <tr key={req.id}>
                                                            <td>{index + 1}</td>
                                                            <td><strong>{req.request_number}</strong></td>
                                                            <td>{req.message}</td>
                                                            <td>{req.price}</td>
                                                            <td>
                                                                <span
                                                                    className={`badge bg-${req.status === "pending"
                                                                        ? "warning"
                                                                        : req.status === "approved"
                                                                            ? "success"
                                                                            : "secondary"
                                                                        }`}
                                                                >
                                                                    {req.status}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(req.created_at).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

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
                        {orderProductDetails?.status == "under_review" && !showRevisionFields && (
                            <>
                                <Button variant="warning" onClick={handleRevisionClick}>
                                    Revised
                                </Button>

                                <Button
                                    variant="success"
                                    disabled={loading}
                                    onClick={() => handleApprovedProduct(orderDetails?.id, orderProductDetails?.id, "approved")}
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

export default My_Order_Details

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
{/* <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Product Name</th>
                                            <th>Product Label Price</th>
                                            <th>Date</th>
                                            <th>Product Label</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {labels && labels.map((order) => (
                                            <tr key={order.id}>
                                                <td>
                                                    <span className={`badge-tag ${getStatusClass(order.status)}`}>
                                                        {order?.status}
                                                    </span>
                                                </td>

                                                <td>{order?.user_product?.name}</td>

                                                <td>$ {order?.price}</td>

                                                <td>
                                                    {new Date(order?.created_at).toLocaleString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>

                                                <td>
                                                    {order?.image_url ? (
                                                        <img
                                                            src={order?.image_url}
                                                            alt="Product Label"
                                                            className="order-image"
                                                        />
                                                    ) : (
                                                        <span>No image</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        className="order-btn"
                                                        onClick={() => handleShowDetails(order?.id)}
                                                        style={{
                                                            borderRadius: "10px",
                                                            padding: "8px",
                                                            border: "1px solid #F87951",
                                                        }}
                                                    >
                                                        <img src={ListImg} alt="ListImg" />
                                                        <span style={{ color: "#F87951" }}>View details</span>
                                                    </button>
                                                    <button
                                                        className="order-btn" style={{ color: "#F87951", borderRadius: "10px", margin: "10px", padding: "8px", border: "1px solid #F87951" }}
                                                        onClick={() => {
                                                            setChatOrderId(order?.id);
                                                            setShowChatModal(true);
                                                        }}
                                                    >
                                                        <img src={commentImg} alt="comment" />
                                                        <span>Chats</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table> */}
{/* <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Product Name</th>
                                            <th>Product Label Price</th>
                                            <th>Date</th>
                                            <th>Product Label</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {labels && labels.map((order) => {
                                            const stepOrder = ["placed", "initiated", "review", "approval", "delivered"];
                                            const currentIndex = stepOrder.indexOf(order.status);

                                            const isCancelled = order.status === "cancelled";

                                            return (
                                                <React.Fragment key={order.id}>
                                                    <tr>
                                                        <td colSpan="6">
                                                            <div className="order-table-head">

                                                                {isCancelled ? (
                                                                    <>
                                                                        <div className="single-order-step active">
                                                                            <img src={StepIcon} alt="StepIcon" />
                                                                            <div className="text">
                                                                                <h6>Order placed</h6>
                                                                                <p>
                                                                                    {new Date(order?.created_at).toLocaleString("en-US", {
                                                                                        month: "short",
                                                                                        day: "numeric",
                                                                                        year: "numeric",
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit",
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                            <span className="line"></span>
                                                                        </div>

                                                                        <div className="single-order-step cancel">
                                                                            <div className="nbr">✖</div>
                                                                            <div className="text">
                                                                                <h6>Cancelled</h6>
                                                                                <p>Order cancelled</p>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className={`single-order-step ${currentIndex >= 0 ? "active" : ""}`}>
                                                                            <img src={StepIcon} alt="StepIcon" />
                                                                            <div className="text">
                                                                                <h6>Order placed</h6>
                                                                                <p>
                                                                                    {new Date(order?.created_at).toLocaleString("en-US", {
                                                                                        month: "short",
                                                                                        day: "numeric",
                                                                                        year: "numeric",
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit",
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                            <span className="line"></span>
                                                                        </div>

                                                                        <div className={`single-order-step ${currentIndex >= 1 ? "active" : ""}`}>
                                                                            <div className="nbr">2</div>
                                                                            <div className="text">
                                                                                <h6>Model initiated</h6>
                                                                                <p>Demo video in progress</p>
                                                                            </div>
                                                                            <span className="line"></span>
                                                                        </div>

                                                                        <div className={`single-order-step ${currentIndex >= 2 ? "active" : ""}`}>
                                                                            <div className="nbr">3</div>
                                                                            <div className="text">
                                                                                <h6>Model under review</h6>
                                                                                <p>Demo video under customer review</p>
                                                                            </div>
                                                                            <span className="line"></span>
                                                                        </div>

                                                                        <div className={`single-order-step ${currentIndex >= 3 ? "active" : ""}`}>
                                                                            <div className="nbr">4</div>
                                                                            <div className="text">
                                                                                <h6>Model to be approved</h6>
                                                                                <p>Awaiting customer approval</p>
                                                                            </div>
                                                                            <span className="line"></span>
                                                                        </div>

                                                                        <div className={`single-order-step ${currentIndex >= 4 ? "active" : ""}`}>
                                                                            <div className="nbr">5</div>
                                                                            <div className="text">
                                                                                <h6>Final model delivered</h6>
                                                                                <p>Final video is ready to download</p>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <span className={`badge-tag ${getStatusClass(order.status)}`}>
                                                                {order?.status}
                                                            </span>
                                                        </td>

                                                        <td>{order?.user_product?.name}</td>

                                                        <td>$ {order?.price}</td>

                                                        <td>
                                                            {new Date(order?.created_at).toLocaleString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </td>

                                                        <td>
                                                            {order?.image_url ? (
                                                                <img
                                                                    src={order?.image_url}
                                                                    alt="Product Label"
                                                                    className="order-image"
                                                                />
                                                            ) : (
                                                                <span>No image</span>
                                                            )}
                                                        </td>

                                                        <td>
                                                            <button
                                                                className="order-btn"
                                                                onClick={() => handleShowDetails(order?.id)}
                                                                style={{
                                                                    borderRadius: "10px",
                                                                    padding: "8px",
                                                                    border: "1px solid #F87951",
                                                                }}
                                                            >
                                                                <img src={ListImg} alt="ListImg" />
                                                                <span style={{ color: "#F87951" }}>View details</span>
                                                            </button>

                                                            <button
                                                                className="order-btn"
                                                                style={{
                                                                    color: "#F87951",
                                                                    borderRadius: "10px",
                                                                    margin: "10px",
                                                                    padding: "8px",
                                                                    border: "1px solid #F87951",
                                                                }}
                                                                onClick={() => {
                                                                    setChatOrderId(order?.id);
                                                                    setShowChatModal(true);
                                                                }}
                                                            >
                                                                <img src={commentImg} alt="comment" />
                                                                <span>Chats</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>

                                </table> */}