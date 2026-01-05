import React from "react";
import Header from "./components/common/header/Header";
import Herosection from "./components/common/herosection/Herosection";
import Tamplates_Sections from "./components/pages/tamplates/tamplates_section/Tamplates_Sections";
import Ready_To_Start from "./components/pages/ready_to_start/Ready_To_Start";
import Footer from "./components/common/footer/Footer";

export const HomeBeforeLogin = () => {

  return (
    <main className="home-page">
      {/* ===== HEADER ===== */}
      <Header />
      <div className='content-outer'>
        {/* ===== HERO SECTION ===== */}
        <Herosection />

        {/* ===== TEMPLATE SECTION ===== */}
        <Tamplates_Sections />

        {/* ========== Ready To start ======= */}
        <Ready_To_Start />

      </div>
      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  );
};
