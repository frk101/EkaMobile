import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  getYearRepeatList: any[];
  getYearRepeatListLoading: boolean;
  getYearRepeatListError: string | null;
}

const initialState: State = {
  getYearRepeatList: [],
  getYearRepeatListError: null,
  getYearRepeatListLoading: false,
};

const getYearRepeatListSlice = createSlice({
  name: 'getYearRepeatList',
  initialState,
  reducers: {
    fetchStart: state => {
      state.getYearRepeatListLoading = true;
      state.getYearRepeatListError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.getYearRepeatList = action.payload;
      state.getYearRepeatListLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.getYearRepeatListLoading = false;
      state.getYearRepeatListError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} =
  getYearRepeatListSlice.actions;

export const fetcgetYearRepeatList =
  (): AppThunk => async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/GetYearRepeatList`;

    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        dispatch(fetchSuccess(response.data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error11', error.response);

        const errorMessage = error.response?.data?.error || error.message;
        dispatch(fetchFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export default getYearRepeatListSlice.reducer;
