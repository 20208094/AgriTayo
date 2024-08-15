import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import OrderItem from './OrderItem';

function CompletedScreen() {
    const orders = [
        { title: 'Order #1232', description: '3 items', date: '2024-08-13', action: 'View Details' },
        { title: 'Order #1231', description: '1 item', date: '2024-08-12', action: 'View Details' },
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

export default CompletedScreen;
