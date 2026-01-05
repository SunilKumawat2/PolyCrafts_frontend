import React, { useEffect, useState } from "react";
import {
    Admin_Get_Subscription_plan,
    Admin_Get_Details_Subscription_plan,
    Admin_Post_Subscription_plan
} from "../../../../api/admin/Admin";
import { Table, Button, Spinner, Form, Modal, InputGroup } from "react-bootstrap";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const Admin_Subscription_Features = () => {
    const [featureData, setFeatureData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [interval, setInterval] = useState("month");

    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [membership, setMembership] = useState([]);
    const [creative, setCreative] = useState([]);

    // Fetch all plans
    const fetchSubscriptionData = async () => {
        try {
            setLoading(true);
            const res = await Admin_Get_Subscription_plan("month");
            setFeatureData(res?.data?.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptionData();
    }, [interval]);

    // Fetch details for a specific plan when editing
    const handleEdit = async (plan) => {
        try {
            setLoading(true);

            const res = await Admin_Get_Details_Subscription_plan(plan.id);
            const planDetails = res?.data?.data;

            if (planDetails) {
                setSelectedPlan(planDetails);

                // Always arrays, never undefined
                setMembership(Array.isArray(planDetails.membership) ? planDetails.membership : []);
                setCreative(Array.isArray(planDetails.creative) ? planDetails.creative : []);

                setShowModal(true);
            }

        } catch (error) {
            console.error("Error fetching plan details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Save updated plan
    const handleSave = async () => {
        if (!selectedPlan) return;
        try {
            setLoading(true);
            await Admin_Post_Subscription_plan({
                id: selectedPlan.id,
                interval,
                membership: membership.filter((m) => m.trim() !== ""),
                creative: creative.filter((c) => c.trim() !== ""),
            });
            setShowModal(false);
            fetchSubscriptionData();
        } catch (error) {
            console.error("Error updating subscription plan:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header_Admin />

            <section className="admin-faq-sec px-85 pb-5">
                <h3 className="mb-4">Subscription Plan Features</h3>

                {/* <Form.Select
                    style={{ width: "200px" }}
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </Form.Select> */}

                {loading && !showModal ? (
                    <div className="text-center mt-3">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table striped bordered hover responsive className="mt-3">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Plan Name</th>
                                <th>Membership Features</th>
                                <th>Creative Features</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featureData.length ? (
                                featureData.map((plan, idx) => (
                                    <tr key={plan.id}>
                                        <td>{idx + 1}</td>
                                        <td>{plan.plan_name}</td>
                                        <td>{plan.membership?.join(", ") || "-"}</td>
                                        <td>{plan.creative?.join(", ") || "-"}</td>
                                        <td>
                                            <Button onClick={() => handleEdit(plan)}>Edit</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">No subscription features found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </section>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Subscription Plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading || !selectedPlan ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Plan Name</Form.Label>
                                <Form.Control type="text" value={selectedPlan.plan_name} disabled />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Membership Features</Form.Label>
                                <TagsInput
                                    value={membership || []}
                                    onChange={setMembership}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Creative Features</Form.Label>
                                <TagsInput
                                    value={creative || []}
                                    onChange={setCreative}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>



            <Footer />
        </main>
    );
};

export default Admin_Subscription_Features;
