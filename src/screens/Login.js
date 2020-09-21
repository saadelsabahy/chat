import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get(
  'screen',
);
import {useIsFocused} from '@react-navigation/native';

const Login = ({navigation}) => {
  const [userName, setuserName] = useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    return () => {
      setuserName('');
    };
  }, [isFocused]);
  const onLoginPressed = async () => {
    auth()
      .signInAnonymously()
      .then((user) => {
        console.log({user});
        navigation.navigate('Chat', {userName});
      })
      .catch((error) => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });
    // navigation.navigate('Chat')
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

export default Login;
