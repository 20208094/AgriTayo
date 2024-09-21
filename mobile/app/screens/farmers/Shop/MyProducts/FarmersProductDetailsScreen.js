import React from "react";
import { SafeAreaView, View, Text, Image } from "react-native";

function FarmersProductDetailScreen({ route }) {
  const { soldOutItem, reviewingItem, violationItem, delistedItem } =
    route.params;
  return (
    <SafeAreaView className="">
      <View className="">
        {soldOutItem ? (
          <>
            <Text className="">{soldOutItem.name}</Text>
            <Text className="">{soldOutItem.date}</Text>
            <Image source={soldOutItem.image} className="" />
          </>
        ) : reviewingItem ? (
          <>
            <Text className="">{reviewingItem.name}</Text>
            <Text className="">{reviewingItem.status}</Text>
            <Image source={reviewingItem.image} className="" />
          </>
        ) : violationItem ? (
          <>
            <Text className="">{violationItem.name}</Text>
            <Text className="">{violationItem.violation}</Text>
            <Image source={violationItem.image} className="" />
          </>
        ) : delistedItem ? (
          <>
            <Text className="">{delistedItem.name}</Text>
            <Text className="">{delistedItem.reason}</Text>
            <Image source={delistedItem.image} className="" />
          </>
        ) : (
          <Text>No item available</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default FarmersProductDetailScreen;
