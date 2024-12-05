import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, Text, View, Modal } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";

const GenerateAllReports = ({ shopId, dataType = "Crops Report" }) => {
  const [shopCropsData, setShopCropsData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch all crop data filtered by shop_id
  const fetchShopCropsData = async () => {
    if (!shopId || !shopId.shop_id) {
      setAlertMessage("Shop ID is missing. Unable to generate report.");
      setAlertVisible(true);
      return;
    }
  
    const shop_id = shopId.shop_id; // Access the actual shop_id property
  
    try {
  
      const response = await fetch(
        `${REACT_NATIVE_API_BASE_URL}/api/crops?shop_id=${shop_id}`,
        {
          headers: {
            'x-api-key': REACT_NATIVE_API_KEY,
          },
        }
      );
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        const filteredData = data.filter(crop => crop.shop_id === shop_id);
        setShopCropsData(filteredData);
      } else {
        setAlertMessage("Unexpected data format received from the API.");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error fetching crop data:", error);
      setAlertMessage("Failed to fetch crop data for the report.");
      setAlertVisible(true);
    }
  };  

  // Load data when the component mounts or shopId changes
  useEffect(() => {
    if (shopId) {
      fetchShopCropsData();
    }
  }, [shopId]);

  const generatePdf = async () => {
    try {
      if (shopCropsData.length === 0) {
        setAlertMessage("No crops found for report generation.");
        setAlertVisible(true);
        return;
      }

      // Get the keys from the first object for table header
      const headers = ['crop_name', 'crop_description', 'crop_price', 'crop_quantity', 'availability'];

      const headerLabels = {
        crop_name: "Crop Name",
        crop_description: "Description",
        crop_price: "Price",
        crop_quantity: "Quantity",
        availability: "Availability",
      };

      // Generate table header with selected columns
    const tableHeader = `
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <tr style="background-color: #00B251; color: white;">
        ${headers.map(header => `<th style="padding: 8px;">${headerLabels[header]}</th>`).join('')}
      </tr>
  `;

      // Dynamically generate table rows from the data
      const tableRows = shopCropsData
        .map(
          (item) => `
          <tr>
            ${headers.map(header => `<td style="padding: 8px; text-align: center;">${item[header]}</td>`).join('')}
          </tr>
        `
        )
        .join('');

      const tableFooter = `</table>`;

      const reportTitle = `${dataType}`;
      const reportDate = `Date: ${new Date().toLocaleDateString()}`;

      // HTML structure for the PDF
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; box-sizing: border-box;">
            <h1 style="text-align: center; color: #00B251;">${reportTitle}</h1>
            <p style="text-align: center; font-size: 14px;">${reportDate}</p>
            <div style="margin-top: 20px;">
              ${tableHeader}
              ${tableRows}
              ${tableFooter}
            </div>
          </body>
        </html>
      `;

      // Generate PDF file
      const { uri } = await Print.printToFileAsync({ html });

      // Define a new path where you want to save the file (in app's document directory)
      const newPath = `${FileSystem.documentDirectory}${dataType}.pdf`;

      // Move the file to the new path in app's directory
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      setAlertMessage("PDF file saved to your Documents folder.");
      setAlertVisible(true);

      // Share the PDF file
      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      setAlertMessage("Could not generate or save the PDF file.");
      setAlertVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex px-4 mt-4">
      <TouchableOpacity
        className="bg-[#00B251] py-3 px-4 rounded-lg shadow-lg"
        onPress={generatePdf}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-center">
          Generate All Crops PDF
        </Text>
      </TouchableOpacity>

      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">{alertMessage}</Text>
            <TouchableOpacity
              className="mt-4 p-2 bg-[#00B251] rounded-lg flex-row justify-center items-center"
              onPress={() => setAlertVisible(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text className="text-lg text-white ml-2">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GenerateAllReports;
