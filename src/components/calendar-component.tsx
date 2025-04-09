import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Colors} from '../constants';
LocaleConfig.locales.tr = {
  monthNames: [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ],
  monthNamesShort: [
    'Oca.',
    'Şub.',
    'Mar.',
    'Nis.',
    'May.',
    'Haz.',
    'Tem.',
    'Ağu.',
    'Eyl.',
    'Eki.',
    'Kas.',
    'Ara.',
  ],
  dayNames: [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
  ],
  dayNamesShort: ['Paz.', 'Pzt.', 'Sal.', 'Çar.', 'Per.', 'Cum.', 'Cmt.'],
  today: 'Bugün',
};
LocaleConfig.defaultLocale = 'tr';
const CalendarComponent = () => {
  const [selected, setSelected] = useState('');

  return (
    <Calendar
      style={styles.calendar}
      theme={{
        selectedDayTextColor: '#ffffff',
        dayTextColor: Colors.BLACK,
      }}
      onDayPress={(day: {dateString: React.SetStateAction<string>}) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: 'orange',
        },
      }}
    />
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  calendar: {
    height: 350,
    marginHorizontal: 20,
    // marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
