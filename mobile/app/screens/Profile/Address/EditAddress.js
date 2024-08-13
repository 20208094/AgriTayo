import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import EditMap from "../../../components/EditMap";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import { NotificationIcon, MessagesIcon, MarketIcon } from "../../../components/SearchBarC";

function EditAddress({ route, navigation }) {
  const { address } = route.params;
  const { label, address: addressDetail, note, latitude, longitude } = address;

  const [position, setPosition] = useState({ latitude, longitude });
  const [addressText, setAddressText] = useState(addressDetail);
  const [noteText, setNoteText] = useState(note);
  const [labelText, setLabelText] = useState(label);

  const handleLabelSelect = (selectedLabel) => {
    setLabelText(selectedLabel);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <NotificationIcon onPress={() => navigation.navigate("Notifications")} />
          <MessagesIcon onPress={() => navigation.navigate("Messages")} />
          <MarketIcon onPress={() => navigation.navigate("Market")} />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <EditMap
          initialPosition={position}
          onPositionChange={(newPosition) => setPosition(newPosition)}
          selectedAddress={address}
        />
        <View className="p-5">
          <Text className="text-2xl font-bold text-black mb-2">Edit your address</Text>
          <View className="flex-row items-center mb-2">
            <Icon name="map-marker" type="font-awesome" size={20} color="#00B251" />
            <TextInput
              className="flex-1 border-b border-gray-300 mx-2 py-1 text-black"
              placeholder="St. John Inn Dominican Hill Rd"
              value={addressText}
              onChangeText={setAddressText}
            />
            <Icon name="edit" type="font-awesome" size={20} color="#00B251" />
          </View>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Floor/Unit/Room #"
            value={noteText}
            onChangeText={setNoteText}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-2 text-black"
            placeholder="Give us more information about your address. Note to rider - e.g. landmark"
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={4}
          />
          <Text className="self-end text-gray-500 mb-2">{noteText.length}/300</Text>
          <Text className="text-lg font-bold text-black mb-2">Add a label</Text>
          <View className="flex-wrap flex-row justify-between mb-5">
            <TouchableOpacity
              className={`flex-row items-center border ${
                labelText === "Home" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Home")}
            >
              <Icon name="home" type="font-awesome" size={20} color={labelText === "Home" ? "white" : "#00B251"} />
              <Text className={`ml-2 ${labelText === "Home" ? "text-white" : "text-green-600"}`}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center border ${
                labelText === "Work" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Work")}
            >
              <Icon name="briefcase" type="font-awesome" size={20} color={labelText === "Work" ? "white" : "#00B251"} />
              <Text className={`ml-2 ${labelText === "Work" ? "text-white" : "text-green-600"}`}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center border ${
                labelText === "Partner" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Partner")}
            >
              <Icon name="heart" type="font-awesome" size={20} color={labelText === "Partner" ? "white" : "#00B251"} />
              <Text className={`ml-2 ${labelText === "Partner" ? "text-white" : "text-green-600"}`}>Partner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center border ${
                labelText === "Other" ? "bg-green-600" : "border-green-600"
              } rounded-lg py-2 px-3 m-1`}
              onPress={() => handleLabelSelect("Other")}
            >
              <Icon name="plus" type="font-awesome" size={20} color={labelText === "Other" ? "white" : "#00B251"} />
              <Text className={`ml-2 ${labelText === "Other" ? "text-white" : "text-green-600"}`}>Other</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-full items-center"
            onPress={() => {
              Alert.alert(
                "Address Saved",
                `Address: ${addressText}, Note: ${noteText}, Label: ${labelText}`
              );
            }}
          >
            <Text className="text-white text-lg font-semibold">Save and continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default styled(EditAddress);
