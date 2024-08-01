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

const AchievementScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backText}>뒤로 가기</Text>
        </TouchableOpacity>
        <View style={styles.profile}>
          <View style={styles.profileCircle}></View>
          <Text style={styles.profileText}>떠들자</Text>
        </View>
      </View>
      <View style={styles.achievements}>
        <Circle text="첫 문장 완성" size={60} color="#7FB3D5" top={50} left={20} />
        <Circle text="백 문장 완성" size={60} color="#A9DFBF" top={150} left={200} />
        <Circle text="열 문장 완성" size={60} color="#F7DC6F" top={250} left={100} />
        <Circle text="한주 동안 떠들기" size={60} color="#F1948A" top={350} left={50} />
        <Circle text="삼일째 떠들기" size={60} color="#82E0AA" top={450} left={150} />
        <Circle text="열흘째 떠들기" size={60} color="#BB8FCE" top={550} left={200} />
        <Circle text="최고예요 평가 받기" size={60} color="#F5B041" top={650} left={100} />
        <Circle text="십분간 떠들기" size={60} color="#73C6B6" top={750} left={20} />
        <Circle text="삼십분간 떠들기" size={60} color="#A569BD" top={850} left={200} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backText: {
    fontSize: 18,
    color: 'black',
  },
  profile: {
    alignItems: 'center',
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'green',
  },
  profileText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievements: {
    flex: 1,
    position: 'relative',
  },
});

export default AchievementScreen;
