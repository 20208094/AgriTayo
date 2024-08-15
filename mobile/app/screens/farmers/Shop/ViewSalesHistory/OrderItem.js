import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function OrderItem({ order }) {
    return (
        <View className="flex-row justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm">
            <View>
                <Text className="text-lg font-semibold">{order.title}</Text>
                <Text className="text-gray-500">{order.description}</Text>
                <Text className="text-gray-500">{order.date}</Text>
            </View>
            <TouchableOpacity className="px-4 py-2 bg-[#00B251] rounded-full">
                <Text className="text-white">{order.action}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default OrderItem;
