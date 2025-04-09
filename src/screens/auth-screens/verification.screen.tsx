import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Images, Colors} from '../../constants';
import {AuthStackParamList} from '../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LayoutWidgets from './widgets/layout.widgets';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSignInCode} from '../../business/slices/signIn.slice';
import DeviceInfo from 'react-native-device-info';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const VerificationScreen: React.FC<AuthProps> = ({navigation, route}) => {
  const {email, password} = route.params || {};
  const [code, setCode] = React.useState('');
  const dispatch: AppDispatch = useDispatch();
  const [deviceId, setDeviceId] = useState('');
  const {memberLoading} = useSelector((state: RootState) => state.memberSlice);
  const {deviceSaveLoading} = useSelector(
    (state: RootState) => state.deviceSlice,
  );

  const getDeviceId = async () => {
    try {
      const deviceIds = await DeviceInfo.getUniqueId(); // await ile Promise çözülür
      return deviceIds;
    } catch (error) {
      console.error('Cihaz kimliği alınırken hata oluştu:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await getDeviceId();
      if (id) {
        setDeviceId(id);
      } // getDeviceId fonksiyonunu çağırıyoruz
      // ID'yi state'e kaydediyoruz
    };

    fetchDeviceId(); // Fonksiyonu çağırıyoruz
  }, []);
  const confirmCode = () => {
    dispatch(
      fetchSignInCode({
        email: email,
        password: password,
        code: code,
        deviceId: deviceId,
        deviceType: Platform.OS,
      }),
    );
  };
  console.log('deviceSaveLoaing', memberLoading);
  return (
    <LayoutWidgets>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.iconWrapper}>
            <Image source={Images.USER} style={styles.icon} />
          </View>
          <TextInput
            placeholder="Kod"
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholderTextColor={'#7F7F7F'}
            keyboardType="number-pad"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={confirmCode}>
          {memberLoading || deviceSaveLoading ? (
            <ActivityIndicator color={Colors.WHITE} size="large" />
          ) : (
            <Text style={styles.buttonText}>Onayla</Text>
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

export default VerificationScreen;

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
