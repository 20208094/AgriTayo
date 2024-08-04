import React from 'react';
import { View, Image, Text} from 'react-native';
import ehh from "../../assets/ehh.png";

function SplashScreen() {
  return (
    <View className = 'flex-1 justify-center items-center bg-green-600'>
      <Image source={ehh} className='w-50 h-70' />
    </View>
  );
}

export default SplashScreen;
