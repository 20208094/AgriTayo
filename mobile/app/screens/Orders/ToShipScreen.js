import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import placeholderimg from '../../assets/placeholder.png'; // Ensure the correct path for the placeholder image

const ToShipScreen = ({ navigation }) => {  
    const toShipOrders = [
        { id: '1', item: 'Cabbage Seeds', shippingDate: '2024-09-12', image: placeholderimg },
        { id: '2', item: 'Onion Seeds', shippingDate: '2024-09-14', image: placeholderimg },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="p-4">
                {toShipOrders.map((toShipOrder) => (
                    <TouchableOpacity
                        key={toShipOrder.id}  
                        className="bg-white p-4 mb-4 rounded-lg shadow-lg flex-row items-center"
                        onPress={() => navigation.navigate('Order Details', { toShipOrder })}  
                    >
                        <Image source={toShipOrder.image} className="w-16 h-16 rounded-lg mr-4" /> 
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">{toShipOrder.item}</Text>
                            <Text className="text-sm text-green-600">Shipping by: {toShipOrder.shippingDate}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ToShipScreen;
