import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native';
import ToPayScreen from './ToPayScreen';
import ToShipScreen from './ToShipScreen';

function OrdersScreen(){
    const Tab = createMaterialTopTabNavigator()
    return(
        <NavigationContainer independent={true}>
            <Tab.Navigator>
                <Tab.Screen name='To Pay' component={ToPayScreen}/>
                <Tab.Screen name='To Ship' component={ToShipScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default OrdersScreen