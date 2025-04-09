import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  feedback: any;
  feedbackLoading: boolean;
  feedbackError: string | null;
}

const initialState: State = {
  feedback: null,
  feedbackError: null,
  feedbackLoading: false,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    fetchStart: state => {
      state.feedbackLoading = true;
      state.feedbackError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.feedback = action.payload;
      state.feedbackLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.feedbackLoading = false;
      state.feedbackError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = feedbackSlice.actions;

export const fetchFeedBack =
  ({
    memberid,
    title,
    message,
  }: {
    memberid: any;
    title: any;
    message: any;
  }): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/feedback/insert`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());
    try {
      const response = await axios.post(
        url,
        {
          entity: {
            memberid: memberid,
            title: title,
            message: message,
          },
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      dispatch(fetchSuccess(response.data));
      if (response.data.isSuccess) {
        toast.success('Öneriniz başarıyla iletildi.');
      }
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

export default feedbackSlice.reducer;
