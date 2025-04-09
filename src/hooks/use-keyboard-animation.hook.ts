import {useRef, useEffect} from 'react';
import {Keyboard, Animated} from 'react-native';
const useKeyboardAnimation = (
  initialSize: number,
  finalSize: number,
  duration = 300,
) => {
  const imageSize = useRef(new Animated.Value(initialSize)).current;

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    const keyboardHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyboardDidShow = () => {
    Animated.timing(imageSize, {
      toValue: finalSize, // Küçültülecek boyut
      duration: duration, // Animasyon süresi
      useNativeDriver: false,
    }).start();
  };

  const keyboardDidHide = () => {
    Animated.timing(imageSize, {
      toValue: initialSize, // Büyütülecek boyut
      duration: duration, // Animasyon süresi
      useNativeDriver: false,
    }).start();
  };

  return imageSize;
};

export default useKeyboardAnimation;
