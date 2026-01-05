import React, { useState } from 'react'
import Header from "../../common/header/Header";
import Header_Login from "../../common/header/Header_Login";
import Herosection from "../../common/herosection/Herosection";
import Footer from '../../common/footer/Footer';
import Template_Slider from '../tamplates/tamplates_section/Template_Slider';
import Book_Call from '../../common/book_call_popup/Book_Call';
import DynamicSEO from '../../../seo/DynamicSEO';

const Home = () => {
  const [Bookshow, setBookShow] = useState(false);

  const handleBookShow = () => setBookShow(true);
  const handleBookClose = () => setBookShow(false);
  return (
    <main className="home-login">
        <DynamicSEO pageKey="home" />
      {/* ===== HEADER ===== */}
      {/* <Header/> */}
      <Header_Login />

      {/* ===== HERO SECTION ===== */}
      <Herosection />

      {/* ===== TEMPLATE SECTION ===== */}
      <Template_Slider />

      {/* ========== Ready To start ======= */}

      {/* ============== Book A Call ============ */}
      <section className='book-call-btn'>
        <div className="container-fluid">
          <div className='col-book-btn about-us'>
            <button className='btn btn-primary' onClick={handleBookShow}>
              Book A Call
            </button>
            <Book_Call Bookshow={Bookshow} handleBookClose={handleBookClose} />
          </div>
        </div>
      </section>
      {/* ===== FOOTER ===== */}
      <Footer />

    </main>
  )
}

export default Home