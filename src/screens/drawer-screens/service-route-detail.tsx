import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';
const ServiceRouteDetail = ({route}) => {
  const {title, description} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          marginHorizontal: 20,
          borderRadius: 10,
          shadowColor: '#000',
          backgroundColor: 'white',
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
        <Text style={[styles.title]}>{title}</Text>
        <Text style={[styles.title]}>{description}</Text>
      </View>
    </View>
  );
};

export default ServiceRouteDetail;

const styles = StyleSheet.create({
  title: {
    color: Colors.BLACK,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
