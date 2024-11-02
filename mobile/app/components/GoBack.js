import React from "react";
import {TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
const GoBack = ({navigation}) => {
  return (
    <TouchableOpacity
      className="absolute top-4 left-4"
      onPress={() => navigation.goBack()} // Navigate back on press
    >
      <Ionicons name="arrow-back-outline" size={24} color="#00b251" />
    </TouchableOpacity>
  );
};

export default GoBack
