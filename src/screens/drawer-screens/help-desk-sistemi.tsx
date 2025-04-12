/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import {Enums, Images} from '../../constants';
import {RootState} from '../../business/store';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {toast} from 'sonner-native';

interface Ticket {
  id: number;
  title: string;
  priority: string;
  unitName: string;
  description: string;
  status: string;
}

interface Unit {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

const HelpDeskSistemi = ({navigation}) => {
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {token} = useSelector((state: RootState) => state.getTokenSlice);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [answer, setAnswer] = React.useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = React.useState<number | null>(
    null,
  );
  const [ticketDetail, setTicketDetail] = React.useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [ticketList, setTicketList] = React.useState<Ticket[]>([]);
  const [unitList, setUnitList] = React.useState<Unit[]>([]);
  const [statusList, setStatusList] = React.useState<Status[]>([]);

  const getTicketList = async () => {
    try {
      const response = await fetch(
        `${Enums.BASE_URL}api/TicketApi/getticketlist`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
          body: JSON.stringify({
            pageSize: 20,
            page: 1,
            currentUserId: member?.id || '',
          }),
        },
      );
      const data = await response.json();
      setTicketList(data?.ticketList || []);
    } catch (error) {
      console.error('Error fetching thread list:', error);
    }
  };

  const getUnitList = async () => {
    try {
      const response = await fetch(
        `${Enums.BASE_URL}api/TicketApi/getunitslist`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
        },
      );
      const data = await response.json();
      setUnitList(data || []);
    } catch (error) {
      console.error('getUnitList error:', error);
    }
  };
  const fetchTicketDetail = async (ticketId: number) => {
    try {
      setDetailLoading(true);
      setDetailModalVisible(true);
      const response = await fetch(
        `${Enums.BASE_URL}api/TicketApi/getticketdetail`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
          body: JSON.stringify({
            ticketId,
          }),
        },
      );

      const text = await response.text();
      try {
        const data = JSON.parse(text); // 👈 JSON olarak parse ediyoruz
        console.log('Gelen data:', data);
        setTicketDetail(data);
      } catch (e) {
        console.error('JSON parse hatası:', e);
        console.log('Gelen text:', text);
      }
    } catch (error) {
      console.error('Detay çekme hatası:', error);
    } finally {
      setDetailLoading(false);
    }
  };
  const getStatusList = async () => {
    try {
      const response = await fetch(
        `${Enums.BASE_URL}api/TicketApi/getstatuslist`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
        },
      );
      const data = await response.json();
      setStatusList(data || []);
    } catch (error) {
      console.error('getStatusList error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([getTicketList(), getUnitList(), getStatusList()]).finally(
        () => setLoading(false),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 0:
        return {label: 'Kritik', color: '#d32f2f'};
      case 1:
        return {label: 'Acil', color: '#f57c00'};
      case 2:
        return {label: 'Önemli', color: '#fbc02d'};
      case 3:
        return {label: 'Normal', color: '#388e3c'};
      case 4:
        return {label: 'Acil Değil', color: '#1976d2'};
      default:
        return {label: 'Bilinmiyor', color: '#757575'};
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return {label: 'Cevaplanmadı', color: '#d32f2f'};
      case 1:
        return {label: 'Cevaplandı', color: '#388e3c'};
      default:
        return {label: 'Bilinmiyor', color: '#757575'};
    }
  };

  const sendAnswerToTicket = async () => {
    if (!selectedTicketId || !answer) {
      return;
    }

    try {
      const response = await fetch(
        `${Enums.BASE_URL}api/TicketApi/addmessagetoticket`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
          body: JSON.stringify({
            currentUserId: member?.id || 0,
            ticketId: selectedTicketId,
            message: answer,
          }),
        },
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (data?.isSuccess) {
        setAnswer('');
        setDetailModalVisible(false);
        toast.success('Mesaj gönderildi');
      } else {
        setAnswer('');
        toast.success(data.message);
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  const renderTicketItem = ({item}: {item: Ticket}) => {
    const cleanDescription = item.description.replace(/<[^>]+>/g, '');
    const {label: priorityLabel, color: priorityColor} = getPriorityInfo(
      Number(item.priority),
    );
    const {label: statusLabel, color: statusColor} = getStatusLabel(
      Number(item.status),
    );

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTicketId(item.id);
          fetchTicketDetail(item.id);
        }}>
        <View style={[styles.ticketCardContainer]}>
          <View
            style={[styles.priorityIndicator, {backgroundColor: priorityColor}]}
          />
          <View style={styles.ticketContent}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>{item.title}</Text>
              <View
                style={[styles.statusBadge, {backgroundColor: statusColor}]}>
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            </View>
            <Text style={styles.unitName}>{item.unitName}</Text>
            <Text style={styles.ticketDescription} numberOfLines={2}>
              {cleanDescription}
            </Text>
            <View style={styles.footerRow}>
              <View
                style={[
                  styles.priorityBadge,
                  {backgroundColor: priorityColor},
                ]}>
                <Text style={styles.priorityText}>{priorityLabel}</Text>
              </View>
              <Text style={styles.footerText}>#TicketID: {item.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const date = new Date(ticketDetail?.messages[0]?.timestamp);

  const formatted = date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0084b4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ticketList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTicketItem}
        refreshing={loading}
        onRefresh={getTicketList}
        contentContainerStyle={{paddingVertical: 10}}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('HelpDestekChat', {
            statusList: statusList,
            unitList: unitList,
          });
          // HelpDestekChat
        }}>
        <Image
          source={require('../../../assets/icons/new-message.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
      {detailModalVisible && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View style={styles.modalCard}>
            {detailLoading ? (
              <ActivityIndicator size="large" color="#0084b4" />
            ) : ticketDetail ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                  }}>
                  <Text style={styles.modalTitle}>{ticketDetail?.title}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setDetailModalVisible(false);
                      setTicketDetail(null);
                    }}>
                    <Image source={Images.CLOSE} style={styles.closeIcon} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    marginTop: 20,
                  }}>
                  <Text style={styles.modalDescription}>
                    {ticketDetail.description.replace(/<[^>]+>/g, '')}
                  </Text>
                </View>
                {ticketDetail?.messages?.length > 0 ? (
                  <View
                    style={{
                      marginTop: 20,
                    }}>
                    <Text style={styles.modalDescription}>
                      {ticketDetail.messages[0].message}
                    </Text>
                    <Text style={{color: '#555', marginTop: 5}}>
                      {ticketDetail.messages[0].senderName} - {formatted}
                    </Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      placeholder="Cevap yazın..."
                      style={[
                        styles.input,
                        {height: 100, textAlignVertical: 'top'},
                      ]}
                      multiline
                      placeholderTextColor="#999"
                      value={answer}
                      onChangeText={setAnswer}
                    />
                    <TouchableOpacity
                      style={styles.sendButton}
                      disabled={!answer}
                      onPress={sendAnswerToTicket}>
                      <Text style={styles.sendButtonText}>Gönder</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <Text style={{color: '#333'}}>Detay bilgisi bulunamadı</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default HelpDeskSistemi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fab: {
    width: 70,
    height: 70,
    backgroundColor: '#0084b4',
    borderRadius: 35,
    position: 'absolute',
    bottom: 50,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  ticketCardContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fcff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  priorityIndicator: {
    width: 8,
    backgroundColor: '#ccc',
  },
  ticketContent: {
    flex: 1,
    padding: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    paddingRight: 8,
  },
  unitName: {
    fontSize: 13,
    color: '#007ACC',
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0E3192',
  },
  modalUnit: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  modalTagContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modalTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#0084b4',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#0E3192',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
