import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import placeholderimg from '../../assets/placeholder.png';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

function CompareShopsScreen({ route }) {
  const navigation = useNavigation();
  const { filter_category_id, filter_sub_category_id, filter_variety_id, filter_class, filter_size_id, filter_price_range, filter_quantity } = route.params || {};
  const [loading, setLoading] = useState(true)

  const [combinedData, setCombinedData] = useState([]);
  const [cropsData, setCropsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [varietyData, setVarietyData] = useState([]);
  const [varietySizesData, setVarietySizesData] = useState([]);
  const [sizesData, setSizesData] = useState([]);
  const [metricData, setMetricData] = useState([]);

  const fetchCrops = async () => {
    try {
      const cropsResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const categoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_categories`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const subcategoryResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const varietyResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const varietySizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_variety_sizes`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const sizeResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const metricResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/metric_systems`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const shopResponse = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/shops`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });

      const crops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();
      const variety_sizes = await varietySizeResponse.json();
      const sizes = await sizeResponse.json();
      const metrics = await metricResponse.json();
      const shops = await shopResponse.json();

      const combinedData = crops.map(crop => {
        const categoryData = categories.find(cat => cat.crop_category_id === crop.category_id);
        const subcategoryData = subcategories.find(sub => sub.crop_sub_category_id === crop.sub_category_id);
        const varietyData = varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id);
        const sizeData = variety_sizes.find(varSize => varSize.crop_variety_id === crop.crop_variety_id);
        const actualSize = sizes.find(size => size.crop_size_id === (sizeData ? sizeData.crop_size_id : null));
        const metricData = metrics.find(metric => metric.metric_system_id === crop.metric_system_id);
        const shopData = shops.find(shop => shop.shop_id === crop.shop_id);

        return {
          ...crop,
          category: categoryData ? categoryData : null,
          subcategory: subcategoryData ? subcategoryData : null,
          variety: varietyData ? varietyData : null,
          size: actualSize ? actualSize : null,
          metric: metricData ? metricData : null,
          shop: shopData ? shopData : null
        };
      });

      const filterCrops = combinedData.filter(crop =>
        crop.category_id === Number(filter_category_id)
        && crop.sub_category_id === Number(filter_sub_category_id)
        && crop.variety.crop_variety_id === Number(filter_variety_id)
        && crop.crop_size_id === Number(filter_size_id)
        && crop.crop_quantity >= Number(filter_quantity[0])
        && crop.crop_price >= Number(filter_price_range[0])
        && filter_class.includes(crop.crop_class)
      );

      setCombinedData(filterCrops);
      setCropsData(crops);
      setCategoryData(categories);
      setSubCategoryData(subcategories);
      setVarietyData(varieties);
      setVarietySizesData(variety_sizes);
      setSizesData(sizes);
      setMetricData(metrics);

    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false)
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [filter_category_id, filter_sub_category_id, filter_variety_id, filter_class, filter_size_id, filter_price_range, filter_quantity])
  );


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Search and Filter */}
      <View className="p-4 pb-1 flex-row items-center space-x-3 bg-white shadow-sm">

        {/* Filter Button */}
        <TouchableOpacity
          className="flex w-10 h-10 items-center justify-center rounded-lg bg-[#00B251] shadow-md"
          onPress={() => navigation.navigate("Filter Products")}
        >
          <Icon name="filter" size={18} color="white" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-1 flex-row bg-gray-100 rounded-lg border border-gray-200 shadow-sm items-center px-2">
          <Icon name="search" size={16} color="gray" />
          <TextInput
            placeholder="Search crops..."
            className="p-2 pl-2 flex-1 text-xs text-gray-700"
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="mt-4">
        <View className="px-4">
          <Text className="text-lg font-bold text-gray-800 my-3">Filtered Products</Text>
          <View className="space-y-3">
            {combinedData.map(crop => (
              <ShopCard
                key={crop.crop_id}
                shopName={crop.shop.shop_name}
                productName={crop.crop_name}
                price={crop.crop_price}
                available={crop.crop_quantity}
                rating={crop.crop_rating}
                shopImage={crop.shop.shop_image_url}
                metricSymbol={crop.metric.metric_system_symbol}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ShopCard = ({ shopName, productName, price, available, rating, shopImage, metricSymbol }) => {
  return (
    <View className="flex-row border p-2 rounded-md shadow-sm bg-white items-center mb-2">
      <View className="flex-1 justify-between">
        <View className="flex-1 flex-row items-center ml-2">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
            <Image source={{ uri: shopImage }} className="w-full h-full" />
          </View>
          <Text className="text-base ml-3 font-semibold text-gray-700">{shopName}</Text>
        </View>

        <Text className="text-xl text-center font-extrabold text-[#00B251]">{productName}</Text>
        <View className="flex-1 flex-row px-3">
          <View className="flex-row w-3/5">
            <View className="w-2/5">
              <Text className="text-base font-bold text-gray-700">Rating:</Text>
              <Text className="text-base font-bold text-gray-700">Available:</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-base text-gray-700">{rating}⭐</Text>
              <Text className="text-base text-gray-700">{available} {metricSymbol}</Text>
            </View>
          </View>
          <View className="justify-center">
            <Text className="text-3xl text-center font-bold text-[#00B251]"> ₱{price}/{metricSymbol}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CompareShopsScreen;
