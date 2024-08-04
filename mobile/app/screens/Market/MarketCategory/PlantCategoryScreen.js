import React from 'react'
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function PlantCategoryScreen (){
    const plantsCategory = [
        {
            id: 1,
            name: "Spider Plant",
        },
        {
            id: 2,
            name: "Aloe Vera",
        },
        {
            id: 3,
            name: "Rose",
        },
        {
            id: 4,
            name: "Lavender",
        },
        {
            id: 5,
            name: "Snake Plant",
        },
        {
            id: 6,
            name: "Peace Lily",
        },
        {
            id: 7,
            name: "Pothos",
        },
        {
            id: 8,
            name: "Jade Plant",
        },
        {
            id: 9,
            name: "Hibiscus",
        },
        {
            id: 10,
            name: "Bamboo Plant"
        }
    ]
    return(
       <Tab.Navigator
       screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
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