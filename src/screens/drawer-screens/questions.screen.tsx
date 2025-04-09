import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {Colors, Images} from '../../constants';
import {fetchQuestions} from '../../business/slices/questions.slice';
import Collapsible from 'react-native-collapsible';
import {stripHtmlTags} from '../../utils';

const QuestionsScreen = () => {
  const [collapsedStates, setCollapsedStates] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleExpanded = (index: number) => {
    setCollapsedStates(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const dispatch: AppDispatch = useDispatch();
  const {questions, questionsLoading} = useSelector(
    (state: RootState) => state.questionsSlice,
  );

  useEffect(() => {
    dispatch(fetchQuestions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // {stripHtmlTags(item.content)}
  if (questionsLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={Colors.blueColor} size="large" />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={questions}
        keyExtractor={(item, index) => `question-${index}`}
        renderItem={({item, index}) => (
          <View>
            <View style={styles.container}>
              <View style={styles.row}>
                {/* <Image source={Images.FAV} style={styles.favIcon} /> */}
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleExpanded(index)}>
                <Image source={Images.DOWN} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Collapsible collapsed={!collapsedStates[index]}>
              <View style={styles.content}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.contentTitle}>
                  {stripHtmlTags(item.content)}
                </Text>
              </View>
            </Collapsible>
          </View>
        )}
      />
    </View>
  );
};

export default QuestionsScreen;

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
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  description: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  contentTitle: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
    marginTop: 5,
  },
  content: {
    backgroundColor: 'white',
    marginHorizontal: 20,
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
    padding: 20,
    elevation: 5,
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
