import { useLocation, Outlet } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumps";
import CategoryTable from "../components/tables/CategoryTable";

const Category = () => {
  const location = useLocation();

  const isCategoryPage = location.pathname === "/categories";

  return (
    <div>
      <Breadcrumb />
      {isCategoryPage && (
        <>
          <CategoryTable />
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Category;
