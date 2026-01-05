import React, { useState } from "react";
import Header from "../../common/header/Header";
import Herosection from "../../common/herosection/Herosection";
import Tamplates_Sections from "../tamplates/tamplates_section/Tamplates_Sections";
import Ready_To_Start from "../ready_to_start/Ready_To_Start";
import Footer from "../../common/footer/Footer";
import Mobile_How_Works from "../mobile_how_works/Mobile_How_Works";
import Book_Call from '../../common/book_call_popup/Book_Call';
import DynamicSEO from "../../../seo/DynamicSEO"; // <-- Add this

const Home_before_login = () => {
  const [Bookshow, setBookShow] = useState(false);

  const handleBookShow = () => setBookShow(true);
  const handleBookClose = () => setBookShow(false);

  return (
    <main className="home-without-login">

      {/* 🚀 Dynamic SEO for before-login version */}
      <DynamicSEO pageKey="home" />

      {/* ===== HEADER ===== */}
      <Header />

      {/* ===== HERO SECTION ===== */}
      <Herosection />

      {/* ===== TEMPLATE SECTION ===== */}
      <Tamplates_Sections />

      {/* ========== Mobile How Works ======= */}
      <Mobile_How_Works />

      {/* ========== Ready To start ======= */}
      <Ready_To_Start />

      {/* BOOK CALL BUTTON */}
      <section className="book-call-btn">
        <div className="container-fluid">
          <div className="col-book-btn about-us">
            <button className="btn btn-primary" onClick={handleBookShow}>
              Book A Call
            </button>
            <Book_Call Bookshow={Bookshow} handleBookClose={handleBookClose} />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />

    </main>
  );
};

export default Home_before_login;
