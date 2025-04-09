import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';
import navigationUtil from '../../utils/navigation.util';
import {
  fetchMemberReset,
  fetchResetLogin,
  fetchSuccessSignIn,
} from './signIn.slice';

interface State {
  deviceSave: any;
  deviceSaveLoading: boolean;
  deviceSaveError: string | null;
}

const initialState: State = {
  deviceSave: null,
  deviceSaveError: null,
  deviceSaveLoading: false,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    fetchStart: state => {
      state.deviceSaveLoading = true;
      state.deviceSaveError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.deviceSave = action.payload;
      state.deviceSaveLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.deviceSaveLoading = false;
      state.deviceSaveError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = deviceSlice.actions;

export const fetchDeviceSave =
  ({
    deviceId,
    deviceType,
    memberId,
    member,
  }: {
    deviceId: any;
    deviceType: any;
    memberId: any;
    member: any;
  }): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/MemberDevice/Save`;
    const token = getState().getTokenSlice.token;
    console.log(deviceId);
    try {
      const response = await axios.post(
        url,
        {
          memberDevice: {
            deviceId: deviceId,
            token: token,
            deviceType: deviceType,
            memberId: memberId,
          },
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.isSuccess) {
        dispatch(fetchSuccessSignIn(member));
        dispatch(fetchSuccess(response.data));
        navigationUtil.navigate('DrawerStack');
      } else {
        dispatch(fetchResetLogin());
        // dispatch(fetchSuccessSignIn(member));
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('error', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        //   dispatch(fetchGetTokenFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        //   dispatch(fetchGetTokenFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export const fetchDeviceLogOut =
  ({deviceId, memberId}: {deviceId: any; memberId: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/MemberDevice/SignOut`;
    const token = getState().getTokenSlice.token;
    try {
      const response = await axios.post(
        url,
        {
          deviceId: deviceId,
          memberId: memberId,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      console.log(response);
      dispatch(fetchMemberReset());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        // dispatch(fetchGetTokenFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        //   dispatch(fetchGetTokenFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export default deviceSlice.reducer;
