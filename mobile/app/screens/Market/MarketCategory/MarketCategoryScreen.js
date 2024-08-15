import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { styled } from 'nativewind';
import placeholderimg from '../../../assets/placeholder.png'; // Import the placeholder image

const Tab = createMaterialTopTabNavigator();

// Define a component similar to HomeCard for displaying each item in the tab
const CategoryItemCard = ({ item }) => (
  <TouchableOpacity className="w-40 bg-white rounded-lg shadow-md mb-4 mx-2">
    <Image
      source={placeholderimg}
      className="w-full h-24 rounded-t-lg"
      resizeMode="cover"
    />
    <View className="p-2">
      <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
      <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
      {/* Add Price and Rating below the description */}
      <Text className="text-base font-bold text-green-700 mt-2">₱ {item.price}</Text>
      <Text className="text-sm text-gray-600">⭐ {item.rating}</Text>
    </View>
  </TouchableOpacity>
);

// Example data (you might want to replace this with real data or props)
const exampleData = [
  { id: 1, name: 'Item 1', description: 'Description for Item 1', price: 100, rating: 4.5 },
  { id: 2, name: 'Item 2', description: 'Description for Item 2', price: 200, rating: 4.0 },
  { id: 3, name: 'Item 3', description: 'Description for Item 3', price: 150, rating: 4.8 },
  { id: 4, name: 'Item 4', description: 'Description for Item 4', price: 120, rating: 4.2 },
  { id: 5, name: 'Item 5', description: 'Description for Item 5', price: 180, rating: 4.7 },
];

function MarketCategoryScreen({ route }) {
  const { category, selectedItemId } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: true,
          lazy: true,
          tabBarStyle: { backgroundColor: 'white', elevation: 4 },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#00B251' },
          tabBarActiveTintColor: '#00B251',
          tabBarInactiveTintColor: '#757575',
        }}
        initialRouteName={category.find(item => item.id === selectedItemId)?.name ?? category[0]?.name}
      >
        {category.map(item => (
          <Tab.Screen 
            key={item.id} 
            name={item.name}
            options={{ title: item.name }}
          >
            {() => (
              <ScrollView className="flex-1 p-4 bg-gray-100">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Items in {item.name}</Text>
                <View className="flex-row flex-wrap justify-between">
                  {exampleData.map(dataItem => (
                    <CategoryItemCard key={dataItem.id} item={dataItem} />
                  ))}
                </View>
              </ScrollView>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default styled(MarketCategoryScreen);
