import React from "react";
import { TextInput, Button, Text, ScrollView } from "react-native";

function RegisterScreenFarmers() {
  const handleRegister = () => {};

  return (
    <ScrollView className="">
      <Text className="">Register</Text>
      <TextInput className="" placeholder="Shop Name" />
      <TextInput className="" placeholder="Shop Address" />
      <TextInput className="" placeholder="Shop Description" />
      <Button title="Register" onPress={handleRegister} />
    </ScrollView>
  );
}

export default RegisterScreenFarmers;
