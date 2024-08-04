import { useLocation, Outlet } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumps";
import ProductsTable from "../components/tables/ProductTable";

const Products = () => {
  const location = useLocation();

  // Check if current path is exactly "/products"
  const isProductsPage = location.pathname === "/products";

  return (
    <div>
      <Breadcrumb />
      {isProductsPage && (
        <>
          <ProductsTable />
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Products;
