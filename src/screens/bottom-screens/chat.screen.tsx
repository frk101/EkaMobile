import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Merhaba! Size nasıl yardımcı olabilirim?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Destek Ekibi',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/bizzmeslogo.png')} resizeMode="contain" style={styles.image}/>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
          messagesContainerStyle={{ backgroundColor: 'white' }}
        />
      </KeyboardAvoidingView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  image:{
    width:Dimensions.get('screen').width,
    height:Dimensions.get('screen').width / 3,
  },
});

export default ChatScreen;
