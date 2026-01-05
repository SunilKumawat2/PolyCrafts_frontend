"use client";

import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal, Card } from "react-bootstrap";
import {
  Admin_Home_Video_Sections,
  Admin_Home_Video_Details_Sections,
  Admin_show_Upload_Video_teampletas,
  Admin_Home_Video_Store_Sections,
  Admin_Home_Video_Update_Sections,
  Admin_Home_Video_Delete_Sections,
} from "../../../../api/admin/Admin";
import Header_Login from "../../../common/header/Header_Login";
import Footer from "../../../common/footer/Footer";
import { FaEdit, FaEye } from "react-icons/fa";
import TrashIcon from "../../../../assets/images/trash.svg";
import Header_Admin from "../../../common/header/Header_Admin";

const Admin_Home_Videos_Sections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoTemplates, setVideoTemplates] = useState([]);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    access_type: "guest",
    method: "custom",
    values: [],
    sort: "",
    condition: { operator: "", value: "" },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValueChange = (index, value) => {
    const newValues = [...formData.values];
    newValues[index] = value;
    setFormData({ ...formData, values: newValues });
  };

  const addValueField = () => {
    setFormData({ ...formData, values: [...formData.values, ""] });
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("heading", formData.heading);
      fd.append("subheading", formData.subheading);
      fd.append("access_type", formData.access_type);
      fd.append("method", formData.method);
      fd.append("sort", formData.sort);

      if (formData.method === "condition") {
        fd.append("values[0][field]", "price");
        fd.append("values[0][operator]", formData.condition.operator);
        fd.append("values[0][value]", formData.condition.value);
      } else {
        formData.values.forEach((val, i) => {
          fd.append(`values[${i}]`, val);
        });
      }

      // Add _method patch if editing
      if (editingSectionId) {
        fd.append("_method", "PATCH");
      }

      let res;
      if (editingSectionId) {
        res = await Admin_Home_Video_Update_Sections(editingSectionId, fd);
      } else {
        res = await Admin_Home_Video_Store_Sections(fd);
      }

      if (res?.data?.status) {
        alert(
          editingSectionId
            ? "Section updated successfully!"
            : "Section added successfully!"
        );
        setShowAddModal(false);
        setEditingSectionId(null);
        fetchSections();
        window.location.reload()
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save section");
    }
  };

  const fetchSections = async () => {
    try {
      const res = await Admin_Home_Video_Sections(page, 30);
      if (res?.data?.status) {
        setSections(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // setError(err?.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchSections();
}, [page]);


  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewDetails = async (id) => {
    setDetailsLoading(true);
    try {
      const res = await Admin_Home_Video_Details_Sections(id);
      if (res?.data?.status) {
        setSelectedSection(res.data);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Details fetch error:", err);
      alert("Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await Admin_show_Upload_Video_teampletas(page, 30); // ✅ 30 per page
        if (res?.status) {
          setVideoTemplates(res.data); // ✅ store API results
          setPagination(res.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch video templates", error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, [page]);

 const renderPagination = () => {
  if (!pagination) return null;

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.last_page) return;
    setPage(newPage);
    setLoading(true);
    try {
      const res = await Admin_Home_Video_Sections(newPage, 30);
      if (res?.data?.status) {
        setSections(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const pages = [];
for (let i = 1; i <= pagination.last_page; i++) {
  pages.push(
    <Button
      key={i}
      variant={i === page ? "primary" : "light"}
      className="mx-1 d-flex align-items-center justify-content-center rounded-circle"
      style={{
        width: "50px",
        height: "50px",
        fontSize: "16px",
        fontWeight: "500",
        marginTop:'60px'
      }}
      onClick={() => handlePageChange(i)}
    >
      {i}
    </Button>
  );
}


  return (
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
  );
};


  const handleCheckboxChange = (id) => {
    let updated = [...formData.values];
    if (updated.includes(id)) {
      updated = updated.filter((v) => v !== id);
    } else {
      updated.push(id);
    }
    setFormData({ ...formData, values: updated });
  };

  const handleConditionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      condition: { ...prev.condition, [field]: value },
    }));
  };

  const handleEditSection = (section) => {
    setEditingSectionId(section.id);
    setFormData({
      heading: section.heading || "",
      subheading: section.subheading || "",
      access_type: section.access_type || "guest",
      method: section.method || "custom",
      values: Array.isArray(section.values) ? section.values : [],
      sort: section.sort || "",
      condition: {
        operator: section.condition?.operator || "",
        value: section.condition?.value || "",
      },
    });
    setShowAddModal(true);
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;

    try {
      const res = await Admin_Home_Video_Delete_Sections(id);
      if (res?.data?.status) {
        alert("Section deleted successfully!");
        fetchSections(); // Refresh list
      }
    } catch (error) {
      alert(error?.data?.message || "Failed to delete section");
    }
  };

  // if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <main className="container mt-4">
      <Header_Admin />
      <div className="row">
  <div className="col-10"></div>
  <div className="col-2 text-end">
    <Button
      variant="primary"
      className="mb-3 w-100"
      onClick={() => setShowAddModal(true)}
    >
      + Add Section
    </Button>
  </div>
</div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Heading</th>
            <th>Subheading</th>
            <th>Access Type</th>
            <th>Method</th>
            <th>Values</th>
            <th>Sort</th>
            {/* <th>Created At</th>
                        <th>Updated At</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sections?.map((item) => {
            const isExpanded = expanded[item.id] || false;
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item?.heading}</td>
                <td style={{ maxWidth: "250px" }}>
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: isExpanded ? "unset" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.subheading}
                  </div>
                  {item?.subheading?.length > 100 && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {isExpanded ? "Less" : "More"}
                    </Button>
                  )}
                </td>
                <td>{item?.access_type}</td>
                <td>{item?.method}</td>
                <td>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{item.values}</pre>
                </td>
                <td>{item?.sort}</td>
                {/* <td>{new Date(item?.created_at).toLocaleString()}</td>
                                <td>{new Date(item.updated_at).toLocaleString()}</td> */}
                <td>
                  <FaEdit
                    size={18}
                    style={{
                      cursor: "pointer",
                      color: "#F87951",
                      marginRight: "10px",
                    }}
                    onClick={() => handleEditSection(item)}
                  />
                  <FaEye
                    onClick={() => handleViewDetails(item.id)}
                    disabled={detailsLoading}
                    size={18}
                    style={{ cursor: "pointer", color: "#F87951" }}
                  />
                  <button
                    className="dlt-btn border-0 bg-transparent"
                    onClick={() => handleDeleteSection(item.id)}
                  >
                    <img src={TrashIcon} alt="Delete" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/* ✅ Pagination */}
      {renderPagination()}
      {/* Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Section Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSection ? (
            <>
              <h5 className="mb-3">{selectedSection.section.heading}</h5>
              <p className="text-muted">{selectedSection.section.subheading}</p>
              <Table bordered size="sm">
                <tbody>
                  <tr>
                    <th>Access Type</th>
                    <td>{selectedSection.section.access_type}</td>
                  </tr>
                  <tr>
                    <th>Method</th>
                    <td>{selectedSection.section.method}</td>
                  </tr>
                  <tr>
                    <th>Videos Templates</th>
                    <td>{selectedSection.section.values}</td>
                  </tr>
                  <tr>
                    <th>Sort</th>
                    <td>{selectedSection.section.sort}</td>
                  </tr>
                  <tr>
                    <th>Created At</th>
                    <td>
                      {new Date(
                        selectedSection.section.created_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Updated At</th>
                    <td>
                      {new Date(
                        selectedSection.section.updated_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="mt-4">Video Templates</h5>
              <div className="d-flex flex-wrap gap-3">
                {selectedSection.video_templates?.map((video) => (
                  <Card key={video.id} style={{ width: "14rem" }}>
                    <Card.Img
                      variant="top"
                      src={video.video_image_url}
                      alt={video.video_name}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{video.video_name}</Card.Title>
                      <Card.Text>
                        <strong>ID:</strong> {video.id}
                        <br />
                        <strong>Number:</strong> {video.video_number}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingSectionId ? "Edit Section" : "Add New Section"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label>Heading</label>
              <input
                type="text"
                className="form-control"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Subheading</label>
              <textarea
                className="form-control"
                name="subheading"
                value={formData.subheading}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Access Type</label>
              <select
                className="form-control"
                name="access_type"
                value={formData.access_type}
                onChange={handleChange}
              >
                <option value="guest">Guest</option>
                {/* <option value="user">User</option> */}
              </select>
            </div>

            <div className="mb-3">
              <label>Method</label>
              <select
                className="form-control"
                name="method"
                value={formData.method}
                onChange={handleChange}
              >
                <option value="custom">Custom</option>
                <option value="condition">Condition</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Values</label>
              {formData.method === "custom" ? (
                loadingTemplates ? (
                  <div>Loading video templates...</div>
                ) : videoTemplates.length === 0 ? (
                  <div>No video templates found.</div>
                ) : (
                  <>
                    <div className="d-flex flex-wrap gap-3">
                      {(showAllTemplates
                        ? videoTemplates
                        : videoTemplates.slice(0, 4)
                      ).map((video) => (
                        <div
                          key={video.id}
                          className="border rounded p-2"
                          style={{ width: "200px", textAlign: "center" }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.values.includes(video.id)}
                            onChange={() => handleCheckboxChange(video.id)}
                          />
                          <strong>{video.video_name}</strong>
                        </div>
                      ))}
                    </div>
                    {videoTemplates.length > 4 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setShowAllTemplates(!showAllTemplates)}
                        style={{ marginTop: "10px" }}
                      >
                        {showAllTemplates ? "View Less" : "View More"}
                      </Button>
                    )}
                  </>
                )
              ) : formData.method === "condition" ? (
                <>
                  <div className="mb-2">
                    <label>Field</label>
                    <input
                      type="text"
                      className="form-control"
                      value="price"
                      readOnly
                    />
                  </div>
                  <div className="mb-2">
                    <label>Operator</label>
                    <select
                      className="form-control"
                      value={formData.condition.operator}
                      onChange={(e) =>
                        handleConditionChange("operator", e.target.value)
                      }
                    >
                      <option value="">Select Operator</option>
                      <option value="<">Less than</option>
                      <option value=">">Greater than</option>
                      <option value="=">Equal</option>
                      <option value="<=">Less than equal</option>
                      <option value=">=">Greater than equal</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.condition.value}
                      onChange={(e) =>
                        handleConditionChange("value", e.target.value)
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  {formData?.values?.map((val, i) => (
                    <input
                      key={i}
                      type="text"
                      className="form-control mb-2"
                      value={val}
                      onChange={(e) => handleValueChange(i, e.target.value)}
                    />
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addValueField}
                  >
                    + Add More
                  </Button>
                </>
              )}
            </div>

            <div className="mb-3">
              <label>Sort</label>
              <select
                className="form-control"
                name="sort"
                value={formData.sort}
                onChange={handleChange}
              >
                <option value="">Select Sort Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </main>
  );
};

export default Admin_Home_Videos_Sections;
