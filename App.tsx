/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import Navigator from './src/navigation';
import {NavigationContainer} from '@react-navigation/native';
import {store, persistor} from './src/business/store';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {toast, Toaster} from 'sonner-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {navigationRef} from './src/utils/navigation.util';
import messaging from '@react-native-firebase/messaging';
import NotificationToast from './src/components/notification-toast';

const App: React.FC = () => {
  useEffect(() => {
    // Bildirim izni isteme
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM token:', token);
        console.log('Bildirim izni verildi!');
      } else {
      }
    };

    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Ön planda bildirim alındı:', remoteMessage);
      toast.custom(
        <NotificationToast
          title={remoteMessage.notification?.title || ''}
          body={remoteMessage.notification?.body || ''}
        />,
      );
    });

    return unsubscribe;
  }, []);
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer ref={navigationRef}>
              <Navigator />
            </NavigationContainer>
            <Toaster />
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
