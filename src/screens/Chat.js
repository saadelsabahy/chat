import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import HandleMessages from '../utils/Message';
import {GiftedChat} from 'react-native-gifted-chat';
import {SCREEN_HEIGHT} from './Login';
const Chat = ({route, navigation}) => {
  const {userName} = route.params;
  const isFocused = useIsFocused();
  const [messages, setmessages] = useState([]);
  useEffect(() => {
    if (isFocused) {
      HandleMessages.get((message) =>
        setmessages((prev) => GiftedChat.append(prev, message)),
      );
    }
    return () => {
      HandleMessages.off();
    };
  }, [isFocused]);

  const GIFTEDCHAT = (
    <GiftedChat
      messages={messages}
      onSend={HandleMessages.send}
      user={{
        name: userName,
        _id: HandleMessages.uid,
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
    height: SCREEN_HEIGHT / 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#888',
  },
});
export default Chat;
