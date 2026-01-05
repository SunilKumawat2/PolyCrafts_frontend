import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Admin_show_subscription_plans, Admin_Update_subscription_plans } from "../../../../api/admin/Admin";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import { FaEdit } from "react-icons/fa";

const Admin_Subscription_Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [interval, setInterval] = useState("month");

    // modal state
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        price_id: "",
        amount: "",
        credits: "",
        bonus_credits: "",
        total_credits: "",
    });

    const fetchPlans = async (intervalValue = interval, pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await Admin_show_subscription_plans(intervalValue, pageNumber);
            if (res?.data?.status) {
                setPlans(res.data.data);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans(interval, page);
    }, [interval, page]);

    const handleEdit = (plan) => {
        setEditId(plan.id);
        setFormData({
            price_id: plan.price_id,
            amount: plan.amount,
            credits: plan.credits,
            bonus_credits: plan.bonus_credits,
            total_credits: plan.total_credits,
        });
        setShow(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("_method", "PATCH");
            fd.append("price_id", formData.price_id);
            fd.append("amount", formData.amount);
            fd.append("credits", formData.credits);
            fd.append("bonus_credits", formData.bonus_credits);
            fd.append("total_credits", formData.total_credits);

            const res = await Admin_Update_subscription_plans(editId, fd);
            if (res?.data?.status) {
                alert("Plan updated successfully!");
                setShow(false);
                fetchPlans(interval, page);
            }
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Failed to update plan.");
        }
    };

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
            <section className="admin-plans-sec px-85 pb-5">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Subscription Plans</h3>

                        <div>
                            <Button
                                variant={interval === "month" ? "primary" : "outline-danger"}
                                className={`mx-1 ${interval !== "month" ? "rounded-pill" : ""}`}
                                onClick={() => {
                                    setInterval("month");
                                    setPage(1);
                                }}
                            >
                                Monthly
                            </Button>
                            <Button
                                variant={interval === "year" ? "primary" : "outline-danger"}
                                className={`mx-1 ${interval !== "year" ? "rounded-pill" : ""}`}
                                onClick={() => {
                                    setInterval("year");
                                    setPage(1);
                                }}
                            >
                                Yearly
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading Plans...</p>
                    ) : (
                        <Table striped bordered responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Plan Name</th>
                                    <th>Price</th>
                                    <th>Interval</th>
                                    <th>Credits</th>
                                    <th>Bonus</th>
                                    <th>Total Credits</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans?.length > 0 ? (
                                    plans?.map((plan, index) => (
                                        <tr key={plan.id}>
                                            <td>{(page - 1) * (plan?.per_page || 10) + index + 1}</td>
                                            {/* <td>{index + 1 + (page - 1) * perPage}</td> */}
                                            <td>{plan.plan_name}</td>
                                            <td>$ {plan.amount}</td>
                                            <td>{plan.interval}</td>
                                            <td>{plan.credits}</td>
                                            <td>{plan.bonus_credits}</td>
                                            <td>{plan.total_credits}</td>
                                            <td>
                                                <FaEdit
                                                    size={20}
                                                    style={{ cursor: "pointer", color: "#F87951" }}
                                                    onClick={() => handleEdit(plan)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No Plans found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}

                    {/* ✅ Pagination */}
                    {renderPagination()}
                </div>
            </section>

            {/* Modal for update */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Subscription Plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Price ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="price_id"
                                value={formData.price_id}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Credits</Form.Label>
                            <Form.Control
                                type="number"
                                name="credits"
                                value={formData.credits}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bonus Credits</Form.Label>
                            <Form.Control
                                type="number"
                                name="bonus_credits"
                                value={formData.bonus_credits}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Plan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Footer />
        </main>
    );
};

export default Admin_Subscription_Plans;
