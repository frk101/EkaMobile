import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {Colors} from '../../constants';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchHairdresserList,
  addHardresserAppointments,
  deleteHardresserAppointments,
} from '../../business/slices/hairdresser.slice';
import {toast} from 'sonner-native';

interface TimeSlot {
  time: string;
  status: string;
  isMyAppointment: boolean;
  id: number;
}

const AppointmentCalendar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch: AppDispatch = useDispatch();

  const {hairdresserList, hairdresserListLoading} = useSelector(
    (state: RootState) => state.hairdresserSlice,
  );
  const {member} = useSelector((state: RootState) => state.memberSlice);

  const [selectedDate, setSelectedDate] = useState<string>('');

  const markedDates = hairdresserList.reduce<Record<string, any>>(
    (acc, appointment) => {
      const dateOnly = appointment.date.split('T')[0];
      acc[dateOnly] = {
        selected: true,
        selectedColor: '#f8d7da',
      };
      return acc;
    },
    {},
  );

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    let hour = 8;

    while (hour < 17) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      if (timeSlot !== '12:00') {
        slots.push(timeSlot);
      }
      hour++; // 1 saat artır
    }
    return slots;
  };
  const getTimeSlotsForDate = (date: string): TimeSlot[] => {
    const availableSlots = generateTimeSlots();

    const bookedSlots = hairdresserList
      .filter(appointment => appointment.date.startsWith(date))
      .map(appointment => ({
        time: appointment.date.split('T')[1].slice(0, 5),
        isMyAppointment: appointment.isMyAppointment,
        id: appointment.appointmentId,
      }));

    return availableSlots.map(slot => {
      const bookedSlot = bookedSlots.find(b => b.time === slot);
      return {
        time: slot,
        status: bookedSlot ? 'Dolu' : 'Boş',
        isMyAppointment: bookedSlot ? bookedSlot.isMyAppointment : false,
        id: bookedSlot ? bookedSlot.id : 0,
      };
    });
  };

  const isWeekend = (date: string): boolean => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };
  useEffect(() => {
    selectedGender(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selectedGender = (gender: number) => {
    setActiveIndex(gender);
    dispatch(
      fetchHairdresserList({
        gender: gender === 0 ? 'men' : 'women',
        memberId: member?.id,
      }),
    );
  };

  if (hairdresserListLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator color={Colors.blueColor} size={'large'} />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.btnView}>
        <TouchableOpacity
          style={activeIndex === 0 ? styles.activeBtn : styles.btn}
          onPress={() => selectedGender(0)}>
          <Text style={styles.btnText}>Erkek Kuaför</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            activeIndex === 1 ? styles.activeBtn : styles.btn,
            // eslint-disable-next-line react-native/no-inline-styles
            {marginLeft: 10},
          ]}
          onPress={() => selectedGender(1)}>
          <Text style={styles.btnText}>Kadın Kuaför</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        style={styles.calendar}
        onDayPress={(day: DateData) => {
          if (isWeekend(day.dateString)) {
            Alert.alert('Uyarı', 'Hafta sonu randevu alınamaz.');
            return;
          }
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: '#70d7c7',
          },
        }}
        minDate={new Date().toISOString().split('T')[0]}
        maxDate={new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ).toISOString()}
      />

      <View style={styles.appointmentContainer}>
        <Text style={styles.title}>
          {selectedDate
            ? `${selectedDate} için randevu saatleri:`
            : 'Bir tarih seçiniz'}
        </Text>
        {selectedDate ? (
          <View style={styles.gridContainer}>
            {getTimeSlotsForDate(selectedDate).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  item.isMyAppointment
                    ? styles.mySlot
                    : item.status === 'Dolu'
                    ? styles.bookedSlot
                    : null,
                ]}
                disabled={!item.isMyAppointment && item.status === 'Dolu'}
                onPress={() => {
                  if (item.isMyAppointment) {
                    deleteHardresserAppointments({
                      MemberId: member?.id,
                      id: item.id,
                    }).then(x => {
                      if (x.success) {
                        toast.success(x.message);
                        selectedGender(activeIndex);
                      } else {
                        toast.error(x.message);
                      }
                    });
                  } else {
                    addHardresserAppointments({
                      MemberId: member?.id,
                      Date: selectedDate,
                      Time: item.time,
                      BarberType: activeIndex,
                    })
                      .then(x => {
                        if (x.success) {
                          toast.success(x.message);
                          selectedGender(activeIndex);
                        } else {
                          toast.error(x.message);
                        }
                      })
                      .catch(x => {
                        console.log(x);
                      });
                  }
                }}>
                <Text style={styles.timeSlotText}>{item.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  appointmentContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#70d7c7',
  },
  bookedSlot: {
    backgroundColor: '#f8d7da',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  calendar: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  activeBtn: {
    backgroundColor: '#70d7c7',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  btn: {
    backgroundColor: Colors.blueColor7,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  btnText: {
    color: Colors.WHITE,
    fontWeight: '600',
  },
  indicator: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  mySlot: {
    backgroundColor: Colors.blueColor,
  },
});

export default AppointmentCalendar;
