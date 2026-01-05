import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import { FaEye } from "react-icons/fa";
import { Get_Admin_User_list, Get_Admin_User_Details, Admin_Add_Credits, Admin_Deduct_Credits, Admin_User_Block_Status } from "../../../../api/admin/Admin";
import Spinner from "react-bootstrap/Spinner";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";

const Admin_User_List = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage] = useState(30);
    const [pagination, setPagination] = useState(null);
    const [creditModalShow, setCreditModalShow] = useState(false);
    const [creditAction, setCreditAction] = useState("add"); // "add" or "deduct"
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [creditAmount, setCreditAmount] = useState("");
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchUsers = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await Get_Admin_User_list(pageNumber, perPage);
            if (res?.data?.status) {
                setUsers(res.data.data);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const viewUserDetails = async (id) => {
        setModalLoading(true);
        setShowModal(true);
        try {
            const res = await Get_Admin_User_Details(id);
            if (res?.data?.status) {
                setSelectedUser(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

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

    const handleCreditSubmit = async (e) => {
        e.preventDefault();

        if (!creditAmount || creditAmount <= 0) {
            alert("Please enter a valid credit amount.");
            return;
        }

        const formData = new FormData();
        formData.append("amount", creditAmount);

        try {
            let res;
            if (creditAction === "add") {
                res = await Admin_Add_Credits(selectedUserId, formData);
            } else {
                res = await Admin_Deduct_Credits(selectedUserId, formData);
            }

            if (res?.data?.status) {
                alert(
                    creditAction === "add"
                        ? "Credits added successfully!"
                        : "Credits deducted successfully!"
                );
                setCreditModalShow(false);

                // Update wallet balance from API
                fetchUsers(page); // reload table to get updated balance
            }
        } catch (error) {
            console.error("Error updating credits:", error);
            alert("Failed to update credits.");
        }
    };



    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "300px" }}>
                <Spinner animation="border" variant="primary" />
                <p>Loading users...</p>
            </div>
        );
    }

    const handleBlockUnblock = async (user_id) => {
        try {
            const res = await Admin_User_Block_Status(user_id);
           console.log("sjadfgsjdfs",res)
            if (res?.data?.status) {
                alert(res.data.message || "User status updated");

                // Reload user list
                fetchUsers();
            }
        } catch (error) {
            console.log(error);
            alert("Failed to update user status");
        }
    };


    return (
        <main className="container mt-4">
            <Header_Admin />

            <div>

            <h2>User List</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Email Verified</th>
                        <th>Company</th>
                        <th>Phone Number</th>
                        <th>Wallet Balance</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                        <th>Credits</th>
                        <th>Deduct</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user?.id}>
                                <td>{user?.id}</td>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>
                                    {user?.email_verified_at
                                        ? new Date(user?.email_verified_at).toLocaleString()
                                        : "Not Verified"}
                                </td>
                                <td>{user?.company || "-"}</td>
                                <td>{user?.phone_number || "-"}</td>
                                <td>{user?.wallet_balance}</td>
                                <td>{user?.is_block === "0" ? "Active" : "Blocked"}</td>
                                <td>{new Date(user?.created_at).toLocaleString()}</td>
                                <td>{new Date(user?.updated_at).toLocaleString()}</td>
                                <td>
                                    <Button
                                        variant={user?.is_block == "1" ? "success" : "danger"}
                                        size="sm"
                                        onClick={() => handleBlockUnblock(user.id)}
                                        className="me-2"
                                    >
                                        {user?.is_block == "1" ? "Unblock" : "Block"}
                                    </Button>

                                    <Button
                                        variant="light"
                                        onClick={() => viewUserDetails(user.id)}
                                        style={{ marginRight: "5px" }}
                                    >
                                        <FaEye style={{ color: "#F87951" }} />
                                    </Button>
                                </td>


                                <td>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedUserId(user.id);
                                            setCreditAmount("");
                                            setCreditAction("add");
                                            setCreditModalShow(true);
                                        }}
                                    >
                                        Credits
                                    </Button>

                                </td>
                                <td>


                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => {
                                            setSelectedUserId(user.id);
                                            setCreditAmount("");
                                            setCreditAction("deduct");
                                            setCreditModalShow(true);
                                        }}
                                    >
                                        Deduct
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" style={{ textAlign: "center" }}>
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            {renderPagination()}

            {/* User Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading user details...</p>
                        </div>
                    ) : selectedUser ? (
                        <div className="user-details">
                            <div className="d-flex align-items-center mb-3">
                                {selectedUser.image_url ? (
                                    <img
                                        src={selectedUser.image_url}
                                        alt={selectedUser.name}
                                        style={{ width: "100px", borderRadius: "50%", marginRight: "20px" }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            background: "#ccc",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        No Image
                                    </div>
                                )}
                                <h4>{selectedUser.name}</h4>
                            </div>

                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <td><strong>ID</strong></td>
                                        <td>{selectedUser.id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email</strong></td>
                                        <td>{selectedUser.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email Verified</strong></td>
                                        <td>
                                            {selectedUser.email_verified_at
                                                ? new Date(selectedUser.email_verified_at).toLocaleString()
                                                : "Not Verified"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Company</strong></td>
                                        <td>{selectedUser.company || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Phone Number</strong></td>
                                        <td>{selectedUser.phone_number || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Wallet Balance</strong></td>
                                        <td>{selectedUser.wallet_balance}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status</strong></td>
                                        <td>{selectedUser.is_block === "0" ? "Active" : "Blocked"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Stripe ID</strong></td>
                                        <td>{selectedUser.stripe_id || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>PM Type</strong></td>
                                        <td>{selectedUser.pm_type || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>PM Last Four</strong></td>
                                        <td>{selectedUser.pm_last_four || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Trial Ends At</strong></td>
                                        <td>{selectedUser.trial_ends_at ? new Date(selectedUser.trial_ends_at).toLocaleString() : "-"}</td>
                                    </tr>

                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <p>No details available</p>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={creditModalShow} onHide={() => setCreditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {creditAction === "add" ? "Add Credits" : "Deduct Credits"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            variant={creditAction === "add" ? "success" : "danger"}
                        >
                            {creditAction === "add" ? "Add Credits" : "Deduct Credits"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            </div>




            <Footer />
        </main>
    );
};

export default Admin_User_List;
