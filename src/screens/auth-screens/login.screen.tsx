import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Images, Colors} from '../../constants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LayoutWidgets from './widgets/layout.widgets';
import {AuthStackParamList} from '../../navigation/types';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../business/store';
import {fetchSignIn} from '../../business/slices/signIn.slice';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<AuthProps> = ({navigation}) => {
  const [email, setEmail] = React.useState(
    __DEV__ ? 'frkalbayrak101@gmail.com' : '',
  );
  const [password, setPassword] = React.useState(__DEV__ ? 'Emlak123456' : '');
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await dispatch(fetchSignIn({email, password})); // unwrap() ile hata fırlatma kontrolü yapabilirsiniz
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWidgets>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.iconWrapper}>
            <Image source={Images.USER} style={styles.icon} />
          </View>
          <TextInput
            placeholder="Kullanıcı Adı"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={'#7F7F7F'}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.iconWrapper}>
            <Image
              source={Images.KEY}
              style={[styles.icon, {transform: [{rotate: '280deg'}]}]}
            />
          </View>

          <TextInput
            placeholder="Şifre"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={'#7F7F7F'}
            keyboardType="default"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={!email || !password}>
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={styles.buttonText}>Giriş Yapın</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {marginTop: 20, backgroundColor: Colors.orangeColor},
          ]}
          onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.buttonText}>Müşterimiz Olun</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          width: '85%',
        }}>
        {/* <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate('FargotPassword')}>
          <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.goBack()}>
          <Text style={styles.forgotPasswordText}>
            Başlangıç Sayfasına Geri Dön
          </Text>
        </TouchableOpacity> */}
      </View>
    </LayoutWidgets>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
    // marginRight: '10%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  back: {
    alignSelf: 'flex-start',
    // marginLeft: '10%',
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
