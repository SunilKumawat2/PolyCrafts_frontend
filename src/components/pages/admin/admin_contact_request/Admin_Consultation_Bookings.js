import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import {
  Admin_Get_consultation_bookings,
  Admin_Get_consultation_bookings_Details,
  Admin_Update_consultation_bookings,
  Admin_Delete_consultation_bookings,
} from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";

const Admin_Consultation_Bookings = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: "",
    meet_link: "",
    reason: "",
  });

  const handleUpdateConsultation = async () => {
    if (!selectedConsultation) return;

    const data = new FormData();
    data.append("_method", "PATCH");
    data.append("status", editFormData.status);
    data.append("meet_link", editFormData.meet_link);
    data.append("reason", editFormData.reason);

    try {
      await Admin_Update_consultation_bookings(selectedConsultation.id, data);
      alert("Consultation updated successfully!");
      setShowEditModal(false);
      fetchConsultations(); // Refresh table
    } catch (error) {
      if (error && error.data && error.data.errors) {
        const errors = error.data.errors;
        const firstKey = Object.keys(errors)[0];
        const firstErrorMessage = errors[firstKey][0];
        alert(firstErrorMessage);
      } else if (error && error.data && error.data.message) {
        alert(error.data.message);
      } else {
        alert("Failed to update consultation.");
      }
      console.error("Error updating consultation:", error);
    }
  };

  const handleEditClick = async (id) => {
    setLoadingDetails(true);
    try {
      const res = await Admin_Get_consultation_bookings_Details(id);
      const consultation = res.data.data;

      setSelectedConsultation(consultation);

      setEditFormData({
        status: consultation.status || "",
        meet_link: consultation.meet_link || "",
        reason: consultation.reason || "",
      });

      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching consultation details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

const fetchConsultations = async (currentPage = 1) => {
    setLoading(true);
    try {
        const res = await Admin_Get_consultation_bookings(currentPage, 10);
        console.log("Consultations API response:", res.data);

        if (res?.data?.status) {
            setConsultations(res.data?.data || []);
            setPagination(res.data.pagination); // ✅ Correct location
        }
    } catch (error) {
        console.error("Error fetching consultations:", error);
        setError(error?.response?.data?.message || "Failed to fetch consultations");
    } finally {
        setLoading(false);
    }
};



const renderPagination = () => {
    if (!pagination) return null;

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.last_page) return;
        setPage(newPage);
    };

    const pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
        pages.push(
            <Button
                key={i}
                variant={i === page ? "primary" : "light"}
                className="mx-1"
                onClick={() => handlePageChange(i)}
            >
                {i}
            </Button>
        );
    }

    return (
      <mian>
        <section className="admin-seo-sec px-85 pb-5">
        <div className="d-flex justify-content-center mt-3">
            <Button
                variant="light"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
            >
                Prev
            </Button>
            {pages}
            <Button
                variant="light"
                disabled={page === pagination.last_page}
                onClick={() => handlePageChange(page + 1)}
            >
                Next
            </Button>
        </div>
        </section>
      </mian>
        
    );
};


 useEffect(() => {
    fetchConsultations(page);
}, [page]);


  const handleViewClick = async (id) => {
    setLoadingDetails(true);
    try {
      const res = await Admin_Get_consultation_bookings_Details(id);
      setSelectedConsultation(res.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching consultation details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this consultation?"
    );
    if (!confirmDelete) return;

    try {
      await Admin_Delete_consultation_bookings(id);
      alert("Consultation deleted successfully.");
      fetchConsultations(); // Refresh table
    } catch (error) {
      console.error("Error deleting consultation:", error);
      alert("Failed to delete consultation.");
    }
  };

  return (
    <main>
      <Header_Admin />
      <div className="container mt-4">
        <h3>Consultation Bookings</h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {consultations?.length > 0 ? (
                consultations?.map((consultation) => (
                  <tr key={consultation?.id}>
                    <td>{consultation?.id}</td>
                    <td>{consultation?.name}</td>
                    <td>{consultation?.email}</td>
                    <td>{consultation?.company_name}</td>
                    <td>{consultation?.status}</td>
                    <td>
                      <FaEye
                        style={{
                          cursor: "pointer",
                          color: "#F87951",
                          marginRight: "10px",
                        }}
                        title="View Details"
                        onClick={() => handleViewClick(consultation.id)}
                      />
                      <FaEdit
                        style={{
                          cursor: "pointer",
                          color: "#F87951",
                          marginRight: "10px",
                        }}
                        title="Edit Consultation"
                        onClick={() => handleEditClick(consultation.id)}
                      />
                      <FaTrash
                        style={{
                          cursor: "pointer",
                          color: "#F87951",
                          marginRight: "10px",
                        }}
                        title="Delete Consultation"
                        onClick={() => handleDeleteClick(consultation.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No consultation bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
          {/* ✅ Pagination */}
      {renderPagination()}
      </div>

      {/* View details */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Consultation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetails ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          ) : selectedConsultation ? (
            <div className="p-3">
              <div className="mb-3">
                <h5 className="text-primary">Booking Information</h5>
                <hr />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <th>ID</th>
                        <td>{selectedConsultation.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{selectedConsultation.name}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{selectedConsultation.email}</td>
                      </tr>
                      <tr>
                        <th>Company</th>
                        <td>{selectedConsultation.company_name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="col-md-6">
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <th>Phone</th>
                        <td>{selectedConsultation.phone_number}</td>
                      </tr>
                      <tr>
                        <th>Booking Date</th>
                        <td>{selectedConsultation.booking_date}</td>
                      </tr>
                      <tr>
                        <th>Start Time</th>
                        <td>{selectedConsultation.booking_start_time}</td>
                      </tr>
                      <tr>
                        <th>End Time</th>
                        <td>{selectedConsultation.booking_end_time}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span
                            className={`badge ${
                              selectedConsultation.status === "approved"
                                ? "bg-success"
                                : selectedConsultation.status === "pending"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            {selectedConsultation.status}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedConsultation.meet_link && (
                <div className="mt-3">
                  <h6>Meeting Link:</h6>
                  <a
                    href={selectedConsultation.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedConsultation.meet_link}
                  </a>
                </div>
              )}

              {selectedConsultation.reason && (
                <div className="mt-3">
                  <h6>Reason:</h6>
                  <p>{selectedConsultation.reason}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center">No details found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Consultation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetails ? (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          ) : selectedConsultation ? (
            <div className="p-3">
              <div className="form-group mb-3">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Meeting Link</label>
                <input
                  type="text"
                  name="meet_link"
                  className="form-control"
                  value={editFormData.meet_link}
                  onChange={handleEditInputChange}
                  placeholder="Enter meeting link"
                />
              </div>

              <div className="form-group mb-3">
                <label>Reason</label>
                <textarea
                  name="reason"
                  className="form-control"
                  value={editFormData.reason}
                  onChange={handleEditInputChange}
                  placeholder="Enter reason"
                ></textarea>
              </div>
            </div>
          ) : (
            <p className="text-center">No details found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateConsultation}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </main>
  );
};

export default Admin_Consultation_Bookings;
