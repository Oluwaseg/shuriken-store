import Hero from '../../components/common/Hero';
import BestSellers from '../../components/landing_page/BestSeller';
import Latest from '../../components/landing_page/Latest';
import NewsLetter from '../../components/landing_page/NewsLetter';
import OurPolicy from '../../components/landing_page/OurPolicy';
import ScrollButton from '../../components/lib/ScrollButton';

const index = () => {
  return (
    <div className=''>
      <Hero />
      <Latest />
      <OurPolicy />
      <BestSellers />
      <NewsLetter />
      <ScrollButton />
    </div>
  );
};

export default index;
