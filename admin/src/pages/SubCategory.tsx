import SubcategoryTable from "../components/tables/SubcategoryTable";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SubCategory = () => {
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>Admin Sub-Category</title>
          <meta name="description" content="Admin Sub-Category Page" />
        </Helmet>
      </HelmetProvider>
      <SubcategoryTable />
    </div>
  );
};

export default SubCategory;
