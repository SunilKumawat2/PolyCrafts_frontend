import React, { useEffect, useRef, useState } from "react";
import { Table, Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import {
    Admin_Orders_List,
    Admin_Orders_Details,
    Admin_Orders_Updates,
    Admin_Orders_Upload_demo_videos,
    Admin_Orders_Upload_final_videos,
    Admin_Revision_Requests,
    Admin_Revision_Requests_Update,
    Admin_Orders_Get_Message,
    Admin_Orders_Send_Message,
    Admin_Orders_Show_Label_List,
    Admin_Orders_Label_Update_Status,
    Admin_Orders_Show_Label_Details,
} from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import { useParams } from "react-router-dom";
import { AiOutlineEdit, AiOutlineMessage } from "react-icons/ai";
import ThreeDViewer from "../../../common/three_d_viewer/ThreeDViewer";
import { Get_video_templates_details } from "../../../../api/global/Global";

const Admin_Order_Details = () => {
    const messagesEndRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [loadingDemoId, setLoadingDemoId] = useState(null);
    const [error, setError] = useState("");
    const [viewModalShow, setViewModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [selectedFiles, setSelectedFiles] = useState({});
    const [finalVideos, setFinalVideos] = useState({});
    const [inspectionData, setInspectionData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [updateStatus, setUpdateStatus] = useState("");
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatOrderId, setChatOrderId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const get_admin_id = localStorage.getItem("admin_id");
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [showLabelModal, setShowLabelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [labelList, setLabelList] = useState([]);
    const [loadingLabels, setLoadingLabels] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [loadingLabelDetails, setLoadingLabelDetails] = useState(false);
    const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
    const [revisionRequests, setRevisionRequests] = useState([]);
    const [loadingRevisions, setLoadingRevisions] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedLabelForEdit, setSelectedLabelForEdit] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [loadingUploads, setLoadingUploads] = useState({});
    const [showTemplates, setShowTemplates] = useState(false);
    const [templateDetails, setTemplateDetails] = useState(null);
    const get_order_id = useParams();
    const order_id = get_order_id?.id

    // ✅ Function to set selected final video file
    const setFinalVideoFile = (labelId, file) => {
        setFinalVideos((prev) => ({ ...prev, [labelId]: file }));
    };

    // ✅ Function to set inspection notes
    const setInspectionNotes = (labelId, notes) => {
        setInspectionData((prev) => ({ ...prev, [labelId]: notes }));
    };

    const setSelectedFile = (labelId, file) => {
        setSelectedFiles((prev) => ({ ...prev, [labelId]: file }));
    };

    const handleOpenChat = (orderId) => {
        setChatOrderId(orderId);
        setShowChatModal(true);
    };

    // fetch both APIs
    useEffect(() => {
        fetchData(page);
    }, [page]);

    // --- Fetch Data Function ---
    const fetchData = async (pageNumber = 1) => {
        setLoading(true);
        try {
            // ✅ FIX: pass `pageNumber` directly (don’t overwrite it with =1)
            const [ordersRes, requestsRes] = await Promise.all([
                Admin_Orders_List(pageNumber),
                Admin_Revision_Requests(),
            ]);

            if (ordersRes?.data?.status) {
                setOrders(ordersRes.data.data);
                setPagination(ordersRes.data.pagination);
            }

            if (requestsRes?.data?.status) {
                setRequests(requestsRes.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page); // ✅ fetch whenever page changes
    }, [page]);

    // --- Handle Page Change ---
    const handlePageChange = (newPage) => {
        if (pagination && newPage >= 1 && newPage <= pagination.last_page) {
            setPage(newPage); // ✅ triggers useEffect → fetchData(newPage)
        }
    };

    // helper: get request number for order
    const getRequestNumber = (orderId) => {
        const req = requests.find((r) => String(r.order_id) === String(orderId));
        return req ? req.request_number : "-";
    };
    const handleViewDetails = async (id) => {
        setDetailsLoading(true);
        setViewModalShow(true);
        try {
            const res = await Admin_Orders_Details(id);
            if (res?.data?.status) {
                setSelectedOrder(res.data.data);
            }
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleEditDetails = async (id) => {
        setDetailsLoading(true);
        setEditModalShow(true);
        try {
            const res = await Admin_Orders_Details(id);
            if (res?.data?.status) {
                setSelectedOrder(res.data.data);
                setNewStatus(""); // start empty so admin must choose
            }
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        if (!newStatus) {
            alert("Please select Accept or Reject");
            return;
        }

        setUpdating(true);

        let statusToSend = "";

        if (newStatus === "accept") {
            if (selectedOrder.status === "initiated") {
                alert("This order is already initiated");
                setUpdating(false);
                return;
            }
            statusToSend = "initiated";
        } else if (newStatus === "reject") {
            if (selectedOrder.status === "cancelled") {
                alert("This order is already cancelled");
                setUpdating(false);
                return;
            }
            statusToSend = "cancelled";
        }

        try {
            const formData = new FormData();
            formData.append("_method", "PATCH");
            formData.append("status", statusToSend);

            const res = await Admin_Orders_Updates(selectedOrder.id, formData);

            if (res?.data?.status) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === selectedOrder.id ? { ...o, status: statusToSend } : o
                    )
                );
                setEditModalShow(false);
            } else {
                alert(res?.data?.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case "initiated":
                return "bg-primary text-white"; // blue
            case "under review":
                return "bg-warning text-dark"; // yellow
            case "delivered":
                return "bg-success text-white"; // green
            case "cancelled":
                return "bg-danger text-white"; // red
            case "approved":
                return "bg-success text-white"; // grey
            default:
                return "bg-secondary text-white"; // grey
        }
    };


    const handleUploadDemoVideo = async (labelId) => {
        const file = selectedFiles[labelId];
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("demo_video", file);

        try {
            setLoadingDemoId(labelId); // Start loader for this button

            const res = await Admin_Orders_Upload_demo_videos(labelId, formData);
            if (res?.data?.status) {
                alert("Demo video uploaded successfully!");

                // ✅ Update local state with new demo video URL
                setSelectedOrder((prevOrder) => {
                    if (!prevOrder || !prevOrder.items) return prevOrder;

                    const updatedItems = prevOrder.items.map((item) => {
                        const updatedUserProducts = item.user_products.map((product) => {
                            const updatedLabels = product.user_product_labels.map((label) =>
                                label.id === labelId
                                    ? { ...label, demo_video_url: res.data.data.demo_video_url }
                                    : label
                            );

                            return { ...product, user_product_labels: updatedLabels };
                        });

                        return { ...item, user_products: updatedUserProducts };
                    });

                    return { ...prevOrder, items: updatedItems };
                });

                window.location.reload();
            } else {
                alert("Failed to upload demo video");
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading demo video");
        } finally {
            setLoadingDemoId(null); // Stop loader
        }
    };

    const handleMarkAsUnderReview = async (product) => {
        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("status", "under review");

        try {
            const res = await Admin_Orders_Updates(product.id, formData); // product.id not order_id
            if (res?.data?.status) {
                alert("Product marked as Under Review!");
                fetchData(); // refresh orders
                setViewModalShow(false);
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating status");
        }
    };

    const allLabelsUploaded = (product) => {
        return product?.user_product_labels?.every((label) => label.demo_video_url);
    };

    // ✅ Function to upload final video
    const handleUploadFinalVideo = async (labelId) => {
        if (!finalVideos[labelId]) {
            alert("Please select a final video file!");
            return;
        }

        setLoadingId(labelId); // Start loader for this button

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("video", finalVideos[labelId]);
        formData.append("aspect_ratio", inspectionData[labelId] || "");

        try {
            const res = await Admin_Orders_Upload_final_videos(labelId, formData);
            if (res?.data?.status) {
                alert("Final video uploaded successfully!");
                fetchData(); // refresh list after upload
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            if (error?.data?.errors?.aspect_ratio) {
                alert(error.data.errors.aspect_ratio[0]);
            } else {
                alert("Failed to upload final video");
            }
        } finally {
            setLoadingId(null); // Stop loader
        }
    };

    // ✅ STATUS UPDATE HANDLER
    const handleUpdateRequest = async (e, labelId) => {
        e.preventDefault();

        if (!updateStatus) {
            alert("Please select a status");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("status", updateStatus);
            formData.append("_method", "PATCH");

            setUpdating(true);

            // ✅ Send labelId as param to API call
            const res = await Admin_Revision_Requests_Update(labelId, formData);

            if (res?.data?.status) {
                alert("Request status updated successfully!");
                fetchData(); // Refresh orders
                setShowModal(false);
                window.location.reload()
            } else {
                const errorMsg = res?.data?.message || "Failed to update request";
                alert(errorMsg);
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err?.data?.message || "Error updating request";
            alert(errorMsg);
        } finally {
            setUpdating(false);
        }
    };


    const handleCompleteUpdateRequest = async (e, requestId) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("status", "completed");
            formData.append("_method", "PATCH");

            setUpdating(true);

            const res = await Admin_Revision_Requests_Update(requestId, formData);

            if (res?.data?.status) {
                alert("Request status updated successfully!");
                fetchData(); // refresh data
                setShowModal(false);
                window.location.reload()
            } else {
                const errorMsg = res?.data?.message || "Failed to update request";
                alert(errorMsg);
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err?.data?.message || "Error updating request";
            alert(errorMsg);
        } finally {
            setUpdating(false);
        }
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!chatOrderId || !showChatModal) return;

        let intervalId;

        const loadMessages = async () => {
            try {
                const data = await Admin_Orders_Get_Message(chatOrderId);
                setMessages(data?.data?.data?.data || []);
                scrollToBottom();
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        // Initial load
        loadMessages();

        // Poll every 2 seconds
        intervalId = setInterval(() => {
            loadMessages();
        }, 2000);

        return () => {
            clearInterval(intervalId); // cleanup on unmount or modal close
        };
    }, [chatOrderId, showChatModal]);

    // Send message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("message", newMessage);

        try {
            const res = await Admin_Orders_Send_Message(chatOrderId, formData);
            console.log("sdfmnksdfj", res.data);
            setNewMessage("");

            // ✅ after successful send → refresh chat history
            const updatedData = await Admin_Orders_Get_Message(chatOrderId);
            console.log("updatedData", updatedData);
            setMessages(updatedData?.data?.data?.data);
            scrollToBottom();
        } catch (err) {
            console.error(err);
            alert("Error sending message.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle Label Button Click
    const handleShowLabelList = async () => {
        try {
            setLoadingLabels(true);
            setSelectedOrderId(order_id);
            //   setShowLabelModal(true);

            const res = await Admin_Orders_Show_Label_List(order_id);
            if (res?.data?.status) {
                setLabelList(res?.data?.data || []);
            } else {
                setLabelList([]);
            }
        } catch (err) {
            console.error("Error fetching label list:", err);
            setLabelList([]);
        } finally {
            setLoadingLabels(false);
        }
    };
    useEffect(() => {
        handleShowLabelList()
    }, [])

    const handleLableDetails = async (labelId) => {
        try {
            setLoadingLabelDetails(true);
            setShowProductDetailsModal(true); // ✅ open ProductDetailsShow modal

            const res = await Admin_Orders_Show_Label_Details(labelId);

            if (res?.data?.status) {
                setSelectedLabel(res.data.data);
            } else {
                setSelectedLabel(null);
            }
        } catch (error) {
            console.error("Error fetching label details:", error);
        } finally {
            setLoadingLabelDetails(false);
        }
    };


    const handleCloseVideo = () => {
        setShowVideoModal(false);
        setSelectedLabel(null);
    };

    // ✅ Handle Show Video
    const handleShowVideo = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setShowVideoModal(true);
    };


    const handleLabelStatusUpdate = async (labelId, newStatus) => {
        try {
            const formData = new FormData();
            formData.append("status", newStatus);

            await Admin_Orders_Label_Update_Status(labelId, formData);
            alert("✅ Label status updated successfully");

            // Refresh label list after update
            handleShowLabelList(selectedOrderId);
        } catch (err) {
            console.error("Error updating label status:", err);
            alert("❌ Failed to update label status");
        }
    };

    useEffect(() => {
        const fetchRevisions = async () => {
            if (selectedLabel?.id) {
                try {
                    setLoadingRevisions(true);
                    const response = await Admin_Revision_Requests(selectedLabel.id);
                    setRevisionRequests(response.data?.data || []);
                } catch (err) {
                    console.error("Failed to fetch revision requests:", err);
                    setRevisionRequests([]);
                } finally {
                    setLoadingRevisions(false);
                }
            }
        };

        fetchRevisions();
    }, [selectedLabel]);

    const handleEditStatus = (label) => {
        setSelectedLabelForEdit(label);

        // Pre-select the current status
        setNewStatus(label.status || "");

        // Open modal
        setShowStatusModal(true);
    };

    const getNextStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case "placed":
                return ["initiated", "cancelled"];

            case "initiated":
                return ["under_review"];

            case "under_review":
                return ["approved"];   // move to approved first

            case "approved":
                return ["delivered"];  // your new condition

            default:
                return [];
        }
    };




    const handleUpdateLabelStatus = async () => {
        if (!newStatus) {
            alert("Please select a status");
            return;
        }

        try {
            setUpdatingStatus(true);

            const formData = new FormData();
            // formData.append("_method", "PATCH");
            formData.append("status", newStatus);

            const res = await Admin_Orders_Label_Update_Status(
                selectedLabelForEdit.id,
                formData
            );

            if (res?.data?.status) {
                alert("Status updated successfully!");
                setShowStatusModal(false);
                fetchData(); // ✅ refresh label list
                window.location.reload()
            } else {
                alert(res?.data?.message || "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating status");
        } finally {
            setUpdatingStatus(false);
        }
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
        <main>
            <Header_Admin />
            <section className="admin-seo-sec px-85 pb-5">
                <div className="container mt-4">
                    <h3>Admin Orders Details</h3>

                    {loading && (
                        <div className="text-center my-3">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}

                    {error && <Alert variant="danger">{error}</Alert>}

                    {!loading && !error && (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Label ID</th>
                                    <th>Order Number</th>
                                    <th>Product Name</th>
                                    <th>Revisions Request</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Demo Video</th>
                                    <th>Created At</th>
                                    <th>Product Details</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labelList?.length > 0 ? (
                                    labelList.map((label, index) => (
                                        <tr key={label.id}>
                                            <td>{index + 1}</td>
                                            <td>{label.id}</td>
                                            <td>{label?.user_product?.reference?.order?.order_number}</td>
                                            <td>{label?.user_product?.name}</td>
                                            <td>{label?.pending_revisions_count}</td>
                                            <td>
                                                {label.image_url ? (
                                                    <img
                                                        src={label.image_url}
                                                        alt="Label"
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px",
                                                        }}
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>$ {label.price}</td>
                                            <td>
                                                <span
                                                    className={`badge ${label.status === "under_review"
                                                        ? "bg-warning"
                                                        : label.status === "delivered"
                                                            ? "bg-success"
                                                            : "bg-secondary"
                                                        }`}
                                                >
                                                    {label.status}
                                                </span>
                                            </td>
                                            <td>
                                                {label.demo_video_url ? (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleShowVideo(label.demo_video_url)}
                                                    >
                                                        Show Demo Video
                                                    </Button>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>
                                                {new Date(label.created_at).toLocaleString("en-IN")}
                                            </td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleLableDetails(label.id)} // <-- send label.id
                                                >
                                                    Product Details
                                                </Button>
                                            </td>
                                            <td>
                                                <AiOutlineEdit
                                                    size={18}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#F87951",
                                                        marginRight: "10px",
                                                    }}
                                                    onClick={() => handleEditStatus(label)}
                                                />
                                                <AiOutlineMessage
                                                    size={18}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#F87951",
                                                    }}
                                                    onClick={() => handleOpenChat(label.id)}
                                                />
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            No labels found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}

                    {/* ✅ Pagination */}
                    {pagination && (
                        <div className="d-flex justify-content-center my-3">
                            <Button
                                variant="secondary"
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Prev
                            </Button>

                            {Array.from({ length: pagination.last_page }, (_, i) => (
                                <Button
                                    key={i}
                                    variant={page === i + 1 ? "primary" : "light"}
                                    className="mx-1"
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="secondary"
                                disabled={page === pagination.last_page}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>

            </section>

            {/* Edit Modal */}
            <Modal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailsLoading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                        </div>
                    )}

                    {!detailsLoading && selectedOrder && (
                        <div>
                            <Table bordered hover size="sm">
                                <tbody>
                                    <tr>
                                        <th>User ID</th>
                                        <td>{selectedOrder.user_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>
                                            <Form.Select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                            >
                                                <option value="">Select the request</option>
                                                <option value="accept">Accept</option>
                                                <option value="reject">Reject</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Total Amount</th>
                                        <td>₹{selectedOrder.total_amount}</td>
                                    </tr>
                                    <tr>
                                        <th>Created At</th>
                                        <td>
                                            {new Date(selectedOrder.created_at).toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalShow(false)}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdateStatus}
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Save Changes"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ✅ Modal to Show Demo Video */}
            <Modal
                show={showVideoModal}
                onHide={() => setShowVideoModal(false)}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>🎥 Demo Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedVideo ? (
                        <video
                            src={selectedVideo}
                            controls
                            autoPlay
                            playsInline
                            webkit-playsinline="true"
                            preload="auto"
                            className="w-100 rounded"
                            style={{ maxHeight: "500px", objectFit: "contain" }}
                        />
                    ) : (
                        <p>No video available</p>
                    )}
                </Modal.Body>
            </Modal>

            <Modal
                show={showProductDetailsModal}
                onHide={() => setShowProductDetailsModal(false)}
                size="xl"
                centered
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary">Product Details</Modal.Title>
                </Modal.Header>

                <Modal.Body className="pt-2">
                    {loadingLabelDetails ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Loading details...</p>
                        </div>
                    ) : selectedLabel ? (
                        <>
                            {/* ---------- LABEL DETAILS ---------- */}
                            <div className="card shadow-sm mb-4 border-0">
                                <div className="card-body">
                                    <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">
                                        Label Information
                                    </h5>

                                    <div className="row g-4">
                                        <div className="col-md-5 text-center">
                                            {selectedLabel.image_url ? (
                                                <img
                                                    src={selectedLabel.image_url}
                                                    alt="Label"
                                                    className="img-fluid rounded shadow-sm border"
                                                    style={{ maxHeight: "220px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <p className="text-muted small">No label image available</p>
                                            )}
                                        </div>

                                        <div className="col-md-7">
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                <span className="text-capitalize text-secondary">
                                                    {selectedLabel.status || "N/A"}
                                                </span>
                                            </p>
                                            <p>
                                                <strong>Price:</strong>{" "}
                                                <span className="fw-semibold text-success">
                                                    $ {selectedLabel.price || "0.00"}
                                                </span>
                                            </p>
                                            <p>
                                                <strong>Created At:</strong>{" "}
                                                {new Date(selectedLabel.created_at).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        {selectedLabel.demo_video_url && (
                                            <div className="col-12">
                                                <h3>Demo video</h3>
                                                <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                                                    <video
                                                        playsInline
                                                        webkit-playsinline="true"
                                                        preload="auto"
                                                        controls
                                                        src={selectedLabel.demo_video_url}
                                                        className="w-100"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {
                                            selectedLabel?.status !=
                                            "placed" && (
                                                <div
                                                    className="d-flex align-items-center"
                                                    style={{ gap: "10px" }}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        id={`upload-demo-${selectedLabel.id}`}
                                                        className="form-control"
                                                        style={{ maxWidth: "250px" }}
                                                        onChange={(e) =>
                                                            setSelectedFile(
                                                                selectedLabel.id,
                                                                e.target.files[0]
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleUploadDemoVideo(selectedLabel.id)}
                                                        disabled={loadingDemoId === selectedLabel.id}
                                                    >
                                                        {loadingDemoId === selectedLabel.id ? (
                                                            <>
                                                                <Spinner
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                    className="me-2"
                                                                />
                                                                Uploading...
                                                            </>
                                                        ) : (
                                                            "Upload Demo Label"
                                                        )}
                                                    </button>

                                                </div>
                                            )
                                        }

                                        {/* {selectedLabel?.status ==
                                            "approved" && ( */}
                                        <div className="mt-3 border-top pt-3">
                                            <h6>Final Video & Inspection</h6>
                                            <div
                                                className="d-flex align-items-center"
                                                style={{ gap: "10px" }}
                                            >
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    id={`upload-final-${selectedLabel.id}`}
                                                    className="form-control"
                                                    style={{ maxWidth: "250px" }}
                                                    onChange={(e) =>
                                                        setFinalVideoFile(
                                                            selectedLabel.id,
                                                            e.target.files[0]
                                                        )
                                                    }
                                                />
                                                <select
                                                    className="form-select"
                                                    style={{ maxWidth: "250px" }}
                                                    defaultValue=""
                                                    onChange={(e) => setInspectionNotes(selectedLabel.id, e.target.value)}
                                                >
                                                    <option value="">-- Select Aspect Ratio --</option>

                                                    {selectedLabel?.user_product?.reference?.aspect_ratios
                                                        ? JSON.parse(selectedLabel.user_product.reference.aspect_ratios).map(
                                                            (ratio, index) => (
                                                                <option key={index} value={ratio}>
                                                                    {ratio}
                                                                </option>
                                                            )
                                                        )
                                                        : null}

                                                </select>


                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleUploadFinalVideo(selectedLabel.id)}
                                                    disabled={loadingId === selectedLabel.id} // disable during upload
                                                >
                                                    {loadingId === selectedLabel.id ? (
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                className="me-2"
                                                            />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        "Upload Final Video"
                                                    )}
                                                </button>

                                            </div>
                                        </div>
                                        {/* )} */}

                                        {
                                            selectedLabel?.delivered_videos?.map((delivered_videos_maps) => {
                                                return (
                                                    <>
                                                        <h3>Final Video</h3>
                                                        <video
                                                            playsInline
                                                            webkit-playsinline="true"
                                                            preload="auto"
                                                            controls
                                                            src={delivered_videos_maps?.video_url}
                                                            className="w-100"
                                                        />
                                                        <p>Aspect Ratio: {delivered_videos_maps?.aspect_ratio}</p>
                                                    </>
                                                )
                                            })
                                        }


                                    </div>
                                </div>
                            </div>
                            {/* === Button to Show Templates === */}
                            {
                                !showTemplates && (
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => handleSeeTemplates(selectedLabel?.user_product?.reference?.product_id)}
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
                            {/* ---------- USER PRODUCT DETAILS ---------- */}
                            {selectedLabel.user_product && (
                                <div className="card shadow-sm mb-4 border-0">
                                    <div className="card-body">
                                        <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">
                                            User Product Information
                                        </h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p>
                                                    <strong>Product Name:</strong>{" "}
                                                    {selectedLabel.user_product.name || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>User ID:</strong>{" "}
                                                    {selectedLabel.user_product.user_id}
                                                </p>
                                                <p>
                                                    <strong>Price:</strong> $ {selectedLabel.user_product.price}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p>
                                                    <strong>Comment:</strong>{" "}
                                                    {selectedLabel.user_product.comment || "No comment"}
                                                </p>
                                                {selectedLabel.user_product["3d_model_file_url"] && (
                                                    <p>
                                                        <strong>3D Model File:</strong>{" "}
                                                        <a
                                                            href={
                                                                selectedLabel.user_product["3d_model_file_url"]
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            View 3D Model
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                {
                                    selectedLabel?.user_product?.front_view_image_url && (
                                        <div className="col-md-2 col-sm-6">
                                            <img
                                                src={selectedLabel?.user_product?.front_view_image_url}
                                                alt="Label"
                                                className="img-fluid rounded shadow-sm border"
                                                style={{ maxHeight: "220px", objectFit: "cover" }}
                                            />
                                            <h6 style={{ fontWeight: "bold" }}>   Front View </h6>

                                        </div>
                                    )
                                }
                                {
                                    selectedLabel?.user_product?.side_view_image_url && (
                                        <div className="col-md-2 col-sm-6">
                                            <img
                                                src={selectedLabel?.user_product?.side_view_image_url}
                                                alt="Label"
                                                className="img-fluid rounded shadow-sm border"
                                                style={{ maxHeight: "220px", objectFit: "cover" }}
                                            />
                                            <h6 style={{ fontWeight: "bold" }}>   Side View </h6>
                                        </div>
                                    )
                                }

                                {
                                    selectedLabel?.user_product?.top_view_image_url && (
                                        <div className="col-md-2 col-sm-6">
                                            <img
                                                src={selectedLabel?.user_product?.top_view_image_url}
                                                alt="Label"
                                                className="img-fluid rounded shadow-sm border"
                                                style={{ maxHeight: "220px", objectFit: "cover" }}
                                            />
                                            <h6 style={{ fontWeight: "bold" }}>Top View </h6>
                                        </div>
                                    )
                                }


                                {
                                    selectedLabel?.user_product?.bottom_view_image_url && (
                                        <div className="col-md-2 col-sm-6">
                                            <img
                                                src={selectedLabel?.user_product?.bottom_view_image_url}
                                                alt="Label"
                                                className="img-fluid rounded shadow-sm border"
                                                style={{ maxHeight: "220px", objectFit: "cover" }}
                                            />
                                            <h6 style={{ fontWeight: "bold" }}>Bottom View </h6>
                                        </div>
                                    )
                                }
                                {
                                    selectedLabel?.user_product?.rear_view_image_url && (
                                        <div className="col-md-2 col-sm-6">
                                            <img
                                                src={selectedLabel?.user_product?.rear_view_image_url}
                                                alt="Label"
                                                className="img-fluid rounded shadow-sm border"
                                                style={{ maxHeight: "220px", objectFit: "cover" }}
                                            />
                                            <h6 style={{ fontWeight: "bold" }}>Rear View </h6>
                                        </div>
                                    )
                                }


                            </div>
                            {/* {
                                selectedLabel?.user_product?.["3d_model_file_url"] && (
                                    <div className="single-upload-action">

                                        <div
                                            style={{
                                                marginTop: "10px",
                                                padding: "15px",
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: "5px",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                position: "relative",
                                                height: '100px'
                                            }}
                                        >
                                            <p>Uploaded 3D Model Preview:</p>
                                            <ThreeDViewer
                                                modelUrl={selectedLabel?.user_product?.["3d_model_file_url"]}
                                                height="70px"
                                            />
                                            <div style={{ marginTop: "10px" }}>
                                                <a
                                                    href={selectedLabel?.user_product?.["3d_model_file_url"]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "#F53042" }}
                                                >
                                                    Open 3D Model
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                )
                            } */}


                            {/* ---------- ORDER DETAILS ---------- */}
                            {selectedLabel.user_product?.reference?.order && (
                                <div className="card shadow-sm border-0 mb-4">
                                    <div className="card-body">
                                        <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">
                                            Order Information
                                        </h5>
                                        <p>
                                            <strong>Order Number:</strong>{" "}
                                            {selectedLabel.user_product.reference.order.order_number}
                                        </p>
                                        <p>
                                            <strong>Total Amount:</strong> $
                                            {" "}{selectedLabel.user_product.reference.order.total_amount}
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className="text-capitalize text-secondary">
                                                {selectedLabel.user_product.reference.order.status}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Created At:</strong>{" "}
                                            {new Date(
                                                selectedLabel.user_product.reference.order.created_at
                                            ).toLocaleString("en-IN")}
                                        </p>
                                        <div className="mb-3">
                                            <strong>Aspect Ratios:</strong>{" "}
                                            {selectedLabel?.user_product?.reference?.aspect_ratios ? (
                                                JSON.parse(selectedLabel.user_product.reference.aspect_ratios).map(
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
                            )}
                            {/* ✅ STATUS UPDATE FORM */}


                            {/* ---------- REVISION REQUEST LIST ---------- */}
                            {revisionRequests?.length > 0 && (
                                <div className="card shadow-sm border-0">
                                    <div className="card-body">
                                        <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">
                                            Revision Request List
                                        </h5>



                                        {/* ✅ Existing table remains same */}
                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Request Number</th>
                                                        <th>Message</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Status Update</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {revisionRequests.map((rev, index) => (
                                                        <tr key={rev.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{rev.request_number}</td>
                                                            <td>{rev.message}</td>
                                                            <td className="text-capitalize">{rev.status}</td>
                                                            <td>
                                                                {new Date(rev.created_at).toLocaleString("en-IN")}
                                                            </td>
                                                            <td>
                                                                {
                                                                    rev?.status == "pending" ? (
                                                                        <form onSubmit={(e) => handleUpdateRequest(e, rev?.id)} className="mb-3">
                                                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                                                <label className="fw-semibold text-secondary">
                                                                                    Update Revision Status:
                                                                                </label>

                                                                                <select
                                                                                    className="form-select w-auto"
                                                                                    value={updateStatus}
                                                                                    onChange={(e) => setUpdateStatus(e.target.value)}
                                                                                >
                                                                                    <option value="">-- Select Status --</option>
                                                                                    <option value="accepted">Accepted</option>
                                                                                    <option value="rejected">Rejected</option>
                                                                                </select>

                                                                                <Button
                                                                                    type="submit"
                                                                                    variant="primary"
                                                                                    disabled={updating}
                                                                                    className="px-4"
                                                                                >
                                                                                    {updating ? "Updating..." : "Update"}
                                                                                </Button>
                                                                            </div>
                                                                        </form>
                                                                    ) : (
                                                                        <>
                                                                            {rev?.status == "accepted" && (
                                                                                <Button
                                                                                    variant="success"
                                                                                    onClick={(e) => handleCompleteUpdateRequest(e, rev.id)}
                                                                                    disabled={updating}
                                                                                >
                                                                                    {updating ? "Updating..." : "Request Complete"}
                                                                                </Button>
                                                                            )}

                                                                        </>

                                                                    )
                                                                }

                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No details found.</p>
                    )}
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button
                        variant="secondary"
                        onClick={() => setShowProductDetailsModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Modal */}
            <Modal
                show={viewModalShow}
                onHide={() => setViewModalShow(false)}
                size="xl"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Order Details — {selectedOrder?.order_number}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailsLoading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" />
                        </div>
                    )}

                    {!detailsLoading && selectedOrder && (
                        <div className="order-details">
                            {/* Order Info */}
                            <div className="mb-4">
                                <h5 className="mb-3">Order Information</h5>
                                <Table bordered hover size="sm">
                                    <tbody>
                                        <tr>
                                            <th>Order Number</th>
                                            <td>{selectedOrder?.order_number}</td>
                                        </tr>
                                        <tr>
                                            <th>User ID</th>
                                            <td>{selectedOrder?.user_id}</td>
                                        </tr>
                                        <tr>
                                            <th>Sub Total</th>
                                            <td>₹{selectedOrder?.sub_total_amount}</td>
                                        </tr>
                                        <tr>
                                            <th>Discount</th>
                                            <td>₹{selectedOrder?.discount}</td>
                                        </tr>
                                        <tr>
                                            <th>Revision</th>
                                            <td>₹{selectedOrder?.revision}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Amount</th>
                                            <td>₹{selectedOrder?.total_amount}</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td>
                                                <span
                                                    className={`badge ${getStatusBadgeClass(
                                                        selectedOrder?.status
                                                    )}`}
                                                >
                                                    {selectedOrder?.status}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Created At</th>
                                            <td>
                                                {new Date(selectedOrder.created_at).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Updated At</th>
                                            <td>
                                                {new Date(selectedOrder.updated_at).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            {/* Items Section */}
                            <div className="mb-4">
                                <h5 className="mb-3">Order Items</h5>
                                {selectedOrder?.items?.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="mb-3 p-3 border rounded shadow-sm"
                                    >
                                        <h6>
                                            Item {idx + 1} — Product ID: {item.product_id}
                                        </h6>
                                        <Table bordered hover size="sm">
                                            <tbody>
                                                <tr>
                                                    <th>Product Type</th>
                                                    <td>{item.product_type}</td>
                                                </tr>
                                                <tr>
                                                    <th>Quantity</th>
                                                    <td>{item.quantity}</td>
                                                </tr>
                                                <tr>
                                                    <th>Price</th>
                                                    <td>₹{item.price}</td>
                                                </tr>
                                                <tr>
                                                    <th>Aspect Ratios</th>
                                                    <td>{JSON.parse(item.aspect_ratios).join(", ")}</td>
                                                </tr>
                                            </tbody>
                                        </Table>

                                        {/* User Products */}
                                        <div>
                                            <h6>User Products</h6>
                                            {item?.user_products?.length > 0 ? (
                                                item?.user_products?.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="mb-2 p-2 border rounded"
                                                    >
                                                        <p>
                                                            <strong>Name:</strong> {product.name}
                                                        </p>
                                                        <p>
                                                            <strong>Comment:</strong>{" "}
                                                            {product.comment || "N/A"}
                                                        </p>
                                                        <p>
                                                            <strong>Price:</strong> $ {product.price}
                                                        </p>
                                                        {product["3d_model_file_url"] && (
                                                            <p>
                                                                <strong>3D Model:</strong>{" "}
                                                                <a
                                                                    href={product["3d_model_file_url"]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    View Model
                                                                </a>
                                                            </p>
                                                        )}

                                                        {/* Labels */}
                                                        {product?.user_product_labels?.length > 0 && (
                                                            <div className="mt-3">
                                                                <strong>Labels:</strong>
                                                                <ul className="list-unstyled">
                                                                    {product?.user_product_labels?.map(
                                                                        (label) => (
                                                                            <li
                                                                                key={label.id}
                                                                                className="d-flex flex-column mb-3 border rounded p-3"
                                                                                style={{ gap: "15px" }}
                                                                            >
                                                                                {/* Label Image */}
                                                                                {label?.image_url ? (
                                                                                    <img
                                                                                        src={label?.image_url}
                                                                                        alt="label"
                                                                                        style={{
                                                                                            maxWidth: "100px",
                                                                                            borderRadius: "5px",
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <span className="text-muted">
                                                                                        No image
                                                                                    </span>
                                                                                )}

                                                                                {/* Price */}
                                                                                <span>
                                                                                    <strong>Price:</strong> $ {label.price}
                                                                                </span>

                                                                                {/* Show uploaded demo video if exists */}
                                                                                {selectedOrder?.status != "placed" && (
                                                                                    <>
                                                                                        {label.demo_video_url ? (
                                                                                            <video
                                                                                                playsInline
                                                                                                webkit-playsinline="true"
                                                                                                preload="auto"
                                                                                                controls
                                                                                                style={{ maxWidth: "300px" }}
                                                                                                src={label.demo_video_url}
                                                                                            />
                                                                                        ) : // <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                                                                            //     <input
                                                                                            //         type="file"
                                                                                            //         accept="video/*"
                                                                                            //         id={`upload-demo-${label.id}`}
                                                                                            //         className="form-control"
                                                                                            //         style={{ maxWidth: "250px" }}
                                                                                            //         onChange={(e) => setSelectedFile(label.id, e.target.files[0])}
                                                                                            //     />
                                                                                            //     <button
                                                                                            //         className="btn btn-primary"
                                                                                            //         onClick={() => handleUploadDemoVideo(label.id)}
                                                                                            //     >
                                                                                            //         Upload Demo Label
                                                                                            //     </button>
                                                                                            // </div>
                                                                                            null}
                                                                                    </>
                                                                                )}

                                                                                <div
                                                                                    className="d-flex align-items-center"
                                                                                    style={{ gap: "10px" }}
                                                                                >
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="video/*"
                                                                                        id={`upload-demo-${label.id}`}
                                                                                        className="form-control"
                                                                                        style={{ maxWidth: "250px" }}
                                                                                        onChange={(e) =>
                                                                                            setSelectedFile(
                                                                                                label.id,
                                                                                                e.target.files[0]
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <button
                                                                                        className="btn btn-primary"
                                                                                        onClick={() => handleUploadDemoVideo(selectedLabel.id)}
                                                                                        disabled={loadingDemoId === selectedLabel.id}
                                                                                    >
                                                                                        {loadingDemoId === selectedLabel.id ? (
                                                                                            <>
                                                                                                <Spinner
                                                                                                    as="span"
                                                                                                    animation="border"
                                                                                                    size="sm"
                                                                                                    role="status"
                                                                                                    aria-hidden="true"
                                                                                                    className="me-2"
                                                                                                />
                                                                                                Uploading...
                                                                                            </>
                                                                                        ) : (
                                                                                            "Upload Demo Label"
                                                                                        )}
                                                                                    </button>

                                                                                </div>

                                                                                {/* ✅ Final Video Upload Section if status = approved */}

                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>

                                                                {/* Mark as Under Review button */}
                                                                {selectedOrder?.status == "initiated" && (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        disabled={!allLabelsUploaded(product)}
                                                                        onClick={() =>
                                                                            handleMarkAsUnderReview(selectedOrder)
                                                                        }
                                                                    >
                                                                        Mark as Under Review
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>
                                                    <em>No user products found.</em>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setViewModalShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* <----- Request deatils Modal ---------> */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fw-bold text-primary">
                        Revision Request Details
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loadingDetails ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : selectedRequest ? (
                        <div className="px-2">
                            {/* Request Info */}
                            <h5 className="mb-3 text-secondary border-bottom pb-2">
                                Request Information
                            </h5>
                            <div className="row mb-3">
                                <div className="col-md-6 mb-2">
                                    <strong>Request Number:</strong>
                                    <div>{selectedRequest.request_number}</div>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Status:</strong>
                                    <div>
                                        <span
                                            className={`badge ${selectedRequest?.status == "pending"
                                                ? "bg-warning text-dark"
                                                : selectedRequest?.status == "accepted"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                                }`}
                                        >
                                            {selectedRequest?.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-12 mb-2">
                                    <strong>Message:</strong>
                                    <div className="text-muted fst-italic">
                                        {selectedRequest?.message}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Price:</strong>
                                    <div>$ {selectedRequest?.price}</div>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Created At:</strong>
                                    <div>
                                        {new Date(selectedRequest.created_at).toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Info */}
                            <h5 className="mt-4 mb-3 text-secondary border-bottom pb-2">
                                Order Information
                            </h5>
                            <div className="row mb-3">
                                <div className="col-md-6 mb-2">
                                    <strong>Order Number:</strong>
                                    <div>{selectedRequest.order?.order_number}</div>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>User ID:</strong>
                                    <div>{selectedRequest.order?.user_id}</div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <strong>Sub Total:</strong>
                                    <div>₹{selectedRequest.order?.sub_total_amount}</div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <strong>Discount:</strong>
                                    <div>₹{selectedRequest.order?.discount}</div>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <strong>Total:</strong>
                                    <div className="fw-bold text-success">
                                        ₹{selectedRequest.order?.total_amount}
                                    </div>
                                </div>
                                <div className="col-md-12 mb-2">
                                    <strong>Status:</strong>
                                    <div>
                                        <span
                                            className={`badge ${getStatusBadgeClass(
                                                selectedRequest?.order?.status
                                            )}`}
                                        >
                                            {selectedRequest.order?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Section */}
                            {selectedRequest?.status == "pending" && (
                                <>
                                    <h5 className="mt-4 mb-3 text-secondary border-bottom pb-2">
                                        Update Request Status
                                    </h5>
                                    <form onSubmit={handleUpdateRequest}>
                                        <div className="row align-items-end">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    Select Status
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={updateStatus}
                                                    onChange={(e) => setUpdateStatus(e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Choose --</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    disabled={updating}
                                                    className="w-100"
                                                >
                                                    {updating ? (
                                                        <>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />{" "}
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        "Update Request"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-danger text-center my-4">No details found</p>
                    )}
                </Modal.Body>

                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    {selectedRequest?.status == "accepted" && (
                        <Button variant="success" onClick={handleCompleteUpdateRequest}>
                            Request Complete
                        </Button>
                    )}
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

                <Modal.Body
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "500px",
                        padding: "0",
                    }}
                >
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
                            const get_admin_id = localStorage.getItem("admin_id");

                            const isAdminSender =
                                msg?.sender_type == "App\\Models\\Admin" &&
                                msg?.sender_id?.toString() == get_admin_id?.toString();

                            const isUserSender = msg?.sender_type == "App\\Models\\User";

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        alignSelf: isAdminSender ? "flex-end" : "flex-start", // admin messages right
                                        backgroundColor: isAdminSender ? "#F87951" : "#fff", // green for admin, white for user
                                        color: isAdminSender ? "#fff" : "#000",
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
                                            color: isAdminSender ? "#eee" : "#888",
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
                    <div
                        style={{
                            display: "flex",
                            padding: "10px",
                            borderTop: "1px solid #ddd",
                            backgroundColor: "#fff",
                        }}
                    >
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

            {/* <------- Label show Modal --------> */}
            <Modal
                show={showLabelModal}
                onHide={() => setShowLabelModal(false)}
                size="xl"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Order #{selectedOrderId} — Label List</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loadingLabels ? (
                        <p>Loading labels...</p>
                    ) : labelList.length > 0 ? (
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Label ID</th>
                                    <th>Product Name</th>
                                    <th>Label Price</th>
                                    <th>Current Status</th>
                                    <th>Change Status</th>
                                    <th>Label</th>
                                    <th>Label Demo Video</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labelList.map((label, i) => {
                                    // Define allowed next statuses based on current label.status
                                    let allowedStatuses = [];

                                    if (label.status == "placed") {
                                        allowedStatuses = ["initiated"];
                                    } else if (label.status == "initiated") {
                                        allowedStatuses = ["under_review"];
                                    } else if (label.status == "under_review") {
                                        allowedStatuses = ["delivered", "cancelled"];
                                    } else {
                                        allowedStatuses = []; // delivered/cancelled — no more transitions
                                    }

                                    return (
                                        <tr key={label.id}>
                                            <td>{i + 1}</td>
                                            <td>{label.id}</td>
                                            <td>{label?.user_product?.name}</td>
                                            <td>{label?.price}</td>
                                            <td>
                                                <span className="badge bg-info text-dark">{label?.status}</span>
                                            </td>
                                            <td>
                                                {allowedStatuses.length > 0 ? (
                                                    <Form.Select
                                                        defaultValue=""
                                                        onChange={(e) =>
                                                            handleLabelStatusUpdate(label.id, e.target.value)
                                                        }
                                                    >
                                                        <option value="">Select new status</option>
                                                        {allowedStatuses.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    <span className="text-muted">No further changes</span>
                                                )}
                                            </td>
                                            <td>
                                                <img src={label?.image_url} style={{ width: "70px", height: "70px" }} />
                                            </td>
                                            <td>
                                                {label.demo_video_url ? (
                                                    <Button
                                                        className="btn btn-primary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedVideo(label.demo_video_url);
                                                            setShowVideoModal(true);
                                                        }}
                                                    >
                                                        🎥 Show Demo Video
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted">No Video</span>
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted">No labels found for this order.</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLabelModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Update Label Status */}
            <Modal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Label Status</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedLabelForEdit ? (
                        <>
                            <p>
                                <strong>Label ID:</strong> {selectedLabelForEdit.id}
                            </p>
                            <p>
                                <strong>Current Status:</strong>{" "}
                                <span className="text-capitalize">
                                    {selectedLabelForEdit.status}
                                </span>
                            </p>

                            <div className="mt-3">
                                <label className="form-label fw-semibold">Select New Status:</label>
                                <select
                                    className="form-select"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="">-- Select Status --</option>
                                    {getNextStatusOptions(selectedLabelForEdit.status).map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </>
                    ) : (
                        <p>No label selected.</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        disabled={updatingStatus}
                        onClick={handleUpdateLabelStatus}
                    >
                        {updatingStatus ? "Updating..." : "Update"}
                    </Button>
                </Modal.Footer>
            </Modal>



            <Footer />
        </main>
    );
};

export default Admin_Order_Details;
