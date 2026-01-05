import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import Reach_Us_Form from "../../common/reach_out_form/Reach_Us_Form";
import Book_Call from "../../common/book_call_popup/Book_Call";
import ReachStartImg from "../../../assets/images/about-start-img.png";
import SearchIcon from "../../../assets/images/search-icon.svg";
import Accordion from "react-bootstrap/Accordion";
import { Get_FAQ_List } from "../../../api/global/Global"; // your API call
import Header_Login from "../../common/header/Header_Login"
const FAQ = () => {
  const token = localStorage.getItem("polycarft_user_token");
  const [Bookshow, setBookShow] = useState(false);
  const [faqData, setFaqData] = useState([]);
  const [activeSection, setActiveSection] = useState(""); // selected section
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // search input

  const handleBookShow = () => setBookShow(true);
  const handleBookClose = () => setBookShow(false);

  // Fetch FAQ list
  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const res = await Get_FAQ_List();
        if (res?.data?.status) {
          setFaqData(res.data.data);
          // default active section = first available section
          const firstSection = res.data.data.find((faq) => faq.section)?.section;
          setActiveSection(firstSection || "General");
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQ();
  }, []);

  // Group FAQs by section
  const sections = faqData.reduce((acc, item) => {
    const section = item.section || "General"; // fallback if section is null
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  // Filter FAQs based on search term
  const filteredSections = Object.keys(sections).reduce((acc, section) => {
    const filtered = sections[section].filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) acc[section] = filtered;
    return acc;
  }, {});

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (

    <main className="faq-page">
      {/* ===== HEADER ===== */}
      {
        token ? (
          <Header_Login />
        ) : (

          <Header />
        )
      }
     <div className='content-outer'>
        <section className="about-banner px-85">
          <div className="container-fluid">
            <div className="row banner-row">
              <div className="col-about-banner">
                <div className="page-heading">
                  <h1>Frequently Asked Questions</h1>
                  <div className="faq-search-form">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <img src={SearchIcon} alt="SearchIcon" />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search your questions, answer etc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-question px-85">
          <div className="container-fluid">
            <div className="row faq-row">
              {/* Sections list */}
              <div className="col-faq-tabings">
                <ul>
                  {Object.keys(filteredSections).map((section) => (
                    <li key={section}>
                      <button
                        className={`tab-btn ${activeSection === section ? "active" : ""
                          }`}
                        onClick={() => setActiveSection(section)}
                      >
                        {section}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accordion for selected section */}
              <div className="col-faq-accordin">
                {loading ? (
                  <p>Loading FAQs...</p>
                ) : (
                  <Accordion defaultActiveKey="0">
                    {filteredSections[activeSection]?.length > 0 ? (
                      filteredSections[activeSection].map((faq, index) => (
                        <Accordion.Item eventKey={index.toString()} key={faq.id}>
                          <Accordion.Header>{faq.question}</Accordion.Header>
                          <Accordion.Body>
                            <p>{faq.answer}</p>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))
                    ) : (
                      <p>No results found.</p>
                    )}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Ready to Start Section ===== */}
        <section className="px-85">
          <div className="container-fluid">
            <div className="ready-start-bg">
              <div className="reach-start-row">
                <div className="reach-start-text">
                  <h2 className="gradient-text">Ready to Start Creating?</h2>
                  <p>
                    Sign up for a free account or explore our membership plans
                    to unlock the full Poly Craft experience.
                  </p>
                  <Link to="#" className="btn btn-primary">
                    Let's Start
                  </Link>
                </div>
                <div className="reach-start-img">
                  <img src={ReachStartImg} alt="ReachStartImg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Book Call ===== */}
        <section className="book-call-btn">
          <div className="container-fluid">
            <div className="col-book-btn about-us">
              <button className="btn btn-primary" onClick={handleBookShow}>
                Book A Call
              </button>
              <Book_Call
                Bookshow={Bookshow}
                handleBookClose={handleBookClose}
              />
            </div>
          </div>
        </section>

        <Reach_Us_Form />
      </div>
    </main>

  );
};

export default FAQ;
