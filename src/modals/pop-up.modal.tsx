/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {closePopup} from '../business/slices/popup.slice';
import {RootState} from '../business/store';
import {Colors, Enums, Images} from '../constants';

const PopupModal: React.FC = () => {
  const dispatch = useDispatch();
  const {popUpData, isPopupOpen} = useSelector(
    (state: RootState) => state.popUpSlice,
  );

  if (!popUpData) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isPopupOpen}
      animationType="slide"
      onRequestClose={() => dispatch(closePopup())}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            source={{uri: `${Enums.BASE_URL}${popUpData.popupContent}`}}
            style={{
              width: 300,
              height: 300,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => dispatch(closePopup())}
            style={styles.closeBtn}>
            <Image
              source={Images.CLOSE}
              style={styles.closeIcon}
              tintColor={Colors.greyColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
  },
  closeIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  closeBtn: {
    position: 'absolute',
    top: -20,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default PopupModal;
