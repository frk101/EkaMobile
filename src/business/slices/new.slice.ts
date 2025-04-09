import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  news: any;
  newsLoading: boolean;
  newsError: string | null;
}

const initialState: State = {
  news: null,
  newsError: null,
  newsLoading: false,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    fetchStart: state => {
      state.newsLoading = true;
      state.newsError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.news = action.payload;
      state.newsLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.newsLoading = false;
      state.newsError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = newsSlice.actions;

export const fetchNews = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/news/query`;
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

export default newsSlice.reducer;
