import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import OrderItem from './OrderItem';

function CancelledScreen() {
    const orders = [
        { title: 'Order #1229', description: '2 items', date: '2024-08-10', action: 'View Details' },
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

export default CancelledScreen;
