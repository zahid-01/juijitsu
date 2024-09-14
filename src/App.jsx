import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Layout } from "./Components/Layout/Layout";
import AppRoutes from "./Routes/AppRoutes";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import PasswordRecovery from "./Pages/PasswordRecovery/PasswordRecovery";
import { useEffect, useState } from "react";
import { BASE_URI } from "./Config/url";
import useFetch from "./hooks/useFetch";

const App = () => {
  const [search, setSearch] = useState("");
  const [cartItemNumber, setCartItemNumber] = useState(0);

  const url = `${BASE_URI}/api/v1/cart`;
  const token = localStorage.getItem("token");
  const { data } = useFetch(url, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  useEffect(() => {
    console.log(data)
    if (data) {
      setCartItemNumber(data?.cart?.length);
    }
  }, []);


  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/passwordRecovery" element={<PasswordRecovery />} />
        <Route
          path="/*"
          element={
            <Layout
              search={search}
              setSearch={setSearch}
              cartItemNumber={cartItemNumber}
            >
              <AppRoutes search={search} />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;