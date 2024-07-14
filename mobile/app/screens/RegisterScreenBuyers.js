import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import RadioForm from "react-native-simple-radio-button";
import DateTimePicker from "@react-native-community/datetimepicker";

function RegisterScreenBuyers({navigation}) {
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
          <Text className="text-3xl font-bold mt-6 mb-6 text-gray-800 text-center">
            Register
          </Text>
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
            <RadioForm
              radio_props={genderOptions}
              initial={-1}
              formHorizontal={true}
              labelHorizontal={true}
              buttonColor="#00B251"
              selectedButtonColor="#00B251"
              className="mb-2"
              labelStyle={{ marginRight: 20 }}
              onPress={(value) => setSelectedGender(value)}
            />
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
              onPress={() => navigation.navigate('OTP Screen')}
              className="w-full p-3 bg-[#00B251] rounded-lg shadow-md"
            >
              <Text className="text-white text-center text-lg">Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

export default RegisterScreenBuyers;
