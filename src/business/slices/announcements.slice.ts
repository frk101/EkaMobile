import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  announcements: any;
  announcementsLoading: boolean;
  announcementsError: string | null;
}

const initialState: State = {
  announcements: null,
  announcementsError: null,
  announcementsLoading: false,
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    fetchStart: state => {
      state.announcementsLoading = true;
      state.announcementsError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.announcements = action.payload;
      state.announcementsLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.announcementsLoading = false;
      state.announcementsError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} =
  announcementsSlice.actions;

export const fetchannouncements =
  (): AppThunk => async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/announcements/query`;
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
        dispatch(fetchFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export default announcementsSlice.reducer;
