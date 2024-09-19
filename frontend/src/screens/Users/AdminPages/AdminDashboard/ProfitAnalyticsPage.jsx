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

const ProfitAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data for profit analytics
  const getProfitData = (filter) => {
    const data = {
      "7 Days": {
        dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        profit: [2000, 2200, 2100, 2300, 2400, 2500, 2700],
        grossRevenue: [5000, 5200, 5100, 5300, 5500, 5700, 6000],
        expenses: [3000, 3000, 3000, 3000, 3100, 3200, 3300],
      },
      "14 Days": {
        dates: ["Week 1", "Week 2"],
        profit: [15000, 16000],
        grossRevenue: [35000, 37000],
        expenses: [20000, 21000],
      },
      "6 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        profit: [12000, 13000, 12500, 14000, 15000, 16000],
        grossRevenue: [30000, 32000, 31000, 34000, 35000, 37000],
        expenses: [18000, 19000, 18500, 20000, 20000, 21000],
      },
      "12 Months": {
        dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        profit: [10000, 11000, 10500, 12000, 13000, 14000, 13500, 14500, 15000, 16000, 17000, 18000],
        grossRevenue: [25000, 27000, 26000, 28000, 30000, 32000, 31000, 33000, 35000, 37000, 39000, 40000],
        expenses: [15000, 16000, 15500, 16000, 17000, 18000, 17500, 18500, 20000, 21000, 22000, 22000],
      },
      Yearly: {
        dates: ["2020", "2021", "2022", "2023"],
        profit: [50000, 52000, 51000, 53000],
        grossRevenue: [120000, 130000, 125000, 140000],
        expenses: [70000, 78000, 74000, 85000],
      },
    };

    return data[filter] || data["12 Months"];
  };

  const renderProfitChart = () => {
    const profitData = getProfitData(selectedFilter);

    const data = {
      labels: profitData.dates,
      datasets: [
        {
          label: "Profit",
          data: profitData.profit,
          borderColor: "rgba(75, 192, 192, 0.5)", // Aqua
          fill: false,
        },
        {
          label: "Gross Revenue",
          data: profitData.grossRevenue,
          borderColor: "rgba(255, 205, 86, 0.5)", // Yellow
          fill: false,
        },
        {
          label: "Expenses",
          data: profitData.expenses,
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

    return <Line data={data} options={options} />;
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h5 className="text-xl font-bold text-center text-green-700 mb-4">
          PROFIT ANALYTICS
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
          Latest Profit:{" "}
          <span className="text-green-700">
            ₱{getProfitData(selectedFilter).profit.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Latest Gross Revenue:{" "}
          <span className="text-green-700">
            ₱{getProfitData(selectedFilter).grossRevenue.slice(-1)[0]}
          </span>
        </p>
        <p className="text-sm font-bold text-green-500 mb-2">
          Latest Expenses:{" "}
          <span className="text-green-700">
            ₱{getProfitData(selectedFilter).expenses.slice(-1)[0]}
          </span>
        </p>

        {renderProfitChart()}
      </div>
    </div>
  );
};

export default ProfitAnalyticsPage;
