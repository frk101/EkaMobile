import * as React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from './types';
import AuthStack from './auth-stack.navigation';
import DrawerNavigator from './drawer-stack.navigation';
import Screens from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Loading" component={Screens.LoadingScreen} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="DrawerStack" component={DrawerNavigator} />

    </Stack.Navigator>
  );
};
export default Navigator;
