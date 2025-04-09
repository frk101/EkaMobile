import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  serviceRoutes: any;
  serviceRoutesLoading: boolean;
  serviceRoutesError: string | null;
}

const initialState: State = {
  serviceRoutes: null,
  serviceRoutesError: null,
  serviceRoutesLoading: false,
};

const serviceRoutesSlice = createSlice({
  name: 'serviceRoutes',
  initialState,
  reducers: {
    fetchStart: state => {
      state.serviceRoutesLoading = true;
      state.serviceRoutesError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.serviceRoutes = action.payload;
      state.serviceRoutesLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.serviceRoutesLoading = false;
      state.serviceRoutesError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} =
  serviceRoutesSlice.actions;

export const fetchserviceRoutes =
  (): AppThunk => async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/carservice/query`;
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

export default serviceRoutesSlice.reducer;
