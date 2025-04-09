import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  todayMenu: any[];
  todayMenuLoading: boolean;
  todayMenuError: string | null;
  foodMenu: any[];
  foodMenuLoading: boolean;
  foodMenuError: string | null;
}

const initialState: State = {
  todayMenu: [],
  todayMenuError: null,
  todayMenuLoading: false,
  foodMenu: [],
  foodMenuError: null,
  foodMenuLoading: false,
};

const foodMenuSlice = createSlice({
  name: 'foodMenu',
  initialState,
  reducers: {
    fetchStart: state => {
      state.todayMenuLoading = true;
      state.todayMenuError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.todayMenu = action.payload;
      state.todayMenuLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.todayMenuLoading = false;
      state.todayMenuError = action.payload;
    },
    fetchMenuStart: state => {
      state.foodMenuLoading = true;
      state.foodMenuError = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<any>) => {
      state.foodMenu = action.payload;
      state.foodMenuLoading = false;
    },
    fetchMenuFailure: (state, action: PayloadAction<string>) => {
      state.foodMenuLoading = false;
      state.foodMenuError = action.payload;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailure,
} = foodMenuSlice.actions;

export const fetchTodayFood =
  ({date}: {date: string}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/FoodMenu/query?$filter=MenuDate eq ${date}`;
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
        console.log(errorMessage);
        dispatch(fetchFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export const fetchFoodMenu = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/foodmenu/query`;
  const token = getState().getTokenSlice.token;
  dispatch(fetchMenuStart());

  try {
    const response = await axios.get(url, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (response.data) {
      dispatch(fetchMenuSuccess(response.data));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.log(errorMessage);
      dispatch(fetchMenuFailure(errorMessage.toString()));
      toast.error(errorMessage.toString());
    } else {
      dispatch(fetchMenuFailure('An unknown error occurred'));
      toast.error('An unknown error occurred');
    }
  }
};

export default foodMenuSlice.reducer;
