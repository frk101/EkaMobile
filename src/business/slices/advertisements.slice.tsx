import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  advertisements: [];
  advertisementsLoading: boolean;
  advertisementsError: string | null;
}

const initialState: State = {
  advertisements: [],
  advertisementsError: null,
  advertisementsLoading: false,
};

const advertisementsSlice = createSlice({
  name: 'advertisements',
  initialState,
  reducers: {
    fetchStart: state => {
      state.advertisementsLoading = true;
      state.advertisementsError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.advertisements = action.payload;
      state.advertisementsLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.advertisementsLoading = false;
      state.advertisementsError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} =
  advertisementsSlice.actions;

export const fetchAdvertisements =
  (): AppThunk => async (dispatch, getState) => {
    console.log('girdi');
    const url = `${Enums.BASE_URL}api/Advertisements/getall`;
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

export default advertisementsSlice.reducer;
