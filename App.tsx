/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Navigator from './src/navigation';
import {NavigationContainer} from '@react-navigation/native';
import {store, persistor} from './src/business/store';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Toaster} from 'sonner-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {navigationRef} from './src/utils/navigation.util';

const App: React.FC = () => {
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
