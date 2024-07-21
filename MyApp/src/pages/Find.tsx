import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import Inputbox from '../components/Inputbox';
import Greenbtn from '../components/Greenbtn';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';

const Find = () => {
    const [form, setForm] = useState({
        birthDate: new Date(),
        phoneNumber: '',
        
      });
      const setFormnull = () => {
        setForm({
          birthDate: new Date(),
          phoneNumber: '',
          
        });
      };
      const handleChange = (name: string, value: any) => {
        setForm({
          ...form,
          [name]: value,
        });
      };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleFind = async () => {
    //계정찾기 api 연결
    
  };


  return (
    
    <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.logo}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style = {styles.textlink}>뒤로 가기</Text>
            </TouchableOpacity>
        </SafeAreaView>

      <SafeAreaView style={styles.inputbtn}>
        
        <Inputbox
          placeholder="전화 번호"
          onChangeText={(value) => handleChange('phoneNumber', value)}
        />
        <Inputbox
          placeholder="생년 월일"
          onChangeText={(value) => handleChange('phoneNumber', value)}
        />

        <Greenbtn title="계정 찾기" onPress={handleFind}/>

      </SafeAreaView>

      
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5EB',
    
  },
  inputbtn: {
    flex: 470,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    
    flex: 55,
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    marginBottom: 50,
  },
  signup: {
    flex: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  textlink: {
    marginTop: 40,
    marginLeft: 30,
    color: '#1E1E1E',
    fontSize: 19,
    fontWeight: 'bold',
    
    
  }
});

export default Find;
