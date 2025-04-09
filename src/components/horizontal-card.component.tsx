/* eslint-disable react-native/no-inline-styles */

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
import {Colors, Enums} from '../constants';
import DotSteps from './dot-step.component';
import {toast} from 'sonner-native';
import {calculateYearsOfWork} from '../utils/year-format-date.util';

interface HorizontalCardComponentProps {
  data: any;
  onPress?: () => void;
  type: string;
  title?: string;
  btnTitle?: string;
  icon?: any;
}

const HorizontalCardComponent: React.FC<HorizontalCardComponentProps> = ({
  data,
  type,
  title,
  icon,
}) => {
  const listRef = useRef(null);
  const [currIndex, setCurrIndex] = useState(0);
  const _onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      setCurrIndex(viewableItems[0]?.index ?? 0); // index olmayabilir, bu yüzden varsayılan değeri 0 yapıyoruz
    },
    [],
  );
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            type === Enums.HORIZONTAL_CARD.REFECTORY
              ? Colors.blueColor3
              : Colors.blueColor3,
        },
      ]}>
      {Enums.HORIZONTAL_CARD.REFECTORY === type ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <View style={styles.titleView}>
          <Image
            source={icon}
            style={
              type == Enums.HORIZONTAL_CARD.REPEAT
                ? styles.repeaticon
                : styles.icon
            }
          />
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={data}
        renderItem={({item}) => {
          return (
            <>
              {type === Enums.HORIZONTAL_CARD.REFECTORY && (
                <Image
                  source={{uri: item.image}}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              {type === Enums.HORIZONTAL_CARD.BIRTDAY && (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={{uri: Enums.BASE_URL + item.avatar}}
                    style={styles.avatar}
                  />

                  <Text style={styles.name}>{item.nameSurname}</Text>
                  <Text style={styles.job}>{item.memberHierarchy.name}</Text>
                  <View
                    style={{
                      width: Dimensions.get('screen').width - 40,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        marginTop: 20,
                        padding: 10,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        toast.success('Tebriğiniz başarıyla iletildi.');
                      }}>
                      <Text style={{color: Colors.blueColor3}}>
                        Doğum Gününü Kutla
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {type === Enums.HORIZONTAL_CARD.REPEAT && (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={{uri: Enums.BASE_URL + item.avatar}}
                    style={styles.avatar}
                  />
                  <Text style={styles.startDayOfWork}>
                    {calculateYearsOfWork(item.startDayOfWork)} Yıldır
                  </Text>
                  <Text style={styles.name}>Bizimle Beraber</Text>
                  <Text style={styles.name}>{item.nameSurname}</Text>
                  <Text style={styles.job}>{item.job}</Text>
                  <Text style={styles.job}>{item.memberHierarchy.name}</Text>
                  <View
                    style={{
                      width: Dimensions.get('screen').width - 40,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'white',
                        marginTop: 20,
                        padding: 10,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        toast.success('Başarıyla iletildi.');
                      }}>
                      <Text style={{color: Colors.blueColor3}}>
                        Mesai Arkadaşını Tebrik Et
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          );
        }}
        keyExtractor={(item, index) => `${type}-${index}`}
        horizontal
        scrollEventThrottle={5}
        pagingEnabled
        disableIntervalMomentum={true}
        snapToAlignment="center"
        snapToInterval={Dimensions.get('screen').width - 40}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
      {currIndex === 0 && <View />}
      <View>
        <DotSteps currStepIndex={currIndex} stepCount={data?.length} />
      </View>
    </View>
  );
};

export default HorizontalCardComponent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    // paddingVertical: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  image: {
    width: Dimensions.get('screen').width - 40,
    height: 170,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.WHITE,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 20,
    marginRight: 10,
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginTop: 10,
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  job: {
    marginTop: 10,
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: '500',
  },
  repeaticon: {
    marginBottom: 20,
    marginRight: 10,
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  startDayOfWork: {
    marginTop: 10,
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
