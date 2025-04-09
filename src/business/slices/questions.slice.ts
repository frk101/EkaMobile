import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  questions: any;
  questionsLoading: boolean;
  questionsError: string | null;
}

const initialState: State = {
  questions: null,
  questionsError: null,
  questionsLoading: false,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    fetchStart: state => {
      state.questionsLoading = true;
      state.questionsError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.questions = action.payload;
      state.questionsLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.questionsLoading = false;
      state.questionsError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = questionsSlice.actions;

export const fetchQuestions = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/Faq/query`;
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

export default questionsSlice.reducer;
