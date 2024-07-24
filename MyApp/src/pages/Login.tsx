import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import Inputbox from '../components/Inputbox';
import Greenbtn from '../components/Greenbtn';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx';
import {StackNavigationProp} from '@react-navigation/stack';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleLogin = async () => {
    navigation.navigate('Main'); // 임시
    console.log(id);
    console.log(password);
    try {
      const response = await axios.post('/auth/login', {
        // 요청 본문에 들어갈 데이터
        id: '사용자ID',
        password: '비밀번호',
      });
      console.log(response.data);
      await Keychain.setGenericPassword('userToken', response.data.accessToken);
      // navigation.navigate('Main');
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
          value={id}
          onChangeText={setId}
        />
        <Inputbox
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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