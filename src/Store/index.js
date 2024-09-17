import { configureStore } from "@reduxjs/toolkit";
import userCartSlice from "./cartSlice";

const store = configureStore({
  reducer: { cart: userCartSlice.reducer },
});

export default store;
