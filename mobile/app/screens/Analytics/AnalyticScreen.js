import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import LoadingAnimation from "../../components/LoadingAnimation";
import AnalyticsReports from "../../components/AnalyticsReports";

function AnalyticScreen({ navigation }) {
  const [categoryData, setCategoryData] = useState([]);
  const [varietyData, setVarietyData] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const categoriesraw = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();
      const orders = await ordersResponse.json();
      const orderProducts = await orderProductsResponse.json();

      const categories = categoriesraw.sort((a, b) => a.crop_category_id - b.crop_category_id);

      // Combine the varieties with the crops
      const combinedVarieties = varieties.map(variety => {
        const cropsData = crops.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
        return {
          ...variety,
          crops: cropsData ? cropsData : null,
        };
      });

      // Combine the subcategories with the varieties
      const combinedSubcategories = subcategories.map(subcat => {
        const varietiesData = combinedVarieties.filter(variety => variety.crop_sub_category_id === subcat.crop_sub_category_id);
        return {
          ...subcat,
          varieties: varietiesData ? varietiesData : null,
        };
      });

      // Combine the categories with the subcategories
      const combinedCategories = categories.map(cat => {
        const subcategoriesData = combinedSubcategories.filter(subCat => subCat.crop_category_id === cat.crop_category_id);
        return {
          ...cat,
          subcategories: subcategoriesData ? subcategoriesData : null,
        };
      });

      // combine orderProducts inside the orders table
      const varietiesFiltered = varieties.map(variety => {
        // Filter crops for the current variety
        const availableCrops = crops.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
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
        crops.some(crop => crop.crop_id === product.crop_id)
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

      // Add metric calculations for 7 Days, 1 Month, and 6 Months
      const calculateMetrics = (data, varietyId, days) => {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - days);

        const filteredData = data.filter(
          (item) =>
            item.variety_id === varietyId &&
            new Date(item.order_date) >= pastDate &&
            new Date(item.order_date) <= today
        );

        if (filteredData.length === 0) {
          return { highest: 0, lowest: 0, average: 0 };
        }

        const highest = Math.max(...filteredData.map((item) => item.highest));
        const lowest = Math.min(...filteredData.map((item) => item.lowest));
        const average =
          filteredData.reduce((sum, item) => sum + item.average, 0) /
          filteredData.length;

        // Round to 2 decimal places
        const roundToTwo = (num) => Math.round(num * 100) / 100;

        return {
          highest: roundToTwo(highest),
          lowest: roundToTwo(lowest),
          average: roundToTwo(average),
        };
      };

      const updatedVarietiesFiltered = varietiesFiltered.map((variety) => {
        const varietyId = variety.crop_variety_id;

        const { highest: highest7, lowest: lowest7, average: avg7 } = calculateMetrics(
          combinedProductDetails,
          varietyId,
          7
        );
        const { highest: highest1M, lowest: lowest1M, average: avg1M } = calculateMetrics(
          combinedProductDetails,
          varietyId,
          30
        );
        const { highest: highest6M, lowest: lowest6M, average: avg6M } = calculateMetrics(
          combinedProductDetails,
          varietyId,
          180
        );

        return {
          ...variety,
          "7DaysHighest": highest7,
          "7DaysAverage": avg7,
          "7DaysLowest": lowest7,
          "1MonthHighest": highest1M,
          "1MonthAverage": avg1M,
          "1MonthLowest": lowest1M,
          "6MonthHighest": highest6M,
          "6MonthAverage": avg6M,
          "6MonthLowest": lowest6M,
        };
      });
      setCategoryData(combinedCategories);
      // setVarietyData yung ma eexport to PDF, pag pinili Carrots, lahat ng variety ni Carrots maprint.
      setVarietyData(updatedVarietiesFiltered);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(varietyData[0])

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const categoryIcons = {
    Vegetables: "carrot",
    Fruits: "apple-alt",
    Spices: "pepper-hot",
    Seedlings: "seedling",
    Plants: "leaf",
    Flowers: "spa",
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView>
        {categoryData.map((category) => (
          <View key={category.crop_category_id} className="my-2 mx-4">
            <TouchableOpacity
              className="flex-row justify-between items-center p-4 bg-white rounded-lg shadow"
              onPress={() => toggleExpandCategory(category.crop_category_id)}
            >
              <View className="flex-row items-center">
                <Icon
                  name={
                    categoryIcons[category.crop_category_name] ||
                    "question-circle"
                  }
                  size={20}
                  color="#00B251"
                  className="mr-2"
                />
                <Text className="pl-2 text-lg font-semibold text-black">
                  {category.crop_category_name}
                </Text>
              </View>
              <Icon
                name={
                  expandedCategory === category.crop_category_id
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="#00B251"
              />
            </TouchableOpacity>
            {expandedCategory === category.crop_category_id &&
              category.subcategories &&
              category.subcategories.map((subcat) => (
                <View key={subcat.crop_sub_category_id}>
                  <TouchableOpacity
                    className="ml-8 mt-2 p-3 py-4 bg-gray-200 rounded-lg"
                    onPress={() =>
                      navigation.navigate("Market Analytics", {
                        categoryId: category.crop_category_id,
                        subcategoryId: subcat.crop_sub_category_id,
                      })
                    }
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-md text-green-600 font-bold ml-3">
                        {subcat.crop_sub_category_name}
                      </Text>
                      {/* PRESSABLE FOR GENERATE PDF ICON */}
                      <TouchableOpacity
                        className="mr-4 bg-gray-200 rounded-lg"
                        onPress={() =>
                          navigation.navigate("Market Analytics", {
                            categoryId: category.crop_category_id,
                            subcategoryId: subcat.crop_sub_category_id,
                          })
                        }
                      >
                        <AnalyticsReports
                          data={varietyData.filter(
                            (variety) =>
                              variety.crop_sub_category_id ===
                              subcat.crop_sub_category_id
                          )}
                          subcategoryName={subcat.crop_sub_category_name}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AnalyticScreen;
