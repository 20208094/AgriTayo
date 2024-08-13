import React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { styled } from 'nativewind';
import placeholderimg from '../../../assets/placeholder.png'; // Import the placeholder image

const Tab = createMaterialTopTabNavigator();

// Define a component for displaying each item in the tab
const CategoryItem = ({ item }) => (
  <View className="flex-row items-start p-4 mb-4 border border-gray-300 bg-white rounded-lg shadow-md">
    <Image
      source={placeholderimg}
      className="w-24 h-24 rounded-lg mr-4"
      resizeMode="cover"
    />
    <View className="flex-1">
      <Text className="text-lg font-semibold text-gray-800 mb-1">{item.name}</Text>
      <Text className="text-sm text-gray-600">{item.description}</Text>
    </View>
  </View>
);

// Example data (you might want to replace this with real data or props)
const exampleData = [
  { id: 1, name: 'Item 1', description: 'Description for Item 1' },
  { id: 2, name: 'Item 2', description: 'Description for Item 2' },
  { id: 3, name: 'Item 3', description: 'Description for Item 3' },
  { id: 4, name: 'Item 4', description: 'Description for Item 4' },
  { id: 5, name: 'Item 5', description: 'Description for Item 5' },
  { id: 6, name: 'Item 6', description: 'Description for Item 6' },
  { id: 7, name: 'Item 7', description: 'Description for Item 7' },
  { id: 8, name: 'Item 8', description: 'Description for Item 8' },
  { id: 9, name: 'Item 9', description: 'Description for Item 9' },
  { id: 10, name: 'Item 10', description: 'Description for Item 10' },
];

function MarketCategoryScreen({ route }) {
  const { category, selectedItemId } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarScrollEnabled: true,
          lazy: true,
          tabBarStyle: { backgroundColor: 'white', elevation: 4 }, // Shadow for the tab bar
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#00B251' }, // Color for the active tab indicator
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
                {exampleData.slice(0, 5).map(dataItem => (
                  <CategoryItem key={dataItem.id} item={dataItem} />
                ))}
              </ScrollView>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default styled(MarketCategoryScreen);
