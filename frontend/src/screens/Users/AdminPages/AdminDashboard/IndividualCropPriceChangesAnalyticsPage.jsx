import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Modal from '../../../../components/Modal/Modal'; // Adjust based on your folder structure

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IndividualCropPriceChangesPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data for crop price changes
  const getCropPriceData = (filter) => {
    const data = {
      "7 Days": {
        dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        averagePrice: [65, 67, 68, 70, 72, 73, 75],
        highestPrice: [70, 72, 74, 76, 78, 80, 82],
        lowestPrice: [60, 63, 64, 65, 66, 68, 70],
      },
      "14 Days": {
        dates: ["Week 1", "Week 2"],
        averagePrice: [65, 70],
        highestPrice: [72, 78],
        lowestPrice: [63, 66],
      },
      "6 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        averagePrice: [60, 62, 65, 68, 72, 75],
        highestPrice: [65, 68, 72, 74, 78, 80],
        lowestPrice: [55, 58, 60, 63, 66, 70],
      },
      "12 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        averagePrice: [55, 58, 60, 62, 65, 67, 70, 72, 73, 75, 78, 80],
        highestPrice: [60, 63, 65, 67, 70, 72, 74, 76, 78, 80, 82, 85],
        lowestPrice: [50, 53, 55, 58, 60, 62, 64, 66, 68, 70, 72, 75],
      },
      Yearly: {
        dates: ["2020", "2021", "2022", "2023"],
        averagePrice: [50, 55, 60, 65],
        highestPrice: [60, 65, 70, 75],
        lowestPrice: [40, 45, 50, 55],
      },
    };

    return data[filter] || data["12 Months"];
  };

  const renderCropPriceChart = () => {
    const cropPriceData = getCropPriceData(selectedFilter);

    const data = {
      labels: cropPriceData.dates,
      datasets: [
        {
          label: "Average Price",
          data: cropPriceData.averagePrice,
          borderColor: "rgba(75, 192, 192, 0.5)", // Aqua
          fill: false,
        },
        {
          label: "Highest Price",
          data: cropPriceData.highestPrice,
          borderColor: "rgba(255, 69, 58, 0.5)", // Red
          fill: false,
        },
        {
          label: "Lowest Price",
          data: cropPriceData.lowestPrice,
          borderColor: "rgba(25, 118, 210, 0.5)", // Blue
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (tooltipItem, data) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            return `${dataset.label}: ₱${tooltipItem.yLabel}/kg`;
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h5 className="text-xl font-bold text-center text-green-700 mb-4">
          INDIVIDUAL CROP PRICE CHANGES
        </h5>

        <p className="text-sm font-bold text-green-500 mb-2">
          Current Filter:{" "}
          <span className="text-green-700">{selectedFilter}</span>
        </p>

        <button
          onClick={() => setModalVisible(true)}
          className="bg-green-500 text-white p-2 rounded-lg flex items-center justify-center mb-4"
        >
          <span>Select Filter</span>
        </button>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h3 className="text-lg font-bold mb-4 text-center">
            Select a filter
          </h3>
          {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map(
            (filter) => (
              <button
                key={filter}
                className={`p-2 rounded-lg mb-2 w-full ${
                  selectedFilter === filter
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-green-700"
                }`}
                onClick={() => {
                  setSelectedFilter(filter);
                  setModalVisible(false);
                }}
              >
                {filter}
              </button>
            )
          )}
          <button
            onClick={() => setModalVisible(false)}
            className="bg-gray-300 text-green-700 p-2 rounded-lg w-full"
          >
            Close
          </button>
        </Modal>

        <p className="text-sm font-bold text-green-500 mb-2">
          Latest Average Price:{" "}
          <span className="text-green-700">
            ₱{getCropPriceData(selectedFilter).averagePrice.slice(-1)[0]}/kg
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Latest Highest Price:{" "}
          <span className="text-green-700">
            ₱{getCropPriceData(selectedFilter).highestPrice.slice(-1)[0]}/kg
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Latest Lowest Price:{" "}
          <span className="text-green-700">
            ₱{getCropPriceData(selectedFilter).lowestPrice.slice(-1)[0]}/kg
          </span>
        </p>

        {renderCropPriceChart()}
      </div>
    </div>
  );
};

export default IndividualCropPriceChangesPage;
