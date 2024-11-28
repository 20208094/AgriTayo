import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const MarketAnalyticsPage = () => {
  const [marketData, setMarketData] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const cropsResponse = await fetch(`/api/crops`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const categoryResponse = await fetch(`/api/crop_categories`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const subcategoryResponse = await fetch(`/api/crop_sub_categories`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const varietyResponse = await fetch(`/api/crop_varieties`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const crops = await cropsResponse.json();
      const categoriesraw = await categoryResponse.json();
      const subcategories = await subcategoryResponse.json();
      const varieties = await varietyResponse.json();

      const categories = categoriesraw.sort((a, b) => a.crop_category_id - b.crop_category_id);

      // Combine the varieties with the crops
      const combinedVarieties = varieties.map(variety => {
        const cropsData = crops.filter(crop => crop.crop_variety_id === variety.crop_variety_id);
        return {
          ...variety,
          crops: cropsData ? cropsData : null,
        };
      });

      // Combine the subcategories with the varieties
      const combinedSubcategories = subcategories.map(subcat => {
        const varietiesData = combinedVarieties.filter(variety => variety.crop_sub_category_id === subcat.crop_sub_category_id);
        return {
          ...subcat,
          varieties: varietiesData ? varietiesData : null,
        };
      });

      // Combine the categories with the subcategories
      const combinedCategories = categories.map(cat => {
        const subcategoriesData = combinedSubcategories.filter(subCat => subCat.crop_category_id === cat.crop_category_id);
        return {
          ...cat,
          subcategories: subcategoriesData ? subcategoriesData : null,
        };
      });

      setMarketData(combinedCategories)
      console.log('combinedCategories :', combinedCategories);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleExpandSubcategory = (subcategoryId) => {
    setExpandedSubcategory(expandedSubcategory === subcategoryId ? null : subcategoryId);
  };

  return (
    <div className="bg-gray-100 p-4 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto">
        {marketData.map((category) => (
          <div key={category.crop_category_id} className="my-2 mx-4">
            <button
              className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow w-full"
              onClick={() => toggleExpandCategory(category.crop_category_id)}
            >
              <div className="flex flex-row items-center">
                <LazyLoadImage
                  src={category.crop_category_image_url}
                  alt={category.crop_category_name}
                  className="h-10 w-10 object-cover object-center transition-transform duration-300 hover:scale-110"
                />
                <span className="pl-2 text-lg font-semibold text-black">
                  {category.crop_category_name}
                </span>
              </div>
              {expandedCategory === category.crop_category_id ? (
                <FaChevronUp size={24} color="#00B251" />
              ) : (
                <FaChevronDown size={24} color="#00B251" />
              )}
            </button>
            {expandedCategory === category.crop_category_id &&
              category.subcategories &&
              category.subcategories.map((subcat) => (
                <div key={subcat.crop_sub_category_id}><button
                  className="ml-12 mt-2 p-3 bg-gray-200 rounded-lg w-[90%] text-left"
                  onClick={() => toggleExpandSubcategory(subcat.crop_sub_category_id)}
                >
                  <div className="flex items-center">
                    <LazyLoadImage
                      src={subcat.crop_sub_category_image_url}
                      alt={subcat.crop_sub_category_name}
                      className="h-10 w-10 mr-4 object-cover object-center transition-transform duration-300 hover:scale-110"
                    />
                    <span className="text-md text-green-600 flex-1">
                      {subcat.crop_sub_category_name}
                    </span>
                    {expandedSubcategory === subcat.crop_sub_category_id ? (
                      <FaChevronUp size={24} color="#00B251" />
                    ) : (
                      <FaChevronDown size={24} color="#00B251" />
                    )}
                  </div>
                </button>
                  {expandedSubcategory === subcat.crop_sub_category_id &&
                    subcat.varieties &&
                    subcat.varieties.map((variety) => (
                      <div key={variety.crop_variety_id} className="ml-20 mt-1 w-[80%]">
                        <button
                          className="p-2 bg-white rounded-lg shadow w-full text-left"
                          onClick={() =>
                            navigate(`/admin/VarietyAnalytics/${variety.crop_variety_id}`)
                          }
                        >
                          <div className="flex flex-row items-center">
                            <LazyLoadImage
                              src={variety.crop_variety_image_url}
                              alt={variety.crop_variety_name}
                              className="h-10 w-10 mr-4 object-cover object-center transition-transform duration-300 hover:scale-110"
                            />
                            <span className="text-sm text-green-600">
                              {variety.crop_variety_name}
                            </span>
                          </div>
                        </button>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketAnalyticsPage;
