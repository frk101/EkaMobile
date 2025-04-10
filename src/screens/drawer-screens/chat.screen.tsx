import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {GiftedChat, IMessage, Bubble} from 'react-native-gifted-chat';
import Markdown from 'react-native-markdown-display';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../constants';
import {fetcMessageList, fetcSendMessage} from '../../business/slices/ai.slice';
import {useIsFocused} from '@react-navigation/native';

interface CustomMessage extends IMessage {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
  };
}

const ChatScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isFocused = useIsFocused();
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {messageList, messageListLoading, sendMessage} = useSelector(
    (state: RootState) => state.aiSlice,
  );

  useEffect(() => {
    if (isFocused) {
      handleMessageList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (messageList) {
      console.log(messageList);
      const formattedMessages = convertMessages(messageList);
      setMessages(formattedMessages);
    }
  }, [messageList]);
  console.log(sendMessage);
  useEffect(() => {
    if (sendMessage && sendMessage.isSuccess) {
      dispatch(fetcMessageList({memberId: member?.id}));
    }
  }, [dispatch, member?.id, sendMessage]);

  const convertMessages = (previousMessages: any[]): CustomMessage[] => {
    return previousMessages.map((message, index) => ({
      _id: index + 1,
      text: message.text,
      createdAt: new Date(),
      user: {
        _id: message.role === 'user' ? 1 : 2,
        name: message.role === 'user' ? 'User' : 'Assistant',
      },
    }));
  };

  const handleMessageList = () => {
    try {
      dispatch(fetcMessageList({memberId: member?.id}));
    } catch (error) {
      console.log('Mesaj listesi getirilirken hata oluştu:', error);
    }
  };

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      try {
        dispatch(
          fetcSendMessage({
            memberId: member?.id,
            message: newMessages[0].text,
          }),
        );

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages),
        );
        setInputText(''); // Mesaj gönderildikten sonra input alanını temizle
      } catch (error) {
        console.log('hata:', error);
      }
    },
    [dispatch, member?.id],
  );
  console.log(member?.id);

  const handleInputTextChanged = (text: string) => {
    setInputText(text);
    // Enter tuşu algılandığında mesajı gönder
    if (text.endsWith('\n')) {
      onSend([
        {
          _id: Date.now(),
          text: text.trim(),
          createdAt: new Date(),
          user: {_id: 1},
        },
      ]);
    }
  };

  // Özel Mesaj Bileşeni
  const renderMessage = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0084b4',
            marginRight: 5,
            marginVertical: 5,
            paddingHorizontal: 10,
          },
          left: {
            backgroundColor: '#c0deed',
            marginLeft: 5,
            marginVertical: 5,
            paddingHorizontal: 10,
          },
        }}
        renderMessageText={() => (
          <Markdown
            style={{
              body: {
                color: props.position === 'left' ? '#0084b4' : 'white',
              },
            }}>
            {props.currentMessage.text}
          </Markdown>
        )}
        renderTime={() => null}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        keyboardShouldPersistTaps="handled"
        onSend={messages => onSend(messages)}
        isTyping={messageListLoading}
        user={{
          _id: 1,
        }}
        placeholder="Mesaj yazın..."
        text={inputText}
        onInputTextChanged={handleInputTextChanged}
        renderMessage={renderMessage}
        textInputStyle={{color: 'black'}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
