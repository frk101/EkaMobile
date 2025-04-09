import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  changePassword: any;
  changePasswordLoading: boolean;
  changePasswordError: string | null;
}

const initialState: State = {
  changePassword: null,
  changePasswordError: null,
  changePasswordLoading: false,
};

const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    fetchStart: state => {
      state.changePasswordLoading = true;
      state.changePasswordError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.changePassword = action.payload;
      state.changePasswordLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.changePasswordLoading = false;
      state.changePasswordError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} =
  changePasswordSlice.actions;

export const fetchchangePassword =
  ({
    userId,
    newPassword,
    newPasswordAgain,
  }: {
    userId: any;
    newPassword: any;
    newPasswordAgain: any;
  }): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/changepassword`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());
    try {
      const response = await axios.post(
        url,
        {
          Token: userId,
          NewPassword: newPassword,
          NewPasswordAgain: newPasswordAgain,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.isSuccess) {
        dispatch(fetchSuccess(response.data));
        toast.success(response.data.message);
      } else {
        dispatch(fetchSuccess(response.data));
        toast.error(response.data.message);
      }
      //   dispatch(fetchSuccess(response.data));
      //   console.log(response);
      //   if (response.data.isSuccess) {
      //     toast.success('Öneriniz başarıyla iletildi.');
      //   }
      //   if (response.data) {
      //     dispatch(fetchSuccess(response.data));
      //   } else {
      //     toast.error(response.data.message);
      //   }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        dispatch(fetchFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export default changePasswordSlice.reducer;
