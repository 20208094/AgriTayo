import React from 'react'
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function SpicesCategoryScreen (){
    const spicesCategory = [
        {
            id: 1,
            name: 'Turmeric'
        },
        {
            id: 2,
            name: 'Cumin'
        },
        {
            id: 3, 
            name: 'Pepper'
        },
        {
            id: 4,
            name: 'Cinnamon'
        },
        {
            id: 5,
            name: 'Coriander'
        },
        {
            id: 6,
            name: 'Ginger'
        },
        {
            id: 7,
            name: 'Clove'
        },
        {
            id: 8,
            name: 'Cardamom'
        },
        {
            id: 9,
            name: 'Fennel'
        },
        {
            id: 10,
            name: 'Mustard Seed'
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
            {spicesCategory.map(spice =>
                <Tab.Screen
                key = {spice.id}
                name= {spice.name}
                >
                    {() => (
                        <View></View>
                    )}
                </Tab.Screen>
            )}

        </Tab.Navigator>
    )
}

export default SpicesCategoryScreen