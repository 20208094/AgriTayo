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
    <SafeAreaView className="">
      <View className="">
        {cancelledOrder ? (
          <>
            <Text className="">{cancelledOrder.item}</Text>
            <Text className="">{cancelledOrder.date}</Text>
            <Text className="">{cancelledOrder.reason}</Text>
            <Image className='' source={cancelledOrder.image}/>
          </>
        ) : completedOrder ? (
          <>
            <Text className="">{completedOrder.item}</Text>
            <Text className="">{completedOrder.date}</Text>
            <Text className="">{completedOrder.total}</Text>
            <Image className='' source={completedOrder.image}/>
          </>
        ) : toPayOrder ? (
          <>
            <Text className="">{toPayOrder.item}</Text>
            <Text className="">{toPayOrder.total}</Text>
            <Text className="">{toPayOrder.dueDate}</Text>
            <Image className='' source={toPayOrder.image}/>
          </>
        ) : toReceiveOrder ? (
          <>
            <Text className="">{toReceiveOrder.item}</Text>
            <Text className="">{toReceiveOrder.expectedDate}</Text>
            <Image className='' source={toReceiveOrder.image}/>
          </>
        ) : toShipOrder ? (
          <>
            <Text className="">{toShipOrder.item}</Text>
            <Text className="">{toShipOrder.shippingDate}</Text>
            <Image className='' source={toShipOrder.image}/>
          </>
        ) : (
          <Text>No item available</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default OrderDetailsScreen;
