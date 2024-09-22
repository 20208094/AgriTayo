import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Modal from '../../../../components/Modal/Modal';

const API_KEY = import.meta.env.VITE_API_KEY;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const NewUsersAnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('12 Months');
  const [modalVisible, setModalVisible] = useState(false);
  const [newUsersData, setNewUsersData] = useState({
    dates: [],
    buyers: [],
    sellers: [],
  });

  const [totalBuyersCount, setTotalBuyersCount] = useState(0);
  const [totalSellersCount, setTotalSellersCount] = useState(0);

  const fetchNewUsersData = async (filter) => {
    try {
      const response = await fetch(`/api/users?filter=${filter}`, {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const dates = [];
      const buyers = [];
      const sellers = [];
      let totalBuyers = 0;
      let totalSellers = 0;

      data.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        const index = dates.indexOf(date);
        if (index === -1) {
          dates.push(date);
          buyers.push(user.user_type_id === 3 ? 1 : 0);
          sellers.push(user.user_type_id === 2 ? 1 : 0);
        } else {
          if (user.user_type_id === 3) buyers[index] += 1;
          else if (user.user_type_id === 2) sellers[index] += 1;
        }
        if (user.user_type_id === 3) totalBuyers += 1;
        else if (user.user_type_id === 2) totalSellers += 1;
      });

      setTotalBuyersCount(totalBuyers);
      setTotalSellersCount(totalSellers);
      setNewUsersData({ dates, buyers, sellers });
    } catch (error) {
      console.error('Error fetching new users data:', error);
    }
  };

  useEffect(() => {
    fetchNewUsersData(selectedFilter);
  }, [selectedFilter]);

  const renderNewUsersBarChart = () => {
    const data = {
      labels: newUsersData.dates,
      datasets: [
        {
          label: "Added Buyers",
          data: newUsersData.buyers,
          backgroundColor: "rgba(0, 128, 0, 0.7)",
          barThickness: 20,
        },
        {
          label: "Added Sellers",
          data: newUsersData.sellers,
          backgroundColor: "rgba(25, 118, 210, 0.7)",
          barThickness: 20,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.dataset.label || ''}: ${context.raw || 0} Users`,
          }
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          stacked: false,
          barThickness: 40,
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <div style={{ position: 'relative', height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };

  const renderOverallUsersPieChart = () => {
    const data = {
      labels: ['Buyers', 'Sellers'],
      datasets: [
        {
          data: [totalBuyersCount, totalSellersCount],
          backgroundColor: ['rgba(0, 128, 0, 0.7)', 'rgba(25, 118, 210, 0.7)'],
          borderColor: ['rgba(0, 128, 0, 1)', 'rgba(25, 118, 210, 1)'],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.label || ''}: ${context.raw || 0} Users`,
          }
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
    };

    return (
      <div style={{ position: 'relative', height: '300px' }}>
        <Pie data={data} options={options} />
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h5 className="text-2xl font-bold text-center text-green-700 mb-4">
          New Users Analytics Summary
        </h5>
        <p className="text-base font-semibold text-gray-600 mb-2">
          Current Filter: <span className="text-green-700">{selectedFilter}</span>
        </p>

        <button
          onClick={() => setModalVisible(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center mb-4 transition duration-300"
        >
          Select Filter
        </button>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h3 className="text-lg font-bold mb-4 text-center">Select a filter</h3>
          {["7 Days", "14 Days", "6 Months", "12 Months", "Yearly"].map(filter => (
            <button
              key={filter}
              className={`p-2 rounded-lg mb-2 w-full transition duration-300 ${
                selectedFilter === filter
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-green-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setSelectedFilter(filter);
                setModalVisible(false);
              }}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={() => setModalVisible(false)}
            className="bg-gray-300 text-green-700 py-2 rounded-lg w-full hover:bg-gray-400 transition duration-300"
          >
            Close
          </button>
        </Modal>

        <div className="flex flex-wrap justify-center space-x-4 mt-4">
          <div className="w-full sm:w-1/3 p-4">
            <div className="p-4 bg-white rounded-lg shadow-md border border-green-300 text-center">
              <p className="text-base font-semibold text-green-500 mb-2">
                New Buyers Count for the Week:{" "}
                <span className="text-green-700">{newUsersData.dates.length > 0 ? newUsersData.buyers.slice(-1)[0] : 0}</span>
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-md border border-green-300 text-center mt-4">
              <p className="text-base font-semibold text-green-500 mb-2">
                Total Buyers Account:{" "}
                <span className="text-green-700">{totalBuyersCount}</span>
              </p>
            </div>
          </div>
          
          <div className="w-full sm:w-1/3 p-4">
            <div className="p-4 bg-white rounded-lg shadow-md border border-green-300 text-center">
              <p className="text-base font-semibold text-green-500 mb-2">
                New Sellers Count for the Week:{" "}
                <span className="text-green-700">{newUsersData.dates.length > 0 ? newUsersData.sellers.slice(-1)[0] : 0}</span>
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-md border border-green-300 text-center mt-4">
              <p className="text-base font-semibold text-green-500 mb-2">
                Total Sellers Account:{" "}
                <span className="text-green-700">{totalSellersCount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex-1 mx-2" style={{ maxWidth: '48%' }}>
          <h5 className="text-lg font-bold text-green-700 mb-4 text-center">
            Users Added Over Time
          </h5>
          {renderNewUsersBarChart()}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex-1 mx-2" style={{ maxWidth: '48%' }}>
          <h5 className="text-lg font-bold text-green-700 mb-4 text-center">
            Overall Users Distribution
          </h5>
          {renderOverallUsersPieChart()}
        </div>
      </div>
    </div>
  );
};

export default NewUsersAnalyticsPage;
