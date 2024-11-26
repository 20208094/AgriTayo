import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Alert,
  Switch,
} from "react-native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MultiSlider from '@ptomasroos/react-native-multi-slider';//galing sa filter products


const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

function AddProductScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [metricSystem, setMetricSystem] = useState([]);
  const [cropSizes, setCropSizes] = useState([]);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = REACT_NATIVE_API_KEY;

  const [cropDescription, setCropDescription] = useState("");
  const [cropPrice, setCropPrice] = useState("");
  const [cropQuantity, setCropQuantity] = useState("");
  const [minimumNegotiation, setMinimumNegotiation] = useState("");

  const [isClickedCategory, setIsClickedCategory] = useState(false);
  const [isClickedMetricSystem, setIsClickedMetricSystem] = useState(false);
  const [isClickedSubCategory, setIsclickedSubCategory] = useState(false);

  const [selectedMetricSystem, setSelectedMetricSystem] =
    useState("Select Crop Metric");
  const [selectedCategory, setSelectedCategory] = useState(
    "Select Crop Category"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    "Select Crop Sub Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedMetricSystemId, setSelectedMetricSystemId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [cropImage, setCropImage] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [errors, setErrors] = useState({});

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleMetricSelect = (metric) => {
    setSelectedMetricSystem(metric.metric_system_name);
    setSelectedMetricSystemId(metric.metric_system_id);
    setIsClickedMetricSystem(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.crop_category_name);
    setSelectedCategoryId(category.crop_category_id);
    setIsClickedCategory(false);
    fetchSubCategories(category.crop_category_id);
  };

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory.crop_sub_category_name);
    setSelectedSubCategoryId(subCategory.crop_sub_category_id);
    setIsclickedSubCategory(false);
    fetchCropVariety(subCategory.crop_sub_category_id)
  };

  const MAX_IMAGE_SIZE_MB = 1; // Maximum allowed image size (1 MB)

  // Helper function to validate image size
  const validateImageSize = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const sizeInMB = blob.size / (1024 * 1024); // Convert bytes to MB

      if (sizeInMB > MAX_IMAGE_SIZE_MB) {
        setAlertMessage(
          `The selected image is too large (${sizeInMB.toFixed(
            2
          )} MB). Please choose an image smaller than ${MAX_IMAGE_SIZE_MB} MB.`
        );
        setAlertVisible(true);
        return false;
      }

      return true;
    } catch (error) {
      setAlertMessage("Failed to check image size. Please try again.");
      setAlertVisible(true);
      return false;
    }
  };

  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage(
        "Sorry, we need camera roll permissions to make this work!"
      );
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const isValidSize = await validateImageSize(result.assets[0].uri);
      if (isValidSize) {
        setCropImage(result.assets[0].uri);
        setModalVisible(false);
      }
    }
  };

  const selectImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setAlertMessage("Sorry, we need camera permissions to make this work!");
      setAlertVisible(true);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const isValidSize = await validateImageSize(result.assets[0].uri);
      if (isValidSize) {
        setCropImage(result.assets[0].uri);
        setModalVisible(false);
      }
    }

  };

  const removeImage = () => {
    setCropImage(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_categories`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setAlertMessage(`Error fetching crop categories: ${error.message}`);
      setAlertVisible(true);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sub_categories`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const filteredData = data.filter(
        (subCategory) => subCategory.crop_category_id === categoryId
      );
      setSubCategories(filteredData);
    } catch (error) {
      setAlertMessage(`Error fetching crop subcategories: ${error.message}`);
      setAlertVisible(true);
    }
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const shop = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        setShopData(shop);
      }
    } catch (error) {
      setAlertMessage(`Failed to load shop data: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetricSystem = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/metric_systems`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMetricSystem(data);
    } catch (error) {
      setAlertMessage(`Error fetching metric systems: ${error.message}`);
      setAlertVisible(true);
    }
  };

  // for crop size
  const [isClickedCropSize, setIsClickedCropSize] = useState(false);
  const [selectedCropSize, setSelectedCropSize] = useState("Select Crop Size");
  const [selectedCropSizeId, setSelectedCropSizeId] = useState(null);
  const handleCropSizeSelect = (cropSize) => {
    setSelectedCropSize(cropSize.crop_size_name);
    setSelectedCropSizeId(cropSize.crop_size_id);
    setIsClickedCropSize(false);
  };

  // fetching crop size
  const fetchCropSize = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_sizes`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setCropSizes(data);
    } catch (error) {
      setAlertMessage(`Error fetching crop categories: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // for crop variety
  const [isClickedCropVariety, setIsClickedCropVariety] = useState(false);
  const [selectedCropVariety, setSelectedCropVariety] = useState(
    "Select Crop Variety"
  );
  const [selectedCropVarietyId, setSelectedCropVarietyId] = useState(null);

  // Handle crop variety selection
  const handleCropVarietySelect = (cropVariety) => {
    setSelectedCropVariety(cropVariety.crop_variety_name);
    setSelectedCropVarietyId(cropVariety.crop_variety_id);
    setIsClickedCropVariety(false);

    // Find and set the category and subcategory based on the selected crop variety
    const selectedCategory = categories.find(
      (category) => category.crop_category_id === cropVariety.crop_category_id
    );
    const selectedSubCategory = subCategories.find(
      (subCategory) =>
        subCategory.crop_sub_category_id === cropVariety.crop_sub_category_id
    );

    // Update category and subcategory selections
    if (selectedCategory) {
      setSelectedCategory(selectedCategory.crop_category_name);
      setSelectedCategoryId(selectedCategory.crop_category_id);
      fetchSubCategories(selectedCategory.crop_category_id); // Fetch subcategories based on category
    }

    if (selectedSubCategory) {
      setSelectedSubCategory(selectedSubCategory.crop_sub_category_name);
      setSelectedSubCategoryId(selectedSubCategory.crop_sub_category_id);
    }

    // Clear any existing errors for these fields
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedCategoryId: "",
      selectedSubCategoryId: "",
    }));
  };

  useEffect(() => {
    // If a crop variety is selected, set the category and subcategory based on that
    if (selectedCropVariety) {
      const selectedCategory = categories.find(
        (category) =>
          category.crop_category_id === selectedCropVariety.crop_category_id
      );

      const selectedSubCategory = subCategories.find(
        (subCategory) =>
          subCategory.crop_sub_category_id ===
          selectedCropVariety.crop_sub_category_id
      );

      if (selectedCategory) {
        setSelectedCategory(selectedCategory.crop_category_name);
      }

      if (selectedSubCategory) {
        setSelectedSubCategory(selectedSubCategory.crop_sub_category_name);
      }
    }
  }, [selectedCropVariety, categories, subCategories]);

  // fetching crop variety
  const fetchCropVariety = async (subCategoryId) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crop_varieties`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const filteredData = data.filter(
        (subCategory) => subCategory.crop_sub_category_id === subCategoryId
      );
      setCropVarieties(filteredData);
    } catch (error) {
      setAlertMessage(`Error fetching crop categories: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchCropSize();
      fetchCropVariety();
      fetchMetricSystem();
      getAsyncShopData();
    }, [])
  );

  const cropClasses = [
    {
      crop_class_id: 1,
      crop_class_name: "A",
    },
    {
      crop_class_id: 2,
      crop_class_name: "B",
    },
    {
      crop_class_id: 3,
      crop_class_name: "C",
    },
    {
      crop_class_id: 4,
      crop_class_name: "Mix",
    },
  ];

  // for crop size
  const [isClickedCropClass, setIsClickedCropClass] = useState(false);
  const [selectedCropClass, setSelectedCropClass] =
    useState("Select Crop Class");
  const handleCropClassSelect = (cropClass) => {
    setSelectedCropClass(cropClass.crop_class_name);
    setIsClickedCropClass(false);
  };

  const handleAddProduct = async () => {
    const errors = {};

    // Field presence and regex validation
    if (!cropPrice) {
      errors.cropPrice = "Crop Price is required.";
    } else if (!PRICE_REGEX.test(cropPrice)) {
      errors.cropPrice = "Enter a valid price (e.g., 100 or 100.00).";
    }
    if (!cropQuantity) {
      errors.cropQuantity = "Crop Quantity is required.";
    } else if (!PRICE_REGEX.test(cropQuantity)) {
      errors.cropQuantity = "Enter a valid Quantity";
    }

    if (!cropImage) {
      errors.cropImage = "Select an image.";
    }
    if (!cropDescription)
      errors.cropDescription = "Crop Description is required.";
    if (!selectedCategoryId) errors.selectedCategoryId = "Select a category.";
    if (!selectedSubCategoryId)
      errors.selectedSubCategoryId = "Select a sub-category.";
    if (!selectedMetricSystemId)
      errors.selectedMetricSystemId = "Select a metric.";
    if (!selectedCropSizeId) errors.selectedCropSizeId = "Select a crop size.";
    if (!selectedCropVarietyId)
      errors.selectedCropVarietyId = "Select a crop variety.";
    if (!selectedCropClass) errors.selectedCropClass = "Select a crop class.";

    // If there are errors, show alert and return without submitting
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setAlertMessage("Please fill in all the required fields correctly.");
      setAlertVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append("crop_name", selectedCropVariety);
    formData.append("crop_description", cropDescription);
    formData.append("crop_category_id", parseInt(selectedCategoryId));
    formData.append("sub_category_id", parseInt(selectedSubCategoryId));
    formData.append("shop_id", parseInt(shopData.shop_id));
    formData.append("crop_size_id", parseInt(selectedCropSizeId));
    formData.append("crop_variety_id", parseInt(selectedCropVarietyId));
    if (cropImage) {
      formData.append("image", {
        uri: cropImage,
        name: "shop.jpg",
        type: "image/jpeg",
      });
    }
    formData.append("crop_price", parseFloat(cropPrice));
    formData.append("crop_quantity", parseInt(cropQuantity));
    formData.append("metric_system_id", selectedMetricSystemId);
    formData.append("crop_availability", "live");
    formData.append("crop_class", selectedCropClass);
    formData.append("negotiation_allowed", isEnabled ? "TRUE" : "FALSE");
    formData.append("minimum_negotiation", minimumNegotiation || 0);

    try {
      setLoading(true);
      console.log("Submitting product data: ", formData);

      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/crops`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Response Text: ", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        console.log("Response data: ", responseData);
        setAlertMessage("Product added successfully!");
        setAlertVisible(true);
        navigation.navigate("My Products");
      } else {
        console.error("Error adding product: ", responseText);
        setAlertMessage("Failed to add product. Please try again.");
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage(
        `An error occurred while adding the product: ${error.message}`
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  //galing sa filter lahat ng nasa baba nitong comment
  const [varietyFormData, setVarietyFormData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFormData, setCategoryFormData] = useState([]);
  const [subCategoryFormData, setSubCategoryFormData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [variety, setVariety] = useState(null);
  const [varietySizesData, setVarietySizesData] = useState([]);
  const [sizesData, setSizesData] = useState([]);
  const [sizesFormData, setSizesFormData] = useState([]);
  const [metricData, setMetricData] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [minimumPrice, setMinimumPrice] = useState();
  const [maximumPrice, setMaximumPrice] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQuantityName, setSelectedQuantityName] = useState('');
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [activeField, setActiveField] = useState('');
  const [combinedData, setCombinedData] = useState([]);
  const [cropsData, setCropsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [varietyData, setVarietyData] = useState([]);
  const [cropsFormData, setCropsFormData] = useState([]);
  const [varietySizesFormData, setVarietySizesFormData] = useState([]);
  const [metricFormData, setMetricFormData] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [varietyId, setVarietyId] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');


  const handleOpenModal = (field) => {
    setModalData(modalItems[field]);
    setActiveField(field);
    setSearchText('');
    setModalVisible(true);
  };

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

  const filteredItems = modalData.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

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
  const getButtonStyle = (classType) => ({
    backgroundColor: selectedClasses.includes(classType) ? '#00B251' : '#8f8d8d',
    padding: 12,
    borderRadius: 5,
    minWidth: 55,
    justifyContent: 'center',
    alignItems: 'center',
  });
  
  const toggleClassSelection = (classType) => {
    if (selectedClasses.includes(classType)) {
      setSelectedClasses(selectedClasses.filter(item => item !== classType));
    } else {
      setSelectedClasses([...selectedClasses, classType]);
    }
  };

  const sizes = sizesFormData && sizesFormData.length > 0
  ? sizesFormData.map(size => ({
    label: size.crop_size_name,
    value: size.crop_size_id,
  }))
  : [];

  const quantities = [
    { label: '1-5', value: [1, 5] },
    { label: '6-10', value: [6, 10] },
    { label: '11-20', value: [11, 20] },
    { label: '21+', value: [21, 999999] },
  ];

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
          const filterCategoryVarieties = varietyData.filter(cat => cat.crop_category_id === Number(item.value));
          if (filterCategoryVarieties) {
            setVarietyFormData(filterCategoryVarieties)
          }
        }
        // Filter Forms
        const filterSubCategoryVarieties = varietyData.filter(cat => cat.crop_category_id === Number(item.value));
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
          const filterCategoryVarieties = varietyData.filter(cat => cat.crop_category_id === selectedVariety.crop_category_id);
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
  const handleSelectQuantity = (qty) => {
    setSelectedQuantity(qty.value)
    setSelectedQuantityName(qty.label)
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {/* Category Button - from filter */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">Choose Category:</Text>
            <TouchableOpacity onPress={() => handleOpenModal('category')} className="border border-gray-500 rounded-lg p-2 px-4 mx-2 ">
              <Text className="text-base pl-2">{category ? `${category}` : 'No category selected'}</Text>
            </TouchableOpacity>
          </View>

          {/* Subcategory Button - from filter */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">Choose Subcategory:</Text>
            <TouchableOpacity onPress={() => handleOpenModal('subcategory')} className="border border-gray-500 rounded-lg p-2 px-4 mx-2">
              <Text className="text-base pl-2">{subcategory ? `${subcategory}` : 'No subcategory selected'}</Text>
            </TouchableOpacity>
          </View>

          {/* Variety Button - from filter */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">Choose Variety:</Text>
            <TouchableOpacity onPress={() => handleOpenModal('variety')} className="border border-gray-500 rounded-lg p-2 px-4 mx-2">
              <Text className="text-base pl-2">{variety ? variety : 'No variety selected'}</Text>
            </TouchableOpacity>
          </View>

          {/* Modified na Crop Description */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Crop Description <Text className="text-red-500 text-sm">*</Text>
              {errors.cropDescription && (
                <Text className="text-red-600 text-xs">
                  {errors.cropDescription}
                </Text>
              )}
            </Text>
            <TextInput
              className="border border-gray-500 p-2 px-6 mx-2 bg-white rounded-lg shadow-md text-base text-gray-700"
              placeholder="Describe the crop you want to sell."
              value={cropDescription}
              onChangeText={setCropDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Class Selection  - from filter */}
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

          {/* Size - from filter */}
          <View className="mb-4">
            <Text className="text-lg font-semibold">Choose Size:</Text>
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

          {/* Price Range Slider - from filter */}
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

          {/* Mej modified na Metric System Selector */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-1">
              Choose Metric System:<Text className="text-red-500 text-sm">*</Text>
                {errors.selectedMetricSystemId && (
                  <Text className="text-red-600 text-xs">
                    {errors.selectedMetricSystemId}
                  </Text>
                )}
            </Text>
            <TouchableOpacity
              className="border border-gray-500 rounded-lg p-2 px-4 mx-2"
              onPress={() => setIsClickedMetricSystem(!isClickedMetricSystem)}
            >
              <Text className="text-base text-gray-700 flex-1 px-4">
                {selectedMetricSystem}
              </Text>
              {/* <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              /> */}
            </TouchableOpacity>
            {isClickedMetricSystem && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {metricSystem.map((metric) => (
                  <TouchableOpacity
                    key={metric.metric_system_id}
                    className="p-2"
                    onPress={() => handleMetricSelect(metric)}
                  >
                    <Text className="text-base">
                      {metric.metric_system_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quantity Selection - from filter*/}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold">How Many Would You Like to Sell?</Text>
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

          {/* Modified Negotiation Selector */}
          <View className="mb-4">
            <Text className='text-lg font-semibold'>Open for Negotiation?</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Text className="text-lg">{isEnabled ? "Yes" : "No"}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#00b251" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            {isEnabled && (
              <>
                <View>
                  <Text className="mb-2 text-lg font-semibold">
                    Minimum Quantity for Negotiation:
                  </Text>
                  <TextInput
                    className="border border-gray-500 p-2 px-6 mx-2 bg-white rounded-lg shadow-md text-base text-gray-700"
                    keyboardType="numeric"
                    placeholder="5"
                    value={minimumNegotiation}
                    onChangeText={setMinimumNegotiation}
                  />
                </View>
              </>
            )}
          </View>

          {/* Modified Image Upload  */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-semibold">
              Upload Crop Image <Text className="text-red-500 text-sm">*</Text>
              {errors.cropImage && (
                <Text className="text-red-600 text-xs">{errors.cropImage}</Text>
              )}
            </Text>
            <TouchableOpacity
              className="border border-dashed border-green-600 rounded-md p-4  flex-row justify-center items-center "
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={24} color="#00b251" />
            </TouchableOpacity>

            {cropImage && (
              <View className="mt-4">
                <Image
                  source={{ uri: cropImage }}
                  className="w-full h-64 rounded-lg"
                />
                <TouchableOpacity
                  className="mt-2 bg-red-500 p-2 rounded-lg"
                  onPress={removeImage}
                >
                  <Text className="text-white text-center">Remove Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>


          {/* original */}
          {/* Crop Description */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Description <Text className="text-red-500 text-sm">*</Text>
              {errors.cropDescription && (
                <Text className="text-red-600 text-xs">
                  {errors.cropDescription}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2  bg-white rounded-lg shadow-md"
              placeholder="Describe the crop you want to sell."
              value={cropDescription}
              onChangeText={setCropDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Category <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCategoryId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCategoryId}
                </Text>
              )}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center w-full p-2 bg-white rounded-lg shadow flex-1"
                onPress={() => setIsClickedCategory(!isClickedCategory)}
              >
                <Text className="text-base text-gray-700 flex-1">
                  {selectedCategory}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="gray"
                  className="ml-2"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className=" ml-2 p-2 rounded-lg "
                onPress={() => navigation.navigate("Add Crop Category")}
              >
                <Ionicons name="add-outline" size={24} color="#00b251" />
              </TouchableOpacity>
            </View>
            {isClickedCategory && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.crop_category_id}
                    className="p-2"
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text className="text-base">
                      {category.crop_category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Sub-Category Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Sub-Category <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedSubCategoryId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedSubCategoryId}
                </Text>
              )}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md flex-1"
                onPress={() => setIsclickedSubCategory(!isClickedSubCategory)}
              >
                <Text className="text-base text-gray-700 flex-1">
                  {selectedSubCategory}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="gray"
                  className="ml-2"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 p-2 rounded-lg"
                onPress={() => navigation.navigate("Add Crop Sub Category")}
              >
                <Ionicons name="add-outline" size={24} color="#00b251" />
              </TouchableOpacity>
            </View>
            {isClickedSubCategory && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {subCategories.map((subCategory) => (
                  <TouchableOpacity
                    key={subCategory.crop_sub_category_id}
                    className="p-2"
                    onPress={() => handleSubCategorySelect(subCategory)}
                  >
                    <Text className="text-base">
                      {subCategory.crop_sub_category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Variety Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Variety <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCropVarietyId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCropVarietyId}
                </Text>
              )}
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center w-full p-2 mb-3 bg-white rounded-lg shadow-md flex-1"
                onPress={() => setIsClickedCropVariety(!isClickedCropVariety)}
              >
                <Text className="text-base text-gray-700 flex-1">
                  {selectedCropVariety}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="gray"
                  className="ml-2"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 p-2 rounded-lg"
                onPress={() => navigation.navigate("Add Crop Variety")}
              >
                <Ionicons name="add-outline" size={24} color="#00b251" />
              </TouchableOpacity>
            </View>
            {isClickedCropVariety && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {cropVarieties.map((cropVariety) => (
                  <TouchableOpacity
                    key={cropVariety.crop_variety_id}
                    className="p-2"
                    onPress={() => handleCropVarietySelect(cropVariety)}
                  >
                    <Text className="text-base">
                      {cropVariety.crop_variety_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Class */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Class <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCropClass && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCropClass}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
              onPress={() => setIsClickedCropClass(!isClickedCropClass)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCropClass}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCropClass && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {cropClasses.map((cropClass) => (
                  <TouchableOpacity
                    key={cropClass.crop_class_id}
                    className="p-2"
                    onPress={() => handleCropClassSelect(cropClass)}
                  >
                    <Text className="text-base">
                      {cropClass.crop_class_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop SIze */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Size <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedCropSizeId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedCropSizeId}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
              onPress={() => setIsClickedCropSize(!isClickedCropSize)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedCropSize}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedCropSize && (
              <View className="border border-gray-300 rounded-lg p-2 mt-1">
                {cropSizes.map((cropSize) => (
                  <TouchableOpacity
                    key={cropSize.crop_size_id}
                    className="p-2"
                    onPress={() => handleCropSizeSelect(cropSize)}
                  >
                    <Text className="text-base">{cropSize.crop_size_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Crop Price */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Price <Text className="text-red-500 text-sm">*</Text>
              {errors.cropPrice && (
                <Text className="text-red-600 text-xs">{errors.cropPrice}</Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg shadow-md"
              keyboardType="numeric"
              placeholder="₱ 0.00"
              value={cropPrice}
              onChangeText={(text) => {
                setCropPrice(text);
                if (!PRICE_REGEX.test(text)) {
                  setErrors((prev) => ({
                    ...prev,
                    CropPrice: "Enter a valid price (e.g., 100 or 100.00).",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, CropPrice: "" }));
                }
              }}
            />
          </View>

          {/* Crop Quantity */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Quantity <Text className="text-red-500 text-sm">*</Text>
              {errors.cropQuantity && (
                <Text className="text-red-600 text-xs">
                  {errors.cropQuantity}
                </Text>
              )}
            </Text>
            <TextInput
              className="w-full p-2 bg-white rounded-lg shadow-md"
              keyboardType="numeric"
              placeholder="Enter the quantity of the crop."
              value={cropQuantity}
              onChangeText={setCropQuantity}
            />
          </View>

          {/* Metric System Selector */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Crop Metric <Text className="text-red-500 text-sm">*</Text>
              {errors.selectedMetricSystemId && (
                <Text className="text-red-600 text-xs">
                  {errors.selectedMetricSystemId}
                </Text>
              )}
            </Text>
            <TouchableOpacity
              className="flex-row items-center w-full p-2 bg-white rounded-lg shadow-md"
              onPress={() => setIsClickedMetricSystem(!isClickedMetricSystem)}
            >
              <Text className="text-base text-gray-700 flex-1">
                {selectedMetricSystem}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="gray"
                className="ml-2"
              />
            </TouchableOpacity>
            {isClickedMetricSystem && (
              <View className="w-full p-2 mb-4 bg-white rounded-lg shadow-md">
                {metricSystem.map((metric) => (
                  <TouchableOpacity
                    key={metric.metric_system_id}
                    className="p-2"
                    onPress={() => handleMetricSelect(metric)}
                  >
                    <Text className="text-base">
                      {metric.metric_system_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Negotiation Selector */}
          <Text className="text-sm mb-2 text-gray-800">
            Open for Negotiation?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text>{isEnabled ? "Yes" : "No"}</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#00b251" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          {isEnabled && (
            <>
              <View className="mb-4">
                <Text className="text-sm mb-2 text-gray-800">
                  Minimum Quantity for Negotiation:
                </Text>
                <TextInput
                  className="w-full p-2 bg-white rounded-lg shadow-md"
                  keyboardType="numeric"
                  placeholder="5"
                  value={minimumNegotiation}
                  onChangeText={setMinimumNegotiation}
                />
              </View>
            </>
          )}

          {/* Image Upload */}
          <View className="mb-4">
            <Text className="text-sm mb-2 text-gray-800">
              Upload Crop Image <Text className="text-red-500 text-sm">*</Text>
              {errors.cropImage && (
                <Text className="text-red-600 text-xs">{errors.cropImage}</Text>
              )}
            </Text>
            <TouchableOpacity
              className="border border-dashed border-green-600 rounded-md p-4  flex-row justify-center items-center "
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={24} color="#00b251" />
            </TouchableOpacity>

            {cropImage && (
              <View className="mt-4">
                <Image
                  source={{ uri: cropImage }}
                  className="w-full h-64 rounded-lg"
                />
                <TouchableOpacity
                  className="mt-2 bg-red-500 p-2 rounded-lg"
                  onPress={removeImage}
                >
                  <Text className="text-white text-center">Remove Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>


          {/* Bottom Buttons */}
          <View className="flex-row justify-between px-4 py-4 bg-white border-t border-gray-200">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-gray-400 p-3 rounded-lg w-[45%] items-center"
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible1(true)}
              className="bg-green-600 p-3 rounded-lg w-[45%] items-center"
            >
              <Text className="text-white font-semibold">Add Product</Text>
            </TouchableOpacity>
          </View>
          
          {/* Confirmation Modal */}
          <Modal
            transparent={true}
            visible={modalVisible1}
            animationType="slide"
            onRequestClose={() => setModalVisible1(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="w-4/5 bg-white p-6 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Add Product
                </Text>
                <Text className="text-gray-600 mb-6">
                  Do you really want to add this product?
                </Text>
                <View className="flex-row justify-end space-x-4">
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-gray-200"
                    onPress={() => setModalVisible1(false)}
                  >
                    <Text className="text-gray-700 text-base">No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-[#00B251]"
                    onPress={() => {
                      setModalVisible1(false);
                      handleAddProduct();
                    }}
                  >
                    <Text className="text-white text-base">Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/* Modal for Image Selection */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Select Image Source
            </Text>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectImageFromGallery}
            >
              <Text className="text-white text-center">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mb-4 p-4 bg-[#00B251] rounded-lg"
              onPress={selectImageFromCamera}
            >
              <Text className="text-white text-center">Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 bg-red-500 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal for Selecting Items */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible2(false)}
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

export default AddProductScreen;
