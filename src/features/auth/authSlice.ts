import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type RootState } from "../../app/store";

interface AuthState {
  role: string[];
  accessToken: string;
  refreshToken: string;
  userId: number;
  userName: string;
  userMail: string;
}

// Initial state object
const initialState: AuthState = {
  role: [],
  accessToken: "",
  refreshToken: "",
  userId: 0,
  userName: "",
  userMail: "",
};

// Async thunk to initialize from localStorage
export const initializeAuth = createAsyncThunk<AuthState>("auth/initialize", async () => {
  const storedData = localStorage.getItem("access-storage");
  if (storedData) {
    return JSON.parse(storedData);
  }
  return initialState;
});

const storeKey = "access-storage";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      const { role, accessToken, refreshToken, userId, userName, userMail } = action.payload;
      
      // Update state with login data
      state.role = role;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userId = userId;
      state.userName = userName;
      state.userMail = userMail;

      // Store in localStorage for persistence
      localStorage.setItem(storeKey, JSON.stringify(action.payload));
    },
    logout: (state) => {
      // Clear state data
      state.role = [];
      state.accessToken = "";
      state.refreshToken = "";
      state.userId = 0;
      state.userName = "";
      state.userMail = "";
      
      // Remove from localStorage
      localStorage.removeItem(storeKey);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      // Initialize state from localStorage
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.userMail = action.payload.userMail;
    });
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;
