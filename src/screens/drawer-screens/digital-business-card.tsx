import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import {Enums} from '../../constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../business/store';

const DigitalBusinessCard = () => {
  const {member} = useSelector((state: RootState) => state.memberSlice);

  return (
    <WebView
      originWhitelist={['*']}
      source={{uri: `${Enums.DIGITAL_CARD_URL}${member.guid}`}}
      style={{
        flex: 1,
      }}
    />
  );
};

export default DigitalBusinessCard;

const styles = StyleSheet.create({});
