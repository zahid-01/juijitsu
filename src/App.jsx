import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./Components/Layout/Layout";
import AppRoutes from "./Routes/AppRoutes";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import PasswordRecovery from "./Pages/PasswordRecovery/PasswordRecovery";
import { useEffect, useState } from "react";
import { BASE_URI } from "./Config/url";
import useFetch from "./hooks/useFetch";
import axios from "axios";
import { userCartActions } from "./Store/cartSlice";
import { useDispatch } from "react-redux";
import { payoutActions } from "./Store/payoutSlice";

const App = () => {
  const dispatch = useDispatch();
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
    axios({
      method: "GET",
      url,
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(
      (res) => {
        console.log(res.data.cart);
        dispatch(userCartActions.setCart(res.data.cart));
      },
      () => {}
    );

    axios
      .get(`${BASE_URI}/api/v1/admin/payoutRequest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(payoutActions.setNotifications(res?.data?.data.length));
      });

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
