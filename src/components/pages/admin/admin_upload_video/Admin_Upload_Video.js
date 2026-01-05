import React, { useState, useEffect } from "react";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import HeroVideo from "../../../../assets/images/Home_Page_Intro_002 - 1280x720.mp4";
import { CloseButton, Modal, Table, Button, Spinner } from "react-bootstrap";
import DltIcon from "../../../../assets/images/dlt-modal-icon.svg";
import {
  Admin_Upload_Video_teampletas,
  Admin_show_Upload_Video_teampletas,
  Admin_Delete_Upload_Video_teampletas,
  Admin_Update_Video_teampletas,
  Admin_show_Details_Upload_Video_teampletas,
  Admin_Video_Templates_Changeable_Elements_List,
} from "../../../../api/admin/Admin";
import { FaEdit, FaEye } from "react-icons/fa";
import TrashIcon from "../../../../assets/images/trash.svg";
import { MultiSelect } from "react-multi-select-component";

const Admin_Upload_Video = () => {
  const [Cancelshow, setCancelShow] = useState(false);
  const [Dltshow, setDltShow] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  // ✅ Pagination
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [videoData, setVideoData] = useState({
    video_name: "",
    video: null,
    compressed_video: null,
    video_image: null,
    description: "",
    changeable_elements: [],
    video_length: "",
    base_price: "",
    additional_video_selection_price: "",
    all_video_selection_price: "",
  });

  const [previews, setPreviews] = useState({
    videoUrl: HeroVideo,
    compressedUrl: null,
    imageUrl: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [availableElements, setAvailableElements] = useState([]);
  const handleUploadModalClose = () => setUploadModal(false);
  const handleUploadModalShow = () => setUploadModal(true);
  const handleCancelClose = () => setCancelShow(false);
  const handleDltClose = () => setDltShow(false);

  const handleViewClose = () => {
    setViewModal(false);
    setViewData(null);
  };
  // ✅ Fetch videos
  const fetchVideos = async (pageNumber = 1) => {
    try {
      const res = await Admin_show_Upload_Video_teampletas(pageNumber);
      if (res?.status) {
        setVideos(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  // ✅ Pagination change
  const handlePageChange = (newPage) => {
    if (pagination && newPage >= 1 && newPage <= pagination.last_page) {
      setPage(newPage);
    }
  };

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  //   // File inputs with validation
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (name === "video_image" && file.size > 524288) {
      alert("Thumbnail must be less than 512 KB.");
      return;
    }

    setVideoData({ ...videoData, [name]: file });
  };


  // ✅ View details
  const handleViewVideo = async (id) => {
    try {
      const res = await Admin_show_Details_Upload_Video_teampletas(id);
      if (res?.data?.status) {
        setViewData(res.data.data);
        setViewModal(true);
      }
    } catch (err) {
      console.error("Error fetching video details:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await Admin_Delete_Upload_Video_teampletas(id);
      alert("Video deleted successfully!");
      fetchVideos(page);
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  // ✅ Edit
  const handleEditVideo = (vid) => {
    setIsEditing(true);
    setEditId(vid.id);
    setVideoData({
      video_name: vid.video_name || "",
      description: vid.description || "",
      video_length: vid.video_length || "",
      base_price: vid.base_price || "",
      additional_video_selection_price: vid.additional_video_selection_price || "",
      all_video_selection_price: vid.all_video_selection_price || "",
      changeable_elements: vid.changeable_elements?.length ? vid.changeable_elements : [],
      video: null,
      compressed_video: null,
      video_image: null,
    });
    setUploadModal(true);
  };

  // ✅ Upload / Update
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(videoData).forEach(([key, val]) => {
        if (key === "changeable_elements") {
          val.forEach((el) => formData.append("changeable_elements[]", el));
        } else if (val) {
          formData.append(key, val);
        }
      });

      let res;
      if (isEditing && editId) {
        res = await Admin_Update_Video_teampletas(editId, formData);
      } else {
        res = await Admin_Upload_Video_teampletas(formData);
      }
      window.location.reload()
      if (res?.data?.status) {
        alert(`Video ${isEditing ? "updated" : "uploaded"} successfully!`);
        fetchVideos(page);
      }

      setUploadModal(false);
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading video");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Fetch changeable elements
  useEffect(() => {
    const fetchElements = async () => {
      try {
        const res = await Admin_Video_Templates_Changeable_Elements_List();
        if (res?.data?.status) {
          setAvailableElements(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching elements:", err);
      }
    };
    fetchElements();
  }, []);

  return (
    <main className="user-profile-page">
      <Header_Admin />

      <section className="px-85">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Manage Videos</h3>
            <Button variant="primary" onClick={() => setUploadModal(true)}>
              + Add Video
            </Button>
          </div>

          {/* Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Video Name</th>
                <th>Video Number</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No videos</td>
                </tr>
              ) : (
                videos.map((vid, idx) => (
                  <tr key={vid.id}>
                    <td>{(page - 1) * 10 + idx + 1}</td>
                    <td>{vid.video_name}</td>
                    <td>{vid.video_number}</td>
                    <td>
                      {vid.video_image_url ? (
                        <img src={vid.video_image_url} alt="" style={{ width: 80, height: 50 }} />
                      ) : "No Image"}
                    </td>
                    <td className="action-cell" style={{ whiteSpace: "nowrap" }}>
                      <FaEye
                        size={18}
                        style={{ cursor: "pointer", color: "#F87951", marginRight: "10px" }}
                        onClick={() => handleViewVideo(vid.id)}
                      />
                      {/* <FaEdit
                        size={18}
                        style={{ cursor: "pointer", color: "#F87951", marginRight: "10px" }}
                        onClick={() => handleEditVideo(vid)}
                      /> */}
                      <button
                        className="dlt-btn border-0 bg-transparent"
                        onClick={() => handleDelete(vid.id)}
                      >
                        <img src={TrashIcon} alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))
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
        </div>

      </section>


      <Modal size="lg" show={uploadModal} onHide={handleUploadModalClose} centered>
        {/* 🔹 Dim background overlay while loading */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              borderRadius: "8px",
            }}
          >
            <Spinner animation="border" role="status" />
          </div>
        )}

        <Modal.Header>
          <Modal.Title>
            {isEditing ? "Edit Video Template" : "Upload Video Template"}
          </Modal.Title>
          <CloseButton onClick={handleUploadModalClose} />
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleUploadVideo}>
            <div className="row">
              {/* Video Name */}
              <div className="col-12 mt-3">
                <div className="form-group">
                  <label>Video Name</label>
                  <input
                    type="text"
                    name="video_name"
                    className="form-control"
                    value={videoData.video_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Video Files */}
              <div className="col-6">
                <div className="form-group">
                  <label>Video File</label>
                  <input
                    type="file"
                    accept="video/*"
                    name="video"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Compressed Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    name="compressed_video"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div className="col-12">
                <div className="form-group">
                  <label>Video Image (Max 512 KB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    name="video_image"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="col-6">
                <div className="form-group">
                  <label>Base Price</label>
                  <input
                    type="number"
                    name="base_price"
                    className="form-control"
                    value={videoData.base_price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>All Video Selection Price</label>
                  <input
                    type="number"
                    name="all_video_selection_price"
                    className="form-control"
                    value={videoData.all_video_selection_price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Additional Video Selection Price</label>
                  <input
                    type="number"
                    name="additional_video_selection_price"
                    className="form-control"
                    value={videoData.additional_video_selection_price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Length */}
              <div className="col-6">
                <div className="form-group">
                  <label>Video Length</label>
                  <input
                    type="text"
                    name="video_length"
                    className="form-control"
                    value={videoData.video_length}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Changeable Elements */}
              <div className="col-12">
                <label>Changeable Elements</label>
                <MultiSelect
                  options={availableElements.map((el) => ({ label: el, value: el }))}
                  value={videoData.changeable_elements.map((el) => ({
                    label: el,
                    value: el,
                  }))}
                  onChange={(selected) =>
                    setVideoData({
                      ...videoData,
                      changeable_elements: selected.map((s) => s.value),
                    })
                  }
                  labelledBy="Select Elements"
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={videoData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="text-end mt-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                )}
                {isEditing ? "Update Video" : "Upload Video"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>


      {/* Cancel Subscription Modal */}
      <Modal className="cancel-modal" show={Cancelshow} onHide={handleCancelClose}>
        <Modal.Body>
          <div className="cancel-modal-outer">
            <div className="modal-head">
              <CloseButton onClick={handleCancelClose} />
              <h2>Cancel subscription</h2>
              <p>Canceling your subscription will stop further uploads.</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCancelClose}>
            Undo
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert("Cancel Subscription API pending")}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal className="cancel-modal" show={Dltshow} onHide={handleDltClose}>
        <Modal.Body>
          <div className="cancel-modal-outer delete-modal">
            <div className="modal-head">
              <CloseButton onClick={handleDltClose} />
              <img src={DltIcon} alt="Delete Icon" />
              <div>
                <h2>Delete account?</h2>
                <p>Deleting your account will remove all uploaded videos.</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleDltClose}>
            Undo
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert("Delete Account API pending")}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>

      {/* <-------- View Details Modal -------- */}
      <Modal size="xl" show={viewModal} onHide={handleViewClose} centered>
        <Modal.Header>
          <Modal.Title>Video Details</Modal.Title>
          <CloseButton onClick={handleViewClose} />
        </Modal.Header>

        <Modal.Body>
          {viewData ? (
            <div className="container-fluid">
              {/* Top Info */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <h4 className="mb-2">{viewData.video_name}</h4>
                  <p><strong>Video Number:</strong> {viewData.video_number}</p>
                  <p><strong>Status:</strong> <span className={`badge ${viewData.status === "Active" ? "bg-success" : "bg-secondary"}`}>{viewData.status}</span></p>
                  <p><strong>Length:</strong> {viewData.video_length} sec</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Base Price:</strong> ${viewData.base_price}</p>
                  <p><strong>Additional Price:</strong> ${viewData.additional_video_selection_price}</p>
                  <p><strong>All Video Price:</strong> ${viewData.all_video_selection_price}</p>
                  <p><strong>Changeable Elements:</strong> {viewData.changeable_elements.join(", ")}</p>
                </div>
              </div>

              {/* Description */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="card p-3 shadow-sm">
                    <h6>Description</h6>
                    <p>{viewData.description}</p>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="row g-3">
                {/* Thumbnail */}
                {viewData.video_image_url && (
                  <div className="col-md-3">
                    <div className="card">
                      <img
                        src={viewData.video_image_url}
                        alt={viewData.video_name}
                        className="card-img-top"
                        style={{ objectFit: "cover", height: "150px" }}
                      />
                      <div className="card-body text-center">
                        <small className="text-muted">Thumbnail</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Original Video */}
                {viewData.video_url && (
                  <div className="col-md-4">
                    <div className="card">
                      <video controls playsInline
                        webkit-playsinline="true"
                        preload="auto" className="w-100" style={{ height: "200px", objectFit: "cover" }}>
                        <source src={viewData.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="card-body text-center">
                        <small className="text-muted">Original Video</small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compressed Video */}
                {viewData.compressed_video_url && (
                  <div className="col-md-4">
                    <div className="card">
                      <video controls playsInline
                        webkit-playsinline="true"
                        preload="auto" className="w-100" style={{ height: "200px", objectFit: "cover" }}>
                        <source src={viewData.compressed_video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="card-body text-center">
                        <small className="text-muted">Compressed Video</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>
      <Footer />
    </main>
  );
};

export default Admin_Upload_Video;

