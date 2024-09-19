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

const NewUsersAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data for new users analytics
  const getNewUsersData = (filter) => {
    const data = {
      "7 Days": {
        dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        buyers: [5, 10, 8, 12, 14, 16, 18],
        farmers: [2, 3, 4, 6, 5, 7, 8],
      },
      "14 Days": {
        dates: ["Week 1", "Week 2"],
        buyers: [50, 70],
        farmers: [25, 30],
      },
      "6 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        buyers: [150, 200, 180, 220, 250, 270],
        farmers: [80, 90, 85, 100, 110, 130],
      },
      "12 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        buyers: [250, 300, 280, 350, 400, 450, 420, 460, 480, 500, 550, 600],
        farmers: [120, 130, 125, 140, 150, 160, 155, 165, 170, 180, 190, 200],
      },
      Yearly: {
        dates: ["2020", "2021", "2022", "2023"],
        buyers: [800, 1000, 950, 1100],
        farmers: [400, 500, 480, 550],
      },
    };

    return data[filter] || data["12 Months"];
  };

  const renderNewUsersChart = () => {
    const newUsersData = getNewUsersData(selectedFilter);

    const data = {
      labels: newUsersData.dates,
      datasets: [
        {
          label: "Buyers",
          data: newUsersData.buyers,
          borderColor: "rgba(0, 128, 0, 0.5)",
          fill: false,
        },
        {
          label: "Farmers",
          data: newUsersData.farmers,
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
            return `${dataset.label}: ${tooltipItem.yLabel} Users`;
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
          NEW USERS ANALYTICS SUMMARY
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
          Buyers Added:{" "}
          <span className="text-green-700">
            {getNewUsersData(selectedFilter).buyers.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Farmers Added:{" "}
          <span className="text-green-700">
            {getNewUsersData(selectedFilter).farmers.slice(-1)[0]}
          </span>
        </p>

        {renderNewUsersChart()}
      </div>
    </div>
  );
};

export default NewUsersAnalyticsPage;
