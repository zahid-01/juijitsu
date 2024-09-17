import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../Pages/AdminModule/AdminDashboard";
import Logout from "../Pages/Logout/Logout";
import Experts from "../Pages/Experts/Experts";
import Students from "../Pages/Students/Students";
import Transactions from "../Pages/Transactions/Transactions";
import Settings from "../Pages/Settings/Settings";



export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/students" element={<Students />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
