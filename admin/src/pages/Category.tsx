import { Helmet, HelmetProvider } from "react-helmet-async";
import CategoryTable from "../components/tables/CategoryTable";

const Category = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin Category</title>
          <meta name="description" content="Admin Category Page" />
        </Helmet>
      </HelmetProvider>
      <CategoryTable />
    </>
  );
};

export default Category;
