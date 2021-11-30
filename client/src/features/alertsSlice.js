import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    alerts: [],
  },
  reducers: {
    setAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload.id
      );
    },
  },
});

export const { setAlert, removeAlert } = alertsSlice.actions;

export const selectAlerts = (state) => state.alerts.alerts;

export const setAlertWithTime =
  ({ alertType, msg, timeout = 4000 }) =>
  (dispatch) => {
    const alertObj = {
      id: uuidv4(),
      alertType,
      msg,
    };
    dispatch(setAlert(alertObj));
    setTimeout(() => {
      dispatch(removeAlert({ id: alertObj.id }));
    }, timeout);
  };

// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default alertsSlice.reducer;
