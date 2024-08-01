import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import Greenbtn from '../components/Greenbtn';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import Tts from 'react-native-tts';


const Main: React.FC = () => {
 
  axios.defaults.baseURL = 'http://13.125.116.197:8000';

  // // axios 인스턴스 생성
  // const apiClient = axios.create({
  //   baseURL: 'http://13.125.116.197:8000',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  // // 요청 인터셉터 설정
  // apiClient.interceptors.request.use(
  //   async (config) => {
  //     const credentials = await Keychain.getGenericPassword();
  //     if (credentials) {
  //       console.log('이거쓰냐?');
  //       config.headers.Authorization = `Bearer ${credentials.password}`;
  //     } else {
  //       console.log('No credentials stored');
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  useEffect(() => {
    getme();
    // TTS 이벤트 리스너 등록
    Tts.setDefaultLanguage('ko-KR');
    Tts.addEventListener('tts-start', event => console.log('TTS 시작:', event));
    Tts.addEventListener('tts-progress', event => console.log('TTS 진행:', event));
    Tts.addEventListener('tts-finish', event => console.log('TTS 완료:', event));
    Tts.addEventListener('tts-cancel', event => console.log('TTS 취소:', event));

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      Tts.removeEventListener('tts-start', event => console.log('TTS 시작:', event));
      Tts.removeEventListener('tts-progress', event => console.log('TTS 진행:', event));
      Tts.removeEventListener('tts-finish', event => console.log('TTS 완료:', event));
      Tts.removeEventListener('tts-cancel', event => console.log('TTS 취소:', event));
    };
  }, []);

  const [onlearn, setOnlearn] = useState(false);
  const [recordedFile, setRecordedFile] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [nickname, setNickname] = useState('떠들이');

  const getTokenFromLocal = async () => {
    try {
      const value = await AsyncStorage.getItem('Tokens');
      if (value !== null) {
        const token = JSON.parse(value);
        return token.accessToken;
      } else {
        return null;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
  const getme = async () => {
    console.log(await getTokenFromLocal());
    
    const result = await axios.get('/users/me', {
      headers: {
        'Authorization': `Bearer ${getTokenFromLocal()}`,
      }
    });
    
    setNickname(result.data.data.nickname);  
  }



  const startRecording = async () => {
    let audioPath = AudioUtils.DocumentDirectoryPath + '/test.m4a';
    console.log(audioPath);
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
    });
    await AudioRecorder.startRecording();
    setOnlearn(true);
  };

  const stopRecording = async () => {
    const filePath = await AudioRecorder.stopRecording();
    setOnlearn(false);
    setRecordedFile(filePath);
    sendFileToServer(filePath);
  };


  const sendFileToServer = (filePath : any) => {
    const formData = new FormData();
    formData.append('file', {
      uri: filePath,
      type: 'audio/m4a',
      name: 'test.m4a',
    });
    axios.post('http://13.125.116.197:8000', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log('File uploaded successfully', response);
    }).catch(error => {
      console.log('File upload failed', error);
    });
  };


  const handleLearn = () => {
    if (onlearn) {
        stopRecording();
        handlespeak();
      } else {
        startRecording();
      }
  };

  const [base64Image, setBase64Image] = useState('');
  const [text, setText] = useState('안녕하세요 떠들이입니다.');


    const responsedata = async () => {
      const token = await getTokenFromLocal();
      try{
      const resdata = await axios.post('/problems', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(resdata);
      setBase64Image(data.data.image);//모름
      setText(data.data.text);//모름
    } catch(error){
      console.log(error);
    }
    };

    const handlespeak = () => {
      if(text){
        Tts.speak(text);
      }
    };
  


  

    return (
        <SafeAreaView style={styles.container}>
           
            <SafeAreaView style={styles.profilebtn}>
                <Greenbtn style={{width : 50, height:50}}title = {nickname.charAt(0)} onPress={() => navigation.navigate('Profile')}/>
            </SafeAreaView>
            <SafeAreaView style={styles.mainpage}>
            <View style={styles.container}>
              {base64Image ? (
                <Image
                  style={styles.image}
                  source={{ uri: base64Image }}
                />
              ) : (
                <Text></Text>
              )}
            </View> 
            </SafeAreaView>
            <SafeAreaView style={styles.mic}>
                <TouchableOpacity onPress={handleLearn}>
                    <Image source={onlearn ? require('../assets/mic.png') : require('../assets/mic_before.png')} style={{width: 85, height: 85}}/>
                </TouchableOpacity>
            </SafeAreaView> 
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5EB',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilebtn: {
        
        
        flex: 1.2,
        width: '100%',
        marginRight: 80,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        
    },
    mic: {
        
        flex:1.4,
    },
    mainpage:{
        backgroundColor: '#1111F1',
        flex: 5,
    },
    image : {
        borderRadius: 20,
        width: 300,
        height: 250,
    }

});

export default Main;