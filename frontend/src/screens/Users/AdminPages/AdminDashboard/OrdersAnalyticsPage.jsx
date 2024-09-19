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

const OrdersAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data for orders analytics
  const getOrdersData = (filter) => {
    const data = {
      "7 Days": {
        dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        toPay: [2, 5, 3, 4, 6, 2, 7],
        toShip: [3, 4, 3, 6, 7, 5, 8],
        toReceive: [1, 3, 4, 2, 4, 3, 5],
        completed: [10, 12, 9, 15, 18, 20, 22],
        cancelled: [1, 0, 2, 1, 0, 1, 3],
      },
      "14 Days": {
        dates: ["Week 1", "Week 2"],
        toPay: [25, 30],
        toShip: [28, 35],
        toReceive: [15, 20],
        completed: [70, 85],
        cancelled: [4, 6],
      },
      "6 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        toPay: [50, 40, 60, 55, 70, 80],
        toShip: [40, 45, 55, 65, 60, 75],
        toReceive: [35, 30, 40, 50, 45, 60],
        completed: [300, 350, 400, 450, 500, 550],
        cancelled: [10, 15, 12, 10, 8, 20],
      },
      "12 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        toPay: [90, 80, 100, 95, 120, 130, 110, 150, 140, 170, 180, 190],
        toShip: [80, 85, 95, 105, 110, 120, 130, 135, 140, 160, 170, 180],
        toReceive: [70, 65, 75, 85, 90, 95, 100, 110, 120, 130, 140, 150],
        completed: [600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150],
        cancelled: [15, 20, 18, 22, 25, 30, 28, 32, 35, 40, 45, 50],
      },
      Yearly: {
        dates: ["2020", "2021", "2022", "2023"],
        toPay: [400, 450, 470, 500],
        toShip: [350, 420, 440, 480],
        toReceive: [320, 380, 400, 450],
        completed: [2500, 2800, 3000, 3500],
        cancelled: [100, 120, 140, 160],
      },
    };

    return data[filter] || data["12 Months"];
  };

  const renderOrdersChart = () => {
    const ordersData = getOrdersData(selectedFilter);

    const data = {
      labels: ordersData.dates,
      datasets: [
        {
          label: "To Pay",
          data: ordersData.toPay,
          borderColor: "rgba(255, 193, 7, 0.5)", // Yellow
          fill: false,
        },
        {
          label: "To Ship",
          data: ordersData.toShip,
          borderColor: "rgba(54, 162, 235, 0.5)", // Blue
          fill: false,
        },
        {
          label: "To Receive",
          data: ordersData.toReceive,
          borderColor: "rgba(75, 192, 192, 0.5)", // Aqua
          fill: false,
        },
        {
          label: "Completed",
          data: ordersData.completed,
          borderColor: "rgba(0, 128, 0, 0.5)", // Green
          fill: false,
        },
        {
          label: "Cancelled",
          data: ordersData.cancelled,
          borderColor: "rgba(255, 99, 132, 0.5)", // Red
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
            return `${dataset.label}: ${tooltipItem.yLabel} Orders`;
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
          ORDERS ANALYTICS SUMMARY
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
          Total Orders to Pay:{" "}
          <span className="text-green-700">
            {getOrdersData(selectedFilter).toPay.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Total Orders to Ship:{" "}
          <span className="text-green-700">
            {getOrdersData(selectedFilter).toShip.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Total Orders to Receive:{" "}
          <span className="text-green-700">
            {getOrdersData(selectedFilter).toReceive.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Total Completed Orders:{" "}
          <span className="text-green-700">
            {getOrdersData(selectedFilter).completed.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Total Cancelled Orders:{" "}
          <span className="text-green-700">
            {getOrdersData(selectedFilter).cancelled.slice(-1)[0]}
          </span>
        </p>

        {renderOrdersChart()}
      </div>
    </div>
  );
};

export default OrdersAnalyticsPage;
