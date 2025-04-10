import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import {Colors, Images} from '../constants';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../business/store';
import {fetchToken} from '../business/slices/token.slice';

const LoadingScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    handleToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToken = async () => {
    dispatch(fetchToken());
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.AUTH_BACKGROUND} style={styles.image}>
        <Image source={Images.LOGIN_LOGO} style={styles.logo} />
        <ActivityIndicator
          color={Colors.WHITE}
          size="large"
          style={styles.indicator}
        />
      </ImageBackground>
    </View>
  );
};
export default LoadingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  indicator: {
    position: 'absolute',
    bottom: 30,
  },
});
