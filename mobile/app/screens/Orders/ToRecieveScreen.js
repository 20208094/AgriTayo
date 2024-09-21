import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const ToReceiveScreen = () => {
    const orders = [
        { id: '1', item: 'Rice Seeds', expectedDate: '2024-09-15' },
        { id: '2', item: 'Wheat Seeds', expectedDate: '2024-09-17' },
    ]

    return (
        <ScrollView className="p-4">
            {orders.map((order) => (
                <View key={order.id} className="bg-gray-200 p-4 mb-4 rounded-lg flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold">{order.item}</Text>
                        <Text className="text-gray-600">Expected by: {order.expectedDate}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default ToReceiveScreen
