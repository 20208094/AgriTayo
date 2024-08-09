import React from "react";
import { View, Text, SafeAreaView } from "react-native";

const Analytics = () => {
  const screenWidth = Dimensions.get("window").width;

  const crops = [
    { month: "Aug 2023", price: 120 },
    { month: "Sep 2023", price: 130 },
    { month: "Oct 2023", price: 110 },
    { month: "Nov 2023", price: 150 },
    { month: "Dec 2023", price: 160 },
    { month: "Jan 2024", price: 170 },
    { month: "Feb 2024", price: 180 },
    { month: "Mar 2024", price: 190 },
    { month: "Apr 2024", price: 200 },
    { month: "May 2024", price: 210 },
    { month: "Jun 2024", price: 220 },
    { month: "Jul 2024", price: 230 },
    { month: "Aug 2024", price: 240 },
  ];

  const labels = crops.map((crop) => crop.month);
  const data = crops.map((crop) => crop.price);

  return (
    <SafeAreaView className="">
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Potato Price Analytics (Aug 2023 - Aug 2024)
        </Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: data,
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
      </View>
    </SafeAreaView>
  );
};

export default Analytics;
