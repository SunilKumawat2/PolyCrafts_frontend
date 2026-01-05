import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import { Get_Global_seo_content } from "../../../api/global/Global";
import DynamicSEO from "../../../seo/DynamicSEO";

const Terms_Conditions = () => {
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
  });

  // ✅ Fetch SEO content dynamically
  useEffect(() => {
    const fetchSEOContent = async () => {
      try {
        const res = await Get_Global_seo_content("terms_and_conditions"); // pageKey = "home"
        if (res?.data?.status && res?.data?.data) {
          setSeoData({
            title: res.data.data.title || "",
            description: res.data.data.description || "",
          });
        }
      } catch (error) {       
        console.error("Error fetching SEO content:", error);
      }
    };          
    
    fetchSEOContent();             
  }, []);                        

  useEffect(() => {  
    // Scroll to top on component mount 
    window.scrollTo(0, 0);                
  }, []);
  return (                
    <main>
         <DynamicSEO pageKey="terms_and_conditions"/>
      <Header />
      <div className='content-outer'>
      <div className="container px-5">
        {" "}
        {/* or px-85 if you have that utility */}
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "80vh", textAlign: "center" }}
        >
          <div className="col-lg-8 col-md-10">
            <div className="hero-text">
              <h1 className="mb-4">{seoData?.title || "Loading..."}</h1>
              <p
                className="hero-description"
                dangerouslySetInnerHTML={{
                  __html: seoData?.description || "Loading description...",
                }}
              />
            </div>
          </div>
        </div>
      </div>
</div>
      <Footer />
    </main>
  );
};

export default Terms_Conditions;
