/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';
import {AppDispatch, RootState} from '../business/store';
import {Animations, Colors, Enums} from '../constants';
import {fetchLogActivity} from '../business/slices/location.slice';
import {toast} from 'sonner-native';

// Location tipini burada tanımlıyoruz
interface Location {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface ModalProps {
  visible: boolean;
  setVisible?: (visible: boolean) => void;
}

const LocationChecker: React.FC<ModalProps> = ({visible, setVisible}) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState<string>('Lokasyonunuz alınıyor...');
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {unitLocationList} = useSelector(
    (state: RootState) => state.locationSlice,
  );
  const {LogActivity, logActivityLoading} = useSelector(
    (state: RootState) => state.locationSlice,
  );

  const locationRadius = 1000;

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  useEffect(() => {
    if (visible) {
      setLoading(true);
      Geolocation.getCurrentPosition(
        position => {
          console.log('11', position);
          const {latitude, longitude} = position.coords;
          setUserLocation({latitude, longitude});
          setStatus('Lokasyonunuz kontrol ediliyor...');

          const foundLocation = unitLocationList.find(location => {
            const distance = calculateDistance(
              latitude,
              longitude,
              location.latitude,
              location.longitude,
            );
            return distance <= locationRadius;
          });
          if (foundLocation) {
            setNearestLocation(foundLocation);
            setStatus('Kullanıcı belirlenen lokasyonun içinde.');
          } else {
            setStatus('Kullanıcı belirlenen lokasyonların içinde değil.');
          }
          setLoading(false);
        },
        error => {
          console.log('11', error.message);
          setStatus('Lokasyon alınırken hata oluştu.');
          setLoading(false);
          setVisible && setVisible(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const handlePress = async () => {
    const type = LogActivity?.isLogin
      ? Enums.LOCATION_TYPE.LOGOUT
      : Enums.LOCATION_TYPE.LOGIN;
    try {
      const result = await dispatch(
        fetchLogActivity({
          memberId: member?.id,
          id: nearestLocation ? nearestLocation.id : '',
          lat: userLocation?.latitude,
          lng: userLocation?.longitude,
          type: type,
        }),
      );

      // Eğer istek başarılı ise ve modal kapatma fonksiyonu varsa, modalı kapatın.
      if (result && !logActivityLoading) {
        setVisible && setVisible(false);
        toast.success(
          type === Enums.LOCATION_TYPE.LOGIN
            ? 'Giriş yapıldı'
            : 'Cıkış yapıldı',
        );
      } else {
        toast.error('İşlem sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Error while logging activity:', error);
    }
  };
  const openSettings = () => {
    setVisible && setVisible(false);
    Linking.openSettings().catch(() => {
      toast.error('Ayarlar açılamadı.');
    });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {loading ? (
            <View>
              <LottieView
                source={Animations.LOCATION}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: Colors.blueColor,
                }}>
                Lokaston Bilgileriniz kontrol ediliyor...
              </Text>
            </View>
          ) : (
            <>
              {nearestLocation ? (
                <View>
                  <LottieView
                    source={require('../../assets/animations/done.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Colors.blueColor,
                    }}>
                    "{nearestLocation.locationName}" konumundasınız.
                  </Text>
                  <TouchableOpacity
                    onPress={handlePress}
                    style={{
                      backgroundColor: Colors.greenColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 15,
                      marginHorizontal: 20,
                      marginTop: 20,
                      borderRadius: 5,
                    }}>
                    {logActivityLoading ? (
                      <ActivityIndicator color={'white'} size={'small'} />
                    ) : (
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {LogActivity?.isLogin ? 'Çıkış Yap' : 'Giriş Yap'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setVisible && setVisible(false)}
                    style={{
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 15,
                      marginHorizontal: 20,
                      marginTop: 20,
                      borderRadius: 5,
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Vazgeç
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : userLocation &&
                status ===
                  'Kullanıcı belirlenen lokasyonların içinde değil.' ? (
                <View>
                  <LottieView
                    source={require('../../assets/animations/not.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Colors.blueColor,
                    }}>
                    "Konum Dışındasınız" {'\n'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      // textAlign: 'center',
                      color: Colors.blueColor,
                      marginHorizontal: 20,
                    }}>
                    Sayın {member.nameSurname}, {'\n'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      // textAlign: 'center',
                      color: Colors.blueColor,
                      marginHorizontal: 20,
                    }}>
                    Yaptığınız giriş denemesi, belirlenen şirket lokasyonlarımız
                    dışında bir konumdan gerçekleştirilmiştir. {'\n'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      // textAlign: 'center',
                      color: Colors.blueColor,
                      marginHorizontal: 20,
                    }}>
                    Sistemimize giriş yapabilmeniz için merkez binamız, satış
                    ofislerimiz veya şantiyelerimizden birinde olmanız
                    gerekmektedir.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setVisible && setVisible(false)}
                    style={{
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 15,
                      marginHorizontal: 20,
                      marginTop: 20,
                      borderRadius: 5,
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Tamam
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : status === 'Lokasyon alınırken hata oluştu.' ? (
                <View>
                  <LottieView
                    source={require('../../assets/animations/notlocation.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Colors.blueColor,
                    }}>
                    {status}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: Colors.blueColor,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}>
                    Lütfen izinlerinizi kontrol edip tekrar deneyin.
                  </Text>
                  <TouchableOpacity
                    onPress={openSettings}
                    style={{
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 15,
                      marginHorizontal: 20,
                      marginTop: 20,
                      borderRadius: 5,
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Tamam
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  activityIndicatorWrapper: {
    alignItems: 'center',
  },
  lottie: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').width / 2,
    resizeMode: 'contain',
  },
});

export default LocationChecker;
