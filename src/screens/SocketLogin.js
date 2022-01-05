import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get(
  'screen',
);

const SocketLogin = ({navigation}) => {
  const [userName, setuserName] = useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    return () => {
      setuserName('');
    };
  }, [isFocused]);
  const onLoginPressed = async () => {
    console.log('login..');
    userName && navigation.navigate('SocketChat', {userName});
  };
  return (
    <View style={styles.container}>
      {/* <Text>Login</Text> */}
      <TextInput
        placeholder="User name"
        style={styles.input}
        value={userName}
        onChangeText={(text) => setuserName(text)}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={onLoginPressed}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#dcf8c6' : '#075e54',
            },
            styles.wrapperCustom,
          ]}>
          <Icon name="keyboard-arrow-right" color="#fff" size={25} />
        </Pressable>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '90%',
    alignSelf: 'center',
  },
  wrapperCustom: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '95%',
    height: SCREEN_HEIGHT / 17,
    borderWidth: 0.5,
    borderRadius: Math.round(SCREEN_WIDTH / 2 + SCREEN_HEIGHT / 2),
    paddingHorizontal: 10,
    borderColor: '#075e54',
    alignSelf: 'center',
  },
});

export default SocketLogin;
