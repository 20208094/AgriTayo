import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import logolabel from "../../assets/logolabel.png";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SplashScreen() {
  const imageWidth = windowWidth * 1.3;
  const imageHeight = windowHeight * 1.3;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d9d9d9' }}>
      <Image 
        source={logolabel} 
        style={{ width: imageWidth, height: imageHeight }}
        resizeMode='contain'
      />
    </View>
  );
}

export default SplashScreen;
