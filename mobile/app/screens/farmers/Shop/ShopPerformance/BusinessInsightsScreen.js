import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

function BussinessInsightsScreen() {
  const primaryColor = '#00B251';

  const [analyticsData, setAnalyticsData] = useState({
    orders: 12,
    sales: 1500,
    conversionRate: 2.5,
    salesPerOrder: 125,
    visitors: 300,
    pageViews: 500,
    realTimeOrders: [5, 10, 3, 8, 2, 6, 7, 4, 5, 6],
    lastUpdated: '23:00',
  });

  const [selectedTab, setSelectedTab] = useState('Sales');


  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 178, 81, ${opacity})`,
    labelColor: () => primaryColor,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-2">
          <Text className="text-gray-500">Order Type</Text>
          <TouchableOpacity className="border rounded-md p-2" style={{ borderColor: primaryColor }}>
            <Text style={{ color: primaryColor }}>Confirmed Order</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-gray-500">Data Period</Text>
          <TouchableOpacity className="border rounded-md p-2" style={{ borderColor: primaryColor }}>
            <Text style={{ color: primaryColor }}>Real-Time</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4">
        <Text className="font-bold mb-2">Key Metrics</Text>
        <Text className="text-gray-500 text-xs">Last updated at {analyticsData.lastUpdated}</Text>

        <View className="flex-row flex-wrap mt-4">
          {[
            { label: 'Orders', value: analyticsData.orders },
            { label: 'Sales(P)', value: analyticsData.sales },
            { label: 'Conversion Rate', value: `${analyticsData.conversionRate}%` },
            { label: 'Sales per Order(P)', value: analyticsData.salesPerOrder },
            { label: 'Visitors', value: analyticsData.visitors },
            { label: 'Page Views', value: analyticsData.pageViews },
          ].map((metric, index) => (
            <View key={index} className="w-1/2 mb-4">
              <Text className="font-bold">{metric.label}</Text>
              <Text>{metric.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text className="font-bold mb-4">Real-Time Orders Trend</Text>
      <Text className="text-center mb-2" style={{ color: primaryColor }}>
        Tap and hold to view data by each period
      </Text>

      <LineChart
        data={{
          labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
          datasets: [{ data: analyticsData.realTimeOrders }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 8 }}
      />

      <Text className="font-bold mt-4 mb-2">Product Rankings</Text>
      <View className="flex-row justify-between mb-4">
        {['Sales', 'Units Sold', 'Page Views'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            className={`pb-2 ${selectedTab === tab ? 'border-b-2 border-green-500' : ''}`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={{ color: primaryColor }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab === 'Sales' && (
        <View>
          <Text className="font-bold mb-2">Sales Data</Text>
          
        </View>
      )}

      {selectedTab === 'Units Sold' && (
        <View>
          <Text className="font-bold mb-2">Units Sold Data</Text>
          
        </View>
      )}

      {selectedTab === 'Page Views' && (
        <View>
          <Text className="font-bold mb-2">Page Views Data</Text>
          
        </View>
      )}
    </ScrollView>
  );
}

export default BussinessInsightsScreen;
