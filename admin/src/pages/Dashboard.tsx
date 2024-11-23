import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardTable from "../components/tables/Dashboard";

const Dashboard = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin Dashboard</title>
          <meta name="description" content="Admin Dashboard" />
        </Helmet>
      </HelmetProvider>
      <DashboardTable />
    </>
  );
};

export default Dashboard;
