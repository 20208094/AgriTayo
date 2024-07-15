import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native';
import ToPayScreen from './ToPayScreen';
import ToShipScreen from './ToShipScreen';
import ToRecieveScreen from './ToRecieveScreen';
import CompletedScreen from './CompletedScreen';
import CancelledScreen from './CancelledScreen';

function OrdersScreen(){
    const Tab = createMaterialTopTabNavigator()
    return(
        <NavigationContainer independent={true}>
            <Tab.Navigator>
                <Tab.Screen name='To Pay' component={ToPayScreen}/>
                <Tab.Screen name='To Ship' component={ToShipScreen}/>
                <Tab.Screen name='To Recieve' component={ToRecieveScreen}/>
                <Tab.Screen name='Completed' component={CompletedScreen}/>
                <Tab.Screen name='Cancelled' component={CancelledScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default OrdersScreen