import React from "react";
import { View, Text, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart } from "react-native-chart-kit";

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
          datasets: [
            {
              data,
            },
          ],
        }}
        width={screenWidth - 16}
        height={220}
        yAxisLabel="₱"
        chartConfig={{
          backgroundColor: "#00B251",
          backgroundGradientFrom: "#00B251",
          backgroundGradientTo: "#00B251",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#00B251",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
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
        category.find((item) => item.id === selectedItemId)?.name ??
        category[0]?.name
      }
    >
      {category.map((item) => (
        <Tab.Screen key={item.id} name={item.name}>
          {() => (
            <View>
              <Text>Analytics for {item.name}</Text>
              {renderAnalyticsChart(item.id)}
            </View>
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default MarketAnalyticScreen;