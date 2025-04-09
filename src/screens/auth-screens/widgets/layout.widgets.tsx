import { Animated, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { Images } from '../../../constants';
import { useKeyboardAnimation } from '../../../hooks';

interface Layout {
    children: React.ReactNode
}
const LayoutWidgets: React.FC<Layout> = ({children}) => {
    const imageSize = useKeyboardAnimation(125, 50);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}  >
    <ImageBackground source={Images.AUTH_BACKGROUND} style={styles.imageContainer} >
    <Animated.Image
        source={Images.LOGIN_LOGO}
        style={[styles.image, {width: imageSize, height: imageSize}]}
      />
      {children}
    </ImageBackground>
    </ScrollView>
  );
};

export default LayoutWidgets;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      imageContainer: {
        width: '100%',
        height: '100%',
        alignItems:'center',
        // justifyContent:'center',
        resizeMode: 'cover',
      },
      content:{
      flexGrow: 1,alignItems:'center',justifyContent:'center',
      },
      image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: '30%',
        marginBottom:60,
      },
});
