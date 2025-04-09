import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Enums, Images } from '../constants';
import { RootState } from '../business/store';
import { useSelector } from 'react-redux';
import navigationUtil from '../utils/navigation.util';

const HeaderUserComponent = () => {
  const {member} = useSelector((state: RootState) => state.memberSlice);
  return (
    <TouchableOpacity style={styles.container} onPress={() => {
      navigationUtil.navigate('DrawerStack', {screen: 'Profile'});
    }}>
    <Image source={{
      uri: Enums.BASE_URL + member?.avatar,
    }} style={styles.userIcon}/>
    <View style={styles.text}>
      <Text style={styles.welcome}>Hoş Geldin :</Text>
      <Text  style={styles.name}>{member?.nameSurname}</Text>
    </View>
          </TouchableOpacity>
  );
};

export default HeaderUserComponent;

const styles = StyleSheet.create({
    container:{flexDirection:'row',alignItems:'center',paddingLeft:20,marginTop:10,paddingBottom:10},
    userIcon:{
        width:35,
        height:35,
      },
      text:{justifyContent:'center',marginLeft:10},
      welcome:{fontWeight:'400',fontSize:12,color:'gray'},
      name:{
        fontWeight:'bold',
        fontSize:14,
        color:'black',

      },
});
