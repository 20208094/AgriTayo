import React, { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Button } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome } from "@expo/vector-icons"; // For the gear icon

const Tab = createMaterialTopTabNavigator();

function MarketAnalyticScreen({ route }) {
  const { category, selectedItemId } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const [selectedFilter, setSelectedFilter] = useState("14 Days");
  const [modalVisible, setModalVisible] = useState(false);

  const getDataForItem = (id, filter) => {
    // Sample data structure for different filters
    const data = {
      "7 Days": {
        months: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        average: [120, 130, 125, 140, 150, 160, 155],
        highest: [140, 150, 145, 160, 170, 180, 175],
        lowest: [100, 110, 105, 120, 130, 140, 135],
      },
      "14 Days": {
        months: ["Week 1", "Week 2", "Week 3", "Week 4"],
        average: [120, 130, 125, 140],
        highest: [140, 150, 145, 160],
        lowest: [100, 110, 105, 120],
      },
      "6 Months": {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        average: [120, 130, 125, 140, 150, 160],
        highest: [140, 150, 145, 160, 170, 180],
        lowest: [100, 110, 105, 120, 130, 140],
      },
      "12 Months": {
        months: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        average: [120, 130, 125, 140, 150, 160, 155, 165, 170, 180, 190, 200],
        highest: [140, 150, 145, 160, 170, 180, 175, 185, 190, 200, 210, 220],
        lowest: [100, 110, 105, 120, 130, 140, 135, 145, 150, 160, 170, 180],
      },
      "Yearly": {
        months: [
          "2020", "2021", "2022", "2023"
        ],
        average: [120, 130, 125, 140],
        highest: [140, 150, 145, 160],
        lowest: [100, 110, 105, 120],
      },
    };

    return data[filter] || data["14 Days"]; // Default to "14 Days" if filter is not found
  };

  const renderAnalyticsChart = (itemId) => {
    const itemData = getDataForItem(itemId, selectedFilter);

    return (
      <LineChart
        data={{
          labels: itemData.months,
          datasets: [
            {
              data: itemData.average,
              color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green for average
              label: "Average",
            },
            {
              data: itemData.highest,
              color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`, // Red for highest
              label: "Highest",
            },
            {
              data: itemData.lowest,
              color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`, // Blue for lowest
              label: "Lowest",
            },
          ],
          legend: ["Average Price", "Highest Price", "Lowest Price"], // Labels for the legend
        }}
        width={screenWidth - 11}
        height={screenWidth * 0.6}
        yAxisLabel="₱"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#000000",
          },
          fillShadowGradient: 'transparent',
          fillShadowGradientOpacity: 0,
          paddingRight: 32,
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 40,
        }}
        fromZero
        segments={6}
        xLabelsOffset={-10}
        yLabelsOffset={10}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
      }}
      initialRouteName={
        category.find((item) => item.id === selectedItemId)?.name ?? category[0]?.name
      }
    >
      {category.map((item) => (
        <Tab.Screen key={item.id} name={item.name}>
          {() => (
            <View className="bg-white p-4 rounded-lg shadow-md">
              <Text className="text-xl font-bold text-green-700 text-center mb-4">
                {item.name.toUpperCase()} SUMMARY
              </Text>

              <Text className="text-sm font-bold text-green-500 mb-2">
                Current Available Listings{" "}
                <Text className="text-green-700">30 Listings</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-2">
                Current Highest Price/Kilo{" "}
                <Text className="text-green-700">₱70/kilo</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-4">
                Current Lowest Price/Kilo{" "}
                <Text className="text-green-700">₱50/kilo</Text>
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="bg-green-500 p-2 rounded-lg flex-row items-center justify-center mb-4"
                style={{ width: "100%", alignItems: "center" }}
              >
                <FontAwesome name="cog" size={18} color="white" />
                <Text className="text-white text-sm ml-2">{selectedFilter} Summary</Text>
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      width: 300,
                      backgroundColor: "white",
                      borderRadius: 10,
                      padding: 20,
                    }}
                  >
                    {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map(
                      (option) => (
                        <Button
                          key={option}
                          title={option}
                          onPress={() => {
                            setSelectedFilter(option);
                            setModalVisible(false);
                          }}
                        />
                      )
                    )}
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                  </View>
                </View>
              </Modal>

              <Text className="text-sm font-bold text-green-500 mb-2">
                Average{" "}
                <Text className="text-green-700">40</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-2">
                Highest Sold Price/Kilo{" "}
                <Text className="text-green-700">₱70/kilo</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-4">
                Lowest Sold Price/Kilo{" "}
                <Text className="text-green-700">₱50/kilo</Text>
              </Text>

              <Text className="text-sm font-bold text-green-700 mb-2">
                Price Movement per Day
              </Text>

              {renderAnalyticsChart(item.id)}
            </View>
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default MarketAnalyticScreen;
