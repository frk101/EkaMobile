import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';
import navigationUtil from '../../utils/navigation.util';

interface State {
  token: null;
  tokenLoading: boolean;
  tokenError: string | null;
}

const initialState: State = {
  token: null,
  tokenError: null,
  tokenLoading: false,
};

const getTokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    fetchGetTokenStart: state => {
      state.tokenLoading = true;
      state.tokenError = null;
    },
    fetchGetTokenSuccess: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
      state.tokenLoading = false;
    },
    fetchGetTokenFailure: (state, action: PayloadAction<string>) => {
      state.tokenLoading = false;
      state.tokenError = action.payload;
    },
  },
});

export const {fetchGetTokenStart, fetchGetTokenSuccess, fetchGetTokenFailure} =
  getTokenSlice.actions;

export const fetchToken = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/token/create`;
  const member = getState().memberSlice.member;
  dispatch(fetchGetTokenStart());

  try {
    const response = await axios.post(url, {
      username: 'ekadmin',
      password: 'Eka123456',
    });

    if (response.data.isSuccess) {
      console.log(response.data.token);
      dispatch(fetchGetTokenSuccess(response.data.token));
      if (member) {
        navigationUtil.reset({
          index: 0,
          routes: [{name: 'DrawerStack'}],
        });
      } else {
        navigationUtil.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        });
      }
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.request);
      const errorMessage = error.response?.data?.error || error.message;
      console.log('Error message:', errorMessage);
      dispatch(fetchGetTokenFailure(errorMessage.toString()));
      toast.error(errorMessage.toString());
    } else {
      dispatch(fetchGetTokenFailure('An unknown error occurred'));
      toast.error('An unknown error occurred');
    }
  }
};

export default getTokenSlice.reducer;
