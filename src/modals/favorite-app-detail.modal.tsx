import React from 'react';
import {
  Modal,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Colors, Enums, Images} from '../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

interface ModalModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  selectedData: any;
}

const FavoriteModal: React.FC<ModalModalProps> = ({
  visible,
  setVisible,
  title,
  selectedData,
}) => {
  const {top} = useSafeAreaInsets();
  const sanitizedHtml = `
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; padding: 10px; }
    img { max-width: 100%; height: auto; }
    a { color: blue; }
  </style>
</head>
<body>
  ${selectedData?.content || ''}
</body>
</html>
`;
  return (
    <Modal transparent visible={visible}>
      <View style={[styles.header, {marginTop: top + 10}]}>
        <TouchableOpacity onPress={() => setVisible(false)} style={{flex: 1}}>
          <Image source={Images.BACK} style={styles.icon} />
        </TouchableOpacity>

        <View style={{flex: 2, alignItems: 'center'}}>
          <Text style={styles.text}>{title}</Text>
        </View>

        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Image
            source={Images.BACK}
            style={[styles.icon, {tintColor: Colors.WHITE}]}
          />
        </View>
      </View>
      <ScrollView style={styles.rootContainer}>
        <View
          style={{
            marginHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{
              uri: `${Enums.BASE_URL}images/uploads/750x750/${selectedData?.image}`,
            }}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').width,
              resizeMode: 'contain',
            }}
          />
        </View>
      </ScrollView>
      <WebView
        originWhitelist={['*']}
        source={{html: sanitizedHtml}}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onLoadEnd={() => console.log('WebView content loaded')}
      />
    </Modal>
  );
};

export default FavoriteModal;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyColor3,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.BLACK, // Beyaz renk verildi
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pdf: {
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height,
  },
});
