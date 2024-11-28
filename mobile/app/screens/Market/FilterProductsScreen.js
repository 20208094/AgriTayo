import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import LoadingAnimation from '../../components/LoadingAnimation';

function FilterProductsScreen(route) {
  const navigation = useNavigation();
  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [variety, setVariety] = useState(null);
  const [varietyId, setVarietyId] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [minimumPrice, setMinimumPrice] = useState();
  const [maximumPrice, setMaximumPrice] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQuantityName, setSelectedQuantityName] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeField, setActiveField] = useState('');
  const [loading, setLoading] = useState(true)

  const [combinedData, setCombinedData] = useState([]);
  const [cropsData, setCropsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [varietyData, setVarietyData] = useState([]);
  const [varietySizesData, setVarietySizesData] = useState([]);
  const [sizesData, setSizesData] = useState([]);
  const [metricData, setMetricData] = useState([]);

  const [cropsFormData, setCropsFormData] = useState([]);
  const [categoryFormData, setCategoryFormData] = useState([]);
  const [subCategoryFormData, setSubCategoryFormData] = useState([]);
  const [varietyFormData, setVarietyFormData] = useState([]);
  const [varietySizesFormData, setVarietySizesFormData] = useState([]);
  const [sizesFormData, setSizesFormData] = useState([]);
  const [metricFormData, setMetricFormData] = useState([]);

  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);

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

      const crops = await cropsResponse.json();
      const categories = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();
      const variety_sizes = await varietySizeResponse.json();
      const sizes = await sizeResponse.json();
      const metrics = await metricResponse.json();

      const combinedData = crops.map(crop => {
        const categoryData = categories.find(cat => cat.crop_category_id === crop.category_id);
        const subcategoryData = subcategories.find(sub => sub.crop_sub_category_id === crop.sub_category_id);
        const varietyData = varieties.find(variety => variety.crop_variety_id === crop.crop_variety_id);
        const sizeData = variety_sizes.find(varSize => varSize.crop_variety_id === crop.crop_variety_id);
        const actualSize = sizes.find(size => size.crop_size_id === (sizeData ? sizeData.crop_size_id : null));
        const metricData = metrics.find(metric => metric.metric_system_id === crop.metric_system_id);

        return {
          ...crop,
          category: categoryData ? categoryData : null,
          subcategory: subcategoryData ? subcategoryData : null,
          variety: varietyData ? varietyData : null,
          size: actualSize ? actualSize : null,
          metric: metricData ? metricData : null
        };
      });

      setCombinedData(combinedData);
      setCropsData(crops);
      setCategoryData(categories);
      setSubCategoryData(subcategories);
      setVarietyData(varieties);
      setVarietySizesData(variety_sizes);
      setSizesData(sizes);
      setMetricData(metrics);

      setCropsFormData(crops);
      setCategoryFormData(categories);
      setSubCategoryFormData(subcategories);
      setVarietyFormData(varieties);
      setVarietySizesFormData(variety_sizes);
      setMetricFormData(metrics);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false)
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCrops();
    }, [])
  );

  const toggleClassSelection = (classType) => {
    if (selectedClasses.includes(classType)) {
      setSelectedClasses(selectedClasses.filter(item => item !== classType));
    } else {
      setSelectedClasses([...selectedClasses, classType]);
    }
  };

  const getButtonStyle = (classType) => ({
    backgroundColor: selectedClasses.includes(classType) ? '#00B251' : '#8f8d8d',
    padding: 12,
    borderRadius: 5,
    minWidth: 55,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const togglePaymentMethodSelection = (paymentType) => {
    if (selectedPaymentMethods.includes(paymentType)) {
      setSelectedPaymentMethods(selectedPaymentMethods.filter(item => item !== paymentType));
    } else {
      setSelectedPaymentMethods([...selectedPaymentMethods, paymentType]);
    }
  };

  const getPaymentButtonStyle = (paymentType) => ({
    backgroundColor: selectedPaymentMethods.includes(paymentType) ? '#00B251' : '#8f8d8d',
    padding: 12,
    borderRadius: 5,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const quantities = [
    { label: '1-5', value: [1, 5] },
    { label: '6-10', value: [6, 10] },
    { label: '11-20', value: [11, 20] },
    { label: '21+', value: [21, 999999] },
  ];

  const sizes = sizesFormData && sizesFormData.length > 0
    ? sizesFormData.map(size => ({
      label: size.crop_size_name,
      value: size.crop_size_id,
    }))
    : [];

  // Data for the modal items
  const modalItems = {
    category: categoryFormData.map(cat => ({
      label: cat.crop_category_name,
      value: cat.crop_category_id.toString(),
    })),
    subcategory: subCategoryFormData.map(cat => ({
      label: cat.crop_sub_category_name,
      value: cat.crop_sub_category_id.toString(),
    })),
    variety: varietyFormData.map(cat => ({
      label: cat.crop_variety_name,
      value: cat.crop_variety_id.toString(),
    }))
  };

  const handleOpenModal = (field) => {
    setModalData(modalItems[field]);
    setActiveField(field);
    setSearchText('');
    setModalVisible(true);
  };

  const handleSubmit = () => {
    const filter_category_id = categoryId;
    const filter_sub_category_id = subcategoryId;
    const filter_variety_id = varietyId;
    const filter_class = selectedClasses;
    const filter_size_id = selectedSize;
    const filter_price_range = priceRange;
    const filter_quantity = selectedQuantity;
    const filter_payment_methods = selectedPaymentMethods;

    navigation.navigate("Compare Shops", { 
      filter_category_id, 
      filter_sub_category_id, 
      filter_variety_id, 
      filter_class, 
      filter_size_id, 
      filter_price_range, 
      filter_quantity,
      filter_payment_methods 
    });
  };

  const handleSelectItem = (item) => {
    switch (activeField) {
      // FOR CATEGORY
      case 'category':
        setCategory(item.label);
        setCategoryId(item.value);
        setSubcategory(null);
        setSubcategoryId(null);
        setVariety(null);
        setVarietyId(null);
        const selectedCategory = categoryData.find(cat => cat.crop_category_id === Number(item.value));
        const filterCategorySubCategories = subCategoryData.filter(cat => cat.crop_category_id === Number(item.value));
        if (filterCategorySubCategories) {
          setSubCategoryFormData(filterCategorySubCategories)
        }
        const filterCategoryVarieties = varietyData.filter(cat => cat.crop_category_id === Number(item.value));
        if (filterCategoryVarieties) {
          setVarietyFormData(filterCategoryVarieties)
        }
        const filterCropsCat = cropsData.filter(cat => Number(cat.category_id) === Number(selectedCategory.crop_category_id));
        if (filterCropsCat.length > 0) {
          // Extracting the crop prices
          const cropPrices = filterCropsCat.map(crop => crop.crop_price);

          // Finding the minimum and maximum crop prices
          const minPrice = Math.min(...cropPrices);
          const maxPrice = Math.max(...cropPrices);

          setMinimumPrice(minPrice);
          setMaximumPrice(maxPrice);
          setPriceRange([minPrice, maxPrice])
        }
        break;
      // FOR SUBCATEGORY
      case 'subcategory':
        setSubcategory(item.label);
        setSubcategoryId(item.value);
        setVariety(null);
        setVarietyId(null);
        const selectedSubcategory = subCategoryData.find(sub => sub.crop_sub_category_id === Number(item.value));
        if (selectedSubcategory) {
          // Auto Place Data
          const selectedCategoryFromSub = categoryData.find(cat => cat.crop_category_id === selectedSubcategory.crop_category_id);
          if (selectedCategoryFromSub) {
            setCategory(selectedCategoryFromSub.crop_category_name);
            setCategoryId(selectedCategoryFromSub.crop_category_id);
          }
          // FILTER FORMS
          const filterCategorySubCategories = subCategoryData.filter(cat => cat.crop_category_id === selectedCategoryFromSub.crop_category_id);
          if (filterCategorySubCategories) {
            setSubCategoryFormData(filterCategorySubCategories)
          }
          const filterCategoryVarieties = varietyData.filter(cat => cat.crop_sub_category_id === Number(item.value));
          if (filterCategoryVarieties) {
            setVarietyFormData(filterCategoryVarieties)
          }
        }
        // Filter Forms
        const filterSubCategoryVarieties = varietyData.filter(cat => cat.crop_sub_category_id === Number(item.value));
        if (filterSubCategoryVarieties) {
          setVarietyFormData(filterSubCategoryVarieties)
        }
        const filterCrops = cropsData.filter(cat => cat.sub_category_id === selectedSubcategory.crop_sub_category_id);
        if (filterCrops.length > 0) {
          // Extracting the crop prices
          const cropPrices = filterCrops.map(crop => crop.crop_price);

          // Finding the minimum and maximum crop prices
          const minPrice = Math.min(...cropPrices);
          const maxPrice = Math.max(...cropPrices);

          setMinimumPrice(minPrice);
          setMaximumPrice(maxPrice);
          setPriceRange([minPrice, maxPrice])
        }
        break;
      // FOR VARIETY
      case 'variety':
        setVariety(item.label);
        setVarietyId(item.value);
        const selectedVariety = varietyData.find(sub => sub.crop_variety_id === Number(item.value));
        if (selectedVariety) {
          // Auto Place Data
          const selectedCategoryFromVariety = categoryData.find(cat => cat.crop_category_id === selectedVariety.crop_category_id);
          if (selectedCategoryFromVariety) {
            setCategory(selectedCategoryFromVariety.crop_category_name);
            setCategoryId(selectedCategoryFromVariety.crop_category_id);
          }
          const selectedSubCategoryFromVariety = subCategoryData.find(cat => cat.crop_sub_category_id === selectedVariety.crop_sub_category_id);
          if (selectedSubCategoryFromVariety) {
            setSubcategory(selectedSubCategoryFromVariety.crop_sub_category_name);
            setSubcategoryId(selectedSubCategoryFromVariety.crop_sub_category_id);
          }
          // FILTER FORMS
          const filterVarietySubCategories = subCategoryData.filter(cat => cat.crop_category_id === selectedVariety.crop_category_id);
          if (filterVarietySubCategories) {
            setSubCategoryFormData(filterVarietySubCategories)
          }
          const filterCategoryVarieties = varietyData.filter(cat => cat.crop_sub_category_id === selectedVariety.crop_sub_category_id);
          if (filterCategoryVarieties) {
            setVarietyFormData(filterCategoryVarieties)
          }
          const filterVarietySizes = varietySizesData.filter(cat => cat.crop_variety_id === selectedVariety.crop_variety_id);
          if (filterVarietySizes.length > 0) {
            const sizeIds = filterVarietySizes.map(size => size.crop_size_id);
            const filterSizes = sizesData.filter(cat => sizeIds.includes(cat.crop_size_id));
            setSizesFormData(filterSizes);
          }
          const filterCrops = cropsData.filter(cat => cat.crop_variety_id === selectedVariety.crop_variety_id);
          if (filterCrops.length > 0) {
            // Extracting the crop prices
            const cropPrices = filterCrops.map(crop => crop.crop_price);

            // Finding the minimum and maximum crop prices
            const minPrice = Math.min(...cropPrices);
            const maxPrice = Math.max(...cropPrices);

            setMinimumPrice(minPrice);
            setMaximumPrice(maxPrice);
            setPriceRange([minPrice, maxPrice])
          }
        }
        break;
      // ELSE ITO MANGYAYARE
      default:
        break;
    }
    setModalVisible(false);
  };

  handleSelectQuantity = (qty) => {
    setSelectedQuantity(qty.value)
    setSelectedQuantityName(qty.label)
  }

  const filteredItems = modalData.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {/* Category Button */}
          <Text className="text-lg font-semibold mb-1">Choose Category:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('category')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2 ">
            <Text className="text-base pl-2">{category ? `${category}` : 'No category selected'}</Text>
          </TouchableOpacity>

          {/* Subcategory Button */}
          <Text className="text-lg font-semibold mb-1">Choose Subcategory:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('subcategory')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2">
            <Text className="text-base pl-2">{subcategory ? `${subcategory}` : 'No subcategory selected'}</Text>
          </TouchableOpacity>

          {/* Variety Button */}
          <Text className="text-lg font-semibold mb-1">Choose Variety:</Text>
          <TouchableOpacity onPress={() => handleOpenModal('variety')} className="mb-4 border border-gray-500 rounded-lg p-2 px-4 mx-2">
            <Text className="text-base pl-2">{variety ? variety : 'No variety selected'}</Text>
          </TouchableOpacity>

          {/* Class Selection */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold">Choose Class:</Text>
            <View className="flex-row justify-around">
              {['A', 'B', 'C', 'D', 'Mix'].map((classType) => (
                <TouchableOpacity
                  key={classType}
                  onPress={() => toggleClassSelection(classType)}
                  style={getButtonStyle(classType)}
                >
                  <Text className="text-white font-semibold">{classType}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size */}
          <View className="">
            <Text className="mb-2 text-lg font-semibold">Choose Size:</Text>
            <View className="flex-row justify-around">
              {sizes.length > 0 ? (
                sizes.map((size) => (
                  <TouchableOpacity
                    key={size.value}
                    onPress={() => setSelectedSize(size.value)}
                    style={{
                      backgroundColor: selectedSize === size.value ? '#00B251' : '#8f8d8d',
                      padding: 10,
                      borderRadius: 5,
                      minWidth: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text className="text-white font-semibold">{size.label}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-base text-green-800 font-semibold h-10">Choose Variety First</Text>
              )
              }
            </View>
          </View>

          {/* Price Range Slider */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mt-3">Choose Preferred Price:</Text>
            {priceRange.length > 0 ? (
              <View className="w-full items-center">
                <View className="flex-row justify-between w-full items-center">
                  <Text className="text-base font-semibold text-gray-500 text-right">₱{minimumPrice}</Text>
                  <MultiSlider
                    values={priceRange}
                    min={minimumPrice}
                    max={maximumPrice}
                    step={1}
                    onValuesChange={(values) => setPriceRange(values)}
                    selectedStyle={{
                      backgroundColor: '#00B251',
                    }}
                    unselectedStyle={{
                      backgroundColor: '#cccccc',
                    }}
                    containerStyle={{ width: '90%', height: 40 }}
                  />
                  <Text className="text-base font-semibold text-gray-500">₱{maximumPrice}</Text>
                </View>
                <View className="flex-row justify-between w-3/5">
                  <Text className="text-lg font-semibold">₱{priceRange[0]}</Text>
                  <Text className="text-lg font-semibold">to</Text>
                  <Text className="text-lg font-semibold">₱{priceRange[1]}</Text>
                </View>
              </View>
            ) : (
              <View className="items-center pt-4">
                <Text className="text-base text-green-800 font-semibold h-10">Choose Variety First</Text>
              </View>
            )}
          </View>

          {/* Quantity Selection */}
          <View className="">
            <Text className="mb-2 text-lg font-semibold">How Many Would You Like to Buy?</Text>
            <View className="flex-row justify-around">
              {quantities.map((qty) => (
                <TouchableOpacity
                  key={qty.label}
                  onPress={() => handleSelectQuantity(qty)}
                  style={{
                    backgroundColor: selectedQuantityName === qty.label ? '#00B251' : '#8f8d8d',
                    padding: 10,
                    borderRadius: 5,
                    minWidth: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text className="text-white font-semibold">{qty.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Methods */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold">Choose Payment Method:</Text>
            <View className="flex-row justify-around">
              {['COD', 'GCash', 'Bank'].map((paymentType) => (
                <TouchableOpacity
                  key={paymentType}
                  onPress={() => togglePaymentMethodSelection(paymentType)}
                  style={getPaymentButtonStyle(paymentType)}
                >
                  <Text className="text-white font-semibold">{paymentType}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row justify-between px-4 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-400 p-3 rounded-lg w-[45%] items-center"
        >
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 p-3 rounded-lg w-[45%] items-center"
        >
          <Text className="text-white font-semibold">Apply Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Selecting Items */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white mx-4 rounded-lg p-6 shadow-lg h-screen max-h-[80%]">
            <TextInput
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              className="border border-gray-300 p-3 rounded-lg mb-4"
            />
            <ScrollView>
              {filteredItems.map(item => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleSelectItem(item)}
                  className={`px-2 py-1 border-b border-gray-300 rounded-lg ${(activeField === 'category' && category === item.label) ||
                    (activeField === 'subcategory' && subcategory === item.label) ||
                    (activeField === 'variety' && variety === item.label)
                    ? 'bg-green-300'
                    : 'bg-white'
                    }`}
                >
                  <Text className="text-lg text-black">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 bg-gray-400 p-3 rounded-lg">
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default FilterProductsScreen;
