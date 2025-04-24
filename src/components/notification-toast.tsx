import React from 'react';
import {Image, StyleSheet, Text, View, ImageSourcePropType} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {Colors} from '../constants';

interface NotificationToastProps {
  title: string;
  body: string;
  icon?: ImageSourcePropType;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  body,
  icon = require('../../assets/icons/duyurular.png'),
}) => {
  return (
    <Animated.View entering={FadeInUp.duration(1000)} style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title || 'Bildirim'}</Text>
        <Text style={styles.body}>{body || 'Mesaj içeriği'}</Text>
      </View>
    </Animated.View>
  );
};

export default NotificationToast;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    borderWidth: 2,
    borderColor: Colors.blueColor,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: Colors.blueColor,
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.blueColor,
    fontSize: 16,
  },
  body: {
    color: Colors.blueColor,
  },
});
