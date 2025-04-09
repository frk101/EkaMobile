/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Enums} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../business/store';
import {fetchDeviceLogOut} from '../../business/slices/device.slice';
import DeviceInfo from 'react-native-device-info';

const ProfileScreen = ({navigation}) => {
  const dispatch: AppDispatch = useDispatch();
  const [deviceId, setDeviceId] = useState('');
  const {member, memberLoading} = useSelector(
    (state: RootState) => state.memberSlice,
  );
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arasında olduğu için +1 ekliyoruz
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
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
      if (id !== null) {
        setDeviceId(id);
      }
    };

    fetchDeviceId(); // Fonksiyonu çağırıyoruz
  }, []);
  const logOut = () => {
    try {
      dispatch(fetchDeviceLogOut({memberId: member?.id, deviceId: deviceId}));
    } catch (error) {
    } finally {
    }
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{
          uri: Enums.BASE_URL + member?.avatar,
        }}
        style={styles.userIcon}
      />
      <View style={styles.contentInput}>
        <View style={styles.table}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>Ünvan</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.title}>:{member && member?.job}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>Çalıştığı Departman</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.title}>:{member?.memberHierarchy?.name}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>Sicil Numarası</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.title}>:{member?.registrationNumber}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>İşe Başlama Tarihi</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.title}>
              :
              {member?.startDayOfWork ? formatDate(member?.startDayOfWork) : ''}
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>Telefon / Dahili No</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.title}>:{member?.internalNumber}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>Doğum Tarihi</Text>
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.title}>
              :{member?.dayOfBirth ? formatDate(member?.dayOfBirth) : ''}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.changePassword, {backgroundColor: 'orange'}]}
        onPress={() => navigation.navigate('DigitalCard')}>
        <Text style={styles.btnTitle}>DİJİTAL KARTVİZİT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.changePassword}
        onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.btnTitle}>ŞİFRE DEĞİŞTİR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.changePassword, {backgroundColor: Colors.redColor}]}
        onPress={logOut}>
        {memberLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.btnTitle}>ÇIKIŞ YAP</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '30%',
    marginBottom: 60,
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.WHITE,
    marginTop: 20,
    alignSelf: 'center',
  },
  title: {
    color: Colors.blueColor3,
    fontSize: 14,
    fontWeight: '600',
  },
  table: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    borderBottomColor: Colors.greyColor3,
    borderBottomWidth: 1,
    paddingBottom: 3,
  },
  contentInput: {
    marginTop: 20,
  },
  changePassword: {
    backgroundColor: Colors.blueColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
  },
  btnTitle: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});
