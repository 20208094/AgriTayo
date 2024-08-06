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

function AddAddressScreen({
  route,
  onLocationSelect: handleLocationSelect = () => {},
}) {
  const { currentLocation } = route.params;
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [label, setLabel] = useState("Partner");

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
        setPosition({ latitude: coords.latitude, longitude: coords.longitude });
      })();
    }
  }, [currentLocation]);

  const handleLabelSelect = (selectedLabel) => {
    setLabel(selectedLabel);
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Map
          currentLocation={currentLocation}
          onLocationSelect={handleLocationSelect}
        />
        <View className="p-5">
          <Text className="text-2xl font-bold text-black mb-2">Add your address</Text>
          <View className="flex-row items-center mb-2">
            <Icon name="map-marker" type="font-awesome" size={20} color="#00B251" />
            <TextInput
              className="flex-1 border-b border-gray-300 mx-2 py-1 text-black"
              placeholder="St. John Inn Dominican Hill Rd"
              value={address}
              onChangeText={setAddress}
            />
            <Icon name="edit" type="font-awesome" size={20} color="#00B251" />
          </View>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Floor/Unit/Room #"
            value={note}
            onChangeText={setNote}
          />
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
              <Text className={`ml-2 ${label === "Home" ? "text-white" : "text-green-600"}`}>
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
              <Text className={`ml-2 ${label === "Work" ? "text-white" : "text-green-600"}`}>
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
              <Text className={`ml-2 ${label === "Partner" ? "text-white" : "text-green-600"}`}>
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
              <Text className={`ml-2 ${label === "Other" ? "text-white" : "text-green-600"}`}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-full items-center"
            onPress={() => {
              Alert.alert(
                "Address Saved",
                `Address: ${address}, Note: ${note}, Label: ${label}`
              );
            }}
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
