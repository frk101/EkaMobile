export type RootStackParamList = {
  AuthStack: undefined;
  BottomStack: undefined;
  Loading: undefined;
  OnBoarding: undefined;
  DrawerStack: undefined;
};
export type AuthStackParamList = {
  Login: undefined;
  Welcome: undefined;
  Verification: {
    email: string;
    password: string;
  };
  FargotPassword: undefined;
  BottomStack: undefined;
};

export type BottomStackParamList = {
  Home: undefined;
  Intranet: undefined;
  PhoneDirectory: undefined;
  Chat: undefined;
  Power: undefined;
};
