import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import AllSelectedServices from "./pages/AllSelectedServices";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home";
import Account from "./pages/Account";
import { Toaster } from "sonner";
import AdminLogin from "./pages/Admin/AdminLogin";
import Dash from "./pages/Admin/Dash";
import AdminLayout from "./layouts/AdminLayout";
import Categories from "./pages/Admin/Categories";
import SelectedService from "./pages/SelectedService";

function App() {
  return (
    <>
    <Toaster position="top-right" richColors />
      <Routes>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dash />} />
          <Route path="categories" element={<Categories />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<AllSelectedServices />} />
          <Route
            path="services/:categoryId/:serviceId"
            element={<SelectedService />}
          />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="account" element={<Account />} />
          <Route path="requests" element={<Account />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
