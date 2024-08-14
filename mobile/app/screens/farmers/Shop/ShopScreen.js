import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import michael from "../../../assets/ehh.png";

function ShopScreen({ navigation }) {
  const information = {
    id: 1,
    name: "Michael",
    followers: 0,
    verify: "Verified",
    financeBalance: 500,
  };

  return (
    <SafeAreaView className="">
      <View className="">
        <Image source={michael} className="w-24 h-24 rounded-full" />
        <Text className="">{information.name}</Text>
        <TouchableOpacity
          className
          onPress={() => navigation.navigate("View Shop", { information })}
        >
          <Text className="">View Shop</Text>
        </TouchableOpacity>
        <View className="">
          <Text className="">Order Status</Text>
          <TouchableOpacity
            className=""
            onPress={() =>
              navigation.navigate("Sales History", { screen: "Completed" })
            }
          >
            <Text className="">View Sales History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() =>
              navigation.navigate("Sales History", { screen: "To Ship" })
            }
          >
            <Text className="">0</Text>
            <Text className="">To Ship</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() =>
              navigation.navigate("Sales History", { screen: "Cancelled" })
            }
          >
            <Text className="">0</Text>
            <Text className="">Cancelled</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() =>
              navigation.navigate("Sales History", { screen: "Return" })
            }
          >
            <Text className="">0</Text>
            <Text className="">Return</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() =>
              navigation.navigate("Sales History", { screen: "Review" })
            }
          >
            <Text className="">0</Text>
            <Text className="">Review</Text>
          </TouchableOpacity>
        </View>
        <View className="">
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("My Products")}
          >
            <Text className="">My Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("My Finance", { information })}
          >
            <Text className="">My Finance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("")}
          >
            <Text className="">Shop Performance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("")}
          >
            <Text className="">Marketing Centre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("")}
          >
            <Text className="">Seller Programme</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("")}
          >
            <Text className="">Learn and Help</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ShopScreen;
