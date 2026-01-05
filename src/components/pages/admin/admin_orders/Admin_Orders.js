import React, { useEffect, useRef, useState } from "react";
import { Table, ButtonGroup, Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEdit, AiOutlineMessage } from "react-icons/ai";
import {
  Admin_Orders_List,
  Admin_Orders_Details,
  Admin_Orders_Updates,
  Admin_Orders_Upload_demo_videos,
  Admin_Orders_Upload_final_videos,
  Admin_Delete_Orders,
  Admin_Revision_Requests,
  Admin_Revision_Requests_Details,
  Admin_Revision_Requests_Update,
  Admin_Orders_Get_Message,
  Admin_Orders_Send_Message,
  Admin_Orders_Show_Label_List,
  Admin_Orders_Label_Update_Status,
} from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

const Admin_Orders = () => {
  const messagesEndRef = useRef(null);
  const [orders, setOrders] = useState([]);
  console.log("orders", orders)
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedTimespan, setSelectedTimespan] = useState("all");

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
  const fetchData = async (pageNumber = 1, timespan = selectedTimespan) => {
    setLoading(true);
    try {
      const [ordersRes, requestsRes] = await Promise.all([
        Admin_Orders_List(pageNumber, 30, timespan),
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
      // setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Timespan Filter Change ---
  const handleTimespanChange = (value) => {
    setSelectedTimespan(value);
    setPage(1); // reset page when filter changes
  };


  useEffect(() => {
    fetchData(page, selectedTimespan);
  }, [page, selectedTimespan]);

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
      const res = await Admin_Orders_Upload_demo_videos(labelId, formData);
      if (res?.data?.status) {
        alert("Demo video uploaded successfully!");

        // Update selectedOrder with new label video URL
        setSelectedOrder((prevOrder) => {
          const updatedItems = prevOrder.items.map((item) => {
            const updatedLabels = item.user_products.flatMap((product) =>
              product.user_product_labels.map((label) =>
                label.id === labelId
                  ? { ...label, demo_video_url: res.data.data.demo_video_url }
                  : label
              )
            );
            return {
              ...item,
              user_products: item.user_products.map((product) => ({
                ...product,
                user_product_labels: updatedLabels.filter((l) =>
                  product.user_product_labels.some((pl) => pl.id === l.id)
                ),
              })),
            };
          });
          return { ...prevOrder, items: updatedItems };
        });
      } else {
        alert("Failed to upload demo video");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading demo video");
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

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("video", finalVideos[labelId]);
    formData.append("aspect_ratio", inspectionData[labelId] || "");

    try {
      const res = await Admin_Orders_Upload_final_videos(labelId, formData);
      if (res?.data?.status) {
        alert("Final video uploaded successfully!");
        fetchData(); // refresh list after upload
      }
    } catch (err) {
      console.error(err);
      if (error?.data?.errors) {
        alert(error?.data?.errors?.aspect_ratio[0])
      }
      alert("Failed to upload final video");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await Admin_Delete_Orders(id);
      if (res?.data?.status) {
        alert("Order deleted successfully!");
        setOrders((prev) => prev.filter((o) => o.id !== id)); // remove deleted order from UI
      } else {
        alert(res?.data?.message || "Failed to delete order");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting order");
    }
  };

  const handle_Request_ViewDetails = async (id) => {
    try {
      setLoadingDetails(true);
      setShowModal(true); // open modal immediately
      const res = await Admin_Revision_Requests_Details(id);
      if (res?.data?.status) {
        setSelectedRequest(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch revision request details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleUpdateRequest = async (e) => {
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
      const res = await Admin_Revision_Requests_Update(
        selectedRequest.id,
        formData
      );

      if (res?.data?.status) {
        alert("Request status updated successfully!");
        fetchData(); // Refresh orders
        setShowModal(false);
      } else {
        // ✅ Show API error message
        const errorMsg = res?.data?.message || "Failed to update request";
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);

      // Try to extract error message from API response
      const errorMsg = err?.data?.message || "Error updating request";
      alert(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteUpdateRequest = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("status", "completed");
      formData.append("_method", "PATCH");

      setUpdating(true);
      const res = await Admin_Revision_Requests_Update(
        selectedRequest.id,
        formData
      );

      if (res?.data?.status) {
        alert("Request status updated successfully!");
        fetchData(); // Refresh orders
        setShowModal(false);
      } else {
        // ✅ Show API error message
        const errorMsg = res?.data?.message || "Failed to update request";
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);

      // Try to extract error message from API response
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
  const handleShowLabelList = async (orderId) => {
    try {
      setLoadingLabels(true);
      setSelectedOrderId(orderId);
      setShowLabelModal(true);

      const res = await Admin_Orders_Show_Label_List(orderId);
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


  return (
    <main>
      <Header_Admin />

      <section>
        <div className="container mt-4">
          <h3>Admin Orders</h3>
          <div className="d-flex justify-content-end mb-3">
            <ButtonGroup>
              <Button
                variant={selectedTimespan == "all" ? "primary" : "outline-danger"}
                onClick={() => handleTimespanChange("all")}
              >
                All
              </Button>
              <Button
                variant={selectedTimespan == "7days" ? "primary" : "outline-danger"}
                onClick={() => handleTimespanChange("7days")}
              >
                7 Days
              </Button>
              <Button
                variant={selectedTimespan == "15days" ? "primary" : "outline-danger"}
                onClick={() => handleTimespanChange("15days")}
              >
                15 Days
              </Button>
              <Button
                variant={selectedTimespan == "30days" ? "primary" : "outline-danger"}
                onClick={() => handleTimespanChange("30days")}
              >
                30 Days
              </Button>
            </ButtonGroup>
          </div>

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
                  <th>Order Number</th>
                  <th>Request Number</th>
                  <th>User ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Label</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.length > 0 ? (
                  orders.map((order, index) => {
                    const request = requests.find(
                      (r) => String(r.order_id) === String(order.id)
                    );

                    return (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{order?.order_number}</td>
                        <td>
                          {order ? order?.pending_revisions_count : "-"}
                          {order?.status === "under review" && request && (
                            <AiOutlineEye
                              size={18}
                              style={{
                                cursor: "pointer",
                                color: "#F87951",
                                marginLeft: "10px",
                              }}
                              onClick={() => handle_Request_ViewDetails(request.id)}
                            />
                          )}
                        </td>
                        <td>{order?.user_id}</td>
                        <td>$ {order?.total_amount}</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(order.status)}`}
                          >
                            {order?.status}
                          </span>
                        </td>
                        <td>
                          {new Date(order?.created_at).toLocaleString("en-IN")}
                        </td>

                        {/* ✅ Label Button */}
                        {/* <td>
                        <button
                          className="btn btn-primary"
                          // onClick={() => handleShowLabelList(order.id)}
                        >
                          <Link to={`/Admin-order-details/${order.id}`}>
                          Label
                          </Link>
                        </button>
                      </td> */}

                        <td>
                          <button className="btn btn-primary">
                            <Link
                              to={`/Admin-order-details/${order.id}`}
                              style={{
                                textDecoration: "none",
                                color: "white",
                              }}
                            >
                              Order Details
                            </Link>
                          </button>
                        </td>


                        {/* ✅ Action Icons */}
                        <td>
                          {/* <AiOutlineEye
                          size={18}
                          style={{
                            cursor: "pointer",
                            color: "#F87951",
                            marginRight: "10px",
                          }}
                          onClick={() => handleViewDetails(order.id)}
                        /> */}
                          {/* {order.status.toLowerCase() === "placed" && (
                          <AiOutlineEdit
                            size={18}
                            style={{
                              cursor: "pointer",
                              color: "#F87951",
                              marginRight: "10px",
                            }}
                            onClick={() => handleEditDetails(order.id)}
                          />
                        )} */}
                          <AiOutlineDelete
                            size={18}
                            style={{
                              cursor: "pointer",
                              color: "#F87951",
                              marginRight: "10px",
                            }}
                            onClick={() => handleDeleteOrder(order.id)}
                          />
                          {/* <AiOutlineMessage
                          size={18}
                          style={{
                            cursor: "pointer",
                            color: "#F87951",
                          }}
                          onClick={() => handleOpenChat(order.id)}
                        /> */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No orders found
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

      {/* Demo Video Modal */}
      <Modal
        show={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>🎬 Demo Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedVideoUrl ? (
            <video
              src={selectedVideoUrl}
              controls
              autoPlay
              playsInline
              webkit-playsinline="true"
              preload="auto"
              className="w-100 rounded"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video available</p>
          )}
        </Modal.Body>
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
                              <strong>Price:</strong> ₹{product.price}
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
                                          <strong>Price:</strong> ₹{label.price}
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
                                            onClick={() =>
                                              handleUploadDemoVideo(label.id)
                                            }
                                          >
                                            Upload Demo Label
                                          </button>
                                        </div>

                                        {/* ✅ Final Video Upload Section if status = approved */}
                                        {selectedOrder?.status ===
                                          "approved" && (
                                            <div className="mt-3 border-top pt-3">
                                              <h6>Final Video & Inspection</h6>
                                              <div
                                                className="d-flex align-items-center"
                                                style={{ gap: "10px" }}
                                              >
                                                <input
                                                  type="file"
                                                  accept="video/*"
                                                  id={`upload-final-${label.id}`}
                                                  className="form-control"
                                                  style={{ maxWidth: "250px" }}
                                                  onChange={(e) =>
                                                    setFinalVideoFile(
                                                      label.id,
                                                      e.target.files[0]
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Inspection notes"
                                                  className="form-control"
                                                  style={{ maxWidth: "250px" }}
                                                  onChange={(e) =>
                                                    setInspectionNotes(
                                                      label.id,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <button
                                                  className="btn btn-success"
                                                  onClick={() =>
                                                    handleUploadFinalVideo(
                                                      label.id
                                                    )
                                                  }
                                                >
                                                  Upload Final Video
                                                </button>
                                              </div>
                                            </div>
                                          )}
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
                  <div>₹{selectedRequest?.price}</div>
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
                              setSelectedVideoUrl(label.demo_video_url);
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


      <Footer />
    </main>
  );
};

export default Admin_Orders;
