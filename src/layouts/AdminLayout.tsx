import { Outlet } from "react-router-dom";
import NavBar from "../pages/Admin/components/NavBar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-white text-(--color-ink)">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
