/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderUserComponent} from '../../components';
import {Colors, Images} from '../../constants';
import {memberList} from '../../../fakeData';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMembers} from '../../business/slices/members.slice';

const PhoneDirectoryScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const {members, membersLoading} = useSelector(
    (state: RootState) => state.membersSlice,
  );
  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  if (membersLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 100,
        }}>
        <ActivityIndicator color={Colors.blueColor} size={'large'} />
      </View>
    );
  }

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <View
      style={[
        styles.row,
        {backgroundColor: index % 2 === 0 ? Colors.greyColor3 : Colors.WHITE},
      ]}>
      <Text
        style={[styles.cell, {minWidth: 100}]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {item.registrationNumber}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.nameSurname}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.mobilePhone}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.internalNumber}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.job}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.email}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <HeaderUserComponent />
      <View
        style={{
          padding: 10,
          backgroundColor: Colors.greyColor5,
          marginHorizontal: 20,
          borderRadius: 5,
        }}>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
            placeholderTextColor={'#7F7F7F'}
          />

          <TouchableOpacity style={styles.iconContainer}>
            <Image source={Images.SEACRH} style={styles.icon} />
            {/* <Icon name="search" size={20} color="#000" /> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          {/* Tablo başlıkları */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, {color: Colors.greyColor}]}>
              Sicil
            </Text>
            <Text
              style={[
                styles.headerText,
                {color: Colors.greyColor, minWidth: 150},
              ]}>
              Ad Soyad
            </Text>
            <Text
              style={[
                styles.headerText,
                {color: Colors.greyColor, minWidth: 150},
              ]}>
              Telefon
            </Text>
            <Text
              style={[
                styles.headerText,
                {color: Colors.greyColor, minWidth: 150},
              ]}>
              Dahili
            </Text>
            <Text
              style={[
                styles.headerText,
                {color: Colors.greyColor, minWidth: 150},
              ]}>
              Ünvan
            </Text>
            <Text
              style={[
                styles.headerText,
                {color: Colors.greyColor, minWidth: 150},
              ]}>
              E-mail
            </Text>
          </View>

          {/* Dinamik tablo verileri */}
          <FlatList
            data={members?.filter(item =>
              item.nameSurname.toLowerCase().includes(searchText.toLowerCase()),
            )}
            renderItem={renderItem}
            keyExtractor={(item, index) => `memberlist-${index}`}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PhoneDirectoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    // margin: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  cell: {
    minWidth: 150,
    maxWidth: 200, // Hücre genişliğini kontrol etmek için
    paddingHorizontal: 10,
    overflow: 'hidden',
    color: Colors.greyColor,
  },
  headerText: {
    minWidth: 100,
    maxWidth: 150,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: Colors.greyColor,
  },
  tableContainer: {
    marginLeft: 20,
    marginTop: 20,
  },
});
