import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const CustomerWeb = () => {
  return (
    <WebView
      source={{
        uri: 'https://bizz.emlakkonutasansor.com/tr-TR/Account/Register',
      }}
      style={{flex: 1}}
    />
  );
};

export default CustomerWeb;

const styles = StyleSheet.create({});
