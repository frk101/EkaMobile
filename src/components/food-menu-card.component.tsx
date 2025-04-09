import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import {Colors, Images} from '../constants';

interface Props {
  data: any;
  onPress?: () => void;
  detail?: boolean;
}

const {width} = Dimensions.get('window');

const FoodMenuCardComponent: React.FC<Props> = ({data, onPress, detail}) => {
  const listRef = useRef<FlatList>(null);
  const [currIndex, setCurrIndex] = useState(0);

  // Veriyi iki gruba ayırıyoruz
  const firstHalf = data.slice(0, 8);
  const secondHalf = data.slice(8, 16);
  const groupedData = [firstHalf, secondHalf];

  const _onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      setCurrIndex(viewableItems[0]?.index ?? 0);
    },
    [],
  );
  const mealTimeText = currIndex === 0 ? 'Öğle' : 'Akşam';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={Images.FOOD_MENU} style={styles.image} />
        <Text style={styles.title}>GÜNÜN MENÜSÜ - ({mealTimeText})</Text>
      </View>
      <FlatList
        ref={listRef}
        data={groupedData}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => `group-${index}`}
        renderItem={({item}) => (
          <View style={[styles.page, {width}]}>
            <FlatList
              data={item}
              keyExtractor={(foodItem, index) => `food-${index}`}
              renderItem={({item: foodItem}) => (
                <View style={styles.renderRow}>
                  <Text style={styles.renderTitle}>
                    {foodItem?.foodName?.trim()}
                  </Text>
                  <Text style={styles.renderCalorie}>
                    {foodItem.calorie} Kalori
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        snapToAlignment="center"
        snapToInterval={width}
      />
      {!detail && (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>AYLIK MENU</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FoodMenuCardComponent;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: '600',
    marginLeft: 10,
  },
  container: {
    backgroundColor: Colors.lightOrangeColor,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 20,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  renderTitle: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
  },
  renderCalorie: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 12,
  },
  renderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE,
    marginHorizontal: 40,
  },
  btn: {
    backgroundColor: Colors.orangeColor,
    padding: 15,
    alignItems: 'center',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  btnText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  page: {
    justifyContent: 'center',
  },
});
