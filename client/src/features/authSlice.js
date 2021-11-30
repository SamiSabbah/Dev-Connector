import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlertWithTime } from './alertsSlice';
import setAuthToken from '../utils/setAuthToken';
import { clearProfile } from './profileSlice';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoaded: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
    authSuccess: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    authFaild: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    logoutAction: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { authSuccess, authFaild, userLoaded, logoutAction } =
  authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch(userLoaded(res.data));
  } catch (err) {
    dispatch(authFaild());
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch, getState) => {
    try {
      const res = await axios.post('/api/users', { name, email, password });

      dispatch(authSuccess(res.data));
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
        );
      }

      dispatch(authFaild());
    }
  };

// Login User
export const login = (email, password) => async (dispatch, getState) => {
  try {
    const res = await axios.post('/api/auth', { email, password });

    dispatch(authSuccess(res.data));
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
      );
    }

    dispatch(authFaild());
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch(clearProfile());
  dispatch(logoutAction());
};

export default authSlice.reducer;
