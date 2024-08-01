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
import TestResult_up from './src/pages/TestResult_up';
import TestResult_down from './src/pages/TestResult_down';
import ProfileEdit from './src/pages/ProfileEdit';
import Feedback from './src/pages/Feedback';
import Progress from './src/pages/Progress';
import Progressment from './src/pages/Progressment';
import Achieve from './src/pages/Achieve';

// App.tsx 파일 내에서 스택 네비게이터의 파라미터 타입을 정의
export type RootStackParamList = {
  Login: undefined;
  Find: undefined;
  Signup: undefined;
  Main: undefined;
  Profile: undefined;
  Test: undefined;  
  TestResult_up: { answernum: number };
  TestResult_down: { answernum: number };
  ProfileEdit: undefined;
  Feedback: undefined;
  Progress: undefined;
  Progressment: undefined;
  Achieve: undefined;
  
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
        <Stack.Screen name="TestResult_up" component={TestResult_up} options={{headerShown:false}} />
        <Stack.Screen name="TestResult_down" component={TestResult_down} options={{headerShown:false}} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{headerShown:false}} />
        <Stack.Screen name="Feedback" component={Feedback} options={{headerShown:false}} />
        <Stack.Screen name="Progress" component={Progress} options={{headerShown:false}} />
        <Stack.Screen name="Progressment" component={Progressment} options={{headerShown:false}} />
        <Stack.Screen name="Achieve" component={Achieve} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;