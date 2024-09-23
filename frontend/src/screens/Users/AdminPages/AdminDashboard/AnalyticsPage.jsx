import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AnalyticsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName, items } = location.state || {};

  return (
    <div className="analytics-page">
      {categoryName && (
        <div className="category-container">
          <h2>{categoryName}</h2>
          <div className="items-list">
            {items.map((item) => (
              <button
                key={item.id}
                className="item-button"
                onClick={() =>
                  navigate("/admin/marketAnalytics", {
                    state: {
                      category: items,
                      selectedItemId: item.id,
                    },
                  })
                }
              >
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
