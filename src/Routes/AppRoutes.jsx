import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Pages/Login/Login";
import { SignUp } from "../Pages/SignUppage/SignUp";
import { VerifyEmail } from "../Pages/veryEmail/VerifyEmail";
import ExpertRoutes from "./ExpertRoutes";
import UserRoutes from "./UserRoutes";

import UserCourses from "../Pages/UserCourses/UserCourses";
import UserCourseOverview from "../Pages/UserCourseOverview/UserCourseOverview";

import PurchaseHistory from "../Pages/PurchaseHistory/PurchaseHistory";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = ({ search }) => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userType");
    setRole(userRole);

    // if (!userRole) {
    //   navigate("/");
    // }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/verifyEmail" element={<VerifyEmail />} />

      <Route path="/userCourses" element={<UserCourses search={search} />} />
      <Route path="/purchaseHistory" element={<PurchaseHistory />} />

      <Route
        path="/userCourses/userCourseView/:id"
        element={<UserCourseOverview />}
      />

      {role === "expert" && (
        <Route path="/*" element={<ExpertRoutes search={search} />} />
      )}
      {role === "user" && <Route path="/*" element={<UserRoutes />} />}
      {role === "admin" && <Route path="/*" element={<AdminRoutes />} />}
    </Routes>
  );
};

export default AppRoutes;
