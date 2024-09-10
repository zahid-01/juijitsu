import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../Pages/AdminModule/AdminDashboard";
import Logout from "../Pages/Logout/Logout";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}
