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


const Main: React.FC = () => {

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
      } else {
        console.log('No credentials stored');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

    
  const [onlearn, setOnlearn] = useState(false);
  const [recordedFile, setRecordedFile] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [nickname, setNickname] = useState('떠들이');

  const getme = async () => {
    const result = await apiClient.get('/users/me');
    setNickname(result.data.data.nickname);
    
  }

  useEffect(() => {
    getme();
  }, []);

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
    axios.post('YOUR_SERVER_ENDPOINT', formData, {
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
      } else {
        startRecording();
      }
  };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.profilebtn}>
                <Greenbtn style={{width : 50, height:50}}title = {nickname.charAt(0)} onPress={() => navigation.navigate('Profile')}/>
            </SafeAreaView>
            <SafeAreaView style={styles.mainpage}>

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
    }
});

export default Main;