import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Enums, Images} from '../constants';
import {DrawerActions} from '@react-navigation/native';
import {collapsibleData, homeData} from '../../fakeData';
import {AppDispatch, RootState} from '../business/store';
import {useDispatch, useSelector} from 'react-redux';

const CustomDrawerContent = props => {
  const {favoriteApps} = useSelector(
    (state: RootState) => state.favoriteAppsSlice,
  );
  const newData = collapsibleData.concat(favoriteApps);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          <Image source={Images.MAIN_LOGO} style={styles.logoIcon} />
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Image source={Images.CLOSE} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        {newData?.map(item => {
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.drawerItem}
              onPress={() => {
                if (item.dummy) {
                  props.navigation.navigate(item.screen);
                } else {
                  props.navigation.navigate('FavoriteApp', {
                    title: item.title,
                    item: item,
                  });
                }
              }}>
              {item.dummy ? (
                <Image style={styles.icon} source={item.icon} />
              ) : (
                <Image
                  source={{
                    uri: `${Enums.BASE_URL}images/uploads/original/${item.icon}`,
                  }}
                  style={styles.icon}
                />
              )}
              <Text style={styles.drawerText}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('HairdresserAppointment')}>
          <Image
            style={styles.userIcon}
            source={require('../../assets/icons/scissors.png')}
          />
          <Text style={styles.drawerText}>Kuaför Randevu Sistemi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Advertisements')}>
          <Image
            style={[styles.userIcon, {width: 25, height: 30}]}
            source={require('../../assets/images/package-box.png')}
          />
          <Text style={styles.drawerText}>İlanlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Profile')}>
          <Image style={styles.userIcon} source={Images.USER} />
          <Text style={styles.drawerText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}>
          <Image style={styles.userIcon} source={Images.TRASH} />
          <Text style={styles.drawerText}>Hesabımı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoIcon: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  drawerItem: {
    marginHorizontal: 5,
    borderBottomWidth: 0.5,
    padding: 20,
    borderBottomColor: Colors.greyColor3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerText: {color: Colors.blueColor4},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  userIcon: {
    width: 25,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
});
