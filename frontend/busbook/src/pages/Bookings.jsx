import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "../utils/axios";
import "../styles/bookings.css";



const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await axios.get("/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.success) {
          setBookings(res.data.data || []);
        } else {
          throw new Error(res.data?.message || "Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Booking fetch error:", err);
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="travel-loading">
        <div className="travel-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="travel-error">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button 
          className="travel-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="travel-bookings">
      <div className="travel-container">
        <h2 className="travel-section-title">My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="travel-empty">
            <div className="travel-empty-icon">✈️</div>
            <h3>No bookings yet</h3>
            <p>Your future adventures will appear here</p>
            <Link to="/" className="travel-btn">Explore Buses</Link>
          </div>
        ) : (
          <div className="travel-bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="travel-booking-card">
                <div className="travel-booking-header">
                  <h3>{booking.schedule?.bus?.name || "Unknown Bus"}</h3>
                  <span className={`travel-booking-status ${booking.status || 'unknown'}`}>
                    {booking.status || "unknown"}
                  </span>
                </div>
                
                <div className="travel-booking-route">
                  <div className="travel-route-point">
                    <div className="travel-route-marker"></div>
                    <div>
                      <p className="travel-route-label">From</p>
                      <p className="travel-route-value">{booking.schedule?.startingPoint || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="travel-route-line"></div>
                  
                  <div className="travel-route-point">
                    <div className="travel-route-marker"></div>
                    <div>
                      <p className="travel-route-label">To</p>
                      <p className="travel-route-value">{booking.schedule?.destination || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="travel-booking-details">
                  <div className="travel-detail">
                    <span>Departure</span>
                    <p>
                    {booking.schedule?.departureDate && booking.schedule?.departureTime
  ? `${new Date(booking.schedule.departureDate).toLocaleDateString()} ${booking.schedule.departureTime}`
  : "N/A"}
                    </p>
                  </div>
                  
                  <div className="travel-detail">
                    <span>Seat(s)</span>
                    <p>
                      {Array.isArray(booking.seatNumber) 
                        ? booking.seatNumber.join(", ")
                        : booking.seatNumber || "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="travel-booking-footer">
              
                <button 
    className="travel-btn-outline"
    onClick={() => navigate('/ticket', { state: { booking } })}
  >
    View Ticket
  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;