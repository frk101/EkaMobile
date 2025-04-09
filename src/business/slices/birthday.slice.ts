import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  birthdayUsers: [];
  birthdayUsersLoading: boolean;
  birthdayUsersError: string | null;
}

const initialState: State = {
  birthdayUsers: [],
  birthdayUsersError: null,
  birthdayUsersLoading: false,
};

const birthdaySlice = createSlice({
  name: 'birthdayUsers',
  initialState,
  reducers: {
    fetchStart: state => {
      state.birthdayUsersLoading = true;
      state.birthdayUsersError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.birthdayUsers = action.payload;
      state.birthdayUsersLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.birthdayUsersLoading = false;
      state.birthdayUsersError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = birthdaySlice.actions;

export const fetchBirthdayToday =
  (): AppThunk => async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/GetPeopleBornToday`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());

    try {
      const response = await axios.get(url, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (response.data) {
        dispatch(fetchSuccess(response.data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.log(errorMessage);
        dispatch(fetchFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export default birthdaySlice.reducer;
