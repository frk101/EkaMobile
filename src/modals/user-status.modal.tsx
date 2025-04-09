
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants';

// Props için TypeScript tipi tanımlanması
interface UserStatusModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setStatus: (status: boolean) => void;
  status: boolean;
}

const UserStatusModal: React.FC<UserStatusModalProps> = ({ visible, setVisible, setStatus, status }) => {
  useEffect(() => {
    if (visible) {
      // Modal açıldıktan sonra 1 saniye bekleyip kapatma işlemi
      const timer = setTimeout(() => {
        setVisible(false); // Modalı kapat
        setStatus(!status); // Durumu güncellemek için
      }, 1000); // 1 saniye (1000 ms)

      // Cleanup fonksiyonu: Modal kapatıldığında timer'ı temizle
      return () => clearTimeout(timer);
    }
  }, [setStatus, setVisible, status, visible]);

  return (
    <Modal transparent visible={visible}>
      <View style={styles.rootContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator color={Colors.blueColor} size="large" />
          <Text style={styles.modalText}>
            {status ? 'Çıkış bilgileriniz kontrol ediliyor...' : 'Giriş bilgileriniz kontrol ediliyor...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default UserStatusModal;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: Colors.WHITE,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: Colors.blueColor,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});
