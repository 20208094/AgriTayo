import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchNewUsersData = useCallback(async (filter) => {
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

      data.forEach((user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        const index = dates.indexOf(date);

        if (index === -1) {
          dates.push(date);
          buyers.push(user.user_type_id === 3 ? 1 : 0);
          sellers.push(user.user_type_id === 2 ? 1 : 0);
        } else {
          if (user.user_type_id === 3) {
            buyers[index] += 1;
          } else if (user.user_type_id === 2) {
            sellers[index] += 1;
          }
        }

        if (user.user_type_id === 3) {
          totalBuyers += 1;
        } else if (user.user_type_id === 2) {
          totalSellers += 1;
        }
      });

      while (buyers.length < dates.length) {
        buyers.push(0);
      }
      while (sellers.length < dates.length) {
        sellers.push(0);
      }

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
  }, []);

  useEffect(() => {
    fetchNewUsersData(selectedFilter);

    const interval = setInterval(() => {
      fetchNewUsersData(selectedFilter);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedFilter, fetchNewUsersData]);

  const generateLabels = () => {
    const currentDate = new Date();
    const labels = [];
    if (selectedFilter === '7 Days') {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (currentDate.getDay() - i + 7) % 7;
        labels.push(daysOfWeek[dayIndex]);
      }
      return labels;
    } else if (selectedFilter === '14 Days') {
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        labels.push(date.toDateString().slice(0, 3));
      }
      return labels;
    } else if (selectedFilter === '6 Months') {
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        labels.push(new Date(2020, monthIndex, 1).toLocaleString('default', { month: 'short' }));
      }
      return labels;
    } else if (selectedFilter === '12 Months') {
      const currentMonth = currentDate.getMonth();
      for (let i = 1; i <= 12; i++) {
        const monthIndex = (currentMonth + i) % 12;
        labels.push(new Date(2020, monthIndex, 1).toLocaleString('default', { month: 'short' }));
      }
      return labels;
    } else if (selectedFilter === 'Yearly') {
      const currentYear = currentDate.getFullYear();
      return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()).reverse();
    }
  };

  const renderNewUsersBarChart = () => {
    const labels = generateLabels();

    const data = {
      labels,
      datasets: [
        {
          label: 'Added Buyers',
          data: newUsersData.buyers.slice(0, labels.length),
          backgroundColor: 'rgba(0, 128, 0, 0.7)',
          barThickness: 20,
          categoryPercentage: 0.8,
          barPercentage: 1.0,
        },
        {
          label: 'Added Sellers',
          data: newUsersData.sellers.slice(0, labels.length),
          backgroundColor: 'rgba(25, 118, 210, 0.7)',
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

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 10,
            padding: 10,
            font: {
              size: window.innerWidth < 768 ? 10 : 12
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: window.innerWidth < 768 ? 8 : 10
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: window.innerWidth < 768 ? 8 : 10
            }
          }
        }
      }
    };

    return <Bar data={data} options={{
      ...options,
      ...chartOptions,
      maintainAspectRatio: false
    }} />;
  };

  const renderOverallUsersPieChart = () => {
    const data = {
      labels: ['Buyers', 'Sellers'],
      datasets: [
        {
          data: [totalBuyersCount, totalSellersCount],
          backgroundColor: [
            'rgba(0, 128, 0, 0.7)',
            'rgba(25, 118, 210, 0.7)',
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

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 10,
            padding: 10,
            font: {
              size: window.innerWidth < 768 ? 10 : 12
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: window.innerWidth < 768 ? 8 : 10
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: window.innerWidth < 768 ? 8 : 10
            }
          }
        }
      }
    };

    return <Pie data={data} options={{
      ...options,
      ...chartOptions,
      maintainAspectRatio: true
    }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgb(182,244,146)] to-[rgb(51,139,147)]">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md mb-2">
                New Users Analytics
              </h1>
              <p className="text-gray-700 text-lg font-medium">
                Track user growth and distribution
              </p>
            </div>
          </div>
        </div>


        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'New Buyers This Week',
              value: newUsersData.dates.length > 0
                ? newUsersData.buyers[newUsersData.buyers.length - 1]
                : 0,
              color: 'green'
            },
            {
              title: 'New Sellers This Week',
              value: newUsersData.dates.length > 0
                ? newUsersData.sellers[newUsersData.sellers.length - 1]
                : 0,
              color: 'blue'
            },
            {
              title: 'Total Buyers',
              value: totalBuyersCount,
              color: 'green'
            },
            {
              title: 'Total Sellers',
              value: totalSellersCount,
              color: 'blue'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform 
                hover:scale-[1.02] transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-green-600 mb-3 text-center">
                {stat.title}
              </h2>
              <p className="text-3xl font-bold text-gray-900 text-center">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">User Growth Trends</h2>
                  <p className="text-gray-600">
                    Current Range: <span className="font-semibold text-green-600">{selectedFilter}</span>
                  </p>
                </div>
                <button
                  onClick={() => setModalVisible(true)}
                  className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold
                    hover:bg-green-700 active:bg-green-800 transform hover:scale-[1.02]
                    transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Change Time Range
                </button>
              </div>
              <div className="h-[400px] md:h-[500px]">
                {renderNewUsersBarChart()}
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                User Distribution
              </h2>
              <div className="aspect-square">
                {renderOverallUsersPieChart()}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Time Range</h3>
            <div className="space-y-3">
              {['7 Days', '14 Days', '6 Months', '12 Months', 'Yearly'].map((filter) => (
                <button
                  key={filter}
                  className={`w-full p-3 rounded-xl font-semibold transition-all duration-200
                    ${selectedFilter === filter
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setModalVisible(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button
              onClick={() => setModalVisible(false)}
              className="w-full mt-6 p-3 bg-gray-100 text-gray-700 rounded-xl font-semibold
                hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NewUsersAnalyticsPage;
