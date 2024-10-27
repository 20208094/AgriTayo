import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import chip from '../assets/Loading/chip.gif';
import greenPlanet from '../assets/Loading/green-planet.gif';
import oregano from '../assets/Loading/oregano.gif';
import organic from '../assets/Loading/organic.gif';
import sprout from '../assets/Loading/sprout.gif';

const LoadingAnimation = () => {
  const animations = [chip, greenPlanet, oregano, organic, sprout];
  const [randomAnimation, setRandomAnimation] = useState(chip); // Default to 'chip'

  useEffect(() => {
    // Select a random GIF when the component mounts
    const randomIndex = Math.floor(Math.random() * animations.length);
    setRandomAnimation(animations[randomIndex]);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image source={randomAnimation} style={{ width: 150, height: 150 }} />
      <Text className="text-[#00b251] text-xl font-bold">Loading...</Text>
    </View>
  );
};

export default LoadingAnimation;
