import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import OrderItem from './OrderItem';

function ReturnScreen() {
    const orders = [
        { title: 'Order #1227', description: '1 item', date: '2024-08-09', action: 'Process Return' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="p-4">
                {orders.map((order, index) => (
                    <OrderItem key={index} order={order} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export default ReturnScreen;
