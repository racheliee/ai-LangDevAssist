import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image,ImageBackground} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import * as Keychain from 'react-native-keychain';

const ProfileEdit: React.FC = () => {
    
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
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
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    
      const [nickname, setNickname] = useState('떠들이');
    
      const getme = async () => {
        const result = await axios.get('/users/me');
        setNickname(result.data.data.nickname);
        console.log(result.data.data.nickname);
      }

      useEffect(() => {
        getme();
        console.log(nickname);
      }, []);
  
      
    const [form, setForm] = useState({
        nickname: '',
        birth: '',
    });
    const setFormnull = () => {
        setForm({
            nickname: '',
            birth: '',
        });
    }
    const handleChange = (name: string, value: any) => {
        setForm({
            ...form,
            [name]: value,
        });
        console.log(form);
    }
    const [editmode, setEditmode] = useState(false);


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main')} style ={styles.flexitem}>
                    <Text style = {[styles.textlink]}>뒤로 가기</Text>
                </TouchableOpacity>
                <View style={styles.flexitem1}/>
              
                <TouchableOpacity style ={styles.flexitem}>
                    <Text style = {styles.textlink }></Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditmode(true)} style ={styles.flexitem}>
                    <Text style = {[styles.textlink]}>수정</Text>
                </TouchableOpacity>
            </SafeAreaView>

                <SafeAreaView style={[styles.profilepic, {borderColor:'#b4b4b4', borderBottomWidth:1}]}>
                <Image source={require('../assets/profile_1.png')} style={{width: 100, height: 100}}/>
                <Text style = {{marginTop: 25, fontSize: 19, fontWeight: 'bold'}}>{nickname}</Text>
            </SafeAreaView>

            <TouchableOpacity style ={styles.profilebox}>
                <Text style = {[styles.textlink]}>전화번호</Text>
                <Text style = {[styles.textlink]}></Text>         
            </TouchableOpacity>
            ㅁ
            <TouchableOpacity style ={styles.profilebox} >
                <Text style = {[styles.textlink]}>학습 기록</Text>         
            </TouchableOpacity> 
       
            <View style={styles.picturepart}>
                <ImageBackground source={require('../assets/profile_land.png')} style={{width: '100%' , height:216}}>
                    

                </ImageBackground>
            </View>
            
        </View>
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
        
        // backgroundColor: '#5222F1',
        alignItems: 'center',
        flex:5,
        justifyContent: 'center',
    },
    
    picturepart:{
        // backgroundColor: '#1122F1',
        flex: 8,
        justifyContent: 'flex-end',
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
      profilebox: {
        // backgroundColor: '#C8E7C8',
        flex: 1.8,
        flexDirection: 'column',
        borderBlockColor: '#b4b4b4',
        borderBottomWidth: 1,

        
      },
});

export default ProfileEdit;