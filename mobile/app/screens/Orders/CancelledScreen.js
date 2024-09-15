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
                <View key={order.id} className="bg-red-100 p-4 mb-4 rounded-lg flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold">{order.item}</Text>
                        <Text className="text-gray-600">Cancelled on: {order.date}</Text>
                        <Text className="text-red-600">Reason: {order.reason}</Text>
                    </View>
                    <Icon name="close-circle" size={24} color="#ff4d4d" className="ml-2" />
                </View>
            ))}
        </ScrollView>
    )
}

export default CancelledScreen
