/* eslint-disable react-native/no-inline-styles */
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Enums} from '../../constants';
import WebView from 'react-native-webview';

const SliderDetail = ({route}) => {
  const content = route?.params?.new?.content;
  const imageUrl =
    Enums.BASE_URL + 'images/uploads/original/' + route?.params?.new?.image;
  // Kontrol: İçerik bir video tagi içeriyorsa
  const isVideo = content.includes('<video');

  return (
    <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
      <View
        style={{
          marginHorizontal: 20,
          padding: 20,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          marginTop: 20,
        }}>
        <Text style={{color: Colors.BLACK, fontWeight: 'bold'}}>
          {route?.params?.new?.title}
        </Text>
      </View>
      {isVideo ? (
        <WebView
          originWhitelist={['*']}
          source={{
            html: content.replace(
              /src="\/Uploads\//g,
              'src="https://bizz.emlakkonut.com.tr/Uploads/',
            ),
          }}
          style={{
            height: Dimensions.get('window').height,
            backgroundColor: 'white',
            margin: 0,
            padding: 0,
            marginTop: 20,
            marginHorizontal: 20,
          }}
        />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{
            html:
              content +
              `<img src="${imageUrl}" style="width: 100%; height: auto;" />`,
          }}
          style={{
            height: Dimensions.get('window').height,
            backgroundColor: 'white',
            margin: 0,
            padding: 0,
            marginTop: 20,
            marginHorizontal: 20,
          }}
        />
      )}
    </View>
  );
};

export default SliderDetail;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
