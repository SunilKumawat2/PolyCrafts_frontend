import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  Admin_show_FAQ,
  Admin_Upload_FAQ,
  Admin_Deleted_FAQ,
  Admin_Updated_FAQ,
} from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import TrashIcon from "../../../../assets/images/trash.svg";
import { FaEdit } from "react-icons/fa";

const Admin_FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // modal state
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    section: "",
  });

  // fetch FAQs
  const fetchFAQs = async (pageNumber = 1) => {
    try {
      const res = await Admin_show_FAQ(pageNumber);
      if (res?.data?.status) {
        setFaqs(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs(page);
  }, [page]);

  // input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // add/edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await Admin_Updated_FAQ(editId, formData);
        if (res?.data?.status) alert("FAQ updated successfully!");
      } else {
        const res = await Admin_Upload_FAQ(formData);
        if (res?.data?.status) alert("FAQ uploaded successfully!");
      }
      handleClose();
      fetchFAQs(page);
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("Failed to save FAQ.");
    }
  };

  // delete FAQ
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await Admin_Deleted_FAQ(id);
      if (res?.data?.status) {
        alert("FAQ deleted successfully!");
        fetchFAQs(page);
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      alert("Failed to delete FAQ.");
    }
  };

  // edit
  const handleEdit = (faq) => {
    setIsEditing(true);
    setEditId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      section: faq.section,
    });
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({ question: "", answer: "", section: "" });
  };

  // Generate page numbers
  const renderPagination = () => {
    if (!pagination) return null;

    const pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === page ? "primary" : "light"}
          className="mx-1"
          onClick={() => setPage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <Button
          variant="secondary"
          className="mx-1"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        {pages}
        <Button
          variant="secondary"
          className="mx-1"
          disabled={page === pagination.last_page}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <main>
      <Header_Admin />
      <section className="admin-faq-sec px-85 pb-5">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>FAQ List</h3>
            <Button
              variant="primary"
              onClick={() => {
                setIsEditing(false);
                setFormData({ question: "", answer: "", section: "" });
                setShow(true);
              }}
            >
              + Add FAQ
            </Button>
          </div>

          {loading ? (
            <p>Loading FAQs...</p>
          ) : (
            <>
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Section</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs?.length > 0 ? (
                    faqs.map((faq, index) => (
                      <tr key={faq.id}>
                        <td>{(page - 1) * (pagination?.per_page || 10) + index + 1}</td>
                        <td>{faq.question}</td>
                        <td>{faq.answer}</td>
                        <td>{faq.section}</td>
                        <td>{new Date(faq.created_at).toLocaleDateString()}</td>
                        <td className="action-cell" style={{ whiteSpace: "nowrap" }}>
                          <FaEdit
                            size={20}
                            style={{ cursor: "pointer", color: "#F87951" }}
                            onClick={() => handleEdit(faq)}
                          />
                          <button
                            className="dlt-btn border-0 bg-transparent"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <img src={TrashIcon} alt="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No FAQs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* ✅ Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </section>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit FAQ" : "Add New FAQ"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Section --</option>
                <option value="About Polycarfts">About Polycarfts</option>
                <option value="Process">Process</option>
                <option value="Membership">Membership</option>
                <option value="Pricing">Pricing</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditing ? "Update FAQ" : "Save FAQ"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </main>
  );
};

export default Admin_FAQ;
