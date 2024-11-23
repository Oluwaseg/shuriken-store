import React from "react";
import UsersTable from "../components/tables/UserTable";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Users: React.FC = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin Users List</title>
          <meta name="description" content="Admin Users List Page" />
        </Helmet>
      </HelmetProvider>
      <UsersTable />
    </>
  );
};

export default Users;
