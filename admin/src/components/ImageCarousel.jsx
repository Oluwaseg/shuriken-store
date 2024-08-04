import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ images }) => {
  return (
    <div className="mt-4">
      {images.length > 0 && (
        <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
          {images.map((file, index) => (
            <div key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`Product Image ${index + 1}`}
                className="object-cover w-full h-64"
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ImageCarousel;
