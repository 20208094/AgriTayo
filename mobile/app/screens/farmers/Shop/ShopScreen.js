import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { ScrollView } from "react-native-gesture-handler";
import NavigationbarComponent from "../../../components/NavigationbarComponent";

function ShopScreen({ navigation }) {
  const [shopData, setShopData] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getAsyncUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          const user = parsedData[0];
          setUserData(user);
          setUserId(user.user_id);
          setSenderId(user.user_id);
        } else {
          setUserData(parsedData);
          setUserId(parsedData.user_id);
          setSenderId(parsedData.user_id);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const getAsyncShopData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("shopData");

      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse storedData

        if (Array.isArray(parsedData)) {
          const shop = parsedData[0]; // Assuming shop data is the first element of the array
          setShopData(shop); // Set shopData state to the shop object
          checkIncompleteFields(shop);
        } else {
          setShopData(parsedData); // If it's not an array, directly set parsed data
          checkIncompleteFields(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIncompleteFields = (shop) => {
    const fields = [];
    if (!shop.tin_number || shop.tin_number.trim() === "") fields.push("TIN Number");
    if (!shop.bir_image_url || shop.bir_image_url.trim() === "") fields.push("BIR Image");

    if (fields.length > 0) {
      setIsIncomplete(true);
      setMissingFields(fields);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${REACT_NATIVE_API_BASE_URL}/api/orders`, {
        headers: {
          "x-api-key": REACT_NATIVE_API_KEY,
        },
      });
      if (response.ok) {
        const allOrds = await response.json();
        setOrders(allOrds);
      } else {
        console.error("Failed to fetch orders:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/order_statuses`,
        {
          headers: {
            "x-api-key": REACT_NATIVE_API_KEY,
          },
        }
      );
      if (response.ok) {
        const allOrdStat = await response.json();
        const updatedStatuses = allOrdStat.map((status) => {
          const totalOrders = orders.filter(
            (order) =>
              order.status_id === status.order_status_id &&
              order.shop_id === shopData.shop_id
          ).length;
          return { ...status, totalOrders };
        });
        setOrderStatuses(updatedStatuses);
      } else {
        console.error("Failed to fetch order statuses:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching order statuses:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          await getAsyncShopData();
          await fetchOrders();
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      getAsyncUserData();
    }, [])
  );

  useEffect(() => {
    if (orders.length > 0) {
      fetchOrderStatus();
    }
  }, [orders, shopData]);

  // Chat Support logic from LearnAndHelpScreen.js
  const handleChatSupportClick = () => {
    if (userData) {
      navigation.navigate("ChatScreen", {
        senderId: userId,
        receiverId: 1,
        receiverName: "Admin",
        receiverType: "User",
        senderType: "User",
        receiverImage: "user_image_url",
      });
    } else {
      console.error("User data not loaded yet");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      
      {/* Header Section */}
      <ScrollView>
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: shopData.shop_image_url }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-lg font-semibold">{shopData.shop_name}</Text>
            </View>
            {isIncomplete && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialIcons name="error-outline" size={20} color="red" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            className="px-4 py-1 border border-[#00B251] rounded-full"
            onPress={() => navigation.navigate("View Shop")}
          >
            <Text className="text-[#00B251]">View Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Modal to show incomplete shop information */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-3/4">
              <Text className="text-lg font-bold mb-4">Incomplete Shop Information</Text>
              <Text className="text-gray-600 mb-4">
                It seems like the shop has not completed all the required information from the Business Information.
                Please ensure that all fields are filled out correctly.
              </Text>
              <Text className="text-red-600 font-bold mb-4">
                Missing Fields: {missingFields.join(', ')}
              </Text>
              <TouchableOpacity
                className="px-4 py-2 my-2  border border-[#00B251] rounded-md"
                onPress={() => navigation.navigate("View Shop")}
              >
                <Text className="text-[#00B251] text-center font-bold">Go To View Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 bg-[#00B251] rounded-md"
              >
                <Text className="text-white text-center font-bold">Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Banner Placeholder */}
        <View className="bg-[#00B251] w-full h-1 mt-2 mb-4" />

        {/* Order Status Section */}
        <View className="flex-row justify-between px-6 mb-3">
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold text-gray-800 w-3/5">
              Shop Orders
            </Text>
            <TouchableOpacity
              className="items-end w-2/5"
              onPress={() =>
                navigation.navigate("Sales History", { screen: "Completed" })
              }
            >
              <Text className="text-green-600">View Purchase History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          {orderStatuses.map((status, index) => {
            // If it's the start of a new row (every 3rd item), we create a new View for the row
            if (index % 3 === 0) {
              return (
                <View key={index} className="flex-row justify-around mb-3">
                  {/* Render up to 3 items within the row */}
                  {orderStatuses.slice(index, index + 3).map((status) => (
                    <TouchableOpacity
                      key={status.order_status_id}
                      className="items-center w-1/3"
                      onPress={() =>
                        navigation.navigate("Sales History", {
                          screen: status.order_status_name,
                        })
                      }
                    >
                      <Text className="text-lg font-bold mb-1">
                        {status.totalOrders}
                      </Text>
                      <Text className="text-gray-500">
                        {status.order_status_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            }
            return null; // Return null for other items to avoid rendering them outside the row
          })}
        </View>

        {/* Modified Grid Section */}
        <View className="px-4 mt-4 mb-4">
          <View className="bg-white rounded-lg shadow p-4 space-y-4">
            {[
              { label: "  My Products", icon: "box", screen: "My Products" },
              {
                label: " My Negotiation",
                icon: "hands-helping",
                screen: "Seller Negotiation List",
              },
              { label: "    My Bid", icon: "file-contract", screen: "Bidding" },
              {
                label: "  Seller FAQ",
                icon: "question-circle",
                screen: "Seller FAQ",
              }, // Added Seller FAQ
              {
                label: " Chat Support",
                icon: "comments",
                action: handleChatSupportClick,
              }, // Added Chat Support
            ].map(({ label, icon, screen, action }) => (
              <TouchableOpacity
                key={label}
                className="flex-row items-center justify-between"
                onPress={() => {
                  if (label === "Negotiation") {
                    navigation.navigate(screen);
                  } else if (action) {
                    action(); // Call the specific action for Chat Support
                  } else {
                    navigation.navigate(screen);
                  }
                }}
              >
                <View className="flex-row items-center">
                  <FontAwesome5 name={icon} size={20} color="#00B251" />
                  <Text className="text-gray-800 font-semibold ml-4">
                    {label}
                  </Text>
                </View>
                <FontAwesome5 name="chevron-right" size={20} color="gray" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <NavigationbarComponent/>
    </SafeAreaView>
  );
}

export default ShopScreen;
