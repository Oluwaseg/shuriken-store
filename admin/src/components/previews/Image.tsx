import React, { useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdDelete } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRemove = (index: number) => {
    // If the current active slide is the one being removed,
    // adjust the active index to remain valid after removal.
    if (index === activeIndex) {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    onRemove(index);
  };

  return (
    <div className='mt-6 bg-body-light dark:bg-dark-light rounded-lg shadow-md overflow-hidden'>
      <h3 className='text-lg font-medium text-text-primary-light dark:text-text-primary-dark py-2 px-4 bg-accent-light dark:bg-accent-dark'>
        {heading}
      </h3>
      {images.length > 0 && (
        <Carousel
          selectedItem={activeIndex}
          onChange={setActiveIndex}
          showThumbs={false}
          infiniteLoop
          autoPlay
          showStatus={false}
          showIndicators={images.length > 1}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type='button'
                onClick={onClickHandler}
                title={label}
                className='absolute left-0 top-1/2 -translate-y-1/2 bg-accent-light dark:bg-accent-dark text-white p-2 rounded-r-md z-10 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition-colors duration-300'
              >
                <MdChevronLeft size={24} />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type='button'
                onClick={onClickHandler}
                title={label}
                className='absolute right-0 top-1/2 -translate-y-1/2 bg-accent-light dark:bg-accent-dark text-white p-2 rounded-l-md z-10 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition-colors duration-300'
              >
                <MdChevronRight size={24} />
              </button>
            )
          }
        >
          {images.map((image, index) => (
            <div
              key={index}
              className='relative aspect-video bg-input-light dark:bg-input-dark'
            >
              <img
                src={image.url}
                alt={`Product Image ${index + 1}`}
                className='object-contain w-full h-full'
              />
              <button
                type='button'
                onClick={() => handleRemove(index)}
                className='absolute top-2 right-2 bg-accent-light dark:bg-accent-dark text-white rounded-full p-1.5 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition-colors duration-300'
                aria-label={`Remove image ${index + 1}`}
              >
                <MdDelete size={20} />
              </button>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ImageCarousel;
