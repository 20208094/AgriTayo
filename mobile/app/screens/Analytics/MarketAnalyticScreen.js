import React, { useState, useCallback } from "react";
import { View, Text, Dimensions, TouchableOpacity, Modal, Button, ScrollView, SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LineChart } from "react-native-chart-kit";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MarketIcon, NotificationIcon, MessagesIcon } from "../../components/SearchBarC";
import LoadingAnimation from "../../components/LoadingAnimation";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import moment from 'moment';
import { useEffect } from "react";

const Tab = createMaterialTopTabNavigator();

function MarketAnalyticScreen({ route }) {
  const { categoryId, subcategoryId, varietyId } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = screenWidth * 0.6;
  const [selectedFilter, setSelectedFilter] = useState("7 Days");
  const [modalVisible, setModalVisible] = useState(false);
  const [varietyFilterModalVisible, setVarietyFilterModalVisible] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: '', date: '', sold: 0 });
  const [varietyData, setVarietyData] = useState([]);
  const [soldInVarietyData, setSoldInVarietyData] = useState([]);
  const [varietyList, setVarietyList] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState('All Variety');
  const [filteredVarietyData, setFilteredVarietyData] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highestData, setHighestData] = useState('');
  const [lowestData, setLowestData] = useState('');
  const [averageData, setAverageData] = useState('');
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const [cropsResponse, categoryResponse, subcategoryResponse, varietyResponse, ordersResponse, orderProductsResponse] = await Promise.all([
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, { headers: { "x-api-key": REACT_NATIVE_API_KEY } }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, { headers: { "x-api-key": REACT_NATIVE_API_KEY } }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, { headers: { "x-api-key": REACT_NATIVE_API_KEY } }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`, { headers: { "x-api-key": REACT_NATIVE_API_KEY } }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/orders`, { headers: { "x-api-key": REACT_NATIVE_API_KEY } }),
        fetch(`${REACT_NATIVE_API_BASE_URL}/api/order_products`, { headers: { "x-api-key": REACT_NATIVE_API_KEY } }),
      ]);
      const crops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const subcategoriesFiltered = subcategories.find(subcat => Number(subcat.crop_sub_category_id) === Number(subcategoryId));
      setSelectedSubcategory(subcategoriesFiltered)
      const varieties = await varietyResponse.json();
      const orders = await ordersResponse.json();
      const orderProducts = await orderProductsResponse.json();
      // filter crops to only include crops thats in the variety chosen
      const cropsFiltered = crops.filter(crop => Number(crop.sub_category_id) === Number(subcategoryId));
      // filter variety to only include variety thats in the subcategory chosen
      const varietiesComplete = varieties.filter(variety => Number(variety.crop_sub_category_id) === Number(subcategoryId));
      const cropVarietyNames = ["All Variety"]
        .concat(varietiesComplete.map(variety => variety.crop_variety_name));
      // combine orderProducts inside the orders table
      const varietiesFiltered = varietiesComplete.map(variety => {
        // Filter crops for the current variety
        const availableCrops = cropsFiltered.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
        // If there are no available crops, set defaults to null
        if (availableCrops.length === 0) {
          return {
            ...variety,
            availableListing: 0, // Set count to 0 if no available crops
            highestListing: 0,
            lowestListing: 0,
          };
        }
        // Find the highest and lowest price crops
        const highestCrop = availableCrops.reduce((max, crop) => (crop.crop_price > max.crop_price ? crop : max), availableCrops[0]);
        const lowestCrop = availableCrops.reduce((min, crop) => (crop.crop_price < min.crop_price ? crop : min), availableCrops[0]);
        return {
          ...variety,
          availableListing: availableCrops.length,
          highestListing: highestCrop,
          lowestListing: lowestCrop,
        };
      });
      // filter orders to rate and completed only
      const ordersFiltered = orders.filter(order => Number(order.status_id) === 7 || Number(order.status_id) === 8);
      // combine crop data inside orderProducts
      const combinedOrderProds = orderProducts.map(orderProd => {
        const cropData = crops.find(crop => crop.crop_id === orderProd.order_prod_crop_id);
        return {
          ...orderProd,
          crop: cropData ? cropData : null,
          var_id: cropData ? cropData.crop_variety_id : null,
        };
      });
      // combine orderProducts inside the orders table
      const combinedOrders = ordersFiltered.map(order => {
        const orderProductsData = combinedOrderProds.filter(ordProd => ordProd.order_id === order.order_id);
        return {
          ...order,
          order_products: orderProductsData ? orderProductsData : null,
        };
      });
      // extract crop id with total weight sold and total price sold
      const productDetailsArray = combinedOrders.flatMap(order =>
        order.order_products ?
          order.order_products.map(product => ({
            order_prod_id: product.order_prod_id,
            crop_id: product.order_prod_crop_id,
            total_weight: product.order_prod_total_weight,
            total_price: product.order_prod_total_price,
            order_date: order.order_date,
            variety_id: product.var_id,
          }))
          : []
      );
      // filter the productdetailsarray so that only those who are in the same variety will stay
      const filteredProductDetailsArray = productDetailsArray.filter(product =>
        cropsFiltered.some(crop => crop.crop_id === product.crop_id)
      );
      // Combine data with the same variety_id and order_date
      const combinedProductDetailsArray = filteredProductDetailsArray.reduce((acc, product) => {
        // Create a unique key based on variety_id and order_date
        const key = `${product.variety_id}_${new Date(product.order_date).toISOString()}`;

        const pricePerWeight = product.total_price / product.total_weight;

        if (!acc[key]) {
          // If the key doesn't exist, create a new entry
          acc[key] = {
            variety_id: product.variety_id,
            order_date: product.order_date,
            total_price: product.total_price,
            total_weight: product.total_weight,
            highest: pricePerWeight, // Initialize highest price per weight
            lowest: pricePerWeight,  // Initialize lowest price per weight
            sum_price_per_weight: pricePerWeight, // Used to calculate average
            count: 1, // Used to keep track of the number of entries for average
          };
        } else {
          // If the key exists, accumulate the total_price and total_weight
          acc[key].total_price += product.total_price;
          acc[key].total_weight += product.total_weight;
          // Update highest and lowest price per weight
          acc[key].highest = Math.max(acc[key].highest, pricePerWeight);
          acc[key].lowest = Math.min(acc[key].lowest, pricePerWeight);
          // Accumulate sum for average calculation and increment count
          acc[key].sum_price_per_weight += pricePerWeight;
          acc[key].count += 1;
        }
        return acc;
      }, {});

      // After reduce, calculate the average for each entry
      const combinedProductDetails = Object.values(combinedProductDetailsArray).map(item => ({
        ...item,
        average: item.sum_price_per_weight / item.count, // Calculate average price per weight
      }));

      // Initialize "All Variety" data
      let allVariety = {
        crop_variety_name: "All Variety",
        crop_variety_id: 0,
        crop_variety_description: "Combined data of all varieties.",
        crop_variety_image_url: "https://placeholder.com/all-variety.png",
        availableListing: 0,
        highestListing: {
          crop_price: 0,
          crop_quantity: 0,
          crop_rating: null,
        },
        lowestListing: {
          crop_price: Infinity,
          crop_quantity: 0,
          crop_rating: null,
        },
      };

      // Calculate combined values
      varietiesFiltered.forEach((variety) => {
        allVariety.availableListing += variety.availableListing;

        // Update highest listing
        if (variety.highestListing) {
          allVariety.highestListing.crop_price = Math.max(
            allVariety.highestListing.crop_price,
            variety.highestListing.crop_price
          );
          allVariety.highestListing.crop_quantity += variety.highestListing.crop_quantity;
        }

        // Update lowest listing
        if (variety.lowestListing) {
          allVariety.lowestListing.crop_price = Math.min(
            allVariety.lowestListing.crop_price,
            variety.lowestListing.crop_price
          );
          allVariety.lowestListing.crop_quantity += variety.lowestListing.crop_quantity;
        }
      });

      // If no valid lowest price exists, set it to 0
      if (allVariety.lowestListing.crop_price === Infinity) {
        allVariety.lowestListing.crop_price = 0;
      }

      // Add the "All Variety" entry to the array
      varietiesFiltered.unshift(allVariety);

      setSoldInVarietyData(combinedProductDetails);
      setVarietyData(varietiesFiltered);
      setVarietyList(cropVarietyNames);
      replaceSelectedVarietyData(selectedVariety);
      varietiesFiltered.map(variety => {
        if (variety.crop_variety_name === selectedVariety) {
          setFilteredVarietyData(variety);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      const intervalId = setInterval(() => {
        fetchData();
      }, 10000);

      return () => {
        clearInterval(intervalId);
      };
    }, [categoryId, subcategoryId, varietyId, selectedVariety])
  );

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

  // REPLACE CONTENT OF FILTERED VARIETY DATA
  const replaceSelectedVarietyData = (variety_name) => {
    setSelectedVariety(variety_name)
    varietyData.map(variety => {
      if (variety.crop_variety_name === variety_name) {
        setFilteredVarietyData(variety);
      }
    });
  }

  const calculateDateRange = (filter) => {
    const today = moment();
    let startDate;
    switch (filter) {
      case "7 Days":
        startDate = moment().subtract(6, 'days').startOf('day');
        break;
      case "14 Days":
        startDate = moment().subtract(13, 'days').startOf('day');
        break;
      case "1 Month":
        startDate = moment().subtract(1, 'months').startOf('day');
        break;
      case "3 Months":
        startDate = moment().subtract(3, 'months').startOf('day');
        break;
      case "6 Months":
        startDate = moment().subtract(6, 'months').startOf('day');
        break;
      case "9 Months":
        startDate = moment().subtract(9, 'months').startOf('day');
        break;
      case "12 Months":
        startDate = moment().subtract(12, 'months').startOf('day');
        break;
      default:
        startDate = moment().subtract(6, 'days').startOf('day'); // Default to 7 days
    }
    return { startDate, today };
  };

  const getDataForItem = (id, filter) => {
    // Calculate date range based on the filter
    const { startDate, today } = calculateDateRange(filter);
    // Generate all dates between startDate and today
    const dateRange = [];
    let currentDate = moment(startDate);
    while (currentDate.isSameOrBefore(today)) {
      dateRange.push(currentDate.clone());
      currentDate = currentDate.add(1, 'days'); // Add day by day
    }
    // Filter data based on the variety_id and the selected date range
    const itemData = soldInVarietyData.filter(product => {
      if (id === 0) {
        return moment(product.order_date).isBetween(startDate, today, null, '[]');
      } else {
        return (
          product.variety_id === id &&
          moment(product.order_date).isBetween(startDate, today, null, '[]')
        );
      }
    });

    // Create a mapping of order dates to product data
    const dataMap = itemData.reduce((acc, product) => {
      const formattedDate = moment(product.order_date).format('MM/DD/YYYY');
      acc[formattedDate] = acc[formattedDate] || {
        totalPrice: 0,
        totalWeight: 0,
        highest: product.highest,
        lowest: product.lowest,
        count: 0
      };
      acc[formattedDate].totalPrice += product.total_price;
      acc[formattedDate].totalWeight += product.total_weight;
      acc[formattedDate].highest = Math.max(acc[formattedDate].highest, product.highest);
      acc[formattedDate].lowest = Math.min(acc[formattedDate].lowest, product.lowest);
      acc[formattedDate].count++;
      return acc;
    }, {});

    // Aggregation logic based on the filter
    const aggregateData = (dateRange, groupByDays) => {
      const aggregatedDates = [];
      const aggregatedAverage = [];
      const aggregatedHighest = [];
      const aggregatedLowest = [];
      const aggregatedSold = [];

      let currentPeriod = [];
      dateRange.forEach((date, index) => {
        currentPeriod.push(date);
        // If we reached the end of the period or the end of the date range
        if (currentPeriod.length === groupByDays || index === dateRange.length - 1) {
          let totalWeight = 0, totalPrice = 0, highest = null, lowest = null, count = 0;
          currentPeriod.forEach(periodDate => {
            const formattedPeriodDate = moment(periodDate).format('MM/DD/YYYY');
            if (dataMap[formattedPeriodDate]) {
              // Extract values and check for nulls before updating
              const { totalWeight: weight, totalPrice: price, highest: periodHighest, lowest: periodLowest, count: periodCount } = dataMap[formattedPeriodDate];

              if (weight !== null) totalWeight += weight;
              if (price !== null) totalPrice += price;
              if (periodHighest !== null) highest = highest === null ? periodHighest : Math.max(highest, periodHighest);
              if (periodLowest !== null) lowest = lowest === null ? periodLowest : Math.min(lowest, periodLowest);
              if (periodCount !== null) count += periodCount;
            }
          });
          // Calculate average only if totalWeight > 0 to avoid division by zero
          const average = totalWeight > 0 ? totalPrice / totalWeight : null;
          let aggregatedDate;
          // Format the date label based on the filter
          switch (filter) {
            case "7 Days":
              aggregatedDate = currentPeriod[0].format('ddd'); // Day of the week
              break;
            case "14 Days":
              aggregatedDate = currentPeriod[0].format('MMM D'); // Month and day
              break;
            case "1 Month":
              aggregatedDate = `${currentPeriod[0].format('MMM DD')}`;
              break;
            case "3 Months":
              aggregatedDate = `${currentPeriod[0].format('MMM DD')}`; // Month and week number
              break;
            case "6 Months":
              aggregatedDate = `${currentPeriod[0].format('MMM YY')}`; // Month and Year
              break;
            case "9 Months":
              aggregatedDate = `${currentPeriod[0].format('MMM YY')}`; // Month and Year
              break;
            case "12 Months":
              aggregatedDate = `${currentPeriod[0].format('MMM YY')}`; // Month and Year
              break;
            default:
              aggregatedDate = currentPeriod[0].format('ddd'); // Default to day of the week
          }
          aggregatedDates.push(aggregatedDate);
          aggregatedAverage.push(average !== null ? average : null);
          aggregatedHighest.push(highest !== null ? highest : null);
          aggregatedLowest.push(lowest !== null ? lowest : null);
          aggregatedSold.push(totalWeight > 0 ? totalWeight : null);
          currentPeriod = []; // Reset for the next period
        }
      });

      return { aggregatedDates, aggregatedAverage, aggregatedHighest, aggregatedLowest, aggregatedSold };
    };

    // Define the groupByDays depending on the filter
    let groupByDays;
    switch (filter) {
      case "7 Days":
        groupByDays = 1; // No aggregation, keep daily data
        break;
      case "14 Days":
        groupByDays = 2; // Combine every 2 days
        break;
      case "1 Month":
        groupByDays = 7; // Combine weekly
        break;
      case "3 Months":
        groupByDays = 15; // Combine every 15 days
        break;
      case "6 Months":
      case "9 Months":
        groupByDays = 30; // Combine monthly
        break;
      case "12 Months":
        groupByDays = 60; // Combine every 2 months
        break;
      default:
        groupByDays = 1; // Default to daily
    }
    const { aggregatedDates, aggregatedAverage, aggregatedHighest, aggregatedLowest, aggregatedSold } = aggregateData(dateRange, groupByDays);
    function calculateAverage(array) {
      let filteredArray = array.filter(val => val !== null);
      let sum = filteredArray.reduce((acc, val) => acc + val, 0);
      return sum / filteredArray.length;
    }
    // Helper function to calculate the maximum of an array (ignoring null values)
    function calculateMax(array) {
      return Math.max(...array.filter(val => val !== null));
    }
    // Helper function to calculate the minimum of an array (ignoring null values)
    function calculateMin(array) {
      return Math.min(...array.filter(val => val !== null));
    }
    // Calculate overall values and format to two decimals
    let overallAverage = parseFloat(calculateAverage(aggregatedAverage)).toFixed(2);
    let overallHighest = parseFloat(calculateMax(aggregatedHighest)).toFixed(2);
    let overallLowest = parseFloat(calculateMin(aggregatedLowest)).toFixed(2);

    let printAverage, printHighest, printLowest;
    // Replace nulls with calculated values, formatted to two decimals
    printAverage = aggregatedAverage.map(val => val === null ? overallAverage : parseFloat(val).toFixed(2));
    printHighest = aggregatedHighest.map(val => val === null ? overallHighest : parseFloat(val).toFixed(2));
    printLowest = aggregatedLowest.map(val => val === null ? overallLowest : parseFloat(val).toFixed(2));
    return {
      dates: aggregatedDates, average: aggregatedAverage, highest: aggregatedHighest, lowest: aggregatedLowest, averagep: printAverage, highestp: printHighest, lowestp: printLowest, sold: aggregatedSold,
    };
  };

  const renderAnalyticsChart = (itemId) => {
    const itemData = getDataForItem(itemId, selectedFilter);
    if (itemData.dates.length === 0) {
      return <Text>No data available for this variety.</Text>;
    }
    // Calculate min and max values for the Y-axis
    const allValues = [
      ...itemData.average.filter(value => value !== null),
      ...itemData.highest.filter(value => value !== null),
      ...itemData.lowest.filter(value => value !== null)
    ];
    const minValue = Math.floor(Math.min(...allValues)) - 2;
    const maxValue = Math.ceil(Math.max(...allValues)) + 2;
    // Determine verticalLabelRotation based on selectedFilter
    const verticalLabelRotation = ["1 Month", "3 Months", "6 Months", "9 Months", "12 Months"].includes(selectedFilter) ? 45 : 0;

    return (
      <View className="">
        <LineChart
          data={{
            labels: itemData.dates,
            datasets: [
              {
                data: itemData.lowest,
                color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                label: "Lowest",
              },
              {
                data: itemData.highest,
                color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`,
                label: "Highest",
              },
              {
                data: itemData.average,
                color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                label: "Average",
              }
            ],
            legend: ["Lowest Price  ", "Highest Price  ", "Average Price"],
          }}
          width={screenWidth - 20}
          height={chartHeight + 20}
          yAxisLabel="₱"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16, height: 20, },
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#000000", },
            fillShadowGradient: 'transparent',
            fillShadowGradientOpacity: 0,
            paddingRight: 32,
          }}
          bezier
          className="my-2 rounded-lg pr-10"
          fromZero={false}
          segments={6}
          xLabelsOffset={-10}
          yLabelsOffset={10}
          yAxisInterval={1} // Interval for Y-axis labels
          verticalLabelRotation={verticalLabelRotation} // Use dynamic label rotation
          yAxisMin={minValue} // Set min value
          yAxisMax={maxValue} // Set max value
          onDataPointClick={(data) => {
            if (!itemData.dates[data.index]) return;
            setTooltip({ visible: true, x: data.x, y: data.y, value: data.value, date: itemData.dates[data.index], sold: itemData.sold[data.index], });
          }}
        />

        {tooltip.visible && (
          <View
            className="absolute"
            style={{
              top: tooltip.y - 30,
              left: Math.max(5, Math.min(tooltip.x - 50, screenWidth - 100)),
            }}
          >
            <View className="bg-green-600 border border-black rounded-md p-2 z-10 w-24 items-center">
              <Text className="font-bold">₱{parseFloat(tooltip.value).toFixed(2)}</Text>
              <Text>{tooltip.date}</Text>
              <Text>Sold: {tooltip.sold}</Text>
              <View
                className="absolute"
                style={{ bottom: -10, left: "50%", marginLeft: -7.5, width: 0, height: 0, borderLeftWidth: 7.5, borderRightWidth: 7.5, borderTopWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "green", }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {filteredVarietyData && filteredVarietyData.crop_variety_name ? (
          <View className="bg-white px-4 rounded-lg shadow-md">
            <View className="flex-row items-center my-2">
              <TouchableOpacity
                onPress={() => setVarietyFilterModalVisible(true)} className=" bg-green-500 p-2 my-3 mx-1 rounded-lg items-center justify-center mb-4 w-12 mr-2 h-12"
              >
                <FontAwesome name="filter" size={28} color="white" />
              </TouchableOpacity>
              <View className="flex-1 flex-col">
                <Text className="flex-1 text-3xl font-bold text-green-700 text-center">
                  {selectedSubcategory.crop_sub_category_name.toUpperCase()}:
                </Text>
                <Text className="flex-1 text-2xl font-bold text-green-700 text-center">
                  {selectedVariety}
                </Text>
              </View>
            </View>
            <View className='flex-row border-2 rounded-lg px-2 py-1 mb-3 border-green-500'>
              <View className='space-y-1'>
                <Text className="text-base font-extrabold text-green-500">
                  Current Available Listings:
                </Text>
                <Text className="text-base font-extrabold text-green-500">
                  Current Highest Price/Kg:
                </Text>
                <Text className="text-base font-extrabold text-green-500">
                  Current Lowest Price/Kg:
                </Text>
              </View>
              <View className='flex-1 space-y-1'>
                <Text className="text-green-700 text-base font-bold"> {filteredVarietyData.availableListing} Listings</Text>
                <Text className="text-green-700 text-base font-bold"> ₱{filteredVarietyData.highestListing.crop_price}/kg</Text>
                <Text className="text-green-700 text-base font-bold"> ₱{filteredVarietyData.lowestListing.crop_price}/kg</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(true)} className="bg-green-500 p-2 rounded-lg flex-row items-center justify-center mt-1 mb-2"
            >
              <FontAwesome name="cog" size={18} color="white" />
              <Text className="text-white text-base ml-2">{selectedFilter} Summary</Text>
            </TouchableOpacity>

            <View className='flex-row px-2 py-1 mb-3'>
              <View className='space-y-1'>
                <Text className="text-base font-extrabold text-green-500">
                  Highest Total Sold in {selectedFilter}:
                </Text>
                <Text className="text-base font-extrabold text-green-500">
                  Average Total Sold in {selectedFilter}:
                </Text>
                <Text className="text-base font-extrabold text-green-500">
                  Lowest Total Sold in {selectedFilter}:
                </Text>
              </View>
              <View className='flex-1 space-y-1 ml-1'>
                {/* HIGHEST */}
                <Text className="text-green-700 text-base font-bold">
                  ₱{
                    (() => {
                      const value = getDataForItem(filteredVarietyData.crop_variety_id, selectedFilter).highestp.slice(-1)[0];
                      return isNaN(value) || !isFinite(value) ? 0 : value;
                    })()
                  }
                </Text>
                {/* AVERAGE */}
                <Text className="text-green-700 text-base font-bold">
                  ₱{
                    (() => {
                      const value = getDataForItem(filteredVarietyData.crop_variety_id, selectedFilter).averagep.slice(-1)[0];
                      return isNaN(value) || !isFinite(value) ? 0 : value;
                    })()
                  }
                </Text>
                {/* LOWEST */}
                <Text className="text-green-700 text-base font-bold">
                  ₱{
                    (() => {
                      const value = getDataForItem(filteredVarietyData.crop_variety_id, selectedFilter).lowestp.slice(-1)[0];
                      return isNaN(value) || !isFinite(value) ? 0 : value;
                    })()
                  }
                </Text>
              </View>
            </View>
            {renderAnalyticsChart(filteredVarietyData.crop_variety_id)}

            {/* SELECT FILTER MODAL */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)} // This will work on Android hardware back button
            >
              <View className="flex-1 justify-end bg-black/50" onTouchStart={() => setModalVisible(false)}>
                <View className="bg-white p-6 rounded-t-lg shadow-lg" onTouchStart={(e) => e.stopPropagation()}>
                  <Text className="text-xl font-bold text-center mb-4">Select a Filter</Text>
                  {["7 Days", "14 Days", "1 Month", "3 Months", "6 Months", "9 Months", "12 Months"].map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      className={`p-3 rounded-lg border transition duration-200 ${selectedFilter === filter
                        ? "bg-green-600 border-green-700"
                        : "bg-gray-200 border-transparent hover:bg-gray-300"
                        } mb-3`}
                      onPress={() => {
                        setSelectedFilter(filter);
                        setModalVisible(false);
                      }}
                      accessibilityLabel={`Select ${filter}`}
                    >
                      <Text
                        className={`text-center ${selectedFilter === filter ? "text-white" : "text-green-800"}`}
                      >
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="bg-red-600 p-3 rounded-lg mt-4"
                  >
                    <Text className="text-white text-center font-bold">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* SELECT VARIETY MODAL */}
            <Modal
              visible={varietyFilterModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setVarietyFilterModalVisible(false)}
            >
              <View className="flex-1 justify-end bg-black/50" onTouchStart={() => setVarietyFilterModalVisible(false)}>
                <View className="bg-white p-6 rounded-t-lg shadow-lg" onTouchStart={(e) => e.stopPropagation()}>
                  <Text className="text-xl font-bold text-center mb-4">Select a Variety</Text>
                  {varietyList.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      className={`p-3 rounded-lg border transition duration-200 ${selectedVariety === filter
                        ? "bg-green-600 border-green-700"
                        : "bg-gray-200 border-transparent hover:bg-gray-300"
                        } mb-3`}
                      onPress={() => {
                        replaceSelectedVarietyData(filter);
                        setVarietyFilterModalVisible(false);
                      }}
                      accessibilityLabel={`Select ${filter}`}
                    >
                      <Text
                        className={`text-center ${selectedVariety === filter ? "text-white" : "text-green-800"}`}
                      >
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    onPress={() => setVarietyFilterModalVisible(false)}
                    className="bg-red-600 p-3 rounded-lg mt-4"
                  >
                    <Text className="text-white text-center font-bold">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <Text>No Data Available</Text>
        )
        }
      </ScrollView>
    </SafeAreaView>
  )
}
export default MarketAnalyticScreen;
