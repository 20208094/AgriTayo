import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styled } from "nativewind";

function FinanceScreen({ route, navigation }) {
    const { information } = route.params;

    return (
        <SafeAreaView className="flex-1 p-4 bg-gray-100">
            <View className="bg-white p-6 rounded-lg shadow-md mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">Total Balance</Text>
                <Text className="text-4xl font-bold text-gray-900 mb-6">₱{information.financeBalance}</Text>
                <TouchableOpacity
                    className="bg-[#00b251] py-3 rounded-lg mb-4"
                    onPress={() => navigation.navigate("TransactionsScreen")}
                >
                    <Text className="text-center text-white font-semibold">Transactions</Text>
                </TouchableOpacity>

                {information.financeBalance <= 0 ? (
                    <TouchableOpacity
                        className="bg-gray-300 py-3 rounded-lg mb-4"
                        disabled={true}
                    >
                        <Text className="text-center text-gray-500 font-semibold">Withdraw</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className="bg-[#00b251] py-3 rounded-lg mb-4"
                        onPress={() => navigation.navigate("WithdrawScreen")}
                    >
                        <Text className="text-center text-white font-semibold">Withdraw</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    className="bg-white py-3 rounded-lg border border-[#00b251]"
                    onPress={() => navigation.navigate("OrderIncomeScreen")}
                >
                    <Text className="text-center text-[#00b251] font-semibold">Order Income</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default styled(FinanceScreen);
