import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';
interface Location {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
}
interface State {
  unitLocationList: Location[];
  unitLocationListLoading: boolean;
  unitLocationListError: string | null;
  LogActivity: any;
  logActivityLoading: boolean;
  logActivityError: string | null;
}

const initialState: State = {
  unitLocationList: [],
  unitLocationListError: null,
  unitLocationListLoading: false,
  LogActivity: null,
  logActivityLoading: false,
  logActivityError: null,
};

const locationSlice = createSlice({
  name: 'locationSlice',
  initialState,
  reducers: {
    unitLocationListStart: state => {
      state.unitLocationListLoading = true;
      state.unitLocationListError = null;
    },
    unitLocationListSuccess: (state, action: PayloadAction<any>) => {
      state.unitLocationList = action.payload;
      state.unitLocationListLoading = false;
    },
    unitLocationListFailure: (state, action: PayloadAction<string>) => {
      state.unitLocationListLoading = false;
      state.unitLocationListError = action.payload;
    },

    logActivityStart: state => {
      state.logActivityLoading = true;
      state.logActivityError = null;
    },
    logActivitySuccess: (state, action: PayloadAction<any>) => {
      state.LogActivity = action.payload;
      state.logActivityLoading = false;
    },
    logActivityFailure: (state, action: PayloadAction<string>) => {
      state.logActivityLoading = false;
      state.logActivityError = action.payload;
    },
  },
});

export const {
  unitLocationListStart,
  unitLocationListSuccess,
  unitLocationListFailure,
  logActivityFailure,
  logActivityStart,
  logActivitySuccess,
} = locationSlice.actions;

export const fetchUnitLocationList =
  (): AppThunk => async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/memberactivity/GetUnitLocations`;
    const token = getState().getTokenSlice.token;
    dispatch(unitLocationListStart());
    console.log(url);

    try {
      const response = await axios.get(url, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (response.data.isSuccess) {
        dispatch(unitLocationListSuccess(response.data.unitLocationList));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;

        dispatch(unitLocationListFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(unitLocationListFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export const fetchLogActivity =
  ({
    memberId,
    id,
    lat,
    lng,
    type,
  }: {
    memberId: any;
    id: any;
    lat: any;
    lng: any;
    type: any;
  }): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/memberactivity/LogActivity`;

    const token = getState().getTokenSlice.token;
    dispatch(logActivityStart());

    try {
      const response = await axios.post(
        url,
        {
          memberId: memberId,
          unitLocationId: id,
          Latitude: lat,
          Longitude: lng,
          activityType: type, //logout
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.isSuccess) {
        dispatch(
          logActivitySuccess({
            isLogin: type === Enums.LOCATION_TYPE.LOGIN ? true : false,
          }),
        );
        return true; // Başarılı durum
      } else {
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error11', error.response);

        const errorMessage = error.response?.data?.error || error.message;
        dispatch(logActivityFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(logActivityFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
      return false;
    }
  };

export default locationSlice.reducer;
