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
import { Buffer } from 'buffer';
import { getme, getTokenFromLocal } from './utils/token.tsx';
import { freezeEnabled } from 'react-native-screens';


const Main: React.FC = () => {
 
  axios.defaults.baseURL = 'http://13.125.116.197:8000';
  const [onlearn, setOnlearn] = useState(false);
  const [recordedFile, setRecordedFile] = useState('');
    
  const [problemtxt, setProblemtxt] = useState('');
  const [problemimg, setProblemimg] = useState('');
  const [problemnum, setProblemnum] = useState('');
  const [feedbacktxt, setFeedbacktxt] = useState('');
  const [feedback_right, setFeedback_right] = useState(false);
  const [nickname, setNickname] = useState('');
  const [path, setPath] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getme();
      setNickname(data.data.nickname);
      const temp = await getTokenFromLocal();
      setToken(temp);
    }
    fetchdata();
  }, []);

  useEffect(() => {
    console.log('useEffect실행됨');
    getProblem();
  }
  ,[]);

  useEffect(() => {
    const onTtsStart = () => console.log('TTS 시작');
    const onTtsProgress = () => console.log('TTS 진행 중');
    const onTtsFinish = () => console.log('TTS 완료');

    Tts.addEventListener('tts-start', onTtsStart);
    Tts.addEventListener('tts-progress', onTtsProgress);
    Tts.addEventListener('tts-finish', onTtsFinish);

    return () => {
      Tts.removeEventListener('tts-start', onTtsStart);
      Tts.removeEventListener('tts-progress', onTtsProgress);
      Tts.removeEventListener('tts-finish', onTtsFinish);
    };
  }, []);


  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const handlespeak = (text: string) => {
    Tts.setDefaultLanguage('ko-KR');
    Tts.setDefaultRate(0.35);
    Tts.speak(text);
    
  };



  

  const startRecording = async () => {
    setOnlearn(true);
    try {
      const path = AudioUtils.DocumentDirectoryPath + '/test.m4a';
      setPath(path);
      console.log('path', path);
      await AudioRecorder.prepareRecordingAtPath(path, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'aac',
        AudioEncodingBitRate: 32000,
        IncludeBase64: true,
      });
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error("여기닷", error);
  };
};

  const stopRecording = async () => {
    setOnlearn(false);
    try{
      await AudioRecorder.stopRecording();
    }catch (error) {
      console.error("여기", error);
    }
  };

  const sendFeedback = async () => {
    try {
      const formData = new FormData();
      
      

      formData.append('voice', {
        uri: path,
        type: 'audio/m4a',
        name: 'feedback.m4a',
      });
      
      formData.append('problemId', problemnum);
      
      

      const response = await axios.post('/chat/feedback', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setFeedbacktxt(response.data.data.feedback);
      setFeedback_right(response.data.data.isCorrect);
      handlespeak(feedbacktxt);
      if(feedback_right){
        handlespeak('잘하셨어요 ! 다음 문제로 넘어갑니다.');
      }
      
    } catch (error) {
      console.error("마이크버튼", error);
      handlespeak('마이크 버튼을 누르고 다시한번 말해주세요');
      
    }
  };


    

 const getProblem = async () => {
  console.log('getProblem실행됨');
    try {
      const response = await axios.post('/chat/problem', {
        headers: {
          'Authorization': `bearer ${token}`,
        }
      });
      
      setProblemtxt(response.data.data.question);
      setProblemimg(response.data.data.image);
      setProblemnum(response.data.data.problemId);
      
    } catch (error) {
      console.error("여기3", error);
    }
  }
 

  const handleLearn = () => {
    if (onlearn) {
        stopRecording();
        sendFeedback();
      } else {
        startRecording();
      }
  };


    
  


  

    return (
        <SafeAreaView style={styles.container}>
           
            <SafeAreaView style={styles.profilebtn}>
              <Text style={{paddingRight:100, paddingBottom: 19, fontSize: 20, color: 'black', fontWeight: 'bold'}}>문제를 눌러주세요!</Text>
                <Greenbtn style={{width : 50, height:50}}title = {nickname.charAt(0)} onPress={() => navigation.navigate('Profile')}/>
            </SafeAreaView>
            <SafeAreaView style={styles.mainpage}>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => handlespeak(problemtxt)}>
        
              {problemimg ? (
                 <Image source={{ uri: `data:image/png;base64,${problemimg}`}} style={styles.image} />
              ) : (
                <Text>loading...</Text>
              )}
              </TouchableOpacity>
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
        
        flexDirection: 'row',
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
        height: 300,
    }

});

export default Main;