/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import {GiftedChat, IMessage, Bubble, Composer} from 'react-native-gifted-chat';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Markdown from 'react-native-markdown-display';
import {RootState} from '../../business/store';
import {Enums} from '../../constants';

const ChatScreen = () => {
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const initialChatId = route?.params?.id || null;
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {token} = useSelector((state: RootState) => state.getTokenSlice);

  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isFocused) {
      if (initialChatId) {
        console.log('id var');
        setChatId(initialChatId);
        fetchChatHistory(initialChatId);
      } else {
        console.log('id yok');
        setMessages([]);
        createThread();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, initialChatId]);

  const createThread = async () => {
    try {
      const response = await fetch(
        `${Enums.BASE_URL}api/AssistantChatApi/CreateThread`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentUserId: member.id,
          }),
        },
      );

      const newChatId = await response.text();
      console.log('CreateThread response:', newChatId);

      setChatId(newChatId);
    } catch (error: any) {
      console.error('CreateThread error:', error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${Enums.BASE_URL}api/AssistantChatApi/GetChatHistory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({chatId: id}),
        },
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedMessages = data.map((msg, index) => ({
          _id: index,
          text: msg.text,
          createdAt: new Date(),
          user: {
            _id: msg.role === 'user' ? 1 : 2,
            name: msg.role === 'user' ? member?.fullName || 'Sen' : 'Asistan',
          },
        }));

        setMessages(formattedMessages.reverse());
      }
    } catch (error) {
      console.error('fetchChatHistory error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToBackend = async (messageText: string) => {
    if (!chatId) {
      console.warn('Chat ID yok, mesaj gönderilemiyor.');
      return;
    }

    try {
      setIsTyping(true);
      const response = await fetch(
        `${Enums.BASE_URL}api/AssistantChatApi/SendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: messageText,
            chatId: chatId,
            currentUserId: member?.id,
          }),
        },
      );

      const data = await response.json();
      console.log('SendMessage response:', data);

      if (data?.isSuccess && data?.chatResponse) {
        const assistantMessage: IMessage = {
          _id: Date.now(),
          text: data.chatResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Asistan',
          },
        };

        setMessages(previous =>
          GiftedChat.append(previous, [assistantMessage]),
        );
      }
    } catch (error) {
      console.error('sendMessageToBackend error:', error);
      Alert.alert('Hata', 'Mesaj gönderilemedi.');
    } finally {
      setIsTyping(false);
    }
  };

  const renderBubble = (props: any) => {
    const isRight = props.position === 'right';

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#007AFF',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            marginBottom: 2,
          },
          left: {
            backgroundColor: '#E5E5EA',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            marginBottom: 2,
          },
        }}
        renderMessageText={() => (
          <Markdown
            style={{
              body: {
                color: isRight ? '#fff' : '#000',
                fontSize: 15,
                lineHeight: 20,
              },
            }}>
            {props.currentMessage.text}
          </Markdown>
        )}
      />
    );
  };

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (!newMessages.length) {
        return;
      }

      const message = newMessages[0];
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessages),
      );

      sendMessageToBackend(message.text);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatId, member?.id],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{_id: 1}}
        renderBubble={renderBubble}
        renderAvatar={() => null}
        renderTime={() => null}
        alwaysShowSend
        showUserAvatar={false}
        isTyping={isTyping}
        renderComposer={props => (
          <Composer
            {...props}
            textInputStyle={styles.input}
            placeholder="Mesajınızı yazın..."
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
    marginRight: 8,
    color: '#000',
  },
});
