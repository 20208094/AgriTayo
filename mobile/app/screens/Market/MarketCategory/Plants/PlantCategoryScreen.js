import React from 'react'
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function PlantCategoryScreen ({route}){
    const {plantsCategory, selectedPlantId} = route.params
    return(
       <Tab.Navigator
       screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={plantsCategory.find((plant) => plant.id === selectedPlantId).name}
       >
        {plantsCategory.map(plant =>
            <Tab.Screen
            key = {plant.id}
            name = {plant.name}
            >
                {() => {
                    <View></View>
                }}
            </Tab.Screen>
        )}
       </Tab.Navigator>
    )
}

export default PlantCategoryScreen