import React from "react";
import { SafeAreaView, View, Text, Image} from "react-native";

function OrderDetailsScreen({ route }) {
  const {
    cancelledOrder,
    completedOrder,
    toPayOrder,
    toReceiveOrder,  // Corrected name here
    toShipOrder,
  } = route.params;

  return (
    // add ka nalang ng description
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        {cancelledOrder ? (
          <>
            <Image className="w-full h-72 object-cover"source={cancelledOrder.image}/>
            <Text className="text-2xl font-bold text-[#00B251] mt-4">{cancelledOrder.item}</Text>
            <Text className="text-sm text-gray-600">{cancelledOrder.date}</Text>
            <Text className="text-xl font-bold text-red-600">{cancelledOrder.reason}</Text>
          </>
        ) : completedOrder ? (
          <>
            <Image className='w-full h-72 object-cover' source={completedOrder.image}/>
            <Text className="text-2xl font-bold text-[#00B251] mt-4">{completedOrder.item}</Text>
            <Text className="text-sm text-gray-600">{completedOrder.date}</Text>
            <Text className="text-xl font-bold text-green-500">{completedOrder.total}</Text>
          </>
        ) : toPayOrder ? (
          <>
            <Image className='w-full h-72 object-cover' source={toPayOrder.image}/>
            <Text className="text-2xl font-bold text-[#00B251] mt-4">{toPayOrder.item}</Text>
            <Text className="text-xl font-bold text-green-500">{toPayOrder.total}</Text>
            <Text className="text-sm text-gray-600">{toPayOrder.dueDate}</Text>
          </>
        ) : toReceiveOrder ? (
          <>
            <Image className='w-full h-72 object-cover' source={toReceiveOrder.image}/>
            <Text className="text-2xl font-bold text-[#00B251] mt-4">{toReceiveOrder.item}</Text>
            <Text className="text-sm text-gray-600">{toReceiveOrder.expectedDate}</Text>
          </>
        ) : toShipOrder ? (
          <>
            <Image className='w-full h-72 object-cover' source={toShipOrder.image}/>
            <Text className="text-2xl font-bold text-[#00B251] mt-4">{toShipOrder.item}</Text>
            <Text className="text-sm text-gray-600">{toShipOrder.shippingDate}</Text>
          </>
        ) : (
          <Text>No item available</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default OrderDetailsScreen;
