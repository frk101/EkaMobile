import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import {Colors, Enums, Images} from '../constants';
import navigationUtil from '../utils/navigation.util';

interface NewsCardComponentProps {
  data: any;
  onPress?: () => void;
  type?: string;
  title?: string;
  btnTitle?: string;
  icon?: any;
  autoPlay?: boolean;
}

const NewsCardComponent: React.FC<NewsCardComponentProps> = ({
  data,
  autoPlay = false,
}) => {
  const listRef = useRef<FlatList<any>>(null);
  const [currIndex, setCurrIndex] = useState(0);

  const _onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      setCurrIndex(viewableItems[0]?.index ?? 0);
    },
    [],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoPlay) {
      interval = setInterval(() => {
        setCurrIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          listRef.current?.scrollToIndex({
            index: nextIndex >= data.length ? 0 : nextIndex,
            animated: true,
          });
          return nextIndex >= data.length ? 0 : nextIndex;
        });
      }, 6000); // 6 saniyede bir geçiş yapar
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoPlay, data?.length]);

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={listRef}
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigationUtil.navigate('DrawerStack', {
                screen: 'SliderDetail',
                params: {new: item},
              })
            }>
            <Image
              source={{
                uri: Enums.BASE_URL + 'images/uploads/original/' + item.image,
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `news-${index}`}
        horizontal
        scrollEventThrottle={5}
        pagingEnabled
        disableIntervalMomentum={true}
        snapToAlignment="center"
        snapToInterval={Dimensions.get('screen').width}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />
      <View style={styles.controlContainer}>
        <TouchableOpacity
          disabled={currIndex === 0}
          onPress={() => {
            if (currIndex > 0) {
              listRef.current?.scrollToIndex({
                index: currIndex - 1,
              });
              setCurrIndex(currIndex - 1);
            }
          }}
          style={[
            styles.controlButton,
            currIndex === 0 && styles.disabledButton,
          ]}>
          <Image
            style={styles.controlIcon}
            tintColor={Colors.BLACK}
            source={Images.BACK_SLIDER}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={currIndex === data?.length - 1}
          onPress={() => {
            if (currIndex < data?.length - 1) {
              listRef.current?.scrollToIndex({
                index: currIndex + 1,
              });
              setCurrIndex(currIndex + 1);
            }
          }}
          style={[
            styles.controlButton,
            currIndex === data?.length - 1 && styles.disabledButton,
          ]}>
          <Image
            style={styles.controlIcon}
            tintColor={Colors.BLACK}
            source={Images.ARROW}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewsCardComponent;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    width: Dimensions.get('screen').width,
    height: 300,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: Dimensions.get('screen').width,
    height: 200,
    alignItems: 'center',
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 30,
  },
  controlButton: {
    marginRight: 10,
    alignItems: 'center',
  },
  controlIcon: {
    width: 25,
    height: 25,
  },
  disabledButton: {
    opacity: 0.3,
  },
});
