import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const CompletedScreen = () => {
    const orders = [
        { id: '1', item: 'Tomato Seeds', date: '2024-08-29', total: '₱120' },
        { id: '2', item: 'Lettuce Seeds', date: '2024-08-25', total: '₱85' },
    ]

    return (
        <ScrollView className="p-4">
            {orders.map((order) => (
                <View key={order.id} className="bg-gray-200 p-4 mb-4 rounded-lg flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold">{order.item}</Text>
                        <Text className="text-gray-600">Completed on: {order.date}</Text>
                        <Text className="text-green-600">Total: {order.total}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default CompletedScreen
