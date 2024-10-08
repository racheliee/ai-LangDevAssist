import React, {useState} from 'react';
import {SafeAreaView, StyleSheet,TouchableOpacity ,TextInput,ButtonProps, Button, Text, Alert, ViewStyle} from 'react-native';

// ButtonProps를 확장하여 style 속성을 추가합니다.
interface GreenButtonProps extends ButtonProps {
    style?: ViewStyle;
}

// 초록색 버튼에 대한 컴포넌트 정의(스타일)
const Greenbtn : React.FC<GreenButtonProps> = (props) => {
    return (
        <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
            <Text style ={styles.title}>{props.title}</Text>
       </TouchableOpacity>
    );
};
        
const styles = StyleSheet.create({
    container: {
        width: '75%',
        height: 62,
        marginVertical: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#82C96D',
        borderRadius: 40,
    },
    title: {
        fontWeight: '900',
        fontSize: 22,
         
    }
});

export default Greenbtn;