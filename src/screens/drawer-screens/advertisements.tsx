import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAdvertisements} from '../../business/slices/advertisements.slice';
import {AppDispatch, RootState} from '../../business/store';
import {Colors, Enums} from '../../constants';

const Advertisements = ({navigation}) => {
  const dispatch: AppDispatch = useDispatch();

  const {advertisements, advertisementsLoading} = useSelector(
    (state: RootState) => state.advertisementsSlice,
  );
  //   dispatch(fetchAdvertisements());
  useEffect(() => {
    dispatch(fetchAdvertisements());
  }, []);
  if (advertisementsLoading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator color={Colors.blueColor} size={'large'} />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
      <FlatList
        data={advertisements?.list}
        numColumns={2}
        keyExtractor={(item, index) => `advertisements-${index}`}
        renderItem={({item}) => {
          console.log('item', Enums.BASE_URL + item.image);
          return (
            <TouchableOpacity
              style={{margin: 20}}
              onPress={() =>
                navigation.navigate('AdvertisementsDetails', {item: item})
              }>
              <View
                style={{
                  width: Dimensions.get('window').width / 2.5,
                  height: Dimensions.get('window').width / 2.5,
                  borderWidth: 0.2,
                  borderColor: Colors.greyColor,
                  backgroundColor: Colors.greyColor2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={{uri: Enums.BASE_URL + item.image}}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              </View>
              <View
                style={{
                  width: Dimensions.get('window').width / 2.5,
                  marginTop: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.BLACK,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Advertisements;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
});
