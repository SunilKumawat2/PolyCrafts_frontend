import React, { useState } from "react";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import { Modal, Button, Form } from "react-bootstrap";
import { Admin_Add_About_Us_Content } from "../../../../api/admin/Admin";

const Admin_About_Us_Page = () => {
    const [show, setShow] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pageKey, setPageKey] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddAbout = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("page_key", pageKey);
            if (image) formData.append("image", image);

            const res = await Admin_Add_About_Us_Content(formData);
            console.log("sajdkfsgdjfsgjf", res)
            if (res?.data?.status) {
                alert(res?.data?.message);

                setShow(false);
                setTitle("");
                setDescription("");
                setPageKey("");
                setImage(null);
                setImagePreview("");
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            alert("API Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header_Admin />

            {/* Add New Button */}
            <div className="container mt-4">
                <Button
                    variant="primary"
                    onClick={() => setShow(true)}
                    className="d-flex align-items-center gap-2"
                >
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
                    Add About Us
                </Button>
            </div>

            {/* Modal */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add About Us</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>

                        {/* Title */}
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        {/* Description */}
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        {/* Page Key Select */}
                        <Form.Group className="mb-3">
                            <Form.Label>Page Key</Form.Label>
                            <Form.Select
                                value={pageKey}
                                onChange={(e) => setPageKey(e.target.value)}
                            >
                                <option value="">-- Select Page Key --</option>
                                <option value="our_vision">Our Vision</option>
                                <option value="our_mission">Our Mission</option>
                                <option value="price_key">Pricing</option>
                            </Form.Select>
                        </Form.Group>


                        {/* Image Upload */}
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="text-center mb-3">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }}
                                />
                            </div>
                        )}

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>

                    <Button variant="primary" onClick={handleAddAbout} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </div>
    );
};

export default Admin_About_Us_Page;
