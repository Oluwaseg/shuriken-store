import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  rating: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Beoplay M5 Bluetooth Speaker",
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png",
    price: "$99.00",
    rating: 4,
  },
  {
    id: 2,
    name: "Apple Smart Watch 6 - Special Edition",
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-2.png",
    price: "$299.00",
    rating: 5,
  },
  {
    id: 3,
    name: "Beylob 90 Speaker",
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-3.png",
    price: "$149.00",
    rating: 3,
  },
  {
    id: 4,
    name: "Sony WH-1000XM4 Headphones",
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-4.png",
    price: "$399.00",
    rating: 5,
  },
  {
    id: 5,
    name: "Sony WH-1000XM4 Headphones",
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-4.png",
    price: "$399.00",
    rating: 5,
  },
];

const ProductCard: React.FC<Product> = ({ name, image, price, rating }) => {
  return (
    <div className="relative group">
      <div className="overflow-hidden aspect-w-1 aspect-h-1">
        <img
          className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
          src={image}
          alt={name}
        />
      </div>

      <div className="flex items-start justify-between mt-4 space-x-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            <a href="#" title={name}>
              {name}
              <span className="absolute inset-0" aria-hidden="true"></span>
            </a>
          </h3>
          <div className="flex items-center mt-2.5 space-x-px">
            {[...Array(5)].map((_, index) =>
              index < rating ? (
                <AiFillStar
                  key={index}
                  className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4"
                />
              ) : (
                <AiOutlineStar
                  key={index}
                  className="w-3 h-3 text-gray-300 sm:w-4 sm:h-4"
                />
              )
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            {price}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductGrid: React.FC = () => {
  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Our featured items
          </h2>
          <p className="mt-4 text-base font-normal leading-7 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus
            faucibus massa dignissim tempus.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
