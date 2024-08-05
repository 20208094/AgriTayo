import React from 'react'
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function SpicesCategoryScreen ({route}){
    const {spicesCategory, selectedSpiceId} = route.params
    return(
        <Tab.Navigator
        screenOptions={{
            swipeEnabled: true,
            tabBarScrollEnabled: true,
            lazy: true,
          }}
          initialRouteName={spicesCategory.find((spice) => spice.id == selectedSpiceId).name}
        >
            {spicesCategory.map(spice =>
                <Tab.Screen
                key = {spice.id}
                name= {spice.name}
                >
                    {() => (
                        <View className=''>
                            
                        </View>
                    )}
                </Tab.Screen>
            )}

        </Tab.Navigator>
    )
}

export default SpicesCategoryScreen