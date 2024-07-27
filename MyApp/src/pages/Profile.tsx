import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image, TextBase} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';

const Profile: React.FC = () => {
    
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


  

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.header}>
                <Text>뒤로가기</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.profilepic}>
                <Text>프로필 사진</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.buttonpart}>
                <Text>버튼</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.picturepart}>
                <Text>사진</Text>
            </SafeAreaView>
            
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5EB',
        flex: 1,
        justifyContent: 'center',
        
    },
    header: {
        backgroundColor: '#1111F1',
        flex: 1.2,
        width: '100%',
        
        alignItems: 'center',
        
        
    },
    profilepic: {
        
        backgroundColor: '#5222F1',
        alignItems: 'center',
        flex:1.4,
    },
    buttonpart:{
        backgroundColor: '#1111F1',

        flex: 5,
    },
    picturepart:{
        backgroundColor: '#1122F1',
        flex: 5,
    }
});

export default Profile;