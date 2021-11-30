import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlertWithTime } from './alertsSlice';
import { logout } from './authSlice';

const initialState = {
  profile: null,
  selectedProfile: null,
  profiles: [],
  repos: [],
  loading: true,
  errors: {},
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    },
    setProfiles: (state, action) => {
      state.profiles = action.payload;
      state.loading = false;
    },
    setSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
      state.loading = false;
    },
    setRepos: (state, action) => {
      state.repos = action.payload;
      state.loading = false;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    },
    clearProfile: (state, action) => {
      state.profile = null;
      state.repos = [];
      state.loading = false;
    },
    clearSelectedProfile: (state, action) => {
      state.selectedProfile = null;
      state.repos = [];
      state.loading = false;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.loading = false;
    },
  },
});

export const {
  setProfile,
  setProfiles,
  setSelectedProfile,
  setRepos,
  setErrors,
  clearProfile,
  clearSelectedProfile,
  updateProfile,
} = profileSlice.actions;

// Register User
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch(setProfile(res.data));
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile');

    dispatch(setProfiles(res.data));
    dispatch(clearSelectedProfile());
    dispatch(clearSelectedProfile());
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Get profile by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch(setSelectedProfile(res.data));
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Get Github repos
export const getGithubReops = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch(setRepos(res.data));
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Create or update profile
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const res = await axios.post('/api/profile', formData);

      dispatch(setProfile(res.data));
      dispatch(
        setAlertWithTime({
          alertType: 'success',
          msg: edit ? 'Profile Updated' : 'Profile Created',
        })
      );

      if (!edit) {
        history.push('/dashboard');
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
        );
      }
      dispatch(
        setErrors({ msg: err.response.statusText, status: err.response.status })
      );
    }
  };

// Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.put('/api/profile/experience', formData);

    dispatch(updateProfile(res.data));
    dispatch(
      setAlertWithTime({
        alertType: 'success',
        msg: 'Experience Added',
      })
    );

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
      );
    }
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const res = await axios.put('/api/profile/education', formData);

    dispatch(updateProfile(res.data));
    dispatch(
      setAlertWithTime({
        alertType: 'success',
        msg: 'Education Added',
      })
    );

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
      );
    }
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch(
      setAlertWithTime({ alertType: 'success', msg: 'Experience removed' })
    );
    dispatch(updateProfile(res.data));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
      );
    }
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch(
      setAlertWithTime({ alertType: 'success', msg: 'Education removed' })
    );
    dispatch(updateProfile(res.data));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
      );
    }
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');

      dispatch(
        setAlertWithTime({ msg: 'Your account has been permanatly deleted' })
      );
      dispatch(logout());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlertWithTime({ alertType: 'danger', msg: error.msg }))
        );
      }
      dispatch(
        setErrors({ msg: err.response.statusText, status: err.response.status })
      );
    }
  }
};

export default profileSlice.reducer;
