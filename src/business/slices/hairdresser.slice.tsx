import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../store';
import axios from 'axios';
import {Enums} from '../../constants';
import {toast} from 'sonner-native';
import {store} from '../store';
interface Appointment {
  memberId: number;
  date: string;
  gender: number;
  isMyAppointment: boolean;
  appointmentId: number;
  isSuccess: boolean;
  description?: string;
}
interface State {
  hairdresserList: Appointment[];
  hairdresserListLoading: boolean;
  hairdresserListError: string | null;
}

const initialState: State = {
  hairdresserList: [],
  hairdresserListError: null,
  hairdresserListLoading: false,
};

const hairdresserSlice = createSlice({
  name: 'hairdresser',
  initialState,
  reducers: {
    fetchHairdresserListStart: state => {
      state.hairdresserListLoading = true;
      state.hairdresserListError = null;
    },
    fetchHairdresserListSuccess: (state, action: PayloadAction<any>) => {
      state.hairdresserList = action.payload;
      state.hairdresserListLoading = false;
    },
    fetchHairdresserListFailure: (state, action: PayloadAction<string>) => {
      state.hairdresserListLoading = false;
      state.hairdresserListError = action.payload;
    },
  },
});

export const {
  fetchHairdresserListStart,
  fetchHairdresserListSuccess,
  fetchHairdresserListFailure,
} = hairdresserSlice.actions;

export const fetchHairdresserList =
  ({gender, memberId}: {gender: any; memberId: any}): AppThunk =>
  async (dispatch, getState) => {
    const url = `${Enums.BASE_URL}api/AppointmentApi/GetList`;
    const token = getState().getTokenSlice.token;
    dispatch(fetchHairdresserListStart());

    try {
      const response = await axios.post(
        url,
        {
          gender: gender,
          MemberId: memberId,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (response.data) {
        dispatch(fetchHairdresserListSuccess(response.data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.log(errorMessage);
        dispatch(fetchHairdresserListFailure(errorMessage.toString()));
        toast.error(errorMessage.toString());
      } else {
        dispatch(fetchHairdresserListFailure('An unknown error occurred'));
        toast.error('An unknown error occurred');
      }
    }
  };

export const addHardresserAppointments = async ({
  Date,
  Time,
  MemberId,
  BarberType,
}: {
  Date: string;
  Time: string;
  MemberId: number;
  BarberType: number;
}) => {
  const {
    getTokenSlice: {token},
  } = store.getState();
  const url = `${Enums.BASE_URL}api/AppointmentApi/AppointmentsAdd`;
  try {
    const response = await axios.post(
      url,
      {
        Date: Date,
        Time: Time,
        MemberId: MemberId,
        BarberType: BarberType,
      },
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data;
  } catch (error) {
    console.error('Appointment ekleme hatası:', error);
    throw error;
  }
};

export const deleteHardresserAppointments = async ({
  id,
  MemberId,
}: {
  id: number;
  MemberId: number;
}) => {
  const {
    getTokenSlice: {token},
  } = store.getState();
  const url = `${Enums.BASE_URL}api/AppointmentApi/DeleteAppointment`;
  try {
    const response = await axios.post(
      url,
      {
        Id: id,
        MemberId: MemberId,
      },
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data;
  } catch (error) {
    console.error('Appointment silme hatası:', error);
    throw error;
  }
};

export default hairdresserSlice.reducer;
