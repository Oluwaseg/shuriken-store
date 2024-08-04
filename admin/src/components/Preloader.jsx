import React from "react";
import { motion } from "framer-motion";

const Preloader = () => {
  return (
    <div className="preloader">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="spinner"
      />
    </div>
  );
};

export default Preloader;
