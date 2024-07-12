import React from "react";
import { TextInput, Button, Text, ScrollView } from "react-native";
import RadioForm from 'react-native-simple-radio-button';

function RegisterScreenBuyers() {
  const handleRegister = () => {};

  const genderOptions = [
    {
      label: 'Male', value: 'male',
    },
    {
      label: 'Female', value: 'female',
    }
  ]
  return (
    <ScrollView className="">
      <Text className="">Register</Text>
      <TextInput
        className=''
        placeholder="First Name"
      />
      <TextInput
        className=''
        placeholder="Middle Name"
      />
      <TextInput
        className=''
        placeholder="Last Name"
      />
      <TextInput
        className=''
        placeholder="Birthday"
      />
      <Text className=''>Gender: </Text>
      <RadioForm
        className=''
        radio_props= {genderOptions}
      />
      <TextInput
        className=''
        placeholder="Address"
      />   
      <TextInput
        className=''
        placeholder="Email"
      />
      <TextInput
        className=''
        placeholder="Phone Number"
      />   
      <TextInput
        className=''
        placeholder="Password"
        secureTextEntry={true}
      />
      <TextInput
        className=''
        placeholder="Confirm Password"
        secureTextEntry={true}
      />    
      <Button title="Register" onPress={handleRegister} />
    </ScrollView>
  );
}

export default RegisterScreenBuyers;
