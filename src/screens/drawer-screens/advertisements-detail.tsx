import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Colors, Enums} from '../../constants';

const AdvertisementsDetail = ({
  route,
}: {
  route: {params: {item: {image: string; description: string}}};
}) => {
  const {item} = route.params;

  // URL'leri algılamak için RegExp
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Açıklama metnini işleyen fonksiyon
  const renderDescription = (description: string) => {
    const parts = description.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(part)}
            activeOpacity={0.7}>
            <Text style={styles.link}>{part}</Text>
          </TouchableOpacity>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Görsel Alanı */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: Enums.BASE_URL + item.image}}
          style={styles.image}
        />
      </View>

      {/* Açıklama Alanı */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          {renderDescription(item.description)}
        </Text>
      </View>
    </ScrollView>
  );
};

export default AdvertisementsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  imageContainer: {
    marginTop: 20,
    width: Dimensions.get('window').width / 2.5,
    height: Dimensions.get('window').width / 2.5,
    borderWidth: 0.2,
    borderColor: Colors.greyColor,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  descriptionContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.BLACK,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
