import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface PopupData {
  popupTitle: string;
  popupContent: string;
  type: string;
  isSuccess: boolean;
}

interface State {
  popUpData: PopupData | null;
  popUpLoading: boolean;
  popUpError: string | null;
  isPopupOpen: boolean;
}

const initialState: State = {
  popUpData: null,
  popUpError: null,
  popUpLoading: false,
  isPopupOpen: false,
};

const popUpSlice = createSlice({
  name: 'popUp',
  initialState,
  reducers: {
    fetchStart: state => {
      state.popUpLoading = true;
      state.popUpError = null;
    },
    fetchSuccess: (state, action: PayloadAction<PopupData>) => {
      state.popUpData = action.payload;
      state.popUpLoading = false;
      state.isPopupOpen = true;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.popUpLoading = false;
      state.popUpError = action.payload;
    },
    closePopup: state => {
      state.isPopupOpen = false;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure, closePopup} =
  popUpSlice.actions;

export const fetchPopUpData = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/PopupApi/GetPopup`;
  console.log(url);
  const token = getState().getTokenSlice.token;
  dispatch(fetchStart());

  try {
    const response = await axios.get(url, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (response.data.isSuccess) {
      console.log('girdi');
      dispatch(fetchSuccess(response.data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.log(errorMessage);
      dispatch(fetchFailure(errorMessage.toString()));
      toast.error(errorMessage.toString());
    } else {
      dispatch(fetchFailure('An unknown error occurred'));
      toast.error('An unknown error occurred');
    }
  }
};

export default popUpSlice.reducer;
