import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const CancelledScreen = () => {
    const orders = [
        { id: '1', item: 'Carrot Seeds', date: '2024-09-01', reason: 'Out of stock' },
        { id: '2', item: 'Potato Seeds', date: '2024-09-02', reason: 'Payment failure' },
    ]

    return (
        <ScrollView className="p-4">
            {orders.map((order) => (
                <View key={order.id} className="bg-gray-200 p-4 mb-4 rounded-lg flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold">{order.item}</Text>
                        <Text className="text-gray-600">Cancelled on: {order.date}</Text>
                        <Text className="text-green-600">Reason: {order.reason}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default CancelledScreen
