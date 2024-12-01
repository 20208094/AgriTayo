import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Modal from '../../../../components/Modal/Modal';

const API_KEY = import.meta.env.VITE_API_KEY;

const SelectedVarietyAnalyticsPage = () => {
  const { varietyId } = useParams();
  const [varietyData, setVarietyData] = useState([]);
  const [varietyMarketData, setVarietyMarketData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('7 Days');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [cropsResponse, categoryResponse, subcategoryResponse, varietyResponse, ordersResponse, orderProductsResponse] = await Promise.all([
      fetch(`/api/crops`, { headers: { "x-api-key": API_KEY } }),
      fetch(`/api/crop_categories`, { headers: { "x-api-key": API_KEY } }),
      fetch(`/api/crop_sub_categories`, { headers: { "x-api-key": API_KEY } }),
      fetch(`/api/crop_varieties`, { headers: { "x-api-key": API_KEY } }),
      fetch(`/api/orders`, { headers: { "x-api-key": API_KEY } }),
      fetch(`/api/order_products`, { headers: { "x-api-key": API_KEY } }),
    ]);
    const crops = await cropsResponse.json();
    const categories = await categoryResponse.json();
    const subcategories = await subcategoryResponse.json();
    const varieties = await varietyResponse.json();
    const orders = await ordersResponse.json();
    const orderProducts = await orderProductsResponse.json();
    // filter crops to only include crops thats in the variety chosen
    const cropsFiltered = crops.filter(crop => Number(crop.crop_variety_id) === Number(varietyId));
    // filter orders to rate and completed only
    const ordersFiltered = orders.filter(order => Number(order.status_id) === 7 || Number(order.status_id) === 8);
    // combine crop data inside orderProducts
    const combinedOrderProds = orderProducts.map(orderProd => {
      const cropData = crops.find(crop => crop.crop_id === orderProd.order_prod_crop_id);
      return {
        ...orderProd,
        crop: cropData ? cropData : null,
        var_id: cropData ? cropData.crop_variety_id : null,
      };
    });
    // combine orderProducts inside the orders table
    const combinedOrders = ordersFiltered.map(order => {
      const orderProductsData = combinedOrderProds.filter(ordProd => ordProd.order_id === order.order_id);
      return {
        ...order,
        order_products: orderProductsData ? orderProductsData : null,
      };
    });
    // extract crop id with total weight sold and total price sold
    const productDetailsArray = combinedOrders.flatMap(order =>
      order.order_products ?
        order.order_products.map(product => ({
          order_prod_id: product.order_prod_id,
          crop_id: product.order_prod_crop_id,
          total_weight: product.order_prod_total_weight,
          total_price: product.order_prod_total_price,
          order_date: order.order_date,
          variety_id: product.var_id,
        }))
        : []
    );
    // filter the productdetailsarray so that only those who are in the same variety will stay
    const filteredProductDetailsArray = productDetailsArray.filter(product =>
      cropsFiltered.some(crop => crop.crop_id === product.crop_id)
    );
    // Combine data with the same variety_id and order_date
    const combinedProductDetailsArray = filteredProductDetailsArray.reduce((acc, product) => {
      // Create a unique key based on variety_id and order_date
      const key = `${product.variety_id}_${new Date(product.order_date).toISOString()}`;

      const pricePerWeight = product.total_price / product.total_weight;

      if (!acc[key]) {
        // If the key doesn't exist, create a new entry
        acc[key] = {
          variety_id: product.variety_id,
          order_date: product.order_date,
          total_price: product.total_price,
          total_weight: product.total_weight,
          highest: pricePerWeight, // Initialize highest price per weight
          lowest: pricePerWeight,  // Initialize lowest price per weight
          sum_price_per_weight: pricePerWeight, // Used to calculate average
          count: 1, // Used to keep track of the number of entries for average
        };
      } else {
        // If the key exists, accumulate the total_price and total_weight
        acc[key].total_price += product.total_price;
        acc[key].total_weight += product.total_weight;

        // Update highest and lowest price per weight
        acc[key].highest = Math.max(acc[key].highest, pricePerWeight);
        acc[key].lowest = Math.min(acc[key].lowest, pricePerWeight);

        // Accumulate sum for average calculation and increment count
        acc[key].sum_price_per_weight += pricePerWeight;
        acc[key].count += 1;
      }

      return acc;
    }, {});

    // After reduce, calculate the average for each entry
    const combinedProductDetails = Object.values(combinedProductDetailsArray).map(item => ({
      ...item,
      average: item.sum_price_per_weight / item.count, // Calculate average price per weight
    }));

    const varietiesComplete = varieties.filter(variety => Number(variety.crop_variety_id) === Number(varietyId));
    // combine orderProducts inside the orders table
    const varietiesFiltered = varietiesComplete.map(variety => {
      // Filter crops for the current variety
      const availableCrops = cropsFiltered.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
      // If there are no available crops, set defaults to null
      if (availableCrops.length === 0) {
        return {
          ...variety,
          availableListing: 0, // Set count to 0 if no available crops
          highestListing: 0,
          lowestListing: 0,
        };
      }
      // Find the highest and lowest price crops
      const highestCrop = availableCrops.reduce((max, crop) => (crop.crop_price > max.crop_price ? crop : max), availableCrops[0]);
      const lowestCrop = availableCrops.reduce((min, crop) => (crop.crop_price < min.crop_price ? crop : min), availableCrops[0]);
      return {
        ...variety,
        availableListing: availableCrops.length,
        highestListing: highestCrop,
        lowestListing: lowestCrop,
      };
    });

    setVarietyData(combinedProductDetails);
    setVarietyMarketData(varietiesFiltered[0]);
    if (combinedProductDetails && varietiesFiltered[0]) {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const groupByYear = (data) => {
    const grouped = data.reduce((acc, item) => {
      const year = new Date(item.order_date).getFullYear();
      if (!acc[year]) {
        acc[year] = { totalWeight: 0, totalPrice: 0, highest: -Infinity, lowest: Infinity, sumPricePerWeight: 0, count: 0 };
      }
      acc[year].totalWeight += item.total_weight;
      acc[year].totalPrice += item.total_price;
      acc[year].highest = Math.max(acc[year].highest, item.highest);
      acc[year].lowest = Math.min(acc[year].lowest, item.lowest);
      acc[year].sumPricePerWeight += item.average;
      acc[year].count++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([year, values]) => ({
      label: year,
      ...values,
      average: values.sumPricePerWeight / values.count,
    }));
  };

  const groupByMonth = (data) => {
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.order_date);
      const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format as YYYY-MM
      if (!acc[monthLabel]) {
        acc[monthLabel] = { totalWeight: 0, totalPrice: 0, highest: -Infinity, lowest: Infinity, sumPricePerWeight: 0, count: 0 };
      }
      acc[monthLabel].totalWeight += item.total_weight;
      acc[monthLabel].totalPrice += item.total_price;
      acc[monthLabel].highest = Math.max(acc[monthLabel].highest, item.highest);
      acc[monthLabel].lowest = Math.min(acc[monthLabel].lowest, item.lowest);
      acc[monthLabel].sumPricePerWeight += item.average;
      acc[monthLabel].count++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, values]) => ({
      label: month,
      ...values,
      average: values.sumPricePerWeight / values.count,
    }));
  };

  const filterData = useCallback(() => {
    const now = new Date();
    let filteredData = varietyData;

    now.setHours(0, 0, 0, 0);

    // Function to create dummy data for missing dates
    const createDummyData = (count, period = 'day') => {
      const dummyData = [];
      for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now);
        if (period === 'day') {
          date.setDate(now.getDate() - i);
          const isoDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          dummyData.push({
            label: isoDate,
            order_date: isoDate,
            average: 0,
            highest: 0,
            lowest: 0,
          });
        } else if (period === 'month') {
          date.setMonth(now.getMonth() - i);
          const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format as YYYY-MM
          dummyData.push({
            label: monthLabel,
            order_date: monthLabel,
            average: 0,
            highest: 0,
            lowest: 0,
          });
        } else if (period === 'year') {
          date.setFullYear(now.getFullYear() - i);
          const yearLabel = `${date.getFullYear()}`; // Format as YYYY
          dummyData.push({
            label: yearLabel,
            order_date: yearLabel,
            average: 0,
            highest: 0,
            lowest: 0,
          });
        }
      }
      return dummyData;
    };

    // Filter data based on selected filter
    switch (selectedFilter) {
      case '7 Days': {
        const realData = varietyData.filter(data =>
          new Date(data.order_date) >= new Date(new Date().setDate(now.getDate() - 7))
        );
        filteredData = createDummyData(7).map(dummy => {
          const existing = realData.find(data =>
            new Date(data.order_date).toISOString().split('T')[0] === dummy.label
          );
          return existing || dummy;
        });
        break;
      }

      case '14 Days': {
        const realData = varietyData.filter(data =>
          new Date(data.order_date) >= new Date(new Date().setDate(now.getDate() - 14))
        );
        filteredData = createDummyData(14).map(dummy => {
          const existing = realData.find(data =>
            new Date(data.order_date).toISOString().split('T')[0] === dummy.label
          );
          return existing || dummy;
        });
        break;
      }

      case '6 Months': {
        const realData = groupByMonth(
          varietyData.filter(data =>
            new Date(data.order_date) >= new Date(new Date().setMonth(now.getMonth() - 6))
          )
        );
        filteredData = createDummyData(6, 'month').map(dummy => {
          const existing = realData.find(data => data.label === dummy.label);
          return existing || dummy;
        });
        break;
      }

      case '12 Months': {
        const realData = groupByMonth(
          varietyData.filter(data =>
            new Date(data.order_date) >= new Date(new Date().setFullYear(now.getFullYear() - 1))
          )
        );
        filteredData = createDummyData(12, 'month').map(dummy => {
          const existing = realData.find(data => data.label === dummy.label);
          return existing || dummy;
        });
        break;
      }

      case 'Yearly': {
        const realData = groupByYear(
          varietyData.filter(data =>
            new Date(data.order_date) >= new Date(new Date().setFullYear(now.getFullYear() - 5)) // Last 5 years
          )
        );
        filteredData = createDummyData(6, 'year').map(dummy => {
          const existing = realData.find(data => data.label === dummy.label);
          return existing || dummy;
        });
        break;
      }

      default:
        break;
    }

    return filteredData;
  }, [selectedFilter, varietyData]);


  const renderAnalyticsChart = () => {
    const now = new Date();
    const filteredData = filterData();

    let labels = filteredData.map(item => item.label || new Date(item.order_date).toISOString().split('T')[0]);

    // Modify labels based on selected filter
    if (selectedFilter === '7 Days') {
      labels = labels.map((label, index) => {
        const date = new Date(now);  // Start with the current date
        date.setDate(now.getDate() - (6 - index));  // Go back for the last 7 days

        // Manually adjust to GMT+8 by adding 8 hours to the date (in milliseconds)
        // date.setHours(date.getHours() + 8);

        // If it's the first label (for Yesterday)
        if (index === 5) {
          return "Yesterday";
        }

        // If it's the last label (for Today)
        if (index === 6) {
          return "Today";
        }

        // For other days, format the date to display the day of the week (Monday, Tuesday, etc.)
        const options = { weekday: 'long' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      });
    } else if (selectedFilter === '14 Days') {
      labels = labels.map((label, index) => {
        const date = new Date(now);  // Start with the current date
        date.setDate(now.getDate() - (13 - index));  // Go back for the last 14 days (13 - index)

        // Manually adjust to GMT+8 by adding 8 hours to the date (in milliseconds)
        date.setHours(date.getHours() + 8);

        // Format date to display the day of the week and date (e.g., "Monday-28")
        const options = { weekday: 'long', day: 'numeric' };
        const weekday = new Intl.DateTimeFormat('en-US', options).format(date);


        // If it's the first label (for Yesterday)
        if (index === 12) {
          return "Yesterday";
        }

        // If it's the last label (for Today)
        if (index === 13) {
          return "Today";
        }

        // Format label as "Weekday-Day" (e.g., "Monday-28")
        return weekday.replace(',', '');  // Remove comma from weekday (e.g., "Monday, 28" -> "Monday-28")
      });

    } else if (selectedFilter === '6 Months' || selectedFilter === '12 Months') {
      labels = labels.map(label => {
        const date = new Date(label);  // Convert label to date object

        // Manually adjust to GMT+8 by adding 8 hours to the date (in milliseconds)
        date.setHours(date.getHours() + 8);

        // Format date as "Month Year" (e.g., November 2024)
        const options = { year: 'numeric', month: 'long' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      });
    }

    const averages = filteredData.map(item => item.average);
    const highs = filteredData.map(item => item.highest);
    const lows = filteredData.map(item => item.lowest);

    const data = {
      labels,
      datasets: [
        {
          label: "Average",
          data: averages,
          borderColor: "rgba(0, 128, 0, 0.5)",
          fill: false,
        },
        {
          label: "Highest",
          data: highs,
          borderColor: "rgba(255, 69, 58, 0.5)",
          fill: false,
        },
        {
          label: "Lowest",
          data: lows,
          borderColor: "rgba(25, 118, 210, 0.5)",
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 h-full">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
        <span className="text-gray-500">Loading...</span>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 p-4 pt-8">
      <h5 className="text-3xl font-bold text-green-700 text-center mb-2">{varietyMarketData.crop_variety_name} Analytics</h5>
      <div className="grid grid-cols-3 auto-rows-auto gap-4">
        {/* Current Available Listings */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h5 className="text-xl font-bold text-green-500 mb-4">Current Available Listings</h5>
          <p className="text-2xl font-bold text-green-700">{varietyMarketData.availableListing} Listings</p>
        </div>

        {/* Current Highest Price/Kilo */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h5 className="text-xl font-bold text-green-500 mb-4">Current Highest Price/Kilo</h5>
          <p className="text-xl font-bold text-green-700">
            {
              isNaN(parseFloat(varietyMarketData.highestListing.crop_price)) || !varietyMarketData.highestListing.crop_price
                ? 'No available data'
                : `₱${parseFloat(varietyMarketData.highestListing.crop_price).toFixed(2)}/kilo`
            }
          </p>
        </div>

        {/* Current Lowest Price/Kilo */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h5 className="text-xl font-bold text-green-500 mb-4">Current Lowest Price/Kilo</h5>
          <p className="text-xl font-bold text-green-700">
            {
              isNaN(parseFloat(varietyMarketData.lowestListing.crop_price)) || !varietyMarketData.lowestListing.crop_price
                ? 'No available data'
                : `₱${parseFloat(varietyMarketData.lowestListing.crop_price).toFixed(2)}/kilo`
            }
          </p>
        </div>

      </div>

      <div className="col-span-3 row-span-2 bg-white p-4 rounded-lg shadow-md max-w-sm md:max-w-3xl lg:max-w-6xl mx-auto border-2 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold text-green-700">{varietyMarketData.crop_variety_name}: {selectedFilter} Analytics</h5>
          <button
            onClick={() => setModalVisible(true)}
            className="bg-green-500 text-white p-2 rounded-lg"
          >
            Select Filter
          </button>
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <h3 className="text-lg font-bold mb-4 text-center">Select a filter</h3>
          {['7 Days', '14 Days', '6 Months', '12 Months', 'Yearly'].map(filter => (
            <button
              key={filter}
              className={`p-2 rounded-lg mb-2 w-full ${selectedFilter === filter ? "bg-green-500 text-white" : "bg-gray-200 text-green-700"
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
            className="bg-gray-300 text-green-700 p-2 rounded-lg w-full"
          >
            Close
          </button>
        </Modal>
        {renderAnalyticsChart()}
      </div>
    </div>
  );
};

export default SelectedVarietyAnalyticsPage;
