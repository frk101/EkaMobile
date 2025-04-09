/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Enums, Images} from '../constants';
import Collapsible from 'react-native-collapsible';
import {collapsibleData} from '../../fakeData';
import navigationUtil from '../utils/navigation.util';

// Props tipi tanımlama
interface CollapsibleComponentProps {
  toggleExpanded: () => void;
  isCollapsed: boolean;
  favoriteApps: any[];
}

const CollapsibleComponent: React.FC<CollapsibleComponentProps> = ({
  toggleExpanded,
  isCollapsed,
  favoriteApps,
}) => {
  const newData = collapsibleData.concat(
    favoriteApps?.length > 0 ? favoriteApps : [],
  );
  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={toggleExpanded}>
        <View style={styles.row}>
          <Image source={Images.FAV} style={styles.favIcon} />
          <Text style={styles.title}>
            <Text style={{fontWeight: 'bold'}}>FAVORİ</Text> UYGULAMALAR
          </Text>
        </View>
        <Image source={Images.DOWN} style={styles.icon} />
      </TouchableOpacity>

      <Collapsible collapsed={isCollapsed}>
        <View style={styles.content}>
          <FlatList
            numColumns={2}
            data={newData}
            keyExtractor={(item, index) => `collapsible-${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  if (item.dummy) {
                    // navigation.navigate(item.screen);
                    navigationUtil.navigate('DrawerStack', {
                      screen: item.screen,
                    });
                  } else {
                    navigationUtil.navigate('DrawerStack', {
                      screen: 'FavoriteApp',
                      params: {title: item.title, item: item},
                    });
                  }
                }}>
                {item.dummy ? (
                  <Image source={item.icon} style={styles.itemIcon} />
                ) : (
                  <Image
                    source={{
                      uri: `${Enums.BASE_URL}images/uploads/original/${item.icon}`,
                    }}
                    style={styles.itemIcon}
                  />
                )}
                <Text style={styles.itemText} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Collapsible>
    </View>
  );
};

export default CollapsibleComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 5,
    borderTopEndRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  favIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  title: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
  },
  content: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    elevation: Platform.OS === 'android' ? 10 : 0,
    // paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
    borderBottomEndRadius: 5,
    borderBottomRightRadius: 5,
  },
  itemContainer: {
    flex: 1,
    margin: 10, // Her bir öğe arasında boşluk
    padding: 5,
    backgroundColor: 'white',
    height: 70, // Her öğe için sabit yükseklik
    alignItems: 'center', // İçeriği yatayda ortalama
    flexDirection: 'row',
    borderRadius: 5, // Kenarları yuvarlatma
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    color: Colors.blueColor2,
    fontWeight: '400',
    marginLeft: 5,
    flexShrink: 1, // Metnin taşmasını engeller ve sıkıştırılabilir hale getirir
    flexWrap: 'nowrap', // Tek satır yapar, taşıp kayma yapmaz
  },
  itemIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.blueColor2,
    marginLeft: 5,
  },
});
