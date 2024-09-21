import React from "react";
import { SafeAreaView, View, Text, Image} from "react-native";

function FarmersOrderDetailsScreen({ route }) {
  const { toShipOrder, completedOrder, cancelledOrder, returnOrder, reviewOrder } = route.params;
  return (
    // palagyan ako ng description
    <SafeAreaView className="">
      <View className="">
        {toShipOrder ? (
          <>
            <Text className="">{toShipOrder.title}</Text>
            <Text className="">{toShipOrder.description}</Text>
            <Text className="">{toShipOrder.date}</Text>
            <Image className='' source={toShipOrder.image}/>
          </>
        ) : completedOrder ? (
          <>
            <Text className="">{completedOrder.title}</Text>
            <Text className="">{completedOrder.description}</Text>
            <Text className="">{completedOrder.date}</Text>
            <Image className='' source={completedOrder.image}/>
          </>
        ) : cancelledOrder ? (
          <>
            <Text className="">{cancelledOrder.title}</Text>
            <Text className="">{cancelledOrder.description}</Text>
            <Text className="">{cancelledOrder.date}</Text>
            <Text className="">{cancelledOrder.reason}</Text>
            <Image className='' source={cancelledOrder.image}/>
          </>
        ) : returnOrder ? (
          <>
            <Text className="">{returnOrder.title}</Text>
            <Text className="">{returnOrder.description}</Text>
            <Text className="">{returnOrder.date}</Text>
            <Image className='' source={returnOrder.image}/>
          </>
           ) : reviewOrder ? (
            <>
              <Text className="">{reviewOrder.title}</Text>
              <Text className="">{reviewOrder.description}</Text>
              <Text className="">{reviewOrder.date}</Text>
              <Image className='' source={reviewOrder.image}/>
            </>
        ) : (
          <Text>No item available</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default FarmersOrderDetailsScreen;
