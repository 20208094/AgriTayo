import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const Reports = ({ orders }) => {
  // Function to request Media Library permission
  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "You need to enable permissions to save the file."
      );
    }
  };

  // Request permission when component mounts
  useEffect(() => {
    requestPermission();
  }, []);

  const generatePdf = async () => {
    try {
      // Convert orders to table rows
      const orderRows = orders.map(order => `
        <tr>
          <td>${order.title}</td>
          <td>${order.description}</td>
          <td>${order.date}</td>
          <td>${order.action}</td>
        </tr>
      `).join('');

      // HTML structure for the PDF
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1 style="text-align: center;">Orders Report</h1>
            <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; margin-top: 20px;">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
              ${orderRows}
            </table>
          </body>
        </html>
      `;

      // Generate PDF file
      const { uri } = await Print.printToFileAsync({ html });

      // Define a new path where you want to save the file (in app's document directory)
      const newPath = `${FileSystem.documentDirectory}Orders_Report_2024.pdf`;

      // Move the file to the new path in app's directory
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      // Save the file to the media library
      const asset = await MediaLibrary.createAssetAsync(newPath);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      // Display success message and share the file
      Alert.alert(
        "Success",
        "You can now access the report in your Downloads folder or share it."
      );
      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not generate or save the PDF file.");
    }
  };

  return (
    <SafeAreaView className="flex mt-4 mr-2 px-4">
      <TouchableOpacity
        className="bg-green-500 p-3 rounded-lg shadow-md w-2/5 self-end"
        onPress={generatePdf}
      >
        <Text className="text-white font-semibold text-center">Generate PDF</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Reports;
