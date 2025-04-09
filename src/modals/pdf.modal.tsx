import React from 'react';
import { Modal, Image, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { Colors, Images } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';

interface PdfModalModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  titlePdf: string;
  url: string;
}

const PdfModal: React.FC<PdfModalModalProps> = ({ visible, setVisible, titlePdf, url }) => {
  const { top } = useSafeAreaInsets();
  console.log(titlePdf);
  const source = {
    uri: url,
    cache: true, // Caching enabled for better performance
  };
  return (
    <Modal transparent visible={visible}>
      <View style={styles.rootContainer}>
        <View style={[styles.header, { marginTop: top + 10 }]}>
          <TouchableOpacity onPress={() => setVisible(false)} style={{ flex: 1 }}>
            <Image source={Images.BACK} style={styles.icon} />
          </TouchableOpacity>

          <View style={{ flex: 2, alignItems: 'center' }}>
            <Text style={styles.text}>{titlePdf}</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Image source={Images.BACK} style={[styles.icon, { tintColor: Colors.WHITE }]} />
          </View>
        </View>
        <Pdf
        source={source}
        trustAllCerts={false}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);

        }}
        style={styles.pdf}
      />
      </View>
    </Modal>
  );
};

export default PdfModal;

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
    textAlign:'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.WHITE,
  },
});
