import HeroSlider from '../sliders/HeroSlider';

const Hero = () => {
  return (
    <section className='w-full max-w-7xl mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
        {/* Left side - Hero Text */}
        <div className='space-y-6 text-center lg:text-left'>
          <div className='flex items-center justify-center lg:justify-start gap-4'>
            <div className='w-12 h-[2px] bg-accent-light dark:bg-accent-dark'></div>
            <span className='text-text-secondary-light dark:text-text-secondary-dark font-medium'>
              Best Selling Products
            </span>
          </div>

          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary-light dark:text-text-primary-dark leading-tight'>
            Latest Arrivals
            <span className='block text-accent-light dark:text-accent-dark'>
              For You
            </span>
          </h1>

          <div className='flex items-center justify-center lg:justify-start gap-4'>
            <span className='font-semibold text-text-primary-light dark:text-text-primary-dark'>
              SHOP NOW
            </span>
            <div className='w-12 h-[2px] bg-accent-light dark:bg-accent-dark'></div>
          </div>
        </div>

        {/* Right side - Slider */}
        <div className='w-full'>
          <HeroSlider />
        </div>
      </div>

      {/* Mobile Slider (shown below hero text on mobile) */}
      <div className='lg:hidden mt-8'>
        <h2 className='text-2xl font-bold text-center text-text-primary-light dark:text-text-primary-dark mb-6'>
          Explore Our Latest Products
        </h2>
        <HeroSlider />
      </div>
    </section>
  );
};

export default Hero;
