import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import Inputbox from '../components/Inputbox';
import Greenbtn from '../components/Greenbtn';
import axios from 'axios';
// import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx';
import {Header, StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// axios 인스턴스 생성
// const apiClient = axios.create({
//   baseURL: 'http://13.125.116.197:8000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// 요청 인터셉터 설정
// apiClient.interceptors.request.use(
//   async (config) => {
//     const credentials = await Keychain.getGenericPassword();
//     if (credentials) {
//       config.headers.Authorization = `Bearer ${credentials.password}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
const Login = () => {
  axios.defaults.baseURL = 'http://13.125.116.197:8000';
  const [loginId, setId] = useState('');
  const [password, setPassword] = useState('');
  const loginData = {
    loginId: loginId,
    password: password,
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleLogin = async () => {
    
    try {
      const response = await axios.post('/auth/signin', loginData);
      if(response.status = 200){
        await AsyncStorage.setItem('Tokens', JSON.stringify({
          'accessToken': response.data.data.access_token,
          'refreshToken': response.data.data.refresh_token,
        }))
      }
      // await Keychain.setGenericPassword('userToken', response.data.data.access_token);
      const token = await AsyncStorage.getItem('Tokens');
      if (!token) {
        return;
      }
      const JS = JSON.parse(token);
      console.log('token', JS);
      
      if (response.data.data.access_token) {
        const firstlogin = await axios.get('/users/me', {
          headers: {
            'Authorization': `Bearer ${response.data.data.access_token}`,
          }
        });
        if(firstlogin.data.data.lastLogin == (undefined || null)){
          navigation.navigate('Test');
        }
        else
          navigation.navigate('Main');
      } else {
        Alert.alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  const gosignup = () => {
    navigation.navigate('Signup');
  };
  const gofind = () => {
    navigation.navigate('Find');
  }

  return (
    
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.logo}>
      <Image source={require('../assets/logo.png')} style={{width: 300, height:100}}/>
    </SafeAreaView>

      <SafeAreaView style={styles.inputbtn}>
        <Inputbox
          placeholder="아이디"
          value={loginId}
          onChangeText={setId}
          autoCapitalize='none'
        />
        <Inputbox
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize='none'
        />
        <Greenbtn title="로그인" onPress={handleLogin}/>
        <TouchableOpacity onPress={gofind}>
          <Text style = {styles.textlink }>아이디, 비밀번호가 기억나지 않아요!</Text>
        </TouchableOpacity>

      </SafeAreaView>

      <SafeAreaView style = {styles.signup}>
        <TouchableOpacity onPress={gosignup}>
          <Text style = {styles.textlink}>떠들자가 처음이신가요?</Text>
        </TouchableOpacity>
        
      </SafeAreaView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5EB',
    
  },
  inputbtn: {
    flex: 470,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    flex: 320,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  signup: {
    flex: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  textlink: {
    color: '#1E1E1E',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 13,
    
  }
});

export default Login;