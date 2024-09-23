import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import placeholderimg from "../../../../assets/placeholder.png";
import SearchBarC from '../../../../components/SearchBarC';
import Reports from '../../../../components/Reports';

function DelistedScreen({navigation}) {
  const delistedItems = [
    { id: 1, name: "Product G", reason: "Out of Stock", image: placeholderimg, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      price: 100, date: "2024-08-10" },
    { id: 2, name: "Product H", reason: "Discontinued", image: placeholderimg, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus accumsan, tortor eget laoreet luctus, odio urna gravida nisi, sit amet ultrices nisl velit sit amet risus. Integer fermentum nunc sit amet magna fringilla, in convallis odio tincidunt.",
      price: 100, date: "2024-08-10"},
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <SearchBarC/>
      <Reports data={delistedItems} dataType='delistedItems'/>
      <ScrollView className="p-4">
        {delistedItems.map((delistedItem) => (
          <TouchableOpacity key={delistedItem.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center" onPress={() => navigation.navigate('Farmers Product Details', {delistedItem})}>
            <Image source={delistedItem.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{delistedItem.name}</Text>
              <Text className="text-sm text-green-600">Reason: {delistedItem.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default DelistedScreen;
