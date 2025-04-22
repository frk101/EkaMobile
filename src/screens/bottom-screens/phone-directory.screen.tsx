import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchMembers,
  fetchMembersEmlk,
} from '../../business/slices/members.slice';
import {AppDispatch, RootState} from '../../business/store';
import {Colors} from '../../constants';

const PhoneDirectoryScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const {members, membersLoading} = useSelector(
    (state: RootState) => state.membersSlice,
  );

  useEffect(() => {
    if (searchIndex === 0) {
      dispatch(fetchMembers());
    } else {
      dispatch(fetchMembersEmlk());
    }
  }, [dispatch, searchIndex]);

  const filteredMembers = members?.filter(member =>
    member.nameSurname.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.row}>
      <Text style={styles.cellSmall}>{item.registrationNumber}</Text>
      <Text style={styles.cellLarge}>{item.nameSurname}</Text>
      <Text style={styles.cellLarge}>{item.mobilePhone}</Text>
      <Text style={styles.cellxLarge}>{item.email}</Text>
      <Text style={styles.cellLarge}>{item.job}</Text>
      <Text style={styles.cellSmall}>{item.internalNumber}</Text>
    </View>
  );

  if (membersLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.blueColor}
          style={{marginBottom: 20}}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Telefon Rehberi Sistemi</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            searchIndex === 0 && styles.tabButtonActive,
          ]}
          onPress={() => setSearchIndex(0)}>
          <Text style={styles.tabButtonText}>Emlakkonut Asansör Rehber</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            searchIndex === 1 && styles.tabButtonActive,
          ]}
          onPress={() => setSearchIndex(1)}>
          <Text style={styles.tabButtonText}>Emlakkonut Rehber</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Ara"
        placeholderTextColor="#7F7F7F"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={{minWidth: 960}}>
          <View style={styles.headerRow}>
            <Text style={styles.cellSmallHeader}>Sicil</Text>
            <Text style={styles.cellLargeHeader}>Ad Soyad</Text>
            <Text style={styles.cellLargeHeader}>Telefon</Text>
            <Text style={styles.cellxLargeHeader}>E-Posta</Text>
            <Text style={styles.cellLargeHeader}>Meslek</Text>
            <Text style={styles.cellSmallHeader}>Dahili</Text>
          </View>

          <FlatList
            data={filteredMembers}
            renderItem={renderItem}
            keyExtractor={(item, index) => `member-${index}`}
            contentContainerStyle={{paddingBottom: 120}}
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
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#1E3A8A',
  },
  tabButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
  },
  cellSmallHeader: {
    width: 90,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: '#374151',
  },
  cellLargeHeader: {
    minWidth: 200,
    flex: 1,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: '#374151',
  },
  cellxLargeHeader: {
    minWidth: 300,
    flex: 1,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: '#374151',
  },
  cellSmall: {
    width: 90,
    paddingHorizontal: 8,
    color: '#111827',
    fontSize: 14,
  },
  cellLarge: {
    flex: 1,
    minWidth: 200,
    paddingHorizontal: 8,
    color: '#111827',
    fontSize: 14,
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  cellxLarge: {
    flex: 1,
    minWidth: 300,
    paddingHorizontal: 8,
    color: '#111827',
    fontSize: 14,
    flexWrap: 'wrap',
  },
});
