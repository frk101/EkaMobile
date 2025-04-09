/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../business/store';
import {fetchFeedBack} from '../../business/slices/feed-back.slice';

const OpinionsAndSuggestionsScreen = () => {
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const dispatch: AppDispatch = useDispatch();
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {feedbackLoading} = useSelector(
    (state: RootState) => state.feedBackSlice,
  );
  const handleFeedback = () => {
    try {
      dispatch(
        fetchFeedBack({memberid: member?.id, title: title, message: message}),
      );
    } catch (error) {
    } finally {
      setTitle('');
      setMessage('');
    }
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Metin Başlığı"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={'#7F7F7F'}
        />
      </View>
      <View style={[styles.inputWrapper, {height: 200}]}>
        <TextInput
          placeholder="Merak etmek istediğiniz mesajı yazınız"
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholderTextColor={'#7F7F7F'}
          multiline
        />
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.blueColor,
          marginHorizontal: 20,
          minHeight: 50,
        }}
        disabled={!title || !message}
        onPress={handleFeedback}>
        {feedbackLoading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text style={{color: Colors.WHITE, fontWeight: 'bold', fontSize: 16}}>
            MESAJ GÖNDER
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OpinionsAndSuggestionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  content: {
    flexGrow: 1,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    marginBottom: 100,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  inputWrapper: {
    backgroundColor: Colors.WHITE,
    marginBottom: 20,
    height: 50,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    padding: Platform.OS === 'ios' ? 15 : 0,
    paddingLeft: Platform.OS === 'android' ? 10 : 5,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 7,
  },
  button: {
    backgroundColor: Colors.blueColor,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: 'white',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: '10%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
