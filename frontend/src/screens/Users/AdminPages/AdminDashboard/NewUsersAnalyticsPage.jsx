import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Modal from '../../../../components/Modal/Modal'; // Adjust based on your folder structure

const API_KEY = import.meta.env.VITE_API_KEY;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Register ArcElement for Pie chart
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

  // State for total counts
  const [totalBuyersCount, setTotalBuyersCount] = useState(0);
  const [totalSellersCount, setTotalSellersCount] = useState(0);

  const fetchNewUsersData = async (filter) => {
    try {
      const response = await fetch(`/api/users?filter=${filter}`, {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const dates = [];
      const buyers = [];
      const sellers = [];

      let totalBuyers = 0;
      let totalSellers = 0;

      // Group users by date and count buyers and sellers
      data.forEach((user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const index = dates.indexOf(date);

        if (index === -1) {
          dates.push(date);
          buyers.push(user.user_type_id === 3 ? 1 : 0); // 3 for buyers
          sellers.push(user.user_type_id === 2 ? 1 : 0); // 2 for sellers
        } else {
          if (user.user_type_id === 3) {
            buyers[index] += 1;
          } else if (user.user_type_id === 2) {
            sellers[index] += 1;
          }
        }

        // Count total buyers and sellers
        if (user.user_type_id === 3) {
          totalBuyers += 1;
        } else if (user.user_type_id === 2) {
          totalSellers += 1;
        }
      });

      // Ensure buyers and sellers arrays have the same length as dates
      while (buyers.length < dates.length) {
        buyers.push(0);
      }
      while (sellers.length < dates.length) {
        sellers.push(0);
      }

      // Update state with total counts
      setTotalBuyersCount(totalBuyers);
      setTotalSellersCount(totalSellers);

      setNewUsersData({
        dates,
        buyers,
        sellers,
      });
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
          label: 'Added Buyers',
          data: newUsersData.buyers,
          backgroundColor: 'rgba(0, 128, 0, 0.7)',
          // Adjust bar width
          barThickness: 20,
          categoryPercentage: 0.8,
          barPercentage: 1.0,
        },
        {
          label: 'Added Sellers',
          data: newUsersData.sellers,
          backgroundColor: 'rgba(25, 118, 210, 0.7)',
          // Adjust bar width
          barThickness: 20,
          categoryPercentage: 0.8,
          barPercentage: 1.0,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: ${value} Users`;
            },
          },
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          stacked: false,
          // Adjust the space between bars
          barThickness: 40,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
        y: {
          stacked: false,
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderOverallUsersPieChart = () => {
    const data = {
      labels: ['Buyers', 'Sellers'],
      datasets: [
        {
          data: [totalBuyersCount, totalSellersCount],
          backgroundColor: [
            'rgba(0, 128, 0, 0.7)', // Buyers
            'rgba(25, 118, 210, 0.7)', // Sellers
          ],
          borderColor: [
            'rgba(0, 128, 0, 1)',
            'rgba(25, 118, 210, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value} Users`;
            },
          },
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
    };

    return <Pie data={data} options={options} />;
  };

  return (
    <div className="p-4">
      <h5 className="text-xl font-bold text-center text-green-700 mb-4 pt-8">
          NEW USERS ANALYTICS SUMMARY
        </h5>
      <div className="grid grid-cols-5 auto-rows-auto gap-4">
        {/* Fifth column for the filter button */}
        <div className=" p-6 flex flex-col items-center justify-center min-h-[120px]">
          <p className="text-sm font-bold text-green-500">
            Current Filter: {" "}
            <span className="text-green-700">{selectedFilter}</span>
          </p>
          <button
            onClick={() => setModalVisible(true)}
            className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <span>Select Filter</span>
          </button>
        </div>
        {/* Cards for the first row */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[120px]">
          <p className="text-sm font-bold text-green-500">
            New Buyers Count for the Week
          </p>
          <p className="text-xl font-bold text-green-700">
            {newUsersData.dates.length > 0
              ? newUsersData.buyers[newUsersData.buyers.length - 1]
              : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[120px]">
          <p className="text-sm font-bold text-green-500">
            New Sellers Count for the Week
          </p>
          <p className="text-xl font-bold text-green-700">
            {newUsersData.dates.length > 0
              ? newUsersData.sellers[newUsersData.sellers.length - 1]
              : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[120px]">
          <p className="text-sm font-bold text-green-500">
            Total Buyers Account
          </p>
          <p className="text-xl font-bold text-green-700">
            {totalBuyersCount}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[120px]">
          <p className="text-sm font-bold text-green-500">
            Total Sellers Account
          </p>
          <p className="text-xl font-bold text-green-700">
            {totalSellersCount}
          </p>
        </div>

        {/* Second row */}
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-md min-h-[300px]">
          {renderNewUsersBarChart()}
        </div>
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-md min-h-[300px]">
          {renderOverallUsersPieChart()}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <h3 className="text-lg font-bold mb-4 text-center">
          Select a filter
        </h3>
        {['7 Days', '14 Days', '6 Months', '12 Months', 'Yearly'].map(
          (filter) => (
            <button
              key={filter}
              className={`p-2 rounded-lg mb-2 w-full ${
                selectedFilter === filter
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-green-700'
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
    </div>
  );
};

export default NewUsersAnalyticsPage;
