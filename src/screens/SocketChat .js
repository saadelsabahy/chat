import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {io} from 'socket.io-client';
import {removeDoublicate} from '../utils/functions';
import {SCREEN_HEIGHT} from './Login';
const SocketChat = ({route, navigation}) => {
  const {userName} = route.params;
  const user = {
    name: userName,
    _id: userName + Math.random().toString(16).slice(2),
  };
  const isFocused = useIsFocused();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://192.168.1.6:3000', {
      transports: ['websocket'],
      jsonp: false,
      forceNew: true,
    });
    setSocket(socket);

    const messageListener = (message) => {
      const {
        id,
        user: {id: userId, name},
        value,
        time,
      } = message;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: id,
          text: value,
          createdAt: new Date(time),
          user: {
            _id: userId,
            name,
            //avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]);
    };

    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages.filter(
          (message) => message.id !== messageID,
        );
        return newMessages;
      });
    };

    socket.on('message', messageListener);
    socket.on('deleteMessage', deleteMessageListener);
    socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
      socket.off('deleteMessage', deleteMessageListener);
      //socket.close();
    };
  }, [setSocket]);
  console.log({messages});
  const onSend = useCallback(
    (messages = []) => {
      Keyboard.dismiss();
      socket.emit('message', {
        value: messages[0].text,
        user: {name: user.name, id: user._id},
      });
      // setMessages((previousMessages) =>
      //   GiftedChat.append(previousMessages, messages),
      // );
    },
    [socket, setSocket],
  );
  console.log('hello', {user});
  const GIFTEDCHAT = (
    <GiftedChat
      messages={removeDoublicate(messages)}
      onSend={onSend}
      user={user}
      placeholder="type message here..."
      showUserAvatar
      alwaysShowSend
      scrollToBottom
      renderBubble={(props) => {
        return (
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: '#000',
              },
              left: {
                color: '#fff',
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: '#234765',
              },
              right: {
                backgroundColor: '#ccc',
              },
            }}
          />
        );
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>{userName}</Text>
      </View>
      {GIFTEDCHAT}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  header: {
    height: SCREEN_HEIGHT / 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#888',
  },
});
export default SocketChat;
