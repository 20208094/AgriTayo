import React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { styled } from 'nativewind';
import placeholderimg from '../../../assets/placeholder.png'; // Import placeholder image

const Tab = createMaterialTopTabNavigator();

// Dummy data for each item in the category
const dummyItems = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  description: `Description for item ${index + 1}`,
}));

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
              <ScrollView className="flex-1 bg-gray-100 p-4">
                {dummyItems.map(dummyItem => (
                  <View
                    key={dummyItem.id}
                    className="bg-white rounded-lg shadow-md flex-row items-start p-4 mb-4 border border-gray-300"
                    style={{ elevation: 3 }} // Adds shadow effect
                  >
                    <Image
                      source={placeholderimg}
                      className="w-24 h-24 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800 mb-1">{dummyItem.name}</Text>
                      <Text className="text-sm text-gray-600">{dummyItem.description}</Text>
                    </View>
                  </View>
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
