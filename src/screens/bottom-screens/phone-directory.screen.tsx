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
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMembers} from '../../business/slices/members.slice';

const CELL_WIDTH = 160;

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.blueColor} size="large" />
      </View>
    );
  }

  const filteredMembers = members?.filter(item =>
    item.nameSurname.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <View
      style={[
        styles.row,
        {
          backgroundColor: index % 2 === 0 ? Colors.greyColor3 : Colors.WHITE,
        },
      ]}>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
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
      <View style={styles.searchBox}>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#7F7F7F"
          />
          <TouchableOpacity style={styles.iconContainer}>
            <Image source={Images.SEACRH} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal>
        <View>
          <View style={styles.headerRow}>
            {['Sicil', 'Ad Soyad', 'Telefon', 'Dahili', 'Ünvan', 'E-mail'].map(
              (header, i) => (
                <Text key={i} style={styles.headerText}>
                  {header}
                </Text>
              ),
            )}
          </View>
          <FlatList
            data={filteredMembers}
            renderItem={renderItem}
            keyExtractor={(item, index) => `member-${index}`}
            showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  searchBox: {
    padding: 10,
    backgroundColor: Colors.greyColor5,
    marginHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
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
    backgroundColor: Colors.greyColor4,
  },
  headerText: {
    width: CELL_WIDTH,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: Colors.greyColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  cell: {
    width: CELL_WIDTH,
    paddingHorizontal: 10,
    color: '#000',
  },
});
