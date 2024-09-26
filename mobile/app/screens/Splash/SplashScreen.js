import React from 'react';
import { View, Image, Text} from 'react-native';
import ehh from "../../assets/logolabel.png";

function SplashScreen() {
  return (
    <View className = 'flex-1 justify-center items-center bg-white'>
      <Image source={ehh} className='w-80 h-80' />
    </View>
  );
}

export default SplashScreen;
