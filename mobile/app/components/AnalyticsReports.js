import React, { useState } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Modal,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ionicons } from "@expo/vector-icons";

const AnalyticsReports = ({ data, subcategoryName }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const generatePdf = async () => {
    try {
      if (data.length === 0) {
        setAlertMessage(`No varieties found for ${subcategoryName}.`);
        setAlertVisible(true);
        return;
      }

      // Define headers for the variety report
      const headers = [
        "crop_variety_name",
        "availableListing",
        "highestListing.crop_price",
        "lowestListing.crop_price",
        "7DaysLowest",
        "7DaysHighest",
        "7DaysAverage",
        "6MonthLowest",
        "6MonthHighest",
        "6MonthAverage",
        "1MonthLowest",
        "1MonthHighest",
        "1MonthAverage",
      ];

      const headerLabels = {
        crop_variety_name: "Variety Name",
        availableListing: "Available Listings",
        "highestListing.crop_price": "Highest Price",
        "lowestListing.crop_price": "Lowest Price",
        "7DaysLowest": "7 Days Lowest",
        "7DaysAverage": "7 Days Average",
        "7DaysHighest": "7 Days Highest",
        "1MonthLowest": "1 Month Lowest",
        "1MonthAverage": "1 Month Average",
        "1MonthHighest": "1 Month Highest",
        "6MonthLowest": "6 Month Lowest",
        "6MonthAverage": "6 Month Average",
        "6MonthHighest": "6 Month Highest",
      };

      // Table header
      const tableHeader = `
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      <tr style="background-color: #00B251; color: white;">
        ${headers
          .map(
            (header) => `<th style="padding: 8px;">${headerLabels[header]}</th>`
          )
          .join("")}
      </tr>
  `;

      // Dynamically generate table rows from the data with error handling
      const tableRows = data
        .map(
          (item) => `
      <tr>
        <td style="padding: 8px; text-align: center;">${
          item.crop_variety_name || "N/A"
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item.availableListing || 0
        }</td>
        <td style="padding: 8px; text-align: center;">₱${
          item.highestListing?.crop_price
            ? item.highestListing.crop_price.toFixed(2)
            : "N/A"
        }</td>
        <td style="padding: 8px; text-align: center;">₱${
          item.lowestListing?.crop_price
            ? item.lowestListing.crop_price.toFixed(2)
            : "N/A"
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["7DaysLowest"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["7DaysAverage"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["7DaysHighest"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["1MonthLowest"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["1MonthAverage"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["1MonthHighest"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["6MonthLowest"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["6MonthAverage"] || 0
        }</td>
        <td style="padding: 8px; text-align: center;">${
          item["6MonthHighest"] || 0
        }</td>
      </tr>
    `
        )
        .join("");
      const tableFooter = `</table>`;

      const reportTitle = `${subcategoryName} Analytics Report`;
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
      const { uri } = await Print.printToFileAsync({
        html,
        width: 842,
        height: 595,
        orientation: Print.Orientation.LANDSCAPE,
      });

      // Define a new path where you want to save the file (in app's document directory)
      const newPath = `${FileSystem.documentDirectory}${subcategoryName}_Varieties_Analytics_Report_2024.pdf`;

      // Move the file to the new path in app's directory
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      setAlertMessage(`${subcategoryName} Varieties PDF file saved to your Documents folder.`);
      setAlertVisible(true);

      await Sharing.shareAsync(newPath);
    } catch (error) {
      console.error(error);
      setAlertMessage(`Could not generate or save the ${subcategoryName} Varieties PDF file.`);
      setAlertVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={generatePdf} activeOpacity={0.8}>
        <Icon name={"file-export"} size={20} color="#00B251" />
      </TouchableOpacity>

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
    </>
  );
};

export default AnalyticsReports;
