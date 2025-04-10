// src/pages/DeleteBus.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios"; // Use your custom Axios instance
import "../styles/Home.css"; // Assuming you'll add some styling

const DeleteBus = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch buses for the operator
  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.get("/buses/my-buses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        setBuses(response.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
      setError(
        err.response?.status === 401
          ? "Unauthorized: Please log in again."
          : err.response?.data?.message || err.message || "Failed to load buses."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a bus by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.delete(`/buses/delete-bus/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Bus deleted successfully!");
        fetchBuses(); // Refresh the list
      }
    } catch (err) {
      console.error("Error deleting bus:", err);
      alert(
        err.response?.data?.message || err.message || "Error deleting bus."
      );
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading buses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="delete-bus-container">
      <h2 className="page-title">Delete a Bus</h2>
      {buses.length === 0 ? (
        <div className="no-buses-message">
          <p>You haven't created any buses yet.</p>
        </div>
      ) : (
        <div className="buses-list">
          {buses.map((bus) => (
            <div key={bus._id} className="bus-card">
              <div className="bus-info">
                <span className="bus-name">{bus.name}</span>
                <span className="bus-seats">{bus.totalSeats} seats</span>
              </div>
              <button
                onClick={() => handleDelete(bus._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteBus;