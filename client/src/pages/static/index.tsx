import Hero from '../../components/common/Hero';
import ScrollButton from '../../components/lib/ScrollButton';
import BestSellers from '../../components/template/BestSeller';
import Latest from '../../components/template/Latest';
import NewsLetter from '../../components/template/NewsLetter';
import OurPolicy from '../../components/template/OurPolicy';
import ProductGrid from '../../components/template/Product';

const index = () => {
  return (
    <div className=''>
      <Hero />
      <Latest />
      <OurPolicy />
      <BestSellers />
      <ProductGrid />
      <NewsLetter />
      <ScrollButton />
    </div>
  );
};

export default index;
