import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, Enums} from '../../constants';
import {HeaderUserComponent} from '../../components';
import {timelinePosts} from '../../../fakeData';
import {stripHtmlTags} from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../business/store';
import {fetchTimeLine} from '../../business/slices/timeline.slice';

const IntranetScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {timelines, timelinesLoading} = useSelector(
    (state: RootState) => state.timelineSlice,
  );

  useEffect(() => {
    if (member) {
      dispatch(fetchTimeLine({userId: member?.guid}));
    }
  }, [dispatch, member]);
  if (timelinesLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={Colors.blueColor} size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <HeaderUserComponent />
      <FlatList
        style={styles.bottom}
        data={timelines}
        keyExtractor={(item, index) => `timelane-${index}`}
        renderItem={({item}) => (
          <View style={styles.renderTextContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: Enums.BASE_URL + item.member?.avatar}}
                style={styles.avatar}
              />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {item.member?.nameSurname}
                </Text>
                <Text style={styles.date}>
                  {new Date(item.publishedDate).toLocaleDateString()} tarihinde
                  yayınlandı.
                </Text>
              </View>
            </View>
            <Text style={{color: Colors.BLACK, marginTop: 15}}>
              {stripHtmlTags(item.content)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default IntranetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  bottom: {
    marginBottom: 100,
  },
  renderTextContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: Colors.WHITE,
    padding: 20,
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
  avatar: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  date: {
    fontWeight: '300',
    color: Colors.greyColor,
    fontSize: 10,
  },
});
