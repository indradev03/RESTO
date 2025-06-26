import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/TableBooking.css";

const TableBooking = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) setIsLoggedIn(true);
  }, []);

  const tableData = [
    { id: 1, seats: 2, status: "Available", details: "Table 1 - 2 seats, near window, ideal for couples." },
    { id: 2, seats: 4, status: "Booked", details: "Table 2 - Already booked." },
    { id: 3, seats: 6, status: "Available", details: "Table 3 - 6 seats, spacious, good for families or groups." },
    { id: 4, seats: 2, status: "Available", details: "Table 4 - 2 seats, corner spot, cozy for quiet dining." }
  ];

  const showDetails = (table) => {
    setSelectedTable(table);
    setDetailPopupVisible(true);
  };

  const handleBookNow = (table) => {
    if (table.status !== "Available") return;

    if (isLoggedIn) {
      localStorage.setItem("hasNewBooking", "true"); // Notify header
      navigate(`/book/${table.id}`);
    } else {
      navigate("/auth/login");
    }
  };

  const closeAllPopups = () => {
    setDetailPopupVisible(false);
    setSelectedTable(null);
  };

  return (
    <div className="table-container">
      <h2>Available Tables</h2>
      <table className="table-booking">
        <thead>
          <tr>
            <th>Table No</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((table) => (
            <tr key={table.id}>
              <td>{table.id}</td>
              <td>{table.seats}</td>
              <td>
                <span className={`status-badge ${table.status === 'Available' ? 'status-available' : 'status-booked'}`}>
                  {table.status}
                </span>
              </td>
              <td>
                <button className="more-btn" onClick={() => showDetails(table)}>
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

      {detailPopupVisible && selectedTable && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closeAllPopups}>&times;</span>
            <h3>Table {selectedTable.id} Details</h3>
            <p>{selectedTable.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBooking;
