import React from "react";
import { View, Text, ScrollView } from "react-native";

function AccountHealthScreen() {
  const primaryColor = "#00b251";

  const accountHealthData = {
    accountStatus: "Good",
    penaltyPoints: 0,
    ongoingPunishment: 0,
    listingViolations: {
      severe: 0,
      preOrderListingPercentage: 0.0,
      otherViolations: 0,
    },
    fulfillment: {
      nonFulfillmentRate: "-",
      lateShipmentRate: "-",
      preparationTime: "-",
      fastHandoverRate: '-'
    },
  };
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="bg-green-500 p-4 rounded-md mb-4">
        <Text className="text-white text-center text-lg">
          Your account health is
        </Text>
        <Text className="text-white text-center text-2xl font-bold">
          {accountHealthData.accountStatus}
        </Text>
      </View>

      <View className="flex-row justify-between p-4 bg-gray-100 rounded-md mb-4">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: primaryColor }}>
            {accountHealthData.penaltyPoints}
          </Text>
          <Text className="text-gray-500 text-sm">Penalty Points</Text>
          <Text className="text-gray-400 text-xs">
            vs Last Week {accountHealthData.penaltyPoints}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: primaryColor }}>
            {accountHealthData.ongoingPunishment}
          </Text>
          <Text className="text-gray-500 text-sm">Ongoing Punishment</Text>
        </View>
      </View>

      <View className="mb-4">
        <Text className="font-bold mb-2">Listing Violations</Text>
        {[
          {
            label: "Severe Listing Violations",
            value: accountHealthData.listingViolations.severe,
            target: "0",
          },
          {
            label: "Pre-order Listing %",
            value: `${accountHealthData.listingViolations.preOrderListingPercentage}%`,
            target: "<10.00%",
          },
          {
            label: "Other Listing Violations",
            value: accountHealthData.listingViolations.otherViolations,
            target: "0",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between p-4 border-b border-gray-200"
          >
            <View>
              <Text className="font-bold">{item.label}</Text>
              <Text className="text-gray-400">Target: {item.target}</Text>
            </View>
            <Text className="font-bold">{item.value}</Text>
          </View>
        ))}
      </View>

      <View>
        <Text className="font-bold mb-2">Fulfillment</Text>
        {[
          {
            label: "Non-fulfillment Rate",
            value: accountHealthData.fulfillment.nonFulfillmentRate,
            target: "<10.00%",
          },
          {
            label: "Late Shipment Rate",
            value: accountHealthData.fulfillment.lateShipmentRate,
            target: "<10.00%",
          },
          {
            label: "Preparation Time",
            value: accountHealthData.fulfillment.preparationTime,
            target: "<2.00 days",
          },
          {
            label: "Fast Handover Rate",
            value: accountHealthData.fulfillment.fastHandoverRate,
            target: "<30.00 %",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between p-4 border-b border-gray-200"
          >
            <View>
              <Text className="font-bold">{item.label}</Text>
              <Text className="text-gray-400">Target: {item.target}</Text>
            </View>
            <Text className="font-bold">{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default AccountHealthScreen;
