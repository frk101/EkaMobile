import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Screens from '../screens';
import {AuthStackParamList} from './types';
import {Colors} from '../constants';
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={'Login'}
        component={Screens.AuthScreens.LoginScreen}
      />
      <Stack.Screen
        name={'Verification'}
        component={Screens.AuthScreens.VerificationScreen}
      />
      <Stack.Screen
        name={'FargotPassword'}
        component={Screens.AuthScreens.FargotPasswprdScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerTintColor: Colors.WHITE,
          headerStyle: {
            backgroundColor: Colors.blueColor4,
          },
        }}
        name={'Welcome'}
        component={Screens.AuthScreens.WelcomeScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
