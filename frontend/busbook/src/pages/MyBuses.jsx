import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify"; // Added missing import
import "../styles/myBuses.css";

const MyBuses = () => {
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null); // Track which bus is being deleted

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const [busResponse, scheduleResponse] = await Promise.all([
        axios.get("/buses/my-buses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/buses/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (!Array.isArray(busResponse.data)) throw new Error("Invalid bus response format");
      if (!Array.isArray(scheduleResponse.data)) throw new Error("Invalid schedule response format");

      setBuses(busResponse.data);
      setSchedules(scheduleResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err.response?.status === 401
          ? "Unauthorized: Please log in again."
          : err.response?.data?.message || err.message || "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus and all its schedules?")) return;

    try {
      setDeletingId(busId); // Show loading state for this bus
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in.");

      await axios.delete(`/buses/delete-bus/${busId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Bus deleted successfully!");
      await fetchData(); // Refresh the data
    } catch (err) {
      console.error("Error deleting bus:", err);
      toast.error(err.response?.data?.message || err.message || "Error deleting bus.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your buses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-buses-container">
      <div className="header-section">
        <h2 className="page-title">My Buses</h2>
        <div className="stats-badge">
          <span>{buses.length} {buses.length === 1 ? 'Bus' : 'Buses'}</span>
        </div>
      </div>

      {buses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚌</div>
          <h3>No Buses Found</h3>
          <p>You haven't created any buses yet. Create your first bus to get started!</p>
        </div>
      ) : (
        <div className="buses-grid">
          {buses.map((bus) => {
           const busSchedules = schedules.filter((schedule) => {
            if (!schedule.bus) return false; 
            const busId = typeof schedule.bus === 'object' ? schedule.bus._id : schedule.bus;
            return busId === bus._id;
          });
          
            
            
            return (
              <div key={bus._id} className="bus-card">
                <div className="bus-header">
                  <h3 className="bus-name">
                    <span className="bus-icon">🚌</span>
                    {bus.name}
                  </h3>
                  <div className="bus-meta">
                    <span className="seats-badge">{bus.totalSeats} seats</span>
                    <span className="schedules-count">
                      {busSchedules.length} {busSchedules.length === 1 ? 'schedule' : 'schedules'}
                    </span>
                  </div>
                </div>

                {busSchedules.length > 0 ? (
                  <div className="schedules-container">
                    {busSchedules.map((schedule) => (
                      <div key={schedule._id} className="schedule-card">
                        <div className="route-info">
                          <div className="route-path">
                            <div className="route-from-to">
                              <span className="route-from">{schedule.startingPoint}</span>
                              <span className="route-arrow">→</span>
                              <span className="route-to">{schedule.destination}</span>
                            </div>
                          </div>
                          <div className="price-tag">₹{schedule.ticketPrice}</div>
                        </div>
                        
                        <div className="timing-info">
                          <div className="timing-group">
                            <span className="timing-label">Departure:</span>
                            <span className="timing-value">
                              {new Date(schedule.departureDate).toLocaleDateString()} at {schedule.departureTime}
                            </span>
                          </div>
                          <div className="timing-group">
                            <span className="timing-label">Arrival:</span>
                            <span className="timing-value">
                              {new Date(schedule.arrivalDate).toLocaleDateString()} at {schedule.arrivalTime}
                            </span>
                          </div>
                        </div>
                        
                        <div className="availability-info">
                          <span className="seats-available">
                            {schedule.availableSeats} seats available
                          </span>
                          <span className={`status ${schedule.availableSeats > 0 ? 'available' : 'full'}`}>
                            {schedule.availableSeats > 0 ? 'Available' : 'Full'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-schedules">
                    <p>No schedules available for this bus</p>
                  </div>
                )}

                <div className="card-footer">
                  <button
                    onClick={() => handleDelete(bus._id)}
                    className="delete-btn"
                    disabled={deletingId === bus._id}
                  >
                    {deletingId === bus._id ? (
                      <>
                        <span className="delete-spinner"></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Bus"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBuses;
