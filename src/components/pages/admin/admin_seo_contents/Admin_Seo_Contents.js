import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import {
  Admin_Add_About_Us_Content,
  Admin_Update_Our_mission_About_Us_Content,
  Admin_Update_Our_vision_About_Us_Content,
  Admin_seo_contents,
  Admin_seo_contents_details,
  Admin_seo_contents_update_details,
} from "../../../../api/admin/Admin";
import { FaEdit } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Admin_Seo_Contents = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // modal state
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isView, setIsView] = useState(false);

  // editor mount control (to avoid findDOMNode error)
  const [editorVisible, setEditorVisible] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    _method: "PATCH",
    title: "",
    description: "",
    keywords: "",
  });

 // modal visibility
const [showVisionModal, setShowVisionModal] = useState(false);
const [showMissionModal, setShowMissionModal] = useState(false);
const [showPrcingModal, setShowPrcingModal] = useState(false);

// form data
const [visionData, setVisionData] = useState({
  title: "",
  description: "",
  existing_image: "",
  image: null,
  page_key: "our_vision",
});

const [missionData, setMissionData] = useState({
  title: "",
  description: "",
  existing_image: "",
  image: null,
  page_key: "our_mission",
});

const [prcingData, setPrcingData] = useState({
  title: "",
  description: "",
  existing_image: "",
  image: null,
  page_key: "price_key",
});


  const keywordOptions = ["home", "laravel", "react", "seo", "polycraft"];

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setIsView(false);
    setEditorVisible(false);
    setFormData({
      _method: "PATCH",
      title: "",
      description: "",
      keywords: "",
    });
  };

  // fetch pages with pagination
  const fetchPages = async (pageNumber = 1) => {
    try {
      const res = await Admin_seo_contents(pageNumber);
      if (res?.data?.status) {
        setPages(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching SEO pages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages(page);
  }, [page]);

  const handleEdit = async (pageItem) => {
    try {
      const res = await Admin_seo_contents_details(pageItem.id);
      if (!res?.data?.status) throw new Error("Failed to fetch data");
  
      const d = res.data.data;
  
      if (pageItem.page_key === "our_vision") {
        setVisionData({
          title: d.title,
          description: d.description || "",
          existing_image: d.image_url || d.image || "",
          image: null,
          page_key: "our_vision",
        });
        setShowVisionModal(true);
      } 
      else if (pageItem.page_key === "our_mission") {
        setMissionData({
          title: d.title,
          description: d.description || "",
          existing_image: d.image_url || d.image || "",
          image: null,
          page_key: "our_mission",
        });
        setShowMissionModal(true);
      } 
      else if (pageItem.page_key === "price_key") {
        setPrcingData({
          title: d.title,
          description: d.description || "",
          existing_image: d.image_url || d.image || "",
          image: null,
          page_key: "price_key",
        });
        setShowPrcingModal(true);
      } 
      else {
        // All other SEO pages
        handleShow(pageItem.id, false);
      }
  
    } catch (error) {
      console.error(error);
      alert("Failed to load page details");
    }
  };
  
  
  
  // view/edit modal
  const handleShow = async (id, view = false) => {
    try {
      const res = await Admin_seo_contents_details(id);
      if (res?.data?.status) {
        setFormData({
          _method: "PATCH",
          title: res.data.data.title,
          description: res.data.data.description || "",
          keywords: res.data.data.keywords || "",
        });
        setEditId(id);
        setIsView(view);
        setShow(true);

        // ⏱️ Delay mounting editor after modal opens
        setTimeout(() => setEditorVisible(true), 80);
      }
    } catch (error) {
      console.error("Error fetching SEO content details:", error);
      alert("Failed to fetch page details.");
    }
  };

  const handleUpdateVision = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", visionData.title);
      formData.append("description", visionData.description);
      formData.append("page_key", visionData.page_key);
      if (visionData.image) formData.append("image", visionData.image);
  
      const res = await Admin_Update_Our_vision_About_Us_Content(
        formData,
        visionData.page_key
      );
  
      if (res?.data?.status) {
        alert("Our Vision updated successfully!");
        setShowVisionModal(false);
      } else {
        alert("Failed to update Vision!");
      }
    } catch (error) {
      console.error(error);
      alert("API Error while updating Vision");
    }
  };
  
  const handleUpdateMission = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", missionData.title);
      formData.append("description", missionData.description);
      formData.append("page_key", missionData.page_key);
      if (missionData.image) formData.append("image", missionData.image);
  
      const res = await Admin_Update_Our_mission_About_Us_Content(
        formData,
        missionData.page_key
      );
  
      if (res?.data?.status) {
        alert("Our Mission updated successfully!");
        setShowMissionModal(false);
      } else {
        alert("Failed to update Mission!");
      }
    } catch (error) {
      console.error(error);
      alert("API Error while updating Mission");
    }
  };
  
  const handleUpdatePrcing = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", prcingData.title);
      formData.append("description", prcingData.description);
      formData.append("page_key", prcingData.page_key);
      if (prcingData.image) formData.append("image", prcingData.image);
  
      const res = await Admin_Update_Our_mission_About_Us_Content(
        formData,
        prcingData.page_key
      );
  
      if (res?.data?.status) {
        alert("Our Mission updated successfully!");
        setShowPrcingModal(false);
      } else {
        alert("Failed to update Mission!");
      }
    } catch (error) {
      console.error(error);
      alert("API Error while updating Mission");
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Admin_seo_contents_update_details(editId, formData);
      if (res?.data?.status) {
        alert("SEO content updated successfully!");
        handleClose();
        fetchPages(page);
      }
    } catch (error) {
      console.error("Error updating SEO content:", error);
      alert("Failed to update SEO content.");
    }
  };

  // pagination renderer
  const renderPagination = () => {
    if (!pagination) return null;

    const buttons = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      buttons.push(
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
        {buttons}
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
      <section className="admin-seo-sec px-85 pb-5">
        <div className="container-fluid">
          <h3 className="mb-3">SEO Contents</h3>

          {loading ? (
            <p>Loading pages...</p>
          ) : (
            <>
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Page Key</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.length > 0 ? (
                    pages.map((pageItem, index) => (
                      <tr key={pageItem.id || index}>
                        <td>
                          {(page - 1) * (pagination?.per_page || 10) +
                            index +
                            1}
                        </td>
                        <td>{pageItem.page_key}</td>
                        <td>{pageItem.title}</td>
                        <td>
                          <IoEyeSharp
                            size={20}
                            style={{
                              cursor: "pointer",
                              color: "#F87951",
                              marginRight: "10px",
                            }}
                            onClick={() => handleShow(pageItem.id, true)}
                          />
                          {/* <FaEdit
                            size={20}
                            style={{ cursor: "pointer", color: "#F87951" }}
                            onClick={() => handleShow(pageItem.id, false)}
                          /> */}
                          <FaEdit
                            size={20}
                            style={{ cursor: "pointer", color: "#F87951" }}
                            onClick={() => handleEdit(pageItem)}
                          />


                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No pages found.
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

      {/* ✅ Modal with Quill Editor */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isView ? "View SEO Content" : "Edit SEO Content"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isView}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                readOnly={isView}
                style={{
                  height: "200px", // 🟩 Editor height
                  width: "100%", // 🟩 Full width inside modal
                  marginBottom: "50px", // 🟩 Space below toolbar (important for Quill)
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Keywords</Form.Label>
              <Form.Select
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                disabled={isView}
                required
              >
                <option value="">-- Select Keyword --</option>
                {keywordOptions.map((k, idx) => (
                  <option key={idx} value={k}>
                    {k}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {!isView && (
              <Button variant="primary" type="submit">
                Update SEO Content
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showVisionModal} onHide={() => setShowVisionModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Edit - Our Vision</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form onSubmit={handleUpdateVision}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={visionData.title}
          onChange={(e) => setVisionData({ ...visionData, title: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <ReactQuill
          theme="snow"
          value={visionData.description}
          onChange={(value) => setVisionData({ ...visionData, description: value })}
          style={{ height: "200px", marginBottom: "50px" }}
        />
      </Form.Group>

      {visionData.existing_image && (
        <img
          src={visionData.existing_image}
          alt="Vision"
          style={{ width: "130px", marginBottom: "10px", borderRadius: "8px" }}
        />
      )}

      <Form.Group className="mb-3">
        <Form.Label>Upload New Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setVisionData({ ...visionData, image: e.target.files[0] })}
        />
      </Form.Group>

      <Button variant="primary" type="submit">Update Vision</Button>
    </Form>
  </Modal.Body>
</Modal>


<Modal show={showMissionModal} onHide={() => setShowMissionModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Edit - Our Mission</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form onSubmit={handleUpdateMission}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={missionData.title}
          onChange={(e) => setMissionData({ ...missionData, title: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <ReactQuill
          theme="snow"
          value={missionData.description}
          onChange={(value) => setMissionData({ ...missionData, description: value })}
          style={{ height: "200px", marginBottom: "50px" }}
        />
      </Form.Group>

      {missionData.existing_image && (
        <img
          src={missionData.existing_image}
          alt="Mission"
          style={{ width: "130px", marginBottom: "10px", borderRadius: "8px" }}
        />
      )}

      <Form.Group className="mb-3">
        <Form.Label>Upload New Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setMissionData({ ...missionData, image: e.target.files[0] })}
        />
      </Form.Group>

      <Button variant="primary" type="submit">Update Mission</Button>
    </Form>
  </Modal.Body>
</Modal>

<Modal show={showPrcingModal} onHide={() => setShowPrcingModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Edit - Pricing</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form onSubmit={handleUpdatePrcing}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={prcingData.title}
          onChange={(e) => setPrcingData({ ...prcingData, title: e.target.value })}
          required
        />
      </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <ReactQuill
          theme="snow"
          value={prcingData?.description}
          onChange={(value) => setPrcingData({ ...prcingData, description: value })}
          style={{ height: "200px", marginBottom: "50px" }}
        />
      </Form.Group> */}

      {prcingData?.existing_image && (
        <img
          src={prcingData?.existing_image}
          alt="Mission"
          style={{ width: "130px", marginBottom: "10px", borderRadius: "8px" }}
        />
      )}

      <Form.Group className="mb-3">
        <Form.Label>Upload New Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setPrcingData({ ...prcingData, image: e.target.files[0] })}
        />
      </Form.Group>

      <Button variant="primary" type="submit">Update Mission</Button>
    </Form>
  </Modal.Body>
</Modal>


      <Footer />
    </main>
  );
};

export default Admin_Seo_Contents;
