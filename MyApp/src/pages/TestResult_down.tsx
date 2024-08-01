import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import Inputbox from '../components/Inputbox.tsx';
import Greenbtn from '../components/Greenbtn.tsx';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {useNavigation, useRoute} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';


const TestResult_down = () => {
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const {answernum} = route.params as { answernum: number };
  console.log("이거wl" ,answernum);
  return (
    
    <SafeAreaView style={styles.container}>
      
        <SafeAreaView style={styles.logo}>
            <Text style = {styles.textlink}>테스트 검사 결과, {"\n"}언어장애로 의심되지 않습니다.{"\n"}
                언어장애로 의심되는 선택 기준은 12개 이며, {"\n"}자녀분은 {answernum} 개의 항목에 해당됩니다.</Text>   
        </SafeAreaView>

      <SafeAreaView style={styles.inputbtn}>

        <Greenbtn title="떠들러 가기" onPress={() => navigation.navigate('Feedback_test')} />

      </SafeAreaView>
      <SafeAreaView style ={styles.nav}>
        <Text>본 테스트는 정확하지 않을수 있으며, 법적 효력이 없습니다. 
        정확한 진단은 전문가를 통해 받아 보시기를 권합니다.</Text>
        <Text>“떠들자” 는 공식적인 치료 어플리케이션이 아니며 
        의료적으로 학습된 인공지능과의 지속적인 대화를 통한 보조적인 치료를 위해 만들어졌습니다.</Text>
      </SafeAreaView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: '#F5F5EB',
    
  },
  inputbtn: {
    overflow: 'scroll',
    flex: 470,
    width: '100%',
    alignItems: 'center',
  },
  logo: { 
    
    flex:120,
    width: '100%',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  selectbox: {
    width: '82%',
    height:56,
    margin: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 7,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textlink: {
    
    marginTop: 10,
    marginLeft: 30,
    color: '#1E1E1E',
    fontSize: 19,
    fontWeight: 'bold',
    lineHeight: 27,
    
  },
  selectext: {
    fontSize: 16,
  },
  selecteditem: {
    backgroundColor: '#C8E7C8',
  },
  nav:{
    flex: 100,
    margin: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    
  }
});

export default TestResult_down;