/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomStackParamList} from './types';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Enums, Images} from '../constants';
import Screens from '../screens';
import {DrawerToggleButton} from '@react-navigation/drawer';
import {useState} from 'react';
import navigationUtil from '../utils/navigation.util';
import LocationChecker from '../modals/location-check.modal';
import {RootState} from '../business/store';
import {useSelector} from 'react-redux';
type TabIconProps = {
  focused?: boolean;
  image: any;
  tintColor?: string;
};
type TabTextProps = {
  label: string;
  focused: boolean;
};
const Tab = createBottomTabNavigator<BottomStackParamList>();
const TabText: React.FC<TabTextProps> = ({label, focused}) => {
  return (
    <Text
      style={{
        color: focused ? Colors.blueColor : Colors.BLACK,
        fontSize: 12,
        fontWeight: 'bold',
      }}>
      {label}
    </Text>
  );
};

const TabIcon: React.FC<TabIconProps> = ({focused, image, tintColor}) => {
  return (
    <Image
      source={image}
      style={styles.icon}
      tintColor={
        tintColor ? tintColor : focused ? Colors.blueColor : Colors.BLACK
      }
    />
  );
};
const HeaderLeft = () => {
  return (
    <View style={styles.headerLeftView}>
      <Image source={Images.MAIN_LOGO} style={styles.logoIcon} />
    </View>
  );
};
const BottomTabNavigator: React.FC = () => {
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const {LogActivity} = useSelector((state: RootState) => state.locationSlice);
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={() => ({
          tabBarHideOnKeyboard: true,
          headerShadowVisible: false,
          tabBarStyle: styles.tabBar,
          headerStyle: {backgroundColor: Colors.WHITE, height: 120},
          headerTitle: () => null,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
        })}>
        <Tab.Screen
          name="Intranet"
          component={Screens.BottomScreens.IntranetScreen}
          options={{
            tabBarLabel: ({focused}) => (
              <TabText label="INTRANET" focused={focused} />
            ),
            tabBarIcon: ({focused}) => (
              <TabIcon focused={focused} image={Images.USER} />
            ),
          }}
        />
        <Tab.Screen
          name="PhoneDirectory"
          component={Screens.BottomScreens.PhoneDirectoryScreen}
          options={{
            tabBarLabel: ({focused}) => (
              <TabText label="REHBER" focused={focused} />
            ),
            tabBarIcon: ({focused}) => (
              <TabIcon focused={focused} image={Images.GROUP} />
            ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={Screens.BottomScreens.HomeScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({focused}) => (
              <TabIcon
                focused={focused}
                image={Images.HOME}
                tintColor={Colors.WHITE}
              />
            ),
            tabBarButton: props => <CustomTabBarButton {...props} />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={Screens.BottomScreens.ChatScreen}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();
              // setStatusModal(true);
              navigationUtil.navigate('DrawerStack', {
                screen: 'ChatMessage',
              });
              // dispatch(ModalActions.showValeActions());
            },
          }}
          options={{
            tabBarLabel: ({focused}) => (
              <TabText label="Bizz Asistan" focused={focused} />
            ),
            tabBarIcon: ({focused}) => (
              <TabIcon focused={focused} image={Images.CHAT} />
            ),
          }}
        />
        <Tab.Screen
          name="Power"
          component={Screens.BottomScreens.PowerScreen}
          listeners={{
            tabPress: e => {
              // Prevent default action
              e.preventDefault();
              setStatusModal(true);
              // dispatch(ModalActions.showValeActions());
            },
          }}
          options={{
            tabBarLabel: () => (
              <Text
                style={{
                  color: LogActivity?.isLogin ? 'red' : Colors.greenColor,
                  fontWeight: 'bold',
                }}>
                {LogActivity?.isLogin ? 'Çıkış' : 'Giriş'}
              </Text>
            ),
            tabBarIcon: () => (
              <Image
                source={Images.POWER}
                style={styles.powericon}
                tintColor={LogActivity?.isLogin ? 'red' : Colors.greenColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <LocationChecker setVisible={setStatusModal} visible={statusModal} />
    </View>
  );
};
const CustomTabBarButton: React.FC<any> = ({children, onPress}) => (
  <View style={styles.shadowContainer}>
    <TouchableOpacity style={styles.customButtonContainer} onPress={onPress}>
      {children}
    </TouchableOpacity>
  </View>
);

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.WHITE,
    position: 'absolute',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 100 : 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  customButtonContainer: {
    top: -20, // İkonu aşağıya kaydır
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35, // Yarım daire efekti
    backgroundColor: Colors.blueColor,
  },
  shadowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  powericon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  headerLeftView: {flexDirection: 'row', alignItems: 'center', paddingLeft: 20},
  logoIcon: {width: 100, height: 100, resizeMode: 'contain'},
});
