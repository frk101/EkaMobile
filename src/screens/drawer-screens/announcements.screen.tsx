/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Enums} from '../../constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../business/store';
const formatDateAccc = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz.
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};
const AnnouncementsScreen = ({navigation}) => {
  const {announcementsLoading, announcements} = useSelector(
    (state: RootState) => state.announcements,
  );
  return (
    <View style={{flex: 1, backgroundColor: Colors.creamColor}}>
      <FlatList
        data={announcements}
        keyExtractor={(item, index) => `announcement-${index}`}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.announcements}
              onPress={
                () =>
                  navigation.navigate('AnnouncementsDetailScreen', {
                    announcement: item,
                    type: 'detail',
                  })
                // navigationUtil.navigate('DrawerStack', {
                //   screen: 'AnnouncementsDetailScreen',
                //   params: {announcement: announcement},
                // })
              }>
              <Text style={{color: Colors.BLACK, fontWeight: '700'}}>
                {item.title}
              </Text>
              <Text
                style={{
                  color: Colors.orangeColor,
                  fontWeight: '700',
                  marginTop: 5,
                }}>
                {formatDateAccc(item.date)}
              </Text>
              <Text
                style={{
                  color: Colors.greyColor2,
                  fontWeight: '700',
                  marginTop: 5,
                }}>
                {item.description}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      {/* {announcements
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
            })} */}
      {/* <Image
        source={{
          uri: `${Enums.BASE_URL}images/uploads/original/${announcement?.image}`,
        }}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      /> */}
    </View>
  );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  announcements: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    marginHorizontal: 20,
  },
});
