/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../business/store';
import {
  fetchFoodMenu,
  fetchTodayFood,
} from '../../business/slices/food-menu.slice';
import {formatDate, formatSelectedDate} from '../../utils/format.date.util';

import {Colors, Images} from '../../constants';
import {Calendar} from 'react-native-calendars';

const MenuScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const {todayMenu} = useSelector((state: RootState) => state.foodMenuSlice);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const firstDayOfMonth = `${currentYear}-${currentMonth}-01`;
  const lastDayOfMonth = new Date(currentYear, currentDate.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];
  useEffect(() => {
    dispatch(
      fetchTodayFood({date: selected ? selected : formatDate(new Date())}),
    );
  }, [dispatch, selected]);
  return (
    <ScrollView style={{flex: 1, backgroundColor: Colors.WHITE}}>
      <View
        style={{
          marginTop: 40,
          marginHorizontal: 20,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.blueColor5,
        }}>
        <Text style={{color: Colors.WHITE, fontWeight: 'bold', fontSize: 20}}>
          {title}
        </Text>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.row}>
          <Image source={Images.FOOD_MENU} style={styles.image} />
          <Text style={styles.title}>GÜNÜN MENÜSÜ</Text>
        </View>
        <FlatList
          data={todayMenu}
          keyExtractor={(item, index) => `food-${index}`}
          renderItem={({item}) => (
            <View style={styles.renderRow}>
              <Text style={styles.renderTitle}>{item.foodName.trim()}</Text>
              <Text style={styles.renderCalorie}>{item.calorie} Kalori</Text>
            </View>
          )}
        />
      </View>
      <Calendar
        style={styles.calendar}
        theme={{
          selectedDayTextColor: '#ffffff',
          dayTextColor: Colors.WHITE,
          backgroundColor: Colors.blueColor4,
          calendarBackground: Colors.blueColor5,
        }}
        current={firstDayOfMonth}
        minDate={firstDayOfMonth}
        maxDate={lastDayOfMonth}
        onDayPress={(day: {dateString: React.SetStateAction<string>}) => {
          const formattedDate = formatSelectedDate(day.dateString);
          setTitle(formattedDate);
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'orange',
          },
        }}
        renderHeader={() => null}
        hideArrows={true}
      />
    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: '600',
    marginLeft: 10,
  },
  menuContainer: {
    backgroundColor: Colors.lightOrangeColor,
    marginHorizontal: 20,

    paddingTop: 20,
    // borderRadius: 10,
    height: Dimensions.get('screen').height / 3,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  renderTitle: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
  },
  renderCalorie: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 12,
  },
  renderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE,
    marginHorizontal: 20,
  },
  btn: {
    backgroundColor: Colors.orangeColor,
    padding: 15,
    alignItems: 'center',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  btnText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  calendar: {
    marginHorizontal: 20,
  },
});
