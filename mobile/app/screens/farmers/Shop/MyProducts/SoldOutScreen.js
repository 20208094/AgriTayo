import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity, Touchable } from "react-native";
import placeholderimg from "../../../../assets/placeholder.png";
import SearchBarC from '../../../../components/SearchBarC';
import Reports from '../../../../components/Reports';

function SoldOutScreen({navigation}) {
  const soldOutItems = [
    { id: 1, name: "Product A", date: "2024-08-10", image: placeholderimg,  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      price: 100, date: "2024-08-10"
    },
    { id: 2, name: "Product B", date: "2024-08-11", image: placeholderimg, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      price: 100, date: "2024-08-10"
     },
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
              <Text className="text-sm text-green-600">Sold Out on: {soldOutItem.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SoldOutScreen;
