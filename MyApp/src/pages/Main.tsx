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
  

  useEffect(() => {
    getme();
    getProblem();
  }, []);




  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  





  const startRecording = async () => {
    setOnlearn(true);
    try {
      const path = AudioUtils.DocumentDirectoryPath + '/test.m4a';
      setPath(path);
      console.log('path', path);
      await AudioRecorder.prepareRecordingAtPath(path, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'High',
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
      const token = await getTokenFromLocal();
      

      formData.append('voice', {
        uri: path,
        type: 'audio/m4a',
        name: 'feedback.m4a',
      });
      
      formData.append('problemId', problemnum);
      console.log("pidd", problemnum)
      console.log('path', formData.getAll('problemId'));

      const response = await axios.post('/chat/feedback', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('response', response);
    } catch (error) {
      console.error("여기는 feedback", error);
    }
    
  };
    

 const getProblem = async () => {
    try {
      const response = await axios.post('/chat/problem', {
        headers: {
          'Authorization': `${getTokenFromLocal()}`,
        }
      });
      
      setProblemtxt(response.data.data.question);
      setProblemimg(response.data.data.image);
      setProblemnum(response.data.data.problemId);
      
    } catch (error) {
      console.error("여기", error);
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


    const handlespeak = (text: string) => {
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
              {problemimg ? (
                 <Image source={{ uri: `data:image/png;base64,${problemimg}`}} style={styles.image} />
              ) : (
                <Text>loading...</Text>
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
        height: 300,
    }

});

export default Main;