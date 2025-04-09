import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Images } from '../../constants';

const PowerScreen = () => {
  return (
    <View style={styles.container}>
     <Image source={Images.MAIN_LOGO} style={styles.logo}/>
    </View>
  );
};

export default PowerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        width:Dimensions.get('window').width / 2,
        height:Dimensions.get('window').height,
        resizeMode:'contain',
        marginBottom:100,
    },
});
