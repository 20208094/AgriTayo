import React from "react";
import { StyleSheet, View, TextInput, Text, Button } from "react-native";

function LoginScreen({ navigation }) {
  return (
    <View className=''>
      <Text className=''>Login</Text>
      <TextInput className='' placeholder="Email" />
      <TextInput
        className=''
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button
        onPress={() => navigation.navigate("NavigationBar")}
        title="Login"
      />
      <Button
        onPress={() => navigation.navigate("Register")}
        title="Register"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {},

  textLogin: {},

  input: {},
});

export default LoginScreen;
