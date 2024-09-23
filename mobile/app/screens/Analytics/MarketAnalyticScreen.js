import React, { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Button } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MarketIcon, NotificationIcon, MessagesIcon } from "../../components/SearchBarC";

const Tab = createMaterialTopTabNavigator();

function MarketAnalyticScreen({ route }) {
  const { category, selectedItemId } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = screenWidth * 0.6;
  const [selectedFilter, setSelectedFilter] = useState("12 Months");
  const [modalVisible, setModalVisible] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: '', date: '', sold: 0 });

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <MarketIcon onPress={() => navigation.navigate("CartScreen")} />
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
        </View>
      ),
    });
  }, [navigation]);

  const getDataForItem = (id, filter) => {
    const data = {
      "7 Days": {
        dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        average: [120, 130, 125, 140, 150, 160, 155],
        highest: [140, 150, 145, 160, 170, 180, 175],
        lowest: [100, 110, 105, 120, 130, 140, 135],
        sold: [30, 25, 28, 22, 35, 40, 38],
      },
      "14 Days": {
        dates: ["Week 1", "Week 2", "Week 3", "Week 4"],
        average: [120, 130, 125, 140],
        highest: [140, 150, 145, 160],
        lowest: [100, 110, 105, 120],
        sold: [200, 250, 220, 280],
      },
      "6 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        average: [120, 130, 125, 140, 150, 160],
        highest: [140, 150, 145, 160, 170, 180],
        lowest: [100, 110, 105, 120, 130, 140],
        sold: [1200, 1300, 1250, 1400, 1500, 1600],
      },
      "12 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        average: [120, 130, 125, 140, 150, 160, 155, 165, 170, 180, 190, 200],
        highest: [140, 150, 145, 160, 170, 180, 175, 185, 190, 200, 210, 220],
        lowest: [100, 110, 105, 120, 130, 140, 135, 145, 150, 160, 170, 180],
        sold: [1200, 1300, 1250, 1400, 1500, 1600, 1550, 1650, 1700, 1800, 1900, 2000],
      },
      "Yearly": {
        dates: ["2020", "2021", "2022", "2023"],
        average: [120, 130, 125, 140],
        highest: [140, 150, 145, 160],
        lowest: [100, 110, 105, 120],
        sold: [5000, 5200, 5100, 5300],
      },
    };

    return data[filter] || data["12 Months"];
  };

  const renderAnalyticsChart = (itemId) => {
    const itemData = getDataForItem(itemId, selectedFilter);

    return (
      <View style={{ position: 'relative' }}>
        <LineChart
          data={{
            labels: itemData.dates,
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
          height={chartHeight}
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
          onDataPointClick={(data) => {
            const index = data.index;
            setTooltip({
              visible: true,
              x: data.x,
              y: data.y,
              value: data.value,
              date: itemData.dates[index],
              sold: itemData.sold[index],
            });
          }}
        />

        {tooltip.visible && (
          <View
            style={{
              position: "absolute",
              top: tooltip.y - 30, // Adjusts the Y position of the tooltip
              left: Math.max(5, Math.min(tooltip.x - 50, screenWidth - 100)),
              backgroundColor: "green",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              padding: 5,
              zIndex: 1000,
              width: 100,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: "bold" }}>₱{tooltip.value}</Text>
            <Text>{tooltip.date}</Text>
            <Text>Sold: {tooltip.sold}</Text>
            <View
              style={{
                position: "absolute",
                bottom: -10, // Position the arrow
                left: "50%",
                marginLeft: -7.5, // Half of the arrow width to center it
                width: 0,
                height: 0,
                borderLeftWidth: 7.5,
                borderRightWidth: 7.5,
                borderTopWidth: 10,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "green", // Adjust color to match tooltip border or background
              }}
            />
          </View>
        )}

      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: true,
        lazy: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00b251",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white", elevation: 3 },
        tabBarIndicatorStyle: {
          backgroundColor: "#00b251",
          height: 4,
          borderRadius: 2,
        }
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
                <View className="flex-1 justify-end">
                  <View className="bg-white p-4 rounded-t-lg shadow-md">
                    <Text className="text-lg font-bold text-center mb-2">Select a filter</Text>
                    {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map((filter) => (
                      <TouchableOpacity
                        key={filter}
                        className={`p-2 rounded-lg ${
                          selectedFilter === filter
                            ? "bg-green-500"
                            : "bg-gray-200"
                        } mb-2`}
                        onPress={() => {
                          setSelectedFilter(filter);
                          setModalVisible(false);
                        }}
                      >
                        <Text
                          className={`text-center ${
                            selectedFilter === filter ? "text-white" : "text-green-700"
                          }`}
                        >
                          {filter}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                  </View>
                </View>
              </Modal>

              <Text className="text-sm font-bold text-green-500 mb-2">
                Average{" "}
                <Text className="text-green-700">₱{getDataForItem(item.id, selectedFilter).average.slice(-1)[0]}</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-2">
                Highest{" "}
                <Text className="text-green-700">₱{getDataForItem(item.id, selectedFilter).highest.slice(-1)[0]}</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-2">
                Lowest{" "}
                <Text className="text-green-700">₱{getDataForItem(item.id, selectedFilter).lowest.slice(-1)[0]}</Text>
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
