/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Enums} from '../../constants';

const AnnouncementsDetailsScreen = ({route}) => {
  console.log(route?.params?.type);
  const {announcement} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Image
        source={{
          uri: `${Enums.BASE_URL}images/uploads/original/${announcement?.image}`,
        }}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    </View>
  );
};

export default AnnouncementsDetailsScreen;

const styles = StyleSheet.create({});
