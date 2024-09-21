import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const ToShipScreen = () => {
    const orders = [
        { id: '1', item: 'Cabbage Seeds', shippingDate: '2024-09-12' },
        { id: '2', item: 'Onion Seeds', shippingDate: '2024-09-14' },
    ]

    return (
        <ScrollView className="p-4">
            {orders.map((order) => (
                <View key={order.id} className="bg-gray-200 p-4 mb-4 rounded-lg flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold">{order.item}</Text>
                        <Text className="text-gray-600">Shipping by: {order.shippingDate}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default ToShipScreen
