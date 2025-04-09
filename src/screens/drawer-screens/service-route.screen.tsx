import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../business/store';
import {fetchserviceRoutes} from '../../business/slices/serives-route.slice';
import {Colors, Images} from '../../constants';

const ServiceRoute = ({navigation}) => {
  const dispatch: AppDispatch = useDispatch();
  const {serviceRoutes, serviceRoutesLoading} = useSelector(
    (state: RootState) => state.serviceRouteSlice,
  );
  useEffect(() => {
    dispatch(fetchserviceRoutes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (serviceRoutesLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.blueColor3} />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={serviceRoutes}
        renderItem={({item, index}) => (
          <View
            style={{
              backgroundColor: 'white',
              marginHorizontal: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              marginVertical: 10,
              padding: 20,
            }}>
            <Image source={Images.BUS} resizeMode="contain" />
            <Text style={[styles.title, {marginTop: 20}]}>{item.title}</Text>
            <Text style={styles.title}>Sürücü : {item.driverName}</Text>
            <Text style={styles.title}>Sürücü : {item.driverPhone}</Text>
            <Text style={styles.title}>Sürücü : {item.description}</Text>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
                backgroundColor: Colors.blueColor3,
                padding: 10,
              }}
              onPress={() => {
                navigation.navigate('ServiceRouteDetail', {
                  title: (index + 1).toString() + ' - ' + item.title,
                  description: item.description,
                }); // ServiceRouteDetail
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                GÜZERGAH DETAYI
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => `serviceRoute-${index}`}
      />
    </View>
  );
};

export default ServiceRoute;

const styles = StyleSheet.create({
  title: {
    color: Colors.BLACK,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
