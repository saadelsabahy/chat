import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Chat from '../screens/Chat';
import Login from '../screens/Login';
import SocketChat from '../screens/SocketChat ';
import SocketLogin from '../screens/SocketLogin';
const Stack = createStackNavigator();
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="SocketLogin" component={SocketLogin} />
        <Stack.Screen name="SocketChat" component={SocketChat} />
        {/* <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="Chat" component={Chat} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
