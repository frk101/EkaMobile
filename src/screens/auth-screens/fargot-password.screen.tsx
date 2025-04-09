import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Images, Colors} from '../../constants';
import {AuthStackParamList} from '../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LayoutWidgets from './widgets/layout.widgets';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../business/store';
import {fetchfargotPassword} from '../../business/slices/fargot-password.slice';
type AuthProps = NativeStackScreenProps<AuthStackParamList, 'FargotPassword'>;

const FargotPasswordScreen: React.FC<AuthProps> = ({navigation}) => {
  const [email, setEmail] = React.useState(
    __DEV__ ? 'frkalbayrak101@gmail.com' : '',
  );
  const dispatch: AppDispatch = useDispatch();

  const {fargotPasswordLoading} = useSelector(
    (state: RootState) => state.fargotPassword,
  );

  const handleFargotPassword = async () => {
    dispatch(fetchfargotPassword({email}));
  };
  return (
    <LayoutWidgets>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.iconWrapper}>
            <Image source={Images.USER} style={styles.icon} />
          </View>
          <TextInput
            placeholder="Kullanıcı Adı veya Mail "
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={'#7F7F7F'}
            keyboardType="email-address"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleFargotPassword}>
          {fargotPasswordLoading ? (
            <ActivityIndicator size="small" color={Colors.WHITE} />
          ) : (
            <Text style={styles.buttonText}>Kod Gönder</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.forgotPasswordText}>Giriş sayfasına dön!</Text>
      </TouchableOpacity>
    </LayoutWidgets>
  );
};

export default FargotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    // justifyContent:'center',
    resizeMode: 'cover',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '30%',
    marginBottom: 60,
  },
  inputContainer: {
    width: '90%',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    marginBottom: 20,
    // paddingHorizontal: 15,
    height: 50,
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
