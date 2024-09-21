import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity, Touchable } from "react-native";
import placeholderimg from "../../../../assets/placeholder.png";
import SearchBarC from '../../../../components/SearchBarC';
import Reports from '../../../../components/Reports';

function SoldOutScreen({navigation}) {
  const soldOutItems = [
    { id: 1, name: "Product A", date: "2024-08-10", image: placeholderimg },
    { id: 2, name: "Product B", date: "2024-08-11", image: placeholderimg },
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
       <SearchBarC/>
       <Reports data={soldOutItems} dataType="soldOutItems" />
      <ScrollView className="p-4">
        {soldOutItems.map((soldOutItem) => (
          <TouchableOpacity key={soldOutItem.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center" onPress={() => navigation.navigate('Farmers Product Details', {soldOutItem})}>
            <Image source={soldOutItem.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{soldOutItem.name}</Text>
              <Text className="text-sm text-gray-600">Sold Out on: {soldOutItem.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SoldOutScreen;
