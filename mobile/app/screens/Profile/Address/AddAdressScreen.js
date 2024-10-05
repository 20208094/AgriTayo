import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import { Icon } from "react-native-elements";
import Map from "../../../components/Map";
import * as Location from "expo-location";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../../components/SearchBarC";

function AddAddressScreen({
  navigation,
  route,
  onLocationSelect = () => {},  // Use directly as props
}) {
  const { profile, currentLocation } = route.params;

  const [addressInput, setAddressInput] = useState("");
  const [secondAddressInput, setSecondAddressInput] = useState("");
  const [note, setNote] = useState("");
  const [label, setLabel] = useState("Partner");

  const addressInput_regex = /^.{5,}$/;
  const secondAddressInput_regex = /^.{5,}$/;

  const [errors, setErrors] = useState({
    addressInputError: "",
    secondAddressInputError: "",
  });

  useEffect(() => {
    if (!currentLocation) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Permission Denied",
            "Permission to access location was denied"
          );
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        handleLocationSelect({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      })();
    }
  }, [currentLocation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
          <MarketIcon onPress={() => navigation.navigate("Market")} />
        </View>
      ),
    });
  }, [navigation]);

  const validateAddressForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!addressInput) {
      newErrors.addressInputError = "Enter your Address";
      isValid = false;
    } else if (!addressInput_regex.test(addressInput)) {
      newErrors.addressInputError = "Invalid Address, Please Try Again.";
      isValid = false;
    } else {
      newErrors.addressInputError = "";
    }

    if (!secondAddressInput) {
      newErrors.secondAddressInputError = "Enter your Floor/Unit/Room";
      isValid = false;
    } else if (!secondAddressInput_regex.test(secondAddressInput)) {
      newErrors.secondAddressInputError =
        "Invalid Floor/Unit/Room, Please Try Again";
      isValid = false;
    } else {
      newErrors.secondAddressInputError = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateAddressForm()) {
      navigation.navigate("Address", { profile });
    }
  };

  const handleLabelSelect = (selectedLabel) => {
    setLabel(selectedLabel);
  };

  // Handle location select and set the address input
  const handleLocationSelect = async (selectedLocation) => {
    setAddressInput(""); // Reset the address while fetching the new one

    // Reverse geocoding to get address from coordinates
    const location = await Location.reverseGeocodeAsync(selectedLocation);
    if (location.length > 0) {
      const formattedAddress = `${location[0].name || ''} ${location[0].street || ''} ${location[0].city || ''}`;
      setAddressInput(formattedAddress);  // Automatically update the address input
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Map
          currentLocation={currentLocation}
          onLocationSelect={handleLocationSelect}
        />
        <View className="p-5">
          <Text className="text-2xl font-bold text-black mb-2">
            Add your address
          </Text>
          <View className="flex-row items-center mb-2">
            <Icon
              name="map-marker"
              type="font-awesome"
              size={20}
              color="#00B251"
            />
            <TextInput
              className="flex-1 border-b border-gray-300 mx-2 py-1 text-black"
              placeholder="St. John Inn Dominican Hill Rd"
              value={addressInput}
              onChangeText={setAddressInput}
            />
            <Icon name="edit" type="font-awesome" size={20} color="#00B251" />
          </View>
          {errors.addressInputError ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.addressInputError}
            </Text>
          ) : null}
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Floor/Unit/Room #"
            value={secondAddressInput}
            onChangeText={setSecondAddressInput}
          />
          {errors.secondAddressInputError ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.secondAddressInputError}
            </Text>
          ) : null}
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-2 text-black"
            placeholder="Give us more information about your address. Note to rider - e.g. landmark"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />
          <Text className="self-end text-gray-500 mb-2">{note.length}/300</Text>
          <Text className="text-lg font-bold text-black mb-2">Add a label</Text>
          <View className="flex-wrap flex-row justify-between mb-5">
            <TouchableOpacity
              className={`flex-row items-center border ${
                label === "Home" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Home")}
            >
              <Icon
                name="home"
                type="font-awesome"
                size={20}
                color={label === "Home" ? "white" : "#00B251"}
              />
              <Text
                className={`ml-2 ${
                  label === "Home" ? "text-white" : "text-green-600"
                }`}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center border ${
                label === "Work" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Work")}
            >
              <Icon
                name="briefcase"
                type="font-awesome"
                size={20}
                color={label === "Work" ? "white" : "#00B251"}
              />
              <Text
                className={`ml-2 ${
                  label === "Work" ? "text-white" : "text-green-600"
                }`}
              >
                Work
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center border ${
                label === "Partner" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Partner")}
            >
              <Icon
                name="heart"
                type="font-awesome"
                size={20}
                color={label === "Partner" ? "white" : "#00B251"}
              />
              <Text
                className={`ml-2 ${
                  label === "Partner" ? "text-white" : "text-green-600"
                }`}
              >
                Partner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center border ${
                label === "Other" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Other")}
            >
              <Icon
                name="plus"
                type="font-awesome"
                size={20}
                color={label === "Other" ? "white" : "#00B251"}
              />
              <Text
                className={`ml-2 ${
                  label === "Other" ? "text-white" : "text-green-600"
                }`}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-full items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-semibold">
              Save and continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default styled(AddAddressScreen);
