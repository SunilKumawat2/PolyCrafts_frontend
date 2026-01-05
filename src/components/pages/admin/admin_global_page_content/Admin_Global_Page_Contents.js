import React, { useEffect, useState } from 'react'
import { Admin_Get_Page_Content, Admin_Get_Details_Page_Content, Admin_Get_Details_Update_Page_Content } from '../../../../api/admin/Admin';
import Header_Admin from '../../../common/header/Header_Admin';
import Footer from '../../../common/footer/Footer';
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Admin_Global_Page_Contents = () => {

    const [activeTab, setActiveTab] = useState("home");
    const [tableData, setTableData] = useState([]);

    // ---- Modal States ----
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const handleClose = () => setShowModal(false);

    const fetchSEOContent = async (pageKey) => {
        try {
            const res = await Admin_Get_Page_Content(pageKey);
            const contentArray = res?.data?.data || [];
            setTableData(contentArray);
        } catch (error) {
            console.error("Error fetching SEO content:", error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const res = await Admin_Get_Details_Page_Content(id);
            setSelectedData(res?.data?.data || null);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    useEffect(() => {
        fetchSEOContent(activeTab);
    }, [activeTab]);

    const handleUpdate = async () => {
        if (!selectedData) return;

        const formData = new FormData();
        formData.append("_method", "PATCH");

        // String & Text Type
        if (selectedData.content_type == "string" || selectedData.content_type == "text") {
            formData.append("content_value", selectedData.content_value);
        }

        // File Type
        if (selectedData.content_type == "file") {
            if (selectedData.file) {
                formData.append("content_value", selectedData.file); // backend expects file in content_value
            } else {
                formData.append("content_value", selectedData.content_value); // if no change
            }
        }

        try {
            const res = await Admin_Get_Details_Update_Page_Content(formData, selectedData.id);

            if (res?.data?.status) {
                alert("Updated Successfully!");

                // refresh table
                fetchSEOContent(activeTab);

                // close modal
                handleClose();
            }
        } catch (err) {
            console.error(err);
            alert("Update failed!");
        }
    };


    return (
        <main>
            <Header_Admin />

            <section className="admin-faq-sec px-85 pb-5">

                {/* ---------- TAB BUTTONS ---------- */}
                <div className="admin-tabs mb-4">
                    {["home", "about", "pricing"].map((tab) => (
                        <button
                            key={tab}
                            className={`btn ${activeTab === tab ? "btn-primary" : "btn-outline-danger"} me-2`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* ---------- TABLE VIEW ---------- */}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Page Key</th>
                            <th>Section Key</th>
                            <th>Content Key</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.page_key}</td>
                                    <td>{item.section_key}</td>
                                    <td>{item.content_key}</td>
                                    <td className="text-center">
                                        <FaEdit
                                            style={{ cursor: "pointer", color: "#F87951" }}
                                            size={20}
                                            onClick={() => handleEdit(item.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No Data Found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </section>

            <Footer />

            {/* ---------- MODAL ---------- */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Content</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedData ? (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Page Key</Form.Label>
                                <Form.Control type="text" value={selectedData.page_key} disabled />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Section Key</Form.Label>
                                <Form.Control type="text" value={selectedData.section_key} disabled />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Content Key</Form.Label>
                                <Form.Control type="text" value={selectedData.content_key} disabled />
                            </Form.Group>

                            {/* ---- DYNAMIC FIELD BASED ON content_type ---- */}
                            <Form.Group className="mb-3">
                                <Form.Label>Content Value</Form.Label>

                                {selectedData.content_type === "string" && (
                                    <Form.Control
                                        type="text"
                                        defaultValue={selectedData.content_value}
                                        onChange={(e) =>
                                            setSelectedData({ ...selectedData, content_value: e.target.value })
                                        }
                                    />
                                )}

                                {selectedData.content_type === "file" && (
                                    <>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) =>
                                                setSelectedData({ ...selectedData, file: e.target.files[0] })
                                            }
                                        />

                                        {selectedData.content_value && (
                                            <div className="mt-3">
                                                <strong>Current File Preview:</strong>
                                                <br />
                                                <img
                                                    src={selectedData.content_value}
                                                    alt="preview"
                                                    style={{ width: "100px", borderRadius: "5px" }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {selectedData.content_type === "text" && (
                                    <div>
                                        <ReactQuill
                                            theme="snow"
                                            value={selectedData.content_value}
                                            onChange={(value) =>
                                                setSelectedData((prev) => ({ ...prev, content_value: value }))
                                            }
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                marginBottom: "50px",
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>
                        </Form>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>

                </Modal.Footer>
            </Modal>

        </main>
    );
};

export default Admin_Global_Page_Contents;
