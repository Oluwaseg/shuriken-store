import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdDelete } from "react-icons/md";

interface Image {
  url: string;
}

interface ImageCarouselProps {
  images: Image[];
  onRemove: (index: number) => void;
  heading: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onRemove,
  heading,
}) => {
  return (
    <div className="carousel-container mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center border-y border-secondary">
        {heading}
      </h3>
      {images.length > 0 && (
        <Carousel showThumbs={false} infiniteLoop autoPlay>
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
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors duration-300"
                aria-label={`Remove image ${index + 1}`}
              >
                <MdDelete className="w-6 h-6" />
              </button>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ImageCarousel;
