import {createNavigationContainerRef} from '@react-navigation/native';

import {RootStackParamList} from '../navigation/types';

// Sayfaya yönlendiren fonksiyon
export const navigate = (name: keyof RootStackParamList, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

// Navigation referansını oluştur
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Sayfa sıfırlama fonksiyonu
export const reset = (state: any) => {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
};

export default {
  navigate,
  reset,
};
