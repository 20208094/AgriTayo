import React from "react";
import { SafeAreaView, View, Text, Image, ScrollView } from "react-native";

function FarmersOrderDetailsScreen({ route }) {
    const { toShipOrder, completedOrder, cancelledOrder, returnOrder, reviewOrder } = route.params;

    const order = toShipOrder || completedOrder || cancelledOrder || returnOrder || reviewOrder;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                {order ? (
                    <>
                        <Image className="w-full h-72 object-cover" source={order.image} />
                        <Text className="text-2xl font-bold text-[#00B251] mt-4">{order.title}</Text>
                        <Text className="text-base my-2 text-gray-800">{order.description}</Text>
                        <Text className="text-sm text-gray-600">Date: {order.date}</Text>
                        <Text className='text-xl font-bold text-[#00B251]'>Price: ₱{order.price}</Text>
                    </>
                ) : (
                    <Text className="text-center text-gray-600">No item available</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default FarmersOrderDetailsScreen;
