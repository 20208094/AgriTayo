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
import Modal from '../../../../components/Modal/Modal'; // Adjust path based on your folder structure

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data for sales analytics
  const getSalesData = (filter) => {
    const data = {
      "7 Days": {
        dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        average: [120, 130, 125, 140, 150, 160, 170],
        highest: [140, 150, 145, 160, 170, 180, 190],
        lowest: [100, 110, 105, 120, 130, 140, 150],
        sold: [120, 130, 125, 140, 150, 160, 170],
      },
      "14 Days": {
        dates: ["Week 1", "Week 2"],
        average: [120, 130],
        highest: [140, 150],
        lowest: [100, 110],
        sold: [1200, 1300],
      },
      "6 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        average: [120, 130, 125, 140, 150, 160],
        highest: [140, 150, 145, 160, 170, 180],
        lowest: [100, 110, 105, 120, 130, 140],
        sold: [1200, 1300, 1250, 1400, 1500, 1600],
      },
      "12 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        average: [120, 130, 125, 140, 150, 160, 155, 165, 170, 180, 190, 200],
        highest: [140, 150, 145, 160, 170, 180, 175, 185, 190, 200, 210, 220],
        lowest: [100, 110, 105, 120, 130, 140, 135, 145, 150, 160, 170, 180],
        sold: [1200, 1300, 1250, 1400, 1500, 1600, 1550, 1650, 1700, 1800, 1900, 2000],
      },
      Yearly: {
        dates: ["2020", "2021", "2022", "2023"],
        average: [120, 130, 125, 140],
        highest: [140, 150, 145, 160],
        lowest: [100, 110, 105, 120],
        sold: [5000, 5200, 5100, 5300],
      },
    };

    return data[filter] || data["12 Months"];
  };

  const renderSalesAnalyticsChart = () => {
    const salesData = getSalesData(selectedFilter);

    const data = {
      labels: salesData.dates,
      datasets: [
        {
          label: "Average",
          data: salesData.average,
          borderColor: "rgba(0, 128, 0, 0.5)",
          fill: false,
        },
        {
          label: "Highest",
          data: salesData.highest,
          borderColor: "rgba(255, 69, 58, 0.5)",
          fill: false,
        },
        {
          label: "Lowest",
          data: salesData.lowest,
          borderColor: "rgba(25, 118, 210, 0.5)",
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
            return `${dataset.label}: ₱${tooltipItem.yLabel}`;
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h5 className="text-xl font-bold text-center text-green-700 mb-4">
          SALES ANALYTICS SUMMARY
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
          Average:{" "}
          <span className="text-green-700">
            ₱{getSalesData(selectedFilter).average.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Highest:{" "}
          <span className="text-green-700">
            ₱{getSalesData(selectedFilter).highest.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Lowest:{" "}
          <span className="text-green-700">
            ₱{getSalesData(selectedFilter).lowest.slice(-1)[0]}
          </span>
        </p>

        {renderSalesAnalyticsChart()}
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
