import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  motto: [];
  mottoLoading: boolean;
  mottoError: string | null;
}

const initialState: State = {
  motto: [],
  mottoError: null,
  mottoLoading: false,
};

const mottoSlice = createSlice({
  name: 'motto',
  initialState,
  reducers: {
    fetchStart: state => {
      state.mottoLoading = true;
      state.mottoError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.motto = action.payload;
      state.mottoLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.mottoLoading = false;
      state.mottoError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = mottoSlice.actions;

export const fetchMotto = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/mottoofday/query`;
  const token = getState().getTokenSlice.token;
  dispatch(fetchStart());

  try {
    const response = await axios.get(
      url,

      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
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

export default mottoSlice.reducer;
