/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import BottomTabNavigator from './bottom-stack.navigation';
import {Colors, Images} from '../constants';
import CustomDrawerContent from '../components/custom-drawer-content';
import screens from '../screens';
import {Image, TouchableOpacity} from 'react-native';
import AnnouncementsDetailScreen from '../screens/drawer-screens/announcements-detail.screen';
import HelpDeskSistemi from '../screens/drawer-screens/help-desk-sistemi';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = ({navigation}: any) => {
  const HeaderLeft = ({onPress}: any) => {
    return (
      <TouchableOpacity onPress={onPress} style={{marginLeft: 10}}>
        <Image
          source={Images.BACK}
          style={{width: 25, height: 25, resizeMode: 'contain'}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} h />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: Colors.WHITE,
        },
        headerShown: false,
        drawerPosition: 'right',
        drawerType: 'front',
      }}>
      <Drawer.Screen name="BottomStack" component={BottomTabNavigator} />
      <Drawer.Screen
        name="Menu"
        component={screens.DrawerScreens.MenuScreen}
        options={{
          headerShown: true,
          headerTitle: 'Yemek Listesi',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={screens.DrawerScreens.ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: 'Profil',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="Help"
        component={screens.DrawerScreens.HelpScreen}
        options={{
          headerShown: true,
          headerTitle: 'Yardım',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="Qustions"
        component={screens.DrawerScreens.QuestionsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Sıkça Sorulan Sorular',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="Feedback"
        component={screens.DrawerScreens.OpinionsAndSuggestionsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Görüş ve Öneriler',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="ServiceRoute"
        component={screens.DrawerScreens.ServiceRoute}
        options={{
          headerShown: true,
          headerTitle: 'Servis Güzargahı',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="DigitalCard"
        component={screens.DrawerScreens.DigitalBusinessCard}
        options={{
          headerShown: true,
          headerTitle: 'Dijital Kartvizit',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          // headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="ServiceRouteDetail"
        component={screens.DrawerScreens.ServiceRouteDetail}
        options={{
          headerShown: true,
          headerTitle: 'Güzargah Detayı',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('ServiceRoute')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        }}
      />
      <Drawer.Screen
        name="FavoriteApp"
        component={screens.DrawerScreens.FavoriteAppScren}
        options={({route: {params}}) => ({
          headerShown: true,
          headerTitle: params?.title,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => <DrawerToggleButton tintColor={Colors.BLACK} />,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="AnnouncementsScreen"
        component={screens.DrawerScreens.AnnouncementsScreen}
        options={() => ({
          headerShown: true,
          headerTitle: 'Duyurular',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="AnnouncementsDetailScreen"
        component={AnnouncementsDetailScreen}
        options={({route: {params}}) => ({
          headerShown: true,
          headerTitle: params?.announcement.title,
          headerTitleAlign: 'center',

          headerLeft: () =>
            params?.type == 'detail' ? (
              <HeaderLeft
                onPress={() => navigation.navigate('AnnouncementsScreen')}
              />
            ) : (
              <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
            ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={screens.DrawerScreens.ChangePasswordScreen}
        options={() => ({
          headerShown: true,
          headerTitle: 'Şifre Değiştirme',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('Profile')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="Advertisements"
        component={screens.DrawerScreens.Advertisements}
        options={() => ({
          headerShown: true,
          headerTitle: 'İlanlar',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="AdvertisementsDetails"
        component={screens.DrawerScreens.AdvertisementsDetail}
        options={() => ({
          headerShown: true,
          headerTitle: 'İlanlar',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('Advertisements')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="ChatMessage"
        component={screens.DrawerScreens.ChatScreen}
        options={() => ({
          headerShown: true,
          headerTitle: () => (
            <Image
              source={require('../../assets/images/footer-logo.png')}
              style={{width: 70, height: 50, resizeMode: 'contain'}}
            />
          ),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="ChatList"
        component={screens.DrawerScreens.ChatList}
        options={() => ({
          headerShown: true,
          headerTitle: () => (
            <Image
              source={require('../../assets/images/footer-logo.png')}
              style={{width: 70, height: 50, resizeMode: 'contain'}}
            />
          ),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="SliderDetail"
        component={screens.BottomScreens.SliderDetail}
        options={({route}) => ({
          //route?.params?.new?.title
          headerShown: true,
          headerTitle: () => null,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
      <Drawer.Screen
        name="HelpDeskSistemi"
        component={HelpDeskSistemi}
        options={({route}) => ({
          //route?.params?.new?.title
          headerShown: true,
          headerTitle: () => null,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HeaderLeft onPress={() => navigation.navigate('BottomStack')} />
          ),
          headerRight: () => null,
          headerTintColor: Colors.BLACK,
        })}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
