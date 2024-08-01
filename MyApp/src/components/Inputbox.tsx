import React from 'react';
import {TextInput, TextInputProps, StyleSheet} from 'react-native';

// CustomTextInput 컴포넌트 정의
const Inputbox : React.FC<TextInputProps> = (props) => {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor="#1E1E1E" // 여기에 placeholderTextColor 설정
      {...props} // 나머지 props 전달
    />
  );
};

// 기존 스타일을 재사용하거나 새로운 스타일을 정의
const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    fontWeight: 800,
    width: '82%',
    height:56,
    margin: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 7,
    borderRadius: 10,
    backgroundColor: 'white'
    
  },
});

export default Inputbox;