import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ToPayScreen from './ToPayScreen';
import ToShipScreen from './ToShipScreen';
import ToRecieveScreen from './ToRecieveScreen';
import CompletedScreen from './CompletedScreen';
import CancelledScreen from './CancelledScreen';

const Tab = createMaterialTopTabNavigator();

function OrdersScreen() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;

            switch (route.name) {
              case 'To Pay':
                iconName = 'wallet-outline';
                break;
              case 'To Ship':
                iconName = 'paper-plane-outline';
                break;
              case 'To Recieve':
                iconName = 'cube-outline';
                break;
              case 'Completed':
                iconName = 'checkmark-done-outline';
                break;
              case 'Cancelled':
                iconName = 'close-circle-outline';
                break;
              default:
                iconName = 'ellipse-outline';
                break;
            }

            return <Icon name={iconName} size={20} color={color} />;
          },
          tabBarShowLabel: true,
        })}
        tabBarOptions={{
          showIcon: true,
          activeTintColor: 'green',
          inactiveTintColor: 'gray',
          style: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen
          name="To Pay"
          component={ToPayScreen}
          options={{ tabBarLabel: 'To Pay' }}
        />
        <Tab.Screen
          name="To Ship"
          component={ToShipScreen}
          options={{ tabBarLabel: 'To Ship' }}
        />
        <Tab.Screen
          name="To Recieve"
          component={ToRecieveScreen}
          options={{ tabBarLabel: 'To Receive' }}
        />
        <Tab.Screen
          name="Completed"
          component={CompletedScreen}
          options={{ tabBarLabel: 'Completed' }}
        />
        <Tab.Screen
          name="Cancelled"
          component={CancelledScreen}
          options={{ tabBarLabel: 'Cancelled' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default OrdersScreen;
