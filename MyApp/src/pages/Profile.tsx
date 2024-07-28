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
                <TouchableOpacity onPress={() => navigation.navigate('Main')} style ={styles.flexitem}>
                    <Text style = {[styles.textlink]}>뒤로 가기</Text>
                </TouchableOpacity>
                <View style={styles.flexitem1}/>
              
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style ={styles.flexitem}>
                    <Text style = {styles.textlink }>로그 아웃</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Feedback')}style ={styles.flexitem}>
                    <Text style = {[styles.textlink]}>피드백</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView style={styles.profilepic}>
                <Text>프로필 사진</Text>
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
        
        flex: 2,
        width: '100%',
        flexDirection: 'row',
        
        justifyContent: 'space-between',
        
    },
    profilepic: {
        
        backgroundColor: '#5222F1',
        alignItems: 'center',
        flex:3.8,
    },
    
    picturepart:{
        backgroundColor: '#1122F1',
        flex: 8,
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
});

export default Profile;