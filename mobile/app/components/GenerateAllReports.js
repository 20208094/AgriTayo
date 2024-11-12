import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, Text, Alert, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { REACT_NATIVE_API_KEY, REACT_NATIVE_API_BASE_URL } from "@env";

const GenerateAllReports = ({ shopId, dataType = "Crops Report" }) => {
  const [shopCropsData, setShopCropsData] = useState([]);

  // Fetch all crop data filtered by shop_id
  const fetchShopCropsData = async () => {
    if (!shopId || !shopId.shop_id) {
      Alert.alert("Error", "Shop ID is missing. Unable to generate report.");
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
        Alert.alert("Error", "Unexpected data format received from the API.");
      }
    } catch (error) {
      console.error("Error fetching crop data:", error);
      Alert.alert("Error", "Failed to fetch crop data for the report.");
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
        Alert.alert('Error', `No crops found for report generation.`);
        return;
      }

      // Get the keys from the first object for table header
      const headers = Object.keys(shopCropsData[0]);

      // Table header
      const tableHeader = `
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #00B251; color: white;">
            ${headers.map(header => `<th style="padding: 8px;">${header.charAt(0).toUpperCase() + header.slice(1)}</th>`).join('')}
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

      // Display success message
      Alert.alert('Success', `PDF file saved to your Documents folder.`);

      // Share the PDF file
      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', `Could not generate or save the PDF file.`);
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
    </SafeAreaView>
  );
};

export default GenerateAllReports;
