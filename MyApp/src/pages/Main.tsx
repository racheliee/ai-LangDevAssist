import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import Greenbtn from '../components/Greenbtn';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
const Main: React.FC = () => {
    
  const [onlearn, setOnlearn] = useState(false);
  const [recordedFile, setRecordedFile] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


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
                <Greenbtn style={{width : 50, height:50}}title="이" onPress={() => navigation.navigate('Profile')}/>
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