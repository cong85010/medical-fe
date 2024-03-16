import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert, notification } from "antd";
import { login, reAuth, register } from "src/api/auth";

export const loginAuth = createAsyncThunk("login", async (body, thunkAPI) => {
  try {
    const data = await login(body);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const reLoginAuth = createAsyncThunk(
  "reauth",
  async (body, thunkAPI) => {
    try {
      const data = await reAuth(body);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const registerAuth = createAsyncThunk(
  "register",
  async (body, thunkAPI) => {
    try {
      const data = await register(body);
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    isAuthenticated: false,
    loading: true,
  },
  reducers: {
    logoutAuth: (state, action) => {
      state.user = {};
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(reLoginAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        state.loading = false;
      })
      .addCase(registerAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reLoginAuth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerAuth.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(reLoginAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = {};
        localStorage.setItem("token", "");
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
export const { logoutAuth } = authSlice.actions;
