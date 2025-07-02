import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/TableBooking.css";

const TableBooking = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTable, setSelectedTable] = useState(null);
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    setIsLoggedIn(!!email);
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tables");
        if (!response.ok) throw new Error("Failed to fetch tables");
        const data = await response.json();
        setTables(data.tables ?? data); // Flexible for response shape
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const showDetails = async (tableId) => {
    setDetailError(null);
    setDetailLoading(true);
    setDetailPopupVisible(true);
    setSelectedTable(null);

    try {
      const res = await fetch(`http://localhost:5000/api/tables/${tableId}`);
      if (!res.ok) throw new Error("Failed to fetch table details");
      const data = await res.json();
      setSelectedTable(data);
    } catch (err) {
      setDetailError(err.message || "Unknown error");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBookNow = (table) => {
    if (table.status !== "Available") return;
    if (isLoggedIn) {
      navigate(`/book/${table.table_id}`);
    } else {
      navigate("/auth/login");
    }
  };

  const closeAllPopups = () => {
    setDetailPopupVisible(false);
    setSelectedTable(null);
    setDetailError(null);
  };

  const handlePopupBackgroundClick = (e) => {
    if (e.target.classList.contains("popup")) {
      closeAllPopups();
    }
  };

  if (loading) return <div className="loading">Loading tables...</div>;
  if (error) return <div className="error">Error loading tables: {error}</div>;

  return (
    <div className="table-container">
      <h2>Available Tables</h2>

      <table className="table-booking">
        <thead>
          <tr>
            <th>Table No</th>
            <th>Image</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.table_id}>
              <td>{table.name || table.table_id}</td>
              <td>
                {table.image_url ? (
                  <img
                    src={`http://localhost:5000${table.image_url}`}
                    alt={`Table ${table.name || table.table_id}`}
                    className="table-thumbnail"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </td>
              <td>{table.seats}</td>
              <td>
                <span
                  className={`status-badge ${
                    table.status === "Available"
                      ? "status-available"
                      : "status-booked"
                  }`}
                >
                  {table.status}
                </span>
              </td>
              <td>
                <button
                  className="more-btn"
                  onClick={() => showDetails(table.table_id)}
                  disabled={detailLoading}
                >
                  More
                </button>
                <button
                  className="book-btn"
                  disabled={table.status !== "Available"}
                  onClick={() => handleBookNow(table)}
                >
                  Book Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detailPopupVisible && (
        <div className="popup" onClick={handlePopupBackgroundClick}>
          <div className="popup-content form-popup">
            <span className="close-btn" onClick={closeAllPopups}>
              &times;
            </span>

            {detailLoading && <p>Loading details...</p>}
            {detailError && <p className="error">Error: {detailError}</p>}

            {selectedTable && !detailLoading && !detailError && (
              <div className="table-details">
                {selectedTable.image_url && (
                  <img
                    src={`http://localhost:5000${selectedTable.image_url}`}
                    alt={`Table ${selectedTable.table_id}`}
                    className="popup-image"
                  />
                )}

                <div className="details-group">
                  <div className="detail-row">
                    <div className="detail-label">Table Number:</div>
                    <div className="detail-value">{selectedTable.name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Seats:</div>
                    <div className="detail-value">{selectedTable.seats}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Location:</div>
                    <div className="detail-value">
                      {selectedTable.location || "N/A"}
                    </div>
                  </div>
                  <div className="detail-row description-row">
                    <div className="detail-label">Description:</div>
                    <div className="detail-value detail-description">
                      {selectedTable.description ?? "N/A"}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status:</div>
                    <div
                      className={`detail-value status-badge ${
                        selectedTable.status === "Available"
                          ? "status-available"
                          : "status-booked"
                      }`}
                    >
                      {selectedTable.status || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBooking;
