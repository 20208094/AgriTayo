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
                <View key={order.id} className="bg-purple-100 p-4 mb-4 rounded-lg flex-row items-center justify-between">
                    <View>
                        <Text className="text-lg font-bold">{order.item}</Text>
                        <Text className="text-gray-600">Shipping by: {order.shippingDate}</Text>
                    </View>
                    <Icon name="paper-plane" size={24} color="#b366ff" className="ml-2" />
                </View>
            ))}
        </ScrollView>
    )
}

export default ToShipScreen
