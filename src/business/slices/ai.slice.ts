import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  messageList: any[];
  messageListLoading: boolean;
  messageListError: string | null;
  sendMessage: any;
  sendMessageLoading: boolean;
  sendMessageError: string | null;
}

const initialState: State = {
  messageList: [],
  messageListError: null,
  messageListLoading: false,
  sendMessage: null,
  sendMessageLoading: false,
  sendMessageError: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    fetchStart: state => {
      state.messageListLoading = true;
      state.messageListError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.messageList = action.payload;
      state.messageListLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.messageListLoading = false;
      state.messageListError = action.payload;
    },
    fetchSendStart: state => {
      state.sendMessageLoading = true;
      state.sendMessageError = null;
    },
    fetchSendSuccess: (state, action: PayloadAction<any>) => {
      state.sendMessage = action.payload;
      state.sendMessageLoading = false;
    },
    fetchSendFailure: (state, action: PayloadAction<string>) => {
      state.sendMessageLoading = false;
      state.sendMessageError = action.payload;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  fetchSendStart,
  fetchSendSuccess,
  fetchSendFailure,
} = aiSlice.actions;

export const fetcMessageList =
  ({memberId}: {memberId: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/AssistantChatApi/GetPreviousMessages`;

    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());

    try {
      const response = await axios.post(
        url,
        {
          MemberId: memberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data) {
        dispatch(fetchSuccess(response.data.previousMessages));
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

export const fetcSendMessage =
  ({memberId, message}: {memberId: any; message: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/assistantchatapi/SendMessage`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchSendStart());

    try {
      const response = await axios.post(
        url,
        {Message: message, MemberId: memberId},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.isSuccess) {
        dispatch(fetchSendSuccess(response.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.log(errorMessage);
        dispatch(fetchSendFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchSendFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export default aiSlice.reducer;
