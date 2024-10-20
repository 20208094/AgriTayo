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

const LabelButton = ({ label, icon, selectedLabel, onPress }) => {
  const isSelected = selectedLabel === label;
  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity
        className={`flex-row items-center justify-center border w-[85%] ${isSelected ? "bg-green-600" : "border-green-600"} rounded-lg py-2 m-1`}
        onPress={onPress}
      >
        <Icon name={icon} type="font-awesome" size={25} color={isSelected ? "white" : "#00B251"} />
        <Text className={`ml-2 ${isSelected ? "text-white" : "text-green-600"}`}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};


function AddAddressScreen({
  navigation,
  route,
  onLocationSelect = () => { },  // Use directly as props
}) {
  const { profile, currentLocation } = route.params;

  // Inputs for the address form
  const [houseNumber, setHouseNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [building, setBuilding] = useState("");
  const [region, setRegion] = useState('');
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [note, setNote] = useState("");
  const [label, setLabel] = useState("Partner");
  const [postal_code, setPostalCode] = useState('');

  // Error states
  const [errors, setErrors] = useState({
    houseNumberError: "",
    streetNameError: "",
    buildingError: "",
    regionError: '',
    barangayError: "",
    cityError: "",
    provinceError: "",
    postalCodeError: '',
  });

  const validateAddressForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate house number
    if (!houseNumber) {
      newErrors.houseNumberError = "Enter your house number";
      isValid = false;
    } else {
      newErrors.houseNumberError = "";
    }

    // Validate street name
    if (!streetName) {
      newErrors.streetNameError = "Enter your street name";
      isValid = false;
    } else {
      newErrors.streetNameError = "";
    }

    // Validate building name
    if (!building) {
      newErrors.buildingError = "Enter your building name";
      isValid = false;
    } else {
      newErrors.buildingError = "";
    }

    // Validate barangay
    if (!barangay) {
      newErrors.barangayError = "Enter your barangay";
      isValid = false;
    } else {
      newErrors.barangayError = "";
    }

    // Validate city
    if (!city) {
      newErrors.cityError = "Enter your city";
      isValid = false;
    } else {
      newErrors.cityError = "";
    }

    // Validate province
    if (!province) {
      newErrors.provinceError = "Enter your province";
      isValid = false;
    } else {
      newErrors.provinceError = "";
    }

    if (!region) {
      newErrors.regionError = "Enter your region";
      isValid = false;
    } else {
      newErrors.regionError = "";
    }

    if (!postal_code) {
      newErrors.postalCodeError = "Enter your postal code";
      isValid = false;
    } else {
      newErrors.postalCodeError = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  // UseEffect for location permission and getting current location
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

  // Custom header icons
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

  // Handle location select and autofill the form based on selected location
  const handleLocationSelect = async (selectedLocation) => {
    try {
      // Reverse geocoding to get address from coordinates
      const location = await Location.reverseGeocodeAsync(selectedLocation);
      if (location.length > 0) {
        const place = location[0];

        // Autofill the form fields
        setHouseNumber(place.streetNumber || ""); // House number
        setStreetName(place.street || "");        // Street name
        setBarangay(place.subLocality || "");     // Barangay
        setCity(place.city || "");                // City
        setProvince(place.region || "");          // Province
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch address from the selected location.");
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (validateAddressForm()) {
      navigation.navigate("Address", { profile });
    }
  };

  // Handle label selection
  const handleLabelSelect = (selectedLabel) => {
    setLabel(selectedLabel);
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Map component for location selection */}
        <Map
          currentLocation={currentLocation}
          onLocationSelect={handleLocationSelect}
        />

        <View className="p-5">
          <Text className="text-2xl font-bold text-black mb-2">
            Add your address
          </Text>

          {/* House Number Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">House Number:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.houseNumberError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.houseNumberError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="House Number"
            value={houseNumber}
            onChangeText={setHouseNumber}
          />


          {/* Street Name Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">Street Name:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.streetNameError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.streetNameError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Street Name"
            value={streetName}
            onChangeText={setStreetName}
          />

          {/* Building Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">Building:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.buildingError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.buildingError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Building"
            value={building}
            onChangeText={setBuilding}
          />

          {/* Barangay Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">Barangay:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.barangayError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.barangayError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Barangay"
            value={barangay}
            onChangeText={setBarangay}
          />


          {/* City Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">City:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.cityError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.cityError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          {/* Province Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">Province:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.provinceError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.provinceError}
              </Text>
            ) : null}

          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Province"
            value={province}
            onChangeText={setProvince}
          />

          {/* Region Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">Region:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.regionError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.regionError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Region"
            value={region}
            onChangeText={setRegion}
          />


          {/* Postal Input */}
          <Text className="text-base font-bold text-[#00B251] mb-2">Postal Code:
            <Text className="text-red-500"> *</Text>
            {" "} {errors.postalCodeError ? (
              <Text className="text-sm w-4/5 text-red-500 mb-4">
                {errors.postalCodeError}
              </Text>
            ) : null}
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Postal Code"
            value={postal_code}
            onChangeText={setPostalCode}
          />


          {/* Note Input */}
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-2 text-black"
            placeholder="Note to rider (e.g. landmark)"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            maxLength={300}
          />
          <Text className="self-end text-gray-500 mb-2">{note.length}/300</Text>

          {/* Label selection */}
          <Text className="text-lg font-bold text-black mb-2">Add a label</Text>
          <View className="flex flex-col gap-1 mb-4">
            <View className="flex flex-row">
              <LabelButton label="Home" icon="home" selectedLabel={label} onPress={() => handleLabelSelect("Home")} />
              <LabelButton label="Work" icon="briefcase" selectedLabel={label} onPress={() => handleLabelSelect("Work")} />
              <LabelButton label="Office" icon="briefcase" selectedLabel={label} onPress={() => handleLabelSelect("Office")} />
            </View>
            <View className="flex flex-row">
              <LabelButton label="Partner" icon="heart" selectedLabel={label} onPress={() => handleLabelSelect("Partner")} />
              <LabelButton label="Other" icon="map-marker" selectedLabel={label} onPress={() => handleLabelSelect("Other")} />
              <View className="flex-1 items-center justify-center"></View>
            </View>
          </View>


          <TouchableOpacity
            className="bg-green-600 py-4 rounded-full items-center"
            onPress={handleSubmit}
          >
            <Text className="text-center text-white font-bold text-lg">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AddAddressScreen;
