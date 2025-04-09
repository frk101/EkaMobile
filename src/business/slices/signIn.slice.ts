import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';
import navigationUtil from '../../utils/navigation.util';
import {fetchDeviceSave} from './device.slice';

interface State {
  member: any;
  memberLoading: boolean;
  memberError: string | null;
}

const initialState: State = {
  member: null,
  memberError: null,
  memberLoading: false,
};

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    fetchStart: state => {
      state.memberLoading = true;
      state.memberError = null;
    },
    fetchSuccessSignIn: (state, action: PayloadAction<any>) => {
      state.member = action.payload;
      state.memberLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.memberLoading = false;
      state.memberError = action.payload;
    },
    fetchResetLogin: () => initialState,
  },
});

export const {fetchStart, fetchSuccessSignIn, fetchFailure, fetchResetLogin} =
  memberSlice.actions;

export const fetchSignIn =
  ({email, password}: {email: any; password: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/signin`;
    const token = getState().getTokenSlice.token;
    try {
      const response = await axios.post(
        url,
        {
          email: email,
          password: password,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.isSuccess) {
        toast.success(response.data.message);
        navigationUtil.navigate('AuthStack', {
          screen: 'Verification',
          params: {email: email, password: password},
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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

export const fetchSignInCode =
  ({
    email,
    password,
    code,
    deviceId,
    deviceType,
  }: {
    email: any;
    password: any;
    code: any;
    deviceId: any;
    deviceType: any;
  }): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/member/signin`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchStart());

    try {
      const response = await axios.post(
        url,
        {
          email: email,
          password: password,
          code: code,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (response.data.member) {
        // dispatch(fetchSuccessSignIn(response?.data?.member));
        // dispatch(fetchSuccess(response.data));
        // navigationUtil.navigate('DrawerStack');
        dispatch(
          fetchDeviceSave({
            deviceId: deviceId,
            deviceType: deviceType,
            memberId: response?.data?.member?.id,
            member: response?.data?.member,
          }),
        );
      } else {
        dispatch(fetchFailure(response.data.message));
        toast.error(response.data.message);
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

export const fetchMemberReset = (): AppThunk => async dispatch => {
  dispatch(fetchStart());
  dispatch(fetchSuccessSignIn(null));
  navigationUtil.reset({
    index: 0,
    routes: [{name: 'Loading'}],
  });

  // try {
  //   const response = await axios.post(
  //     url,
  //     {
  //       email: email,
  //       password: password,
  //       code: code,
  //     },
  //     {
  //       headers: {Authorization: `Bearer ${token}`},
  //     },
  //   );
  //   if (response.data.member) {
  //     dispatch(fetchSuccess(response.data.member));
  //     // navigationUtil.navigate('DrawerStack');
  //     dispatch(
  //       fetchDeviceSave({
  //         deviceId: deviceId,
  //         deviceType: deviceType,
  //         memberId: response.data.member.guid,
  //       }),
  //     );
  //   } else {
  //     toast.error(response.data.message);
  //   }
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     const errorMessage = error.response?.data?.error || error.message;
  //     dispatch(fetchFailure(errorMessage.toString()));
  //     toast.error(errorMessage.toString());
  //   } else {
  //     dispatch(fetchFailure('An unknown error occurred'));
  //     toast.error('An unknown error occurred');
  //   }
  // }
};
export default memberSlice.reducer;
