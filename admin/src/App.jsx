import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AllApps from "./pages/AllApps";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Products from "./pages/Products";
import Create from "./pages/Create";
import ProductsList from "./pages/ProductsList";
import CreateCategory from "./pages/AddCategory";
import Categories from "./pages/Category";
import Login from "./pages/Login";
import ProtectedRoute from "./services/ProtectedRoutes";
import Preloader from "./components/Preloader";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout>
              <AllApps />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Users />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Orders />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Settings />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Products />
            </RootLayout>
          </ProtectedRoute>
        }
      >
        <Route path="create" element={<Create />} />
        <Route path="list" element={<ProductsList />} />
      </Route>
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Products />
            </RootLayout>
          </ProtectedRoute>
        }
      >
        <Route path="create" element={<CreateCategory />} />
        <Route path="list" element={<Categories />} />
      </Route>
    </Routes>
  );
};

export default App;
