import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet, Platform, TextInput, Button, Text, Alert, TouchableOpacity, Image, ImageBackground} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import * as Keychain from 'react-native-keychain';

const Progress: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  axios.defaults.baseURL = 'http://13.125.116.197:8000';

  // axios 인스턴스 생성
  const apiClient = axios.create({
    baseURL: 'http://13.125.116.197:8000',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // 요청 인터셉터 설정
  apiClient.interceptors.request.use(
    async (config) => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        config.headers.Authorization = `Bearer ${credentials.password}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  const [nickname, setNickname] = useState('떠들이');

  const getme = async () => {
    try {
      const result = await apiClient.get('/users/me');
      setNickname(result.data.data.nickname);
      console.log('Nickname updated:', result.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        console.error('Unexpected error', error);
      }
      Alert.alert('Error', 'Failed to fetch profile data.');
    }
  };
  useEffect(() => {
    getme();
    
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.flexitem}>
          <Text style={styles.textlink}>뒤로 가기</Text>
        </TouchableOpacity>
        <View style={styles.flexitem1} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.flexitem}>
          <Text style={styles.textlink}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Feedback')} style={styles.flexitem}>
          <Text style={styles.textlink}>피드백</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={[styles.profilepic, { borderColor: '#b4b4b4', borderBottomWidth: 1 }]}>
        <Image source={require('../assets/profile_1.png')} style={{ width: 100, height: 100 }} />
        <Text style={{ marginTop: 25, fontSize: 19, fontWeight: 'bold' }}>{nickname}</Text>
      </SafeAreaView>
      <TouchableOpacity style={styles.profilebox} onPress={() => navigation.navigate('ProfileEdit')}>
        <Text style={styles.textlink}>떠든 일수</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profilebox} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.textlink}>최근 떠든날</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profilebox} onPress={() => navigation.navigate('ProfileEdit')}>
        <Text style={styles.textlink}>내 성취도</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profilebox} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.textlink}>내 발전도</Text>
      </TouchableOpacity>
      <View style={styles.picturepart}>
        <ImageBackground source={require('../assets/profile_land.png')} style={{ width: '100%', height: 216 }}>
        </ImageBackground>
      </View>
    </View>
  );
};

// 스타일 정의 생략...




const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5EB',
        flex: 1,
        justifyContent: 'center',
        
    },
    header: {
        
        flex: 2,
        width: '100%',
        flexDirection: 'row',
        
        justifyContent: 'space-between',
        
    },
    profilepic: {
        
        // backgroundColor: '#5222F1',
        alignItems: 'center',
        flex:5,
        justifyContent: 'center',
    },
    
    picturepart:{
        // backgroundColor: '#1122F1',
        flex: 8,
        justifyContent: 'flex-end',
    },
    textlink: {
        marginTop: 25,
        marginLeft: 22,   
        color: '#1E1E1E',
        fontSize: 19    ,
        fontWeight: 'bold',
        flex: 1,       
      },
      flexitem: {
        flex: 1 ,
        alignItems: 'center',
        flexDirection: 'row',
        
      },
      flexitem1: {
        flex: 0.7,
        alignItems: 'center',
        flexDirection: 'row',
      },
      profilebox: {
        // backgroundColor: '#C8E7C8',
        flex: 2.1,
        flexDirection: 'column',
        justifyContent: 'center',
        borderBlockColor: '#b4b4b4',
        borderBottomWidth: 1,

        
      },
});

export default Progress;