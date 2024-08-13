import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";

function BusinessInformationScreen({ navigation, route }) {
  const { profile } = route.params;

  const [birCertificate, setBirCertificate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusinessInformation, setSelectedBusinessInformation] =
    useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [tin, setTin] = useState("");
  const [vatStatus, setVatStatus] = useState("");
  const [swornDeclaration, setSwornDeclaration] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [errors, setErrors] = useState({
    businessInformation: "",
    sellerType: "",
    registeredName: "",
    tin: "",
    vatStatus: "",
    swornDeclaration: "",
    termsAccepted: "",
    birCertificate: "",
  });

  const submitBusinessInformationOptions = [
    { label: "Submit Now", value: "now" },
    { label: "Submit Later", value: "later" },
  ];

  const sellerTypeOptions = [
    { label: "Sole Proprietorship", value: "soleProprietorship" },
    { label: "Partnership / Corporation", value: "partnershipCorporation" },
  ];

  const valueAddedTaxRegistrationStatusOptions = [
    { label: "Vat Registered", value: "vatRegistered" },
    { label: "Non-Vat Registered", value: "nonVatRegistered" },
  ];

  const submitSwornDeclarationOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBirCertificate({ uri: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBirCertificate({ uri: result.assets[0].uri });
      setModalVisible(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!selectedBusinessInformation) {
      newErrors.businessInformation =
        "Business Information option is required.";
      isValid = false;
    } else {
      newErrors.businessInformation = "";
    }

    if (!selectedSellerType) {
      newErrors.sellerType = "Seller Type is required.";
      isValid = false;
    } else {
      newErrors.sellerType = "";
    }

    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!registeredName) {
      newErrors.registeredName = "Registered Name is required";
      isValid = false;
    } else if (!nameRegex.test(registeredName)) {
      newErrors.registeredName =
        "Registered Name must contain only letters, spaces, hyphens, and apostrophes.";
      isValid = false;
    } else {
      newErrors.registeredName = "";
    }

    const tinRegex = /^[0-9]{3}-?[0-9]{3}-?[0-9]{3}$/;
    if (!tin) {
      newErrors.tin = "TIN is required";
      isValid = false;
    } else if (!tinRegex.test(tin)) {
      newErrors.tin = "Tin must be 9 digits (e.g., 123456789 or 123-456-789)";
    } else {
      newErrors.tin = "";
    }

    if (!vatStatus) {
      newErrors.vatStatus = "VAT Status is required.";
      isValid = false;
    } else {
      newErrors.vatStatus = "";
    }

    if (!swornDeclaration) {
      newErrors.swornDeclaration = "Sworn Declaration option is required.";
      isValid = false;
    } else {
      newErrors.swornDeclaration = "";
    }

    if (!isTermsAccepted) {
      newErrors.termsAccepted = "You must agree to the Terms and Conditions.";
      isValid = false;
    } else {
      newErrors.termsAccepted = "";
    }

    if (!birCertificate) {
      newErrors.birCertificate = "BIR Certificate of Registration is required.";
      isValid = false;
    } else {
      newErrors.birCertificate = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigation.navigate("Shop");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#00B251" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>
            Business Information
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: "#00B251", fontWeight: "bold" }}>Save</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              borderBottomWidth: 2,
              borderBottomColor: "#ccc",
              paddingBottom: 8,
            }}
          >
            <Text style={{ textAlign: "center", color: "#ccc" }}>
              Shop Information
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderBottomWidth: 2,
              borderBottomColor: "#2F855A",
              paddingBottom: 8,
            }}
          >
            <Text style={{ textAlign: "center", color: "#2F855A" }}>
              Business Information
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#2F855A",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Business Information
        </Text>
        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            color: "#999",
            marginVertical: 16,
          }}
        >
          The information will be used to ensure proper compliance to seller
          onboarding requirements to e-marketplace and invoicing purposes.
          (Note: We will not re-issue any invoices or tax documents due to
          incomplete or incorrect information provided by sellers.)
        </Text>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#2F855A",
              marginBottom: 8,
            }}
          >
            Submit Business Information?
          </Text>
          {submitBusinessInformationOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedBusinessInformation(option.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    selectedBusinessInformation === option.value
                      ? "#2F855A"
                      : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedBusinessInformation === option.value && (
                  <FontAwesome name="check-circle" size={20} color="#2F855A" />
                )}
              </View>
              <Text style={{ marginLeft: 8, color: "black" }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.businessInformation ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.businessInformation}
            </Text>
          ) : null}
        </View>

        <Text style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>
          You may choose to submit your Business Information some other time if
          you're not yet ready. However, you will not be allowed to start
          selling on our platform until you do so.
        </Text>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#2F855A",
              marginBottom: 8,
            }}
          >
            Seller Type
          </Text>
          {sellerTypeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedSellerType(option.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    selectedSellerType === option.value ? "#2F855A" : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedSellerType === option.value && (
                  <FontAwesome name="check-circle" size={20} color="#2F855A" />
                )}
              </View>
              <Text style={{ marginLeft: 8, color: "black" }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.sellerType ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.sellerType}
            </Text>
          ) : null}
        </View>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#2F855A",
              marginBottom: 8,
            }}
          >
            Registered Name
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 4,
              padding: 8,
              marginBottom: 8,
            }}
            placeholder="Input"
            value={registeredName}
            onChangeText={setRegisteredName}
          />
          {errors.registeredName ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.registeredName}
            </Text>
          ) : null}
        </View>

        <Text style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>
          Last Name, First Name (e.g. Dela Cruz, Juan)
        </Text>

        <View style={{ marginTop: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#2F855A",
              marginBottom: 1,
            }}
          >
            Registered Address
          </Text>
        <TouchableOpacity 
          className='bg-gray-100 rounded-md p-3 my-2 flex-row justify-between items-center'
          onPress={() => navigation.navigate("Address", {profile})}
        >
          <Text className='text-base text-black'>Registered Address: {profile.address}</Text>
          <Icon name="chevron-right" type="font-awesome" size={24} color="#2F855A" />
        </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 18, fontWeight: "600", color: "#2F855A" }}>
          Taxpayer Identification Number (TIN)
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            padding: 8,
            marginVertical: 8,
          }}
          keyboardType="numeric"
          placeholder="TIN"
          value={tin}
          onChangeText={setTin}
        />
        {errors.tin ? (
          <Text style={{ color: "red", marginTop: 4 }}>{errors.tin}</Text>
        ) : null}
        <Text style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>
          Your 9-digit TIN and 3 to 5 digit branch code. Please use '000' as
          your branch code if you don't have one (e.g. 999-999-999-000)
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#2F855A",
            marginBottom: 8,
          }}
        >
          Value Added Tax Registration Status
        </Text>
        <View style={{ marginBottom: 16 }}>
          {valueAddedTaxRegistrationStatusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setVatStatus(option.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: vatStatus === option.value ? "#2F855A" : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {vatStatus === option.value && (
                  <FontAwesome name="check-circle" size={20} color="#2F855A" />
                )}
              </View>
              <Text style={{ marginLeft: 8, color: "black" }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.vatStatus ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.vatStatus}
            </Text>
          ) : null}
        </View>

        <Text style={{ fontSize: 18, fontWeight: "600", color: "#2F855A" }}>
          BIR Certificate of Registration
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#2F855A",
            borderRadius: 4,
            padding: 16,
            marginVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#2F855A" }}>+ Upload (0/1)</Text>
        </TouchableOpacity>

        {birCertificate && (
          <Image
            source={{ uri: birCertificate.uri }}
            style={{ width: 100, height: 100, marginBottom: 16 }}
          />
        )}
        {errors.birCertificate ? (
          <Text style={{ color: "red", marginTop: 4 }}>
            {errors.birCertificate}
          </Text>
        ) : null}
        <Text style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>
          Choose a file that is not more than 1 MB in size.
        </Text>
        <Text style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>
          If Business Name/Trade is not applicable, please enter your Taxpayer
          Name as indicated on your BIR CoR instead (e.g Acme, Inc.)
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#2F855A",
            marginBottom: 8,
          }}
        >
          Submit Sworn Declaration
        </Text>
        <View style={{ marginBottom: 16 }}>
          {submitSwornDeclarationOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSwornDeclaration(option.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    swornDeclaration === option.value ? "#2F855A" : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {swornDeclaration === option.value && (
                  <FontAwesome name="check-circle" size={20} color="#2F855A" />
                )}
              </View>
              <Text style={{ marginLeft: 8, color: "black" }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          {errors.swornDeclaration ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.swornDeclaration}
            </Text>
          ) : null}
        </View>
        <Text style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>
          Submission of Sworn Declaration is required to be exempted from
          withholding tax if your total annual gross remittance is less than or
          equal to P500,000.00.
        </Text>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#2F855A",
              marginBottom: 8,
            }}
          >
            Agreement to Terms & Conditions
          </Text>
          <TouchableOpacity
            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isTermsAccepted ? "#2F855A" : "#ccc",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isTermsAccepted && (
                <FontAwesome name="check-circle" size={20} color="#2F855A" />
              )}
            </View>
            <View className="flex-row flex-wrap items-center m-2">
              <Text className="text-gray-600">I agree to the </Text>
              <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text className="text-green-500">Terms and Conditions</Text>
              </TouchableOpacity>
              <Text className="text-gray-600"> and </Text>
              <TouchableOpacity onPress={() => navigation.navigate("")}>
                <Text className="text-green-500">Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {errors.termsAccepted ? (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors.termsAccepted}
            </Text>
          ) : null}
        </View>
        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            className="bg-gray-300 rounded-full py-4 px-8"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white text-lg font-semibold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-600 rounded-full py-4 px-8"
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", borderRadius: 8, padding: 16 }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Upload Image
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#2F855A",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
              onPress={takePicture}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Take a Picture
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#2F855A",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
              onPress={selectImageFromGallery}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Select from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#ccc", padding: 16, borderRadius: 8 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "black", textAlign: "center" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default BusinessInformationScreen;
