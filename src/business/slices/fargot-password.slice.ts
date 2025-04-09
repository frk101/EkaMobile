import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  fargotPassword: any;
  fargotPasswordLoading: boolean;
  fargotPasswordError: string | null;
}

const initialState: State = {
  fargotPassword: null,
  fargotPasswordError: null,
  fargotPasswordLoading: false,
};

const fargotPasswordSlice = createSlice({
  name: 'fargotPassword',
  initialState,
  reducers: {
    fetchStart: state => {
      state.fargotPasswordLoading = true;
      state.fargotPasswordError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.fargotPassword = action.payload;
      state.fargotPasswordLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.fargotPasswordLoading = false;
      state.fargotPasswordError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} =
  fargotPasswordSlice.actions;

export const fetchfargotPassword =
  ({email}: {email: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/forgetpassword`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());
    try {
      const response = await axios.post(
        url,
        {
          email: email,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.isSuccess) {
        dispatch(fetchSuccess(response.data));
        toast.success(response.data.message);
      } else {
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

export default fargotPasswordSlice.reducer;
