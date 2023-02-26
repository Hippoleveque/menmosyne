import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "./redux-auth/reduxAuth";

const store = configureStore({ reducer: { auth: authSlice.reducer } });

export default store;
