import React from 'react';
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity} from "react-native";
import placeholderimg from "../../../../assets/placeholder.png";
import SearchBarC from '../../../../components/SearchBarC';
import Reports from '../../../../components/Reports';

function ViolationScreen({navigation}) {
  const violationItems = [
    { id: 1, name: "Product E", violation: "Inappropriate Content", image: placeholderimg },
    { id: 2, name: "Product F", violation: "Misleading Information", image: placeholderimg },
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <SearchBarC/>
      <Reports data={violationItems} dataType='violationItems'/>
      <ScrollView className="p-4">
        {violationItems.map((violationItem) => (
          <TouchableOpacity key={violationItem.id} className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center" onPress={() => navigation.navigate('Farmers Product Details', {violationItem})}>
            <Image source={violationItem.image} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{violationItem.name}</Text>
              <Text className="text-sm text-gray-600">Violation: {violationItem.violation}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ViolationScreen;
