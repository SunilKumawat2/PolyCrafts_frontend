import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Get_Global_seo_content } from "../api/global/Global";

const DynemicSeo_About = ({ pageKey }) => {
  const [seo, setSeo] = useState({
    title: "Polycraft Studio",
    description: "Loading..."
  });

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const response = await Get_Global_seo_content(pageKey);
        if (response?.data?.data) {
          setSeo(response.data.data);
        }
      } catch (err) {
        console.log("SEO error => ", err);
      }
    };

    loadSeo();
  }, [pageKey]);

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
    </Helmet>
  );
};

export default DynemicSeo_About;
