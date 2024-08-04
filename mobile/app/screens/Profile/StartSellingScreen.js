import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from 'nativewind';
import ehh from "../../assets/ehh.png";

function StartSelling({ navigation, route }) {
  const { profile } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-4">
      <Image source={ehh} className="w-72 h-72 mb-8" />
      <Text className="text-center text-lg text-black mb-8">
        To get started, register as a seller by providing the necessary information.
      </Text>
      <TouchableOpacity
        className="bg-green-600 py-4 px-8 rounded-full"
        onPress={() => navigation.navigate('Shop Information', { profile })}
      >
        <Text className="text-white text-lg font-semibold">Start Registration</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default styled(StartSelling);
