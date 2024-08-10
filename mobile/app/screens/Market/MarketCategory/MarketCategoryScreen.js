import React from 'react';
import { View, Text, SafeAreaView } from 'react-native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { styled } from 'nativewind';

const Tab = createMaterialTopTabNavigator();

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
          tabBarIndicatorStyle: { backgroundColor: '#FF6F00' }, // Color for the active tab indicator
          tabBarActiveTintColor: '#FF6F00',
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
              <View className="flex-1 items-center justify-center bg-gray-100 p-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">{item.name}</Text>
                <Text className="text-sm text-gray-600">Placeholder content for {item.name}</Text>
              </View>
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default styled(MarketCategoryScreen);
