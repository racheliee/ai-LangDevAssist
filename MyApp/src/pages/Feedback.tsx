import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import Greenbtn from '../components/Greenbtn';
import Inputbox from '../components/Inputbox.tsx';


const Feedback: React.FC = () => {
    axios.defaults.baseURL = 'http://13.125.116.197:8000';
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [feedback, setFeedback] = useState('');
  const setFeedbacknull = () => {
    setFeedback('');
  };
    const handleChange = (value: string) => {
        setFeedback(value);
        console.log(feedback);
    };
  const handlesubmit = () => {
    axios.post('/feedback', {
      feedback: feedback,
    })
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.profilebtn}>
                <Greenbtn style={{width : 50, height:50}}title="이" onPress={() => navigation.navigate('Profile')}/>
            </SafeAreaView>
            <SafeAreaView style={styles.mainpage}>
                <Inputbox
                multiline={true}
                style={
                    {width: '85%',
                     height: '40%',
                     borderColor: 'lightgray',
                     borderWidth: 1,
                    borderRadius: 15,
                    backgroundColor: '#F3F3F3',
                    marginBottom: 40,
                    fontSize: 24,
                    fontWeight: 200,
                    padding: 15,
                
                    
                }}
                value={feedback}
                onChangeText={handleChange}
                    placeholder="피드백을 입력해주세요."
                    
                />
                <Greenbtn title="제출" onPress={() => handlesubmit} />
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
        marginTop:80,
        alignItems: 'center',
        width: '100%',
        flex: 5,
    }

});

export default Feedback;