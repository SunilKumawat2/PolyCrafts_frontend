import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  Admin_show_Contact,
  Admin_Deleted_Contact,
  Admin_Updated_Contact,
} from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import TrashIcon from "../../../../assets/images/trash.svg";
import { FaEdit } from "react-icons/fa";

const Admin_Contact_Request = () => {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // modal state for editing
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    _method: "PATCH",
  });

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setFormData({ status: "", _method: "PATCH" });
  };

  const handleShow = (contact) => {
    setEditId(contact.id);
    setFormData({
      status: contact.status,
      _method: "PATCH",
    });
    setShow(true);
  };

  // fetch contacts with pagination
  const fetchContacts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await Admin_show_Contact(pageNumber);
      if (res?.status) {
        setContacts(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Admin_Updated_Contact(editId, formData);
      if (res?.data?.status) {
        alert("Contact updated successfully!");
        handleClose();
        fetchContacts(page);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact.");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact request?")) return;
    try {
      const res = await Admin_Deleted_Contact(id);
      if (res?.data?.status) {
        alert("Contact deleted successfully!");
        fetchContacts(page);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact.");
    }
  };

  // pagination change
  const handlePageChange = (newPage) => {
    if (pagination && newPage >= 1 && newPage <= pagination.last_page) {
      setPage(newPage);
    }
  };

  return (
    <main>
      <Header_Admin />
      <section className="admin-contact-sec px-85 pb-5">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Contact Requests</h3>
          </div>

          {loading ? (
            <p>Loading contact requests...</p>
          ) : (
            <>
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Website</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Newsletter</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                      <tr key={contact.id}>
                        <td>{(page - 1) * (pagination?.per_page || 10) + index + 1}</td>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.company_website || "-"}</td>
                        <td>{contact.message}</td>
                        <td>{contact.status}</td>
                        <td>{contact.allow_newsletter}</td>
                        <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <FaEdit
                            size={20}
                            style={{ cursor: "pointer", color: "#F87951", marginRight: "10px" }}
                            onClick={() => handleShow(contact)}
                          />
                          <button
                            className="dlt-btn border-0 bg-transparent"
                            onClick={() => handleDelete(contact.id)}
                          >
                            <img src={TrashIcon} alt="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No contact requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

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
            </>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Contact
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </main>
  );
};

export default Admin_Contact_Request;
