/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Enums} from '../../constants';
import {RootState} from '../../business/store';
import {useSelector} from 'react-redux';
import {toast} from 'sonner-native';

interface Unit {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

const HelpDestekChat = () => {
  const route = useRoute<any>();
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {token} = useSelector((state: RootState) => state.getTokenSlice);
  const {statusList, unitList} = route?.params;

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [unitOpen, setUnitOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !description || !selectedUnit || !selectedStatus) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    const data = {
      title: subject,
      content: description,
      unitId: Number(selectedUnit),
      priorityId: Number(selectedStatus),
      createdUserId: member?.id,
    };

    try {
      setLoading(true);
      const response = await fetch(
        `${Enums.BASE_URL}api/TicketApi/saveticket`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie:
              'htech.web.session.intranet=CfDJ8CtKZJYWMk9Ju6lOL0GqSL%2BXdWX253%2BSRqOE7WehHxYeFBuRr%2Bzd%2FqzskyhVziShDMhLBggdGpSRXyGUJSdKLDFyJdheFgfq24dKdn6BXs6y%2BcI1tYc5e5X6RLtvjy%2BMNDbNFoIQHk2KKLHR09Grm0YH96YlNyHiXBkuyCA7s1wj',
          },
          body: JSON.stringify(data),
        },
      );
      if (response.ok) {
        toast.success('Talep başarıyla oluşturuldu.');
        setSubject('');
        setDescription('');
        setSelectedUnit(null);
        setSelectedStatus(null);
      } else {
        toast.error('Talep oluşturulamadı');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>Yeni Destek Talebi</Text>

          <View style={styles.card}>
            <Text style={styles.label}>🎫 Konu</Text>
            <TextInput
              placeholder="Konu başlığını giriniz"
              style={styles.input}
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.label}>📝 Açıklama</Text>
            <TextInput
              placeholder="Detaylı açıklama giriniz"
              style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
              multiline
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>🏢 Birim Seçimi</Text>
            <TouchableOpacity
              onPress={() => setUnitOpen(!unitOpen)}
              style={styles.selectBox}>
              <Text style={styles.selectText}>
                {selectedUnit
                  ? unitList.find((u: Unit) => u.id === Number(selectedUnit))
                      ?.name
                  : 'Birim seçiniz'}
              </Text>
            </TouchableOpacity>
            {unitOpen && (
              <View style={styles.dropdown}>
                {unitList.map((unit: Unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedUnit(String(unit.id));
                      setUnitOpen(false);
                    }}>
                    <Text>{unit.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>📌 Durum Seçimi</Text>
            <TouchableOpacity
              onPress={() => setStatusOpen(!statusOpen)}
              style={styles.selectBox}>
              <Text style={styles.selectText}>
                {selectedStatus
                  ? statusList.find(
                      (s: Status) => s.id === Number(selectedStatus),
                    )?.name
                  : 'Durum seçiniz'}
              </Text>
            </TouchableOpacity>
            {statusOpen && (
              <View style={styles.dropdown}>
                {statusList.map((status: Status) => (
                  <TouchableOpacity
                    key={status.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedStatus(String(status.id));
                      setStatusOpen(false);
                    }}>
                    <Text>{status.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && {opacity: 0.6}]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.sendButtonText}>
              {loading ? 'Gönderiliyor...' : '📨 Talebi Gönder'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HelpDestekChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0E3192',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    color: '#333',
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
  selectBox: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectText: {
    color: '#333',
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sendButton: {
    backgroundColor: '#0E3192',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
