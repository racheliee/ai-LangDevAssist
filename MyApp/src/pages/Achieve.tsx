// AchievementScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, StyleSheet, Platform, TextInput, Button, Text, Alert, TouchableOpacity, Image, ImageBackground} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';
import * as Keychain from 'react-native-keychain';
import {getme} from './utils/token.tsx';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import Circle from '../components/Circle.tsx';

const Achieve: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    axios.defaults.baseURL = 'http://13.125.116.197:8000';

  interface UserData {
    birth: Date;
    nickname: string;
    createdAt: Date;
    lastLogin: Date;
    // 필요한 다른 필드들 추가
  }

  
  const [getdata, setgetdata] = useState<{ data: { nickname: string; birth: Date; createdAt: Date; lastLogin: Date} }>({ data: { nickname: '', birth: new Date() , createdAt: new Date(), lastLogin: new Date()} });
  const [daydiff , setDaydiff] = useState(0);
  const [data, setData] = useState([]);
  const getAchievement = async () => {
    const Achieve = await axios.get('/users/achievements');
    setData(Achieve.data.data);
    console.log(Achieve.data.data[0]);
    
};

  useEffect(() => {
    const fetchData = async () => {
      const data = await getme();
      data.data.birth = new Date(data.data.birth);
      data.data.createdAt = new Date(data.data.createdAt);
      data.data.lastLogin = new Date(data.data.lastLogin);
      setgetdata(data);
      const now = new Date();
      const createdAt = data.data.createdAt;
      
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1;
      
      setDaydiff(diffDays);
      getAchievement();
      
    };
    
    fetchData();
  }, []);

  

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Progress')} style={styles.flexitem}>
          <Text style={styles.textlink}>뒤로 가기</Text>
        </TouchableOpacity>
        <View style={styles.flexitem1} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.flexitem}>
          <Text style={styles.textlink}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Feedback')} style={styles.flexitem}>
          <Text style={styles.textlink}>피드백</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={[styles.profilepic, { borderColor: '#b4b4b4', borderBottomWidth: 1 }]}>
        <Image source={require('../assets/profile_1.png')} style={{ width: 100, height: 100 }} />
        <Text style={{ marginTop: 25, fontSize: 19, fontWeight: 'bold' }}>{getdata.data.nickname}</Text>
      </SafeAreaView>
     
      <View style={styles.picturepart}>
      <ImageBackground source={require('../assets/profile_land.png')} style={{ width: '100%', height: 216 }}>
          {data.map((item: {title: string }, index) => (
            <Circle 
              key={index} 
              text={item.title} 
              size={75} 
              color="#C2C2C2" 
              top={-300 + index * 100} 
              left={20 + index * 50} 
            />
          ))}
        </ImageBackground>
      </View>
    </View>
  );
};

// 스타일 정의 생략...




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
        flex: 15,
        justifyContent: 'flex-end',
    },
    textlink: {
        marginTop: 25,
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


export default Achieve;