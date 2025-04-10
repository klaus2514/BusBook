import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../utils/axios.js";
import "../styles/booking.css";


const BookingPage = () => {
  const { scheduleId } = useParams();
  const { state } = useLocation();
  const [schedule, setSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "male",
    numberOfTickets: 1,
    emergencyContact: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [seatError, setSeatError] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (state?.schedule) {
          const validatedSchedule = {
            bus: state.schedule.bus || { name: "Unknown Bus" },
            departureDate: new Date(state.schedule.departureDate || Date.now()),
            departureTime: state.schedule.departureTime || "00:00",
            startingPoint: state.schedule.startingPoint || "Unknown",
            destination: state.schedule.destination || "Unknown",
            ticketPrice: state.schedule.ticketPrice || 0,
            availableSeats: state.schedule.availableSeats || 0,
            totalSeats: state.schedule.totalSeats || 0,
            arrivalDate: state.schedule.arrivalDate ? new Date(state.schedule.arrivalDate) : null,
            arrivalTime: state.schedule.arrivalTime || null
          };
          setSchedule(validatedSchedule);
          setLoading(false);
          return;
        }

        if (!scheduleId) {
          throw new Error("Schedule ID is required");
        }

        const res = await axios.get(`/buses/schedules/${scheduleId}`);
        
        if (!res.data || !res.data.data) {
          throw new Error("No schedule data received from server");
        }

        const scheduleData = res.data.data;
        
        const validatedSchedule = {
          bus: scheduleData.bus || { name: "Unknown Bus" },
          departureDate: new Date(scheduleData.departureDate || Date.now()),
          departureTime: scheduleData.departureTime || "00:00",
          startingPoint: scheduleData.startingPoint || "Unknown",
          destination: scheduleData.destination || "Unknown",
          ticketPrice: scheduleData.ticketPrice || 0,
          availableSeats: scheduleData.availableSeats || 0,
          totalSeats: scheduleData.totalSeats || 0,
          arrivalDate: scheduleData.arrivalDate ? new Date(scheduleData.arrivalDate) : null,
          arrivalTime: scheduleData.arrivalTime || null
        };

        setSchedule(validatedSchedule);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setError(err.response?.data?.message || err.message || "Failed to load schedule details");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "emergencyContact") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    
    if (name === "age") {
      const numValue = value === "" ? "" : Math.max(1, parseInt(value)) || 1;
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    if (name === "numberOfTickets") {
      const numValue = value === "" ? "" : Math.max(1, parseInt(value)) || 1;
      
      // Check seat availability in real-time
      if (schedule && numValue > schedule.availableSeats) {
        setSeatError(`Only ${schedule.availableSeats} seat(s) available`);
      } else {
        setSeatError("");
      }
      
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update the handleBooking function in BookingPage.jsx
const handleBooking = async (e) => {
  e.preventDefault();
  
  if (!schedule) {
    setError("Schedule information not loaded");
    return;
  }

  // Clear previous errors
  setError("");
  setSeatError("");

  // Validate form
  const errors = [];
  if (!formData.name.trim()) errors.push("Full name is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Valid email address is required");
  if (formData.phone.length < 10) errors.push("Valid 10-digit phone number is required");
  if (formData.emergencyContact.length < 10) errors.push("Valid 10-digit emergency contact is required");
  if (!formData.age || formData.age < 1) errors.push("Valid age is required");
  if (formData.numberOfTickets < 1) errors.push("At least 1 ticket is required");
  
  // Enhanced seat availability check
  if (formData.numberOfTickets > schedule.availableSeats) {
    errors.push(`Only ${schedule.availableSeats} seat(s) available - you requested ${formData.numberOfTickets}`);
    setSeatError(`Only ${schedule.availableSeats} seat(s) available`);
  }

  if (errors.length > 0) {
    setError(errors.join(". "));
    return;
  }

  const token = localStorage.getItem('token');
  console.log("Token:", token); // Should show your JWT
  
  try {
    const res = await axios.post('/bookings/book-seat', {
      scheduleId,
      ...formData,
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Force-add the header
      }
    });

    if (res.data.success) {
      // Generate seat numbers and booking data
      const seatNumbers = Array.from(
        { length: formData.numberOfTickets },
        (_, i) => schedule.totalSeats - schedule.availableSeats + i + 1
      );

      setBookingData({
        bookingId: res.data.data.bookingId,
        seatNumbers: res.data.data.seatNumbers,
        totalAmount: res.data.data.totalAmount,
        bookingDate: new Date(),
        passenger: formData,
        scheduleDetails: schedule
      });

      // Update the schedule's available seats locally
      setSchedule(prev => ({
        ...prev,
        availableSeats: prev.availableSeats - formData.numberOfTickets
      }));
    } else {
      setError(res.data.message || "Booking failed");
    }
  } catch (err) {
    console.error("Full error:", {
      config: err.config,  // Check the sent headers here
      response: err.response
    });
    setError(err.response?.data?.message || "Booking failed");
  }
};

  const handleNewBooking = () => {
    setBookingData(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "male",
      numberOfTickets: 1,
      emergencyContact: ""
    });
    setError("");
    setSeatError("");
  };

  if (loading) {
    return <div className="loading">Loading schedule details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!schedule) {
    return <div className="error">Schedule not available</div>;
  }

 
  
    return (
      <div className="travel-booking-page">
        {/* Route Information */}
        <div className="travel-route-info glass-card">
          <h2 className="travel-bus-name">{schedule.bus?.name || "Unknown Bus"}</h2>
          <div className="travel-route-details">
            <div className="travel-route-point">
              <div className="travel-route-marker departure"></div>
              <div>
                <p className="travel-route-city">{schedule.startingPoint || "Unknown"}</p>
                <p className="travel-route-time">
                  {schedule.departureDate?.toLocaleDateString() || "Unknown date"} at {schedule.departureTime || "Unknown time"}
                </p>
              </div>
            </div>
            
            <div className="travel-route-arrow">→</div>
            
            <div className="travel-route-point">
              <div className="travel-route-marker arrival"></div>
              <div>
                <p className="travel-route-city">{schedule.destination || "Unknown"}</p>
                {schedule.arrivalDate && schedule.arrivalTime && (
                  <p className="travel-route-time">
                    {new Date(schedule.arrivalDate).toLocaleDateString()} at {schedule.arrivalTime}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="travel-pricing">
            <div className="travel-price">
              <span className="travel-price-label">Price per ticket</span>
              <span className="travel-price-value">₹{schedule.ticketPrice || 0}</span>
            </div>
            <div className={`travel-seats ${schedule.availableSeats === 0 ? "travel-no-seats" : ""}`}>
              {schedule.availableSeats || 0} of {schedule.totalSeats || 0} seats available
            </div>
          </div>
        </div>
  
        {bookingData ? (
          <div className="travel-ticket-confirmation">
            <div className="travel-ticket-header">
              <h2>🎉 Booking Confirmed!</h2>
              <p className="travel-booking-id">Booking ID: {bookingData.bookingId}</p>
            </div>
            
            <div className="travel-ticket glass-card">
              <div className="travel-ticket-route">
                <h3>{schedule.bus?.name || "Unknown Bus"}</h3>
                <div className="travel-route-visual">
                  <div className="travel-route-from">
                    <span className="travel-city">{schedule.startingPoint || "Unknown"}</span>
                    <span className="travel-date-time">
                      {schedule.departureDate?.toLocaleDateString() || "Unknown"} • {schedule.departureTime || "Unknown"}
                    </span>
                  </div>
                  <div className="travel-route-arrow">→</div>
                  <div className="travel-route-to">
                    <span className="travel-city">{schedule.destination || "Unknown"}</span>
                    {schedule.arrivalDate && schedule.arrivalTime && (
                      <span className="travel-date-time">
                        {new Date(schedule.arrivalDate).toLocaleDateString()} • {schedule.arrivalTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="travel-ticket-details">
                <div className="travel-passenger-info">
                  <h4>Passenger Details</h4>
                  <div className="travel-detail">
                    <span>Name:</span>
                    <p>{bookingData.passenger.name}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Age:</span>
                    <p>{bookingData.passenger.age}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Gender:</span>
                    <p>{bookingData.passenger.gender}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Contact:</span>
                    <p>{bookingData.passenger.phone}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Email:</span>
                    <p>{bookingData.passenger.email}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Emergency Contact:</span>
                    <p>{bookingData.passenger.emergencyContact}</p>
                  </div>
                </div>
                
                <div className="travel-journey-info">
                  <h4>Journey Details</h4>
                  <div className="travel-detail">
                    <span>Seat Numbers:</span>
                    <p>{bookingData.seatNumbers.join(", ")}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Total Tickets:</span>
                    <p>{bookingData.passenger.numberOfTickets}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Total Amount:</span>
                    <p>₹{bookingData.totalAmount}</p>
                  </div>
                  <div className="travel-detail">
                    <span>Booking Date:</span>
                    <p>{bookingData.bookingDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="travel-ticket-footer">
                <p className="travel-note">Please show this ticket at the boarding point</p>
                <div className="travel-actions">
                  <button onClick={() => window.print()} className="travel-print-btn">
                    Print Ticket
                  </button>
                  <button onClick={handleNewBooking} className="travel-new-booking-btn">
                    New Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="travel-booking-form glass-card">
            <h3 className="travel-form-title">Passenger Details</h3>
            
            <div className="travel-form-group">
              <label className="travel-input-label">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="travel-input"
                required
              />
            </div>
  
            <div className="travel-form-group">
              <label className="travel-input-label">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="travel-input"
                required
              />
            </div>
  
            <div className="travel-form-row">
              <div className="travel-form-group">
                <label className="travel-input-label">Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="travel-input"
                  required
                  maxLength="10"
                />
              </div>
              <div className="travel-form-group">
                <label className="travel-input-label">Emergency Contact*</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="travel-input"
                  required
                  maxLength="10"
                />
              </div>
            </div>
  
            <div className="travel-form-row">
              <div className="travel-form-group">
                <label className="travel-input-label">Age*</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="travel-input"
                  required
                  min="1"
                />
              </div>
  
              <div className="travel-form-group">
                <label className="travel-input-label">Gender*</label>
                <select 
                  name="gender" 
                  value={formData.gender}
                  onChange={handleChange}
                  className="travel-select"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="travel-form-group">
              <label className="travel-input-label">Number of Tickets*</label>
              <input
                type="number"
                name="numberOfTickets"
                value={formData.numberOfTickets}
                onChange={handleChange}
                className={`travel-input ${seatError ? "travel-input-error" : ""}`}
                required
                min="1"
                max={schedule.availableSeats}
              />
              <div className="travel-seats-info">
                <span className={`travel-seats-available ${schedule.availableSeats === 0 ? "travel-no-seats" : ""}`}>
                  {schedule.availableSeats} seat(s) available
                </span>
                {seatError && <span className="travel-seat-error">{seatError}</span>}
              </div>
            </div>
            
            <div className="travel-price-summary">
              <p className="travel-total-price">Total: ₹{schedule.ticketPrice * formData.numberOfTickets}</p>
              <small className="travel-price-breakdown">({formData.numberOfTickets} × ₹{schedule.ticketPrice})</small>
            </div>
            
            {error && <div className="travel-form-error">{error}</div>}
            
            <button 
              type="submit" 
              className="travel-book-btn"
              disabled={schedule.availableSeats === 0}
            >
              {schedule.availableSeats === 0 ? "No Seats Available" : "Confirm Booking"}
            </button>
          </form>
        )}
      </div>
    );
  };
  
  export default BookingPage;