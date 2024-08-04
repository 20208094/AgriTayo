import React from 'react'
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function FlowerCategoryScreen (){
    const flowersCategory = [
        {
            id: 1,
            name: "Rose",
        },
        {
            id: 2,
            name: "Tulip",
        },
        {
            id: 3,
            name: "Marigold",
        },
        {
            id: 4,
            name: "Sunflower",
        },
        {
            id: 5,
            name: "Daisy",
        },
        {
            id: 6,
            name: "Lily",
        },
        {
            id: 7,
            name: "Orchid",
        },
        {
            id: 8,
            name: "Daffodil",
        },
        {
            id: 9,
            name: "Chrysanthemum",
        },
        {
            id: 10,
            name: "Peony",
        },
    ]
    return(
        <Tab.Navigator
        screenOptions={{
            swipeEnabled: true,
            tabBarScrollEnabled: true,
            lazy: true,
          }}
        >
            {flowersCategory.map(flower => 
                <Tab.Screen
                key={flower.id}
                name={flower.name}
                >
                    {() => (
                        <View></View>
                    )}
                </Tab.Screen>
            )}
        </Tab.Navigator>
    )
}

export default FlowerCategoryScreen