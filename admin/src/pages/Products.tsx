import React from "react";
import ProductsTable from "../components/tables/ProductTable";

const Products: React.FC = () => {
  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>
      <div className=" p-2 overflow-x-auto md:overflow-hidden">
        <ProductsTable />
      </div>
    </div>
  );
};

export default Products;
