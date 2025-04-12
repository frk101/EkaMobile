import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../business/store';
import {Enums, Images} from '../../constants';
import {formatDateThread} from '../../utils/format.date.util';

interface Thread {
  chatId: string;
  createdDate: string;
}

const ChatList = ({navigation}) => {
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {token} = useSelector((state: RootState) => state.getTokenSlice);

  const [threadList, setThreadList] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getThreadList = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const response = await fetch(
        `${Enums.BASE_URL}api/AssistantChatApi/GetThreadList`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
          body: JSON.stringify({currentUserId: member?.id || ''}),
        },
      );

      const data = await response.json();
      setThreadList(data);
    } catch (error) {
      console.error('Error fetching thread list:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteThread = async (chatId: string) => {
    try {
      const response = await fetch(
        `${Enums.BASE_URL}api/AssistantChatApi/DeleteThread`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
          body: JSON.stringify({chatId}),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setThreadList(prev => prev.filter(thread => thread.chatId !== chatId));
      } else {
        Alert.alert('Silinemedi', result?.message || 'Bilinmeyen hata oluştu');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      Alert.alert('Hata', 'Thread silinirken bir hata oluştu.');
    }
  };

  const confirmDelete = (chatId: string) => {
    Alert.alert('Sil', 'Bu sohbeti silmek istediğinize emin misiniz?', [
      {text: 'İptal', style: 'cancel'},
      {text: 'Sil', onPress: () => deleteThread(chatId), style: 'destructive'},
    ]);
  };

  const renderItem = useCallback(
    ({item}: {item: Thread}) => (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          navigation.navigate('ChatMessage', {id: item.chatId});
        }}>
        <View style={styles.chatContent}>
          <Text style={styles.chatTitle}>Sohbet #{item.chatId}</Text>
          <Text style={styles.chatDate}>
            {formatDateThread(item.createdDate)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={() => confirmDelete(item.chatId)}>
          <Image source={Images.TRASH} style={styles.trashIcon} />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [],
  );

  const onRefresh = () => getThreadList(true);

  useEffect(() => {
    getThreadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0084b4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={threadList}
        keyExtractor={item => item.chatId}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz sohbet bulunmuyor.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('ChatMessage');
        }}>
        <Image
          source={require('../../../assets/icons/new-message.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 20,
  },
  threadItem: {
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#c0deed',
    borderColor: '#0084b4',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadText: {
    color: '#0084b4',
    fontWeight: '700',
    flex: 1,
  },
  userIcon: {
    width: 25,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'red',
    marginLeft: 10,
  },
  fab: {
    width: 60,
    height: 60,
    backgroundColor: '#0E3192',
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f9ff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E3192',
  },
  chatDate: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  trashButton: {
    marginLeft: 12,
    padding: 8,
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: '#e53935',
    resizeMode: 'contain',
  },
});
