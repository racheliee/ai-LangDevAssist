import React, {useState} from 'react';
import {View, Modal, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import Inputbox from '../components/Inputbox';
import Greenbtn from '../components/Greenbtn';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Signup = () => {
  axios.defaults.baseURL = 'http://13.125.116.197:8000';
    const [form, setForm] = useState({
        nickname: '',
        loginId: '',
        password: '',
        birth: new Date(),
        interest: '',
        
      });
      const setFormnull = () => {
        setForm({
          nickname: '',
          loginId: '',
          password: '',
          birth: new Date(),
          interest: '',
          
        });
      };
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

        const showDatePicker = () => {
            setDatePickerVisibility(true);
        };

        const hideDatePicker = () => {
            setDatePickerVisibility(false);
        };

        const handleConfirm = (date: any) => {
            setForm({
                ...form,
                birth: date,
              });
              console.log(form);
            hideDatePicker();
        };

      const handleChange = (name: string, value: any) => {
        
        setForm({
          ...form,
          [name]: value,
        });
        console.log(form);
      };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    //navigation.navigate('Test'); //
    console.log(form);
    try {
      const response = await axios.post('/auth/signup', form);
      console.log(response.data);
      if(response.status === 201){
        Alert.alert("회원가입이 완료되었습니다.");
        setFormnull();
        navigation.navigate('Login');
      }
      else{
        Alert.alert("회원가입에 실패했습니다.");
      }      
    } catch (error) {
      console.error(error);
    }
    
  };
  
  return (
    
    <SafeAreaView style={styles.container}>
        <View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>

        <SafeAreaView style={styles.logo}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style = {styles.textlink}>뒤로 가기</Text>
            </TouchableOpacity>
        </SafeAreaView>

      <SafeAreaView style={styles.inputbtn}>
        <Inputbox
          placeholder="아이디"
          onChangeText={(value) => handleChange('loginId', value)}
          autoCapitalize='none'
        />
        <Inputbox
          placeholder="비밀번호"
          secureTextEntry
          onChangeText={(value) => handleChange('password', value)}
          autoCapitalize='none'
        />
        <Inputbox
          placeholder="닉네임"
          onChangeText={(value) => handleChange('nickname', value)}
          autoCapitalize='none'
        />

        <Inputbox
          placeholder="관심 분야"
          onChangeText={(value) => handleChange('interest', value)}
          autoCapitalize='none'
        /> 
        <Inputbox
            placeholder="생년 월일"
            value={form.birth.toDateString()}
            underlineColorAndroid={'transparent'}
            autoCapitalize='none'
            onTouchStart={() => setDatePickerVisibility(true)}
        />

        <Greenbtn title="회원가입" onPress={handleSignUp}/>

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
    
    
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 배경 흐리게 처리
  },
  
});

export default Signup;