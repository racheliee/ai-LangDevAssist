import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet, Platform, TextInput, Button, Text, Alert, TouchableOpacity, Image, ImageBackground} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getme} from './utils/token.tsx';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Profile: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  axios.defaults.baseURL = 'http://13.125.116.197:8000';

  // // axios 인스턴스 생성
  // const apiClient = axios.create({
  //   baseURL: 'http://13.125.116.197:8000',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  // // 응답 인터셉터 설정
  // apiClient.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   async (error) => {
  //     const originalRequest = error.config;
  //     if (error.response && error.response.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;
  //       try {
  //         const credentials = await Keychain.getGenericPassword();
  //         console.log('Credentials:', credentials); // 디버깅을 위한 로그 출력
  //         if (credentials && credentials.password) {
  //           const refreshResponse = await axios.post('http://13.125.116.197:8000/auth/refresh', {
  //             refreshToken: credentials.password,
  //           });
  //           const newAccessToken = refreshResponse.data.accessToken;
  //           await Keychain.setGenericPassword('user', newAccessToken);
  //           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  //           return axios(originalRequest);
  //         } else {
  //           console.error('Error: No credentials found');
  //           Alert.alert('Error', 'No credentials found.');
  //         }
  //       } catch (refreshError) {
  //         console.error('Error refreshing token:', refreshError);
  //         Alert.alert('Error', 'Failed to refresh token.');
  //       }
  //     }
  //     return Promise.reject(error);
  //   }
  // );
  const [getdata, setgetdata] = useState<{ data: { nickname: string } }>({ data: { nickname: '' } });
  const [nickname, setNickname] = useState('떠들이');

  // const getTokenFromLocal = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('Tokens');
  //     if (value !== null) {
  //       const token = JSON.parse(value);
  //       return token.accessToken;
  //     } else {
  //       return null;
  //     }
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // }

  // const getrefreshTokenFromLocal = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('Tokens');
  //     if (value !== null) {
  //       const token = JSON.parse(value);
  //       return token.refreshToken;
  //     } else {
  //       return null;
  //     }
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // }

  // const refreshAccessToken = async (refreshToken: string) => {
  //   try {
  //     const response = await axios.post('/auth/refresh', { refreshToken });
  //     if (response.status === 200) {
  //       const newAccessToken = response.data.data.access_token;
  //       const newRefreshToken = response.data.data.refresh_token;
  
  //       await AsyncStorage.setItem('Tokens', JSON.stringify({
  //         'accessToken': newAccessToken,
  //         'refreshToken': newRefreshToken,
  //       }));
  
  //       return newAccessToken;
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing access token:', error);
  //   }
  //   return null;
  // }

  
  // const getme = async () => {
  //   try{    
  //   const result = await axios.get('/users/me', {
  //     headers: {
  //       'Authorization': `${await getTokenFromLocal()}`,
  //     }
  //   });
  //   console.log(result);
  //   setNickname(result.data.data.nickname);
  //   }catch(e :any){
  //   if(e.response.status === 401){
  //     const newAccessToken = await refreshAccessToken(await getrefreshTokenFromLocal());
  //     if (newAccessToken) {
  //       const result = await axios.get('/users/me', {
  //         headers: {
  //           'Authorization': `Bearer ${newAccessToken}`,
  //         }
  //       });
  //       setNickname(result.data.data.nickname);
  //     }
  //   }
  //   console.log(e);
  // }
  // }

  useEffect(() => {
    const fetchData = async () => {
      setgetdata(await getme());
    };
    
    fetchData();
    // console.log(getdata);
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
        <Text style={{ marginTop: 25, fontSize: 19, fontWeight: 'bold' }}>{getdata.data.nickname}</Text>
      </SafeAreaView>
      <TouchableOpacity style={styles.profilebox} onPress={() => navigation.navigate('ProfileEdit')}>
        <Text style={styles.textlink}>내 정보</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profilebox} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.textlink}>학습 기록</Text>
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
        marginTop: 30,
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
        flex: 1.8,
        flexDirection: 'column',
        borderBlockColor: '#b4b4b4',
        borderBottomWidth: 1,

        
      },
});

export default Profile;