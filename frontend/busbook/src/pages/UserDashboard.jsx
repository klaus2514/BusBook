import React, { useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/user.css";

const UserDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.get("/buses/schedules", {
        params: {
          from: searchData.from.toLowerCase(),
          to: searchData.to.toLowerCase(),
          date: searchData.date
        }
      });
  
      const validSchedules = res.data.filter(schedule => 
        schedule.bus &&
        schedule.departureDate &&
        schedule.departureTime &&
        schedule.startingPoint &&
        schedule.destination &&
        schedule.ticketPrice !== undefined &&
        schedule.availableSeats !== undefined &&
        schedule.totalSeats !== undefined
      );
  
      if (validSchedules.length === 0 && res.data.length > 0) {
        setError("Some schedule data is incomplete");
      }
  
      setSchedules(validSchedules);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search for buses. Please try again.");
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="travel-dashboard">
      <Navbar />
      
      <div className="travel-dashboard-container">
        <div className="travel-search-container glass-card">
          <h2 className="travel-search-title">Find Your Bus</h2>
          <form onSubmit={handleSearch} className="travel-search-form">
            <div className="travel-input-group">
              <div className="travel-input-wrapper">
                <label className="travel-input-label">From</label>
                <input
                  type="text"
                  name="from"
                  value={searchData.from}
                  onChange={handleInputChange}
                  placeholder="Departure city"
                  className="travel-input"
                  required
                />
              </div>
              
              <div className="travel-input-wrapper">
                <label className="travel-input-label">To</label>
                <input
                  type="text"
                  name="to"
                  value={searchData.to}
                  onChange={handleInputChange}
                  placeholder="Destination city"
                  className="travel-input"
                  required
                />
              </div>
              
              <div className="travel-input-wrapper">
                <label className="travel-input-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="travel-input"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="travel-search-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="travel-spinner"></span>
                    Searching...
                  </>
                ) : "Search Buses"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="travel-error-message">
            <span className="travel-error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="travel-results-container">
          {isLoading ? (
            <div className="travel-loading-state">
              <div className="travel-spinner-large"></div>
              <p>Finding available buses...</p>
            </div>
          ) : schedules.length > 0 ? (
            <div className="travel-bus-grid">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="travel-bus-card">
                  <div className="travel-bus-header">
                    <h3 className="travel-bus-name">
                      {schedule.bus?.name || "Unknown Bus"}
                    </h3>
                    <div className="travel-bus-availability">
                      <span className="travel-seats-available">
                        {schedule.availableSeats} seats left
                      </span>
                    </div>
                  </div>
                  
                  <div className="travel-bus-route">
                    <div className="travel-route-point">
                      <div className="travel-route-marker departure"></div>
                      <div>
                        <p className="travel-route-city">{schedule.startingPoint}</p>
                        <p className="travel-route-time">
                          {new Date(`${schedule.departureDate}T${schedule.departureTime}`)
                            .toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="travel-route-line"></div>
                    
                    <div className="travel-route-point">
                      <div className="travel-route-marker arrival"></div>
                      <div>
                        <p className="travel-route-city">{schedule.destination}</p>
                        <p className="travel-route-time">
                          {schedule.arrivalDate && schedule.arrivalTime ? 
                            new Date(`${schedule.arrivalDate}T${schedule.arrivalTime}`)
                              .toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="travel-bus-footer">
                    <div className="travel-price">
                      <span className="travel-price-label">Price</span>
                      <span className="travel-price-value">₹{schedule.ticketPrice}</span>
                    </div>
                    
                    <Link 
                      to={`/bookings/${schedule._id}`} 
                      className="travel-book-btn"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="travel-empty-state">
                <div className="travel-empty-icon">🚌</div>
                <h3>No buses found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;