import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  help: any;
  helpLoading: boolean;
  helpError: string | null;
}

const initialState: State = {
  help: null,
  helpError: null,
  helpLoading: false,
};

const helpSlice = createSlice({
  name: 'help',
  initialState,
  reducers: {
    fetchStart: state => {
      state.helpLoading = true;
      state.helpError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.help = action.payload;
      state.helpLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.helpLoading = false;
      state.helpError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = helpSlice.actions;

export const fetchHelp =
  ({email}: {email: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/helpdesklist?email=${email}`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());

    try {
      const response = await axios.post(url, {
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

export default helpSlice.reducer;
