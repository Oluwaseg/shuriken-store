import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ images, onRemove }) => {
  return (
    <div className="mt-4">
      {images.length > 0 && (
        <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={`Product Image ${index + 1}`}
                className="object-contain object-center w-full h-64"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ImageCarousel;
