import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons"; // Import icon

function AddBidScreen() {
   // for inputs
   const [shopId, setShopId] = useState('')
   const [creationDate, setCreationDate] = useState('')
   const [endDate, setEndDate] = useState('')
   const [bidDescription, setBidDescription] = useState('')
   const [bidName, setBidName] = useState('')
   const [category, setCategory] = useState({})
   const [subCategory, setSubCategory] = useState({})
   const [bidStartingPrice, setBidStartingPrice] = useState('')
   const [bidMinimumIncrement, setBidMinimumIcrement] = useState('')
   const [bidCurrentHighest, setBidCurrentHighest] = useState('')
   const [bidUserId, setBidUserId] = useState('')
   const [numberOfBids, setNumberOfBids] = useState('')
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const chooseImageSource = () => {
    Alert.alert(
      "Select Image Source",
      "Choose whether to take a photo or select from gallery",
      [
        {
          text: "Camera",
          onPress: () => selectImage("camera"),
        },
        {
          text: "Gallery",
          onPress: () => selectImage("gallery"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const selectImage = async (source) => {
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "You need to grant access to the media library to select images."
      );
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    };

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    } else {
      console.log("User cancelled image picker or no image selected");
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <TextInput
          placeholder="Name of the product"
          className="border border-gray-300 p-3 mb-4 rounded-lg"
        />
        <TextInput
          placeholder="Description"
          multiline
          className="border border-gray-300 p-3 mb-4 rounded-lg"
        />
        <TextInput
          placeholder="Price"
          keyboardType="numeric"
          className="border border-gray-300 p-3 mb-4 rounded-lg"
        />

        <TouchableOpacity
          onPress={chooseImageSource}
          className="bg-[#00B251] p-4 rounded-lg flex items-center mb-4"
        >
          <Text className="text-white text-base">Upload Image</Text>
        </TouchableOpacity>

        {/* Display the selected image */}
        {imageUri && (
          <View className="relative mt-4">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-40 rounded-lg"
              resizeMode="contain"
            />
            {/* X Button to remove the image */}
            <TouchableOpacity
              onPress={removeImage}
              className="absolute top-2 right-2 bg-red-600 rounded-full p-1"
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          placeholder="Deadline (day/days)"
          keyboardType="numeric"
          maxLength={2}
          className="border border-gray-300 p-3 mb-4 rounded-lg"
        />

        <TouchableOpacity className="bg-[#00B251] p-4 rounded-lg flex items-center mt-4">
          <Text className="text-white text-base">Add Bid</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default AddBidScreen;
