import React from "react";
import HeroSlider from "../sliders/HeroSlider";

const Hero2: React.FC = () => {
  return (
    <section className="relative bg-gray-100 dark:bg-gray-800 py-12 px-4 md:py-16 md:px-8 my-4">
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-100 blur-sm"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1723750787814-72ddbcd155ad?q=80&w=1437&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      ></div>

      <div className="relative container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="text-center lg:text-left lg:pr-10 text-white z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Explore Our Latest Collection
          </h2>
          <p className="text-base md:text-lg mb-6">
            Upgrade your wardrobe with the newest trends and styles. Discover
            amazing deals on all our products.
          </p>
          <span className="text-lg font-semibold text-blue-400 block mb-6">
            Limited Time Offer!
          </span>
          <a
            href="#shop"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded shadow hover:bg-blue-700 transition duration-300"
          >
            Shop Now
          </a>
        </div>

        <div className="relative w-full lg:w-full z-10">
          <HeroSlider />
        </div>
      </div>
    </section>
  );
};

export default Hero2;
