import Hero from "../components/common/Hero";
import BestSellers from "../components/template/BestSeller";
import Footer from "../components/template/Footer";
import Latest from "../components/template/Latest";
import NewsLetter from "../components/template/NewsLetter";
import OurPolicy from "../components/template/OurPolicy";
import ProductGrid from "../components/template/Product";

const index = () => {
  return (
    <div className="">
      <Hero />
      <Latest />
      <BestSellers />
      <OurPolicy />
      <NewsLetter />
      <Footer />
      <ProductGrid />
    </div>
  );
};

export default index;
