import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SlideProps {
  image: string;
  name: string;
  price: string;
  link: string;
}

const slides: SlideProps[] = [
  {
    image:
      "https://images.unsplash.com/photo-1719937051058-63705ed35502?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Product 1",
    price: "$29.99",
    link: "#",
  },
  {
    image:
      "https://images.unsplash.com/photo-1721332155567-55d1b12aa271?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Product 2",
    price: "$39.99",
    link: "#",
  },
  {
    image:
      "https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Product 3",
    price: "$49.99",
    link: "#",
  },
];

const HeroSlider: React.FC = () => {
  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="w-full h-full">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <div className="relative w-full h-80 md:h-96 lg:h-112 overflow-hidden rounded-lg">
              <img
                src={slide.image}
                alt={slide.name}
                className="object-cover w-full h-full rounded-md transition-transform duration-300 transform hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
                <h3 className="text-2xl font-semibold">{slide.name}</h3>
                <p className="text-lg font-medium">{slide.price}</p>
                <a
                  href={slide.link}
                  className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
