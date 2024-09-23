import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styled } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";

function EditProfileScreen({ navigation, route }) {
  const { profile } = route.params;
  const handleRegister = () => {
    // handle registration logic here
  };

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const [selectedGender, setSelectedGender] = useState("");

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
      setFormattedDate(currentDate.toLocaleDateString());
    } else {
      setShow(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="w-full max-w-md mx-auto">
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="First Name"
          />
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Middle Name"
          />
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Last Name"
          />
          <TouchableOpacity
            onPress={() => setShow(true)}
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
          >
            <Text className="text-gray-800">
              {formattedDate || "Select Birthday"}
            </Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Text className="text-lg mb-2 text-gray-800">Gender:</Text>
          <View className="flex-row mb-4">
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSelectedGender(option.value)}
                className="flex-row items-center mr-6"
              >
                <View className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center">
                  {selectedGender === option.value && (
                    <FontAwesome name="check" size={25} color="#00B251" />
                  )}
                </View>
                <Text className="ml-2 text-gray-800">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Address"
            multiline={true}
            numberOfLines={3}
          />
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            className="w-full p-3 mb-4 bg-white rounded-lg shadow-md"
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            className="w-full p-3 mb-6 bg-white rounded-lg shadow-md"
            placeholder="Confirm Password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("View Profile", { profile })}
            className="w-full p-3 bg-[#00B251] rounded-lg shadow-md"
          >
            <Text className="text-white text-center text-lg">Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("View Profile", { profile })}
            className="w-full p-3 bg-gray-300 rounded-lg shadow-md mt-4"
          >
            <Text className="text-gray-800 text-center text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default styled(EditProfileScreen);
