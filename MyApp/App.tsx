// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/pages/Login'; 
import Find from './src/pages/Find';
import Signup from './src/pages/Signup';
import Main from './src/pages/Main';
import Profile from './src/pages/Profile';
import Test from './src/pages/Test';

// App.tsx 파일 내에서 스택 네비게이터의 파라미터 타입을 정의
export type RootStackParamList = {
  Login: undefined;
  Find: undefined;
  Signup: undefined;
  Main: undefined;
  Profile: undefined;
  Test: undefined;  
};

const Stack = createNativeStackNavigator<RootStackParamList>();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Find" component={Find} options={{headerShown:false}} />
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}} />
        <Stack.Screen name="Main" component={Main} options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}} />
        <Stack.Screen name="Test" component={Test} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;