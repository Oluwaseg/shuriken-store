import { useLocation, Outlet } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumps";
import ProductsTable from "../components/tables/ProductTable";

const Products: React.FC = () => {
  const location = useLocation();

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
