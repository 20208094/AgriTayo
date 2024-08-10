import React from "react";
import { View, Text, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome } from "@expo/vector-icons"; // For the gear icon

const Tab = createMaterialTopTabNavigator();

function MarketAnalyticScreen({ route }) {
  const { category, selectedItemId } = route.params;
  const screenWidth = Dimensions.get("window").width;

  const getDataForItem = (id) => {
    const data = {
      1: [
        { month: "Aug", price: 120 },
        { month: "Sep", price: 130 },
        { month: "Oct", price: 125 },
        { month: "Nov", price: 140 },
        { month: "Dec", price: 150 },
        { month: "Jan", price: 160 },
        { month: "Feb", price: 155 },
        { month: "Mar", price: 165 },
        { month: "Apr", price: 170 },
        { month: "May", price: 180 },
        { month: "Jun", price: 190 },
        { month: "Jul", price: 200 },
        { month: "Aug", price: 210 },
      ],
      2: [
        { month: "Aug", price: 110 },
        { month: "Sep", price: 115 },
        { month: "Oct", price: 120 },
        { month: "Nov", price: 125 },
        { month: "Dec", price: 130 },
        { month: "Jan", price: 135 },
        { month: "Feb", price: 140 },
        { month: "Mar", price: 145 },
        { month: "Apr", price: 150 },
        { month: "May", price: 155 },
        { month: "Jun", price: 160 },
        { month: "Jul", price: 165 },
        { month: "Aug", price: 170 },
      ],
      3: [
        { month: "Aug", price: 100 },
        { month: "Sep", price: 105 },
        { month: "Oct", price: 110 },
        { month: "Nov", price: 115 },
        { month: "Dec", price: 120 },
        { month: "Jan", price: 125 },
        { month: "Feb", price: 130 },
        { month: "Mar", price: 135 },
        { month: "Apr", price: 140 },
        { month: "May", price: 145 },
        { month: "Jun", price: 150 },
        { month: "Jul", price: 155 },
        { month: "Aug", price: 160 },
      ],
      4: [
        { month: "Aug", price: 130 },
        { month: "Sep", price: 135 },
        { month: "Oct", price: 140 },
        { month: "Nov", price: 145 },
        { month: "Dec", price: 150 },
        { month: "Jan", price: 155 },
        { month: "Feb", price: 160 },
        { month: "Mar", price: 165 },
        { month: "Apr", price: 170 },
        { month: "May", price: 175 },
        { month: "Jun", price: 180 },
        { month: "Jul", price: 185 },
        { month: "Aug", price: 190 },
      ],
      5: [
        { month: "Aug", price: 140 },
        { month: "Sep", price: 145 },
        { month: "Oct", price: 150 },
        { month: "Nov", price: 155 },
        { month: "Dec", price: 160 },
        { month: "Jan", price: 165 },
        { month: "Feb", price: 170 },
        { month: "Mar", price: 175 },
        { month: "Apr", price: 180 },
        { month: "May", price: 185 },
        { month: "Jun", price: 190 },
        { month: "Jul", price: 195 },
        { month: "Aug", price: 200 },
      ],
      6: [
        { month: "Aug", price: 150 },
        { month: "Sep", price: 155 },
        { month: "Oct", price: 160 },
        { month: "Nov", price: 165 },
        { month: "Dec", price: 170 },
        { month: "Jan", price: 175 },
        { month: "Feb", price: 180 },
        { month: "Mar", price: 185 },
        { month: "Apr", price: 190 },
        { month: "May", price: 195 },
        { month: "Jun", price: 200 },
        { month: "Jul", price: 205 },
        { month: "Aug", price: 210 },
      ],
      7: [
        { month: "Aug", price: 160 },
        { month: "Sep", price: 165 },
        { month: "Oct", price: 170 },
        { month: "Nov", price: 175 },
        { month: "Dec", price: 180 },
        { month: "Jan", price: 185 },
        { month: "Feb", price: 190 },
        { month: "Mar", price: 195 },
        { month: "Apr", price: 200 },
        { month: "May", price: 205 },
        { month: "Jun", price: 210 },
        { month: "Jul", price: 215 },
        { month: "Aug", price: 220 },
      ],
      8: [
        { month: "Aug", price: 170 },
        { month: "Sep", price: 175 },
        { month: "Oct", price: 180 },
        { month: "Nov", price: 185 },
        { month: "Dec", price: 190 },
        { month: "Jan", price: 195 },
        { month: "Feb", price: 200 },
        { month: "Mar", price: 205 },
        { month: "Apr", price: 210 },
        { month: "May", price: 215 },
        { month: "Jun", price: 220 },
        { month: "Jul", price: 225 },
        { month: "Aug", price: 230 },
      ],
      9: [
        { month: "Aug", price: 180 },
        { month: "Sep", price: 185 },
        { month: "Oct", price: 190 },
        { month: "Nov", price: 195 },
        { month: "Dec", price: 200 },
        { month: "Jan", price: 205 },
        { month: "Feb", price: 210 },
        { month: "Mar", price: 215 },
        { month: "Apr", price: 220 },
        { month: "May", price: 225 },
        { month: "Jun", price: 230 },
        { month: "Jul", price: 235 },
        { month: "Aug", price: 240 },
      ],
      10: [
        { month: "Aug", price: 190 },
        { month: "Sep", price: 195 },
        { month: "Oct", price: 200 },
        { month: "Nov", price: 205 },
        { month: "Dec", price: 210 },
        { month: "Jan", price: 215 },
        { month: "Feb", price: 220 },
        { month: "Mar", price: 225 },
        { month: "Apr", price: 230 },
        { month: "May", price: 235 },
        { month: "Jun", price: 240 },
        { month: "Jul", price: 245 },
        { month: "Aug", price: 250 },
      ],
    };
    return data[id];
  };

  const renderAnalyticsChart = (itemId) => {
    const itemData = getDataForItem(itemId);
    const labels = itemData.map((item) => item.month);
    const data = itemData.map((item) => item.price);

    return (
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 32} // Responsive width with some padding
        height={screenWidth * 0.6} // Adjusted height to be more responsive
        yAxisLabel="₱"
        yAxisSuffix="" // Remove any suffix if necessary
        yAxisInterval={1} // Sets the gap between each label on the y-axis
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0, // No decimals in price
          color: (opacity = 1) => `rgba(0, 178, 81, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#000000",
          },
          fillShadowGradient: `rgba(0, 178, 81, 0.3)`,
          fillShadowGradientOpacity: 1,
          paddingRight: 32, // Additional padding for y-axis labels
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 32, // Add padding to prevent overlay on y-axis
        }}
        formatYLabel={(value) => `${value}`} // Formats y-axis labels with "₱"
        fromZero // Starts y-axis from zero
        segments={6} // Number of segments on the Y-axis (adjust for more granularity)
        xLabelsOffset={-10} // Adjust this if your X-axis labels are cut off
        yLabelsOffset={2} // Ensure y-axis labels are not cut off
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

              <View
                className="bg-green-500 p-2 rounded-lg flex-row items-center justify-center mb-4"
                style={{ width: "100%", alignItems: "center" }}
              >
                <FontAwesome name="cog" size={18} color="white" />
                <Text className="text-white text-sm ml-2">14 Days Summary</Text>
              </View>

              <Text className="text-sm font-bold text-green-500 mb-2">
                Total bought{" "}
                <Text className="text-green-700">500 KG</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-2">
                Highest Price/Kilo{" "}
                <Text className="text-green-700">₱70/kilo</Text>
              </Text>
              <Text className="text-sm font-bold text-green-500 mb-4">
                Lowest Price/Kilo{" "}
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
