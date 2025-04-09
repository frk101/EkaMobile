import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  timelines: any[];
  timelinesLoading: boolean;
  timelinesError: string | null;
}

const initialState: State = {
  timelines: [],
  timelinesError: null,
  timelinesLoading: false,
};

const timelineSlice = createSlice({
  name: 'timeLine',
  initialState,
  reducers: {
    fetchStart: state => {
      state.timelinesLoading = true;
      state.timelinesError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.timelines = action.payload;
      state.timelinesLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.timelinesLoading = false;
      state.timelinesError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = timelineSlice.actions;

export const fetchTimeLine =
  ({userId}: {userId: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/TimelinePost/GetTimeLine`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());

    try {
      const response = await axios.post(
        url,
        {
          token: userId,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data) {
        dispatch(fetchSuccess(response.data.timelinePosts));
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

export default timelineSlice.reducer;
