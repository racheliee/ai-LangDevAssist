import React, {useState} from 'react';
import {ScrollView, SafeAreaView, StyleSheet,Platform ,TextInput, Button, Text, Alert, Touchable, TouchableOpacity, Image} from 'react-native';
import Inputbox from '../components/Inputbox';
import Greenbtn from '../components/Greenbtn';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native'; 
import {RootStackParamList} from '../../App.tsx'; 
import {StackNavigationProp} from '@react-navigation/stack';


const Test = () => {
  const behaviors = [
    "자신을 부르는데도 반응하지 않는다.",
    "말하는 사람을 쳐다보지 않는다.",
    "단순한 지시를 따르지 않는다.",
    "친숙한 물건을 갖다달라고 해도 주지 않는다.",
    "자신의 신체 일부를 지적하지 못한다.",
    "동사와 같은 서술어를 말하지 못한다.",
    "두 개이상의 단어를 연결하여 말하지 못한다.",
    "정확한 어휘력을 구사하지 못한다.",
    "아이가 의사소통기술을 잘 사용하지 못한다 (요구를 한다거나 거부-승낙한다거나 등등)",
    "물건의 이름을 말하지 않고 사용하는 용도만을 말하면 따르지 못한다. (나에게 자를 수 있는 것을 보여줘)",
    "몸짓이나 얼굴표정 등의 비언어적 의사소통을 한다.",
    "동시에 2가지 지시를 따르지 못한다. (책은 책상위에 두고, 연필을 가지고 오너라)",
    "형용사나 물건의 비교를 이해하지 못한다. (이것보다 큰 공을 가지고 와)",
    "신체 일부를 지적하지 못한다. (손,코,귀,눈,머리)",
    "5개 단어로 된 문장을 말할 수 없다. (나는 마당에 있는 강아지에게 간다)",
    "2단어 연결 문장으로 말 할 수 없다 (\"엄마 옷\", \"아빠 책\")",
    "의문사에 대한 대답을 잘 못한다.",
    "주로 한단어의 말을 한다.",
    "아이가 하는 말을 잘 못알아 듣는다.",
    "더듬거리며 말을 한다."
  ];

  const [answernum , setAnswernum] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleTest = async () => {
    console.log(answernum);
    try {
      const response = await axios.post('/user/submitTest', {
        score : answernum,
      });
      console.log(response.data);
      
      if(response.data === 'success'){
        navigation.navigate('TestResult');
      }
      else{
        console.log("error");
      }      

    } catch (error) {
      console.error(error);
    }
    
  };
  
  const handleSelectItem = (index: number) => {
    let updatedSelectedItems = [...selectedItems];
    if (updatedSelectedItems.includes(index)) {
      updatedSelectedItems = updatedSelectedItems.filter(item => item !== index);
    } else {
      updatedSelectedItems.push(index);
    }
    setSelectedItems(updatedSelectedItems);
    setAnswernum(updatedSelectedItems.length+1);
    console.log(answernum);
  };

  return (
    
    <ScrollView style={styles.container}>
      
        <SafeAreaView style={styles.logo}>
            <Text style = {styles.textlink}>다음 문항을 읽은뒤{"\n"}자녀가 평소 행하는 행위라면 선택해주세요</Text>   
        </SafeAreaView>

      <SafeAreaView style={styles.inputbtn}>
        {behaviors.map((behavior, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.selectbox,
              selectedItems.includes(index) && styles.selecteditem
            ]}
            onPress={() => handleSelectItem(index)}
          >
            <Text style = {styles.selectext}>{behavior}</Text>
          </TouchableOpacity>
        ))}

        <Greenbtn title="제출"/>

      </SafeAreaView>

    </ScrollView>
    
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
    
    flex:75,
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
    lineHeight: 34,
    
  },
  selectext: {
    fontSize: 16,
  },
  selecteditem: {
    backgroundColor: '#C8E7C8',
  },
  
});

export default Test;