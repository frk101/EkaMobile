import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';

interface State {
  members: any[];
  membersLoading: boolean;
  membersError: string | null;
}

const initialState: State = {
  members: [],
  membersError: null,
  membersLoading: false,
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    fetchStart: state => {
      state.membersLoading = true;
      state.membersError = null;
    },
    fetchSuccess: (state, action: PayloadAction<any>) => {
      state.members = action.payload;
      state.membersLoading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.membersLoading = false;
      state.membersError = action.payload;
    },
  },
});

export const {fetchStart, fetchSuccess, fetchFailure} = membersSlice.actions;

export const fetchMembers = (): AppThunk => async (dispatch, getState) => {
  const url = `${Enums.BASE_URL}api/member/searchmember`;
  const token = getState().getTokenSlice.token;
  dispatch(fetchStart());

  try {
    const response = await axios.get(url, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (response.data) {
      dispatch(fetchSuccess(response.data.memberList));
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

export default membersSlice.reducer;
