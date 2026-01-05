import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { User_Consultation_Booking } from "../../../api/global/Global"; // adjust import path

const Book_Call = ({ Bookshow, handleBookClose }) => {
    const [bookcall, setBookCall] = useState({
        name: "",
        email: "",
        company_name: "",
        phone_number: "",
        booking_date: null, // ✅ keep Date object
        booking_start_time: "",
        booking_end_time: "",
        honeypot: ""
    });

    const [errors, setErrors] = useState({});
    const todayStr = new Date().toISOString().split("T")[0];
    const selectedStr = bookcall.booking_date;

    const disableSlot =
        !selectedStr || selectedStr <= todayStr;

    // handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookCall({ ...bookcall, [name]: value });
    };

    // ✅ format date as YYYY-MM-DD (timezone safe)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // validate form fields
    const validateForm = () => {
        let newErrors = {};
        if (!bookcall.name.trim()) newErrors.name = "Full Name is required";
        if (!bookcall.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(bookcall.email)) {
            newErrors.email = "Enter a valid email";
        }
        if (!bookcall.phone_number.trim()) newErrors.phone_number = "Phone number is required";

        // ✅ booking date validation
        if (!bookcall.booking_date) {
            newErrors.booking_date = "Please select a date";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // normalize
            if (bookcall.booking_date < today) {
                newErrors.booking_date = "Date cannot be in the past";
            }
        }

        if (!bookcall.booking_start_time || !bookcall.booking_end_time) {
            newErrors.booking_start_time = "Please select a time slot";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const payload = {
                    ...bookcall,
                    booking_date: formatDate(bookcall.booking_date),
                };

                await User_Consultation_Booking(payload);
                alert("Booking successful!");
                handleBookClose();
                setBookCall({
                    name: "",
                    email: "",
                    company_name: "",
                    phone_number: "",
                    booking_date: null,
                    booking_start_time: "",
                    booking_end_time: "",
                    honeypot: ""
                });
            } catch (err) {
                console.error("Booking failed", err);
                alert("Something went wrong. Try again.");
            }
        }
    };

    // ✅ normalize today for minDate
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <Modal size="xl" show={Bookshow} onHide={handleBookClose}>
            <Modal.Header closeButton>
                <Modal.Title>Book a free consultation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="book-call-row">
                    <div className="col-left-inputs">
                        <form onSubmit={handleSubmit}>
                            <div className="row inner-row">
                                {/* Full Name */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>
                                            <span className="text-danger">*</span> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter full name"
                                            name="name"
                                            value={bookcall.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>
                                            <span className="text-danger">*</span> Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email"
                                            name="email"
                                            value={bookcall.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter company name"
                                            name="company_name"
                                            value={bookcall.company_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>
                                            <span className="text-danger">*</span> Phone No
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="Enter phone number"
                                            name="phone_number"
                                            value={bookcall.phone_number}
                                            onChange={handleChange}
                                        />
                                        {errors.phone_number && <small className="text-danger">{errors.phone_number}</small>}
                                    </div>
                                </div>


                                {/* Time Slot */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="me-2">
                                            <span className="text-danger">*</span> Time:
                                        </label>

                                        <Dropdown className="time-dropdown">
                                            <Dropdown.Toggle id="dropdown-basic">
                                                {bookcall.booking_start_time && bookcall.booking_end_time
                                                    ? `${bookcall.booking_start_time} - ${bookcall.booking_end_time}`
                                                    : "Select Time"}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {[
                                                    "13:00-13:30",
                                                    "13:30-14:00",
                                                    "14:00-14:30",
                                                    "14:30-15:00",
                                                    "15:00-15:30",
                                                    "15:30-16:00",
                                                    "16:00-16:30",
                                                    "16:30-17:00",
                                                    "17:00-17:30",
                                                    "17:30-18:00"
                                                ].map((slot, idx) => {
                                                    const [start, end] = slot.split("-");

                                                    // ⭐ FINAL FIX (string compare)
                                                    const todayStr = new Date().toISOString().split("T")[0];
                                                    const selectedStr = bookcall.booking_date;

                                                    const disableSlot =
                                                        !selectedStr || selectedStr <= todayStr; // ❌ Past + Today disabled

                                                    return (
                                                        <Dropdown.Item
                                                            key={idx}
                                                            disabled={disableSlot}
                                                            style={{
                                                                opacity: disableSlot ? 0.4 : 1,
                                                                cursor: disableSlot ? "not-allowed" : "pointer"
                                                            }}
                                                            onClick={() => {
                                                                if (disableSlot) return;
                                                                setBookCall({
                                                                    ...bookcall,
                                                                    booking_start_time: start.trim(),
                                                                    booking_end_time: end.trim()
                                                                });
                                                            }}
                                                        >
                                                            {start} - {end}
                                                        </Dropdown.Item>
                                                    );
                                                })}
                                            </Dropdown.Menu>



                                        </Dropdown>

                                        {errors.booking_start_time && (
                                            <small className="text-danger">{errors.booking_start_time}</small>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* ✅ Submit button inside form */}
                            <div className="text-center mt-3">
                                <Button variant="primary" type="submit">
                                    Book Call
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Calendar (for booking_date) */}
                    <div className="col-right-calender">
                        <Calendar
                            minDate={new Date(Date.now() + 86400000)}  // Tomorrow only
                            onChange={(date) =>
                                setBookCall({ ...bookcall, booking_date: date })
                            }
                            value={bookcall.booking_date ? new Date(bookcall.booking_date) : null}
                        />

                        {errors.booking_date && <small className="text-danger">{errors.booking_date}</small>}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Book_Call;
