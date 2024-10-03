import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import EditMap from "../../../components/EditMap";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
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

function EditAddress({ route, navigation }) {
  const { profile } = route.params;
  const { address } = route.params;

  // State variables for all address inputs
  const [house_number, setHouseNumber] = useState('');
  const [street_name, setStreetName] = useState('');
  const [building, setBuilding] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [barangay, setBarangay] = useState('');
  const [postal_code, setPostalCode] = useState('');
  // const [latitude, setLatitude] = useState('');
  // const [longitude, setLongitude] = useState('');
  const [secondAddressInput, setSecondAddressInput] = useState('');
  const addressInput_regex = /^.{5,}$/;
  const secondAddressInput_regex = /^.{5,}$/;

  const [errors, setErrors] = useState({
    houseNumberError: '',
    streetNameError: '',
    buildingError: '',
    regionError: '',
    cityError: '',
    provinceError: '',
    barangayError: '',
    postalCodeError: '',
    secondAddressInputError: ''
  });

  // Initialize the state with the address data from route.params
  useEffect(() => {
    if (address) {
      const { house_number, street_name, building, region, city, province, barangay, postal_code, secondAddressInput, note } = address;
      setHouseNumber(house_number || '');
      setStreetName(street_name || '');
      setBuilding(building || '');
      setRegion(region || '');
      setCity(city || '');
      setProvince(province || '');
      setBarangay(barangay || '');
      setPostalCode(postal_code || '');
      setSecondAddressInput(secondAddressInput || '');
      setNoteText(note || '');
      setLabelText(address.label || ''); // set label if it exists
    }
  }, [address]);

  const validateAddressForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field
    if (!house_number) {
      newErrors.houseNumberError = "Enter your House Number";
      isValid = false;
    } else {
      newErrors.houseNumberError = "";
    }

    if (!street_name) {
      newErrors.streetNameError = "Enter your Street Name";
      isValid = false;
    } else {
      newErrors.streetNameError = "";
    }

    if (building.length > 50) {
      newErrors.buildingError = "Building name is too long";
      isValid = false;
    } else {
      newErrors.buildingError = "";
    }

    if (!region) {
      newErrors.regionError = "Enter your Region";
      isValid = false;
    } else {
      newErrors.regionError = "";
    }

    if (!city) {
      newErrors.cityError = "Enter your City";
      isValid = false;
    } else {
      newErrors.cityError = "";
    }

    if (!province) {
      newErrors.provinceError = "Enter your Province";
      isValid = false;
    } else {
      newErrors.provinceError = "";
    }

    if (!barangay) {
      newErrors.barangayError = "Enter your Barangay";
      isValid = false;
    } else {
      newErrors.barangayError = "";
    }

    if (!postal_code) {
      newErrors.postalCodeError = "Enter your Postal Code";
      isValid = false;
    } else {
      newErrors.postalCodeError = "";
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateAddressForm()) {
      // Create an updated address object
      const updatedAddress = {
        house_number,
        street_name,
        building,
        region,
        city,
        province,
        barangay,
        postal_code,
        secondAddressInput,
        note: noteText,
        label: labelText,
        latitude: position.latitude,
        longitude: position.longitude
      };
      navigation.navigate("Address", { profile, updatedAddress });
    }
  };

  const { label, note, latitude, longitude } = address;
  const [position, setPosition] = useState({ latitude, longitude });
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
          <MessagesIcon onPress={() => navigation.navigate("ChatListScreen")} />
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
          
          {/* House Number Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">House Number:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter House Number"
            value={house_number}
            onChangeText={setHouseNumber}
          />
          {errors.houseNumberError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.houseNumberError}</Text> : null}
          
          {/* Street Name Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">Street Name:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter Street Name"
            value={street_name}
            onChangeText={setStreetName}
          />
          {errors.streetNameError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.streetNameError}</Text> : null}

          {/* Building Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">Building:</Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter Building Name (Optional)"
            value={building}
            onChangeText={setBuilding}
          />
          {errors.buildingError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.buildingError}</Text> : null}

          {/* Barangay Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">Barangay:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter Barangay"
            value={barangay}
            onChangeText={setBarangay}
          />
          {errors.barangayError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.barangayError}</Text> : null}

          {/* City Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">City:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter City"
            value={city}
            onChangeText={setCity}
          />
          {errors.cityError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.cityError}</Text> : null}

          {/* Province Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">Province:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter Province"
            value={province}
            onChangeText={setProvince}
          />
          {errors.provinceError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.provinceError}</Text> : null}

          {/* Region Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">Region:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter Region"
            value={region}
            onChangeText={setRegion}
          />
          {errors.regionError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.regionError}</Text> : null}

          {/* Postal Code Input */}
          <Text className="text-base font-bold text-gray-800 mb-2">Postal Code:
            <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border-b border-gray-300 py-2 mb-2 text-black"
            placeholder="Enter Postal Code"
            value={postal_code}
            onChangeText={setPostalCode}
          />
          {errors.postalCodeError ? <Text style={{ color: "red", marginTop: 4 }}>{errors.postalCodeError}</Text> : null}

          {/* Note Input */}
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-2 text-black"
            placeholder="Give us more information about your address. Note to rider - e.g. landmark"
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={4}
          />
          <Text className="self-end text-gray-500 mb-2">{noteText.length}/300</Text>

          {/* Label Selection */}
          <Text className="text-lg font-bold text-black mb-2">Choose Label:</Text>
          <View className="flex flex-col gap-1 mb-4">
            <View className="flex flex-row">
              <LabelButton label="Home" icon="home" selectedLabel={labelText} onPress={() => handleLabelSelect("Home")} />
              <LabelButton label="Work" icon="briefcase" selectedLabel={labelText} onPress={() => handleLabelSelect("Work")} />
              <LabelButton label="Office" icon="briefcase" selectedLabel={labelText} onPress={() => handleLabelSelect("Office")} />
            </View>
            <View className="flex flex-row">
              <LabelButton label="Partner" icon="heart" selectedLabel={labelText} onPress={() => handleLabelSelect("Partner")} />
              <LabelButton label="Other" icon="map-marker" selectedLabel={labelText} onPress={() => handleLabelSelect("Other")} />
              <View className="flex-1 items-center justify-center"></View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-full items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-semibold">Save and continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default styled(EditAddress);
