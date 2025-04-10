import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Enums, Images} from '../../constants';
import {
  HeaderUserComponent,
  ImportantWordsComponent,
  CollepsiveComponent,
  CalendarComponent,
} from '../../components';
import HorizontalCardComponent from '../../components/horizontal-card.component';
import FoodMenuCardComponent from '../../components/food-menu-card.component';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMotto} from '../../business/slices/motto.slice';
import {fetchTodayFood} from '../../business/slices/food-menu.slice';
import {fetchBirthdayToday} from '../../business/slices/birthday.slice';
import {fetchfavoriteApps} from '../../business/slices/favorite-app.slice';
import navigationUtil from '../../utils/navigation.util';
import {formatDate} from '../../utils/format.date.util';
import {fetchNews} from '../../business/slices/new.slice';
import NewsCardComponent from '../../components/news.component';
import {fetchannouncements} from '../../business/slices/announcements.slice';
import {fetcgetYearRepeatList} from '../../business/slices/get-year-repeat-list';
import {fetchUnitLocationList} from '../../business/slices/location.slice';
import {fetchPopUpData} from '../../business/slices/popup.slice';
import PopupModal from '../../modals/pop-up.modal';

const HomeScreen: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {motto, mottoLoading} = useSelector(
    (state: RootState) => state.mottoSlice,
  );
  const {todayMenu, todayMenuLoading} = useSelector(
    (state: RootState) => state.foodMenuSlice,
  );
  const {birthdayUsers, birthdayUsersLoading} = useSelector(
    (state: RootState) => state.birthDaySlice,
  );
  const {favoriteApps, favoriteAppsLoading} = useSelector(
    (state: RootState) => state.favoriteAppsSlice,
  );
  const {newsLoading, news} = useSelector(
    (state: RootState) => state.newsSlice,
  );
  const {announcementsLoading, announcements} = useSelector(
    (state: RootState) => state.announcements,
  );
  const {getYearRepeatListLoading, getYearRepeatList} = useSelector(
    (state: RootState) => state.getYearRepeatList,
  );
  const {unitLocationListLoading} = useSelector(
    (state: RootState) => state.locationSlice,
  );

  const dispatch: AppDispatch = useDispatch();
  const loadData = useCallback(() => {
    dispatch(fetchPopUpData());
    dispatch(fetchMotto());
    dispatch(fetchTodayFood({date: formatDate(new Date())}));
    dispatch(fetchBirthdayToday());
    dispatch(fetchfavoriteApps());
    dispatch(fetchNews());
    dispatch(fetchannouncements());
    dispatch(fetcgetYearRepeatList());
    dispatch(fetchUnitLocationList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);
  const toggleExpanded = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatDateAccc = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz.
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
  if (
    todayMenuLoading ||
    birthdayUsersLoading ||
    mottoLoading ||
    favoriteAppsLoading ||
    newsLoading ||
    announcementsLoading ||
    getYearRepeatListLoading ||
    unitLocationListLoading
  ) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator color={Colors.blueColor} size={'large'} />
      </View>
    );
  }
  // console.log(news);
  return (
    <View style={styles.container}>
      <HeaderUserComponent />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.bottom}
        showsVerticalScrollIndicator={false}>
        <NewsCardComponent
          data={news}
          type={Enums.HORIZONTAL_CARD.REFECTORY}
          title="Yemekhane Görüntü"
          autoPlay={true}
        />
        {Array.isArray(motto) && motto.length > 0 && !mottoLoading && (
          <ImportantWordsComponent motto={motto} />
        )}
        <CollepsiveComponent
          isCollapsed={isCollapsed}
          toggleExpanded={toggleExpanded}
          favoriteApps={favoriteApps}
        />
        {/* <HorizontalCardComponent
          data={data}
          type={Enums.HORIZONTAL_CARD.REFECTORY}
          title="Yemekhane Görüntü"
        /> */}
        <FoodMenuCardComponent
          data={todayMenu}
          onPress={() => {
            navigationUtil.navigate('DrawerStack', {screen: 'Menu'});
          }}
        />
        {Array.isArray(birthdayUsers) &&
          birthdayUsers.length > 0 &&
          !birthdayUsersLoading && (
            <HorizontalCardComponent
              data={birthdayUsers}
              type={Enums.HORIZONTAL_CARD.BIRTDAY}
              title="Bugün Doğanlar"
              icon={Images.BIRTHDAY}
            />
          )}
        <ScrollView style={styles.announcementsContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../../assets/icons/duyurular.png')}
              tintColor={Colors.BLACK}
              style={{width: 40, height: 40, resizeMode: 'contain'}}
            />
            <View style={{marginLeft: 15}}>
              <Text style={{color: Colors.BLACK, fontSize: 12}}>
                EMLAK KONUT
              </Text>
              <Text
                style={{color: Colors.BLACK, fontSize: 16, fontWeight: '500'}}>
                DUYURULAR
              </Text>
            </View>
          </View>
          {announcements
            ?.slice(0, 2)
            .map((announcement: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.announcements}
                  onPress={() =>
                    navigationUtil.navigate('DrawerStack', {
                      screen: 'AnnouncementsDetailScreen',
                      params: {announcement: announcement},
                    })
                  }>
                  <Text style={{color: Colors.BLACK, fontWeight: '700'}}>
                    {announcement.title}
                  </Text>
                  <Text
                    style={{
                      color: Colors.orangeColor,
                      fontWeight: '700',
                      marginTop: 5,
                    }}>
                    {formatDateAccc(announcement.date)}
                  </Text>
                  <Text
                    style={{
                      color: Colors.greyColor2,
                      fontWeight: '700',
                      marginTop: 5,
                    }}>
                    {announcement.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          <TouchableOpacity
            onPress={() =>
              navigationUtil.navigate('DrawerStack', {
                screen: 'AnnouncementsScreen',
              })
            }
            style={{
              backgroundColor: 'white',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: Colors.BLACK}}>Hepsini Gör</Text>
          </TouchableOpacity>
        </ScrollView>
        {Array.isArray(getYearRepeatList) &&
          getYearRepeatList.length > 0 &&
          !getYearRepeatListLoading && (
            <HorizontalCardComponent
              data={getYearRepeatList}
              type={Enums.HORIZONTAL_CARD.REPEAT}
              title="İyiki Bizimlesin"
              icon={Images.LOGIN_LOGO}
            />
          )}

        <CalendarComponent />
      </ScrollView>
      <PopupModal />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  bottom: {
    paddingBottom: 100,
  },
  indicator: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  announcementsContainer: {
    backgroundColor: Colors.creamColor,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 20,
    borderRadius: 10,
    // height: Dimensions.get('screen').height / 2,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  announcements: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
  },
});
