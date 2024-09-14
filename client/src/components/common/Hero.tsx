import HeroSlider from "../sliders/HeroSlider";

const Hero = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row border border-gray-400">
        {/* left side */}
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <div className="text-[#414141] dark:text-white">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141] dark:bg-white"></p>
              <p className="font-medium text-sm md:text-base"> Best Selling </p>
            </div>
            <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed">
              Latest Arrivals
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
              <p className="w-8 md:w-11 h-[1px] bg-[#414141] dark:bg-white"></p>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 h-[400px] m-2 px-4 hidden sm:block">
          <HeroSlider />
        </div>
      </div>
      {/* MOBILE */}
      <div className="sm:hidden mt-6">
        <h2 className="text-2xl text-center mb-4 dark:text-white">
          Explore Our Latest Products
        </h2>
        <div className="px-4">
          <HeroSlider />
        </div>
      </div>
    </>
  );
};

export default Hero;
