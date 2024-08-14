import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

function FinanceScreen({route, navigation}) {
    
    const { information } = route.params;
    console.log("FinanceScreen information:", information);
  return (
    <SafeAreaView className="">
      <View className="">
        <Text className="">Total Balance</Text>
        <TouchableOpacity className="" onPress={() => navigation.navigate("")}>
          <Text className="">Transactions</Text>
        </TouchableOpacity>
        <Text className="">₱{information.financeBalance}</Text>
        {information.financeBalance <= 0 ? (
          <TouchableOpacity className="" disabled={true}>
            <Text className="">Withdraw</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate("")}
          >
            <Text className="">Withdraw</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="" onPress={() => navigation.navigate("")}>
          <Text className="">Order Income</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default FinanceScreen;
