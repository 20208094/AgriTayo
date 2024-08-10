import React from 'react';
import { View } from 'react-native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MarketCategoryScreen({ route }) {
  const { category, selectedItemId } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={category.find(item => item.id === selectedItemId)?.name ?? category[0]?.name}
    >
      {category.map(item => (
        <Tab.Screen key={item.id} name={item.name}>
          {() => <View className=""></View>}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default MarketCategoryScreen;
