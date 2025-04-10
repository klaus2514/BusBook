import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/TicketDetails.css";

const TicketDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="ticket-error">
        <h3>No ticket information found</h3>
        <button onClick={() => navigate("/bookings")} className="travel-btn">
          Back to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-container">
      <div className="ticket-card">
        <div className="ticket-header">
          <h2>Travel Ticket</h2>
          <div className="ticket-status">{booking.status || "confirmed"}</div>
        </div>

        <div className="ticket-route">
          <div className="route-from">
            <h3>{booking.schedule?.startingPoint || "N/A"}</h3>
            <p>Departure: {new Date(booking.schedule?.departureDate).toDateString()}</p>
            <p>Time: {booking.schedule?.departureTime || "N/A"}</p>
          </div>
          
          <div className="route-arrow">→</div>
          
          <div className="route-to">
            <h3>{booking.schedule?.destination || "N/A"}</h3>
            <p>Arrival: {new Date(booking.schedule?.arrivalDate).toDateString()}</p>
            <p>Time: {booking.schedule?.arrivalTime || "N/A"}</p>
          </div>
        </div>

        <div className="ticket-details">
          <div className="detail-section">
            <h4>Passenger Details</h4>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Seat:</strong> {booking.seatNumber}</p>
            <p><strong>Age:</strong> {booking.age}</p>
            <p><strong>Gender:</strong> {booking.gender}</p>
          </div>

          <div className="detail-section">
            <h4>Journey Details</h4>
            <p><strong>Bus:</strong> {booking.schedule?.bus?.name || "N/A"}</p>
            <p><strong>Ticket Price:</strong> ₹{booking.ticketPrice}</p>
            <p><strong>Booking Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            <p><strong>Booking ID:</strong> {booking._id}</p>
          </div>
        </div>

        <div className="ticket-footer">
          <div className="barcode">
            <p>Ticket ID: {booking._id}</p>
            {/* You can add a real barcode component here later */}
          </div>
          <button 
            onClick={() => window.print()} 
            className="print-btn"
          >
            Print Ticket
          </button>
        </div>
      </div>

      <button 
        onClick={() => navigate("/bookings")} 
        className="back-btn"
      >
        Back to My Bookings
      </button>
    </div>
  );
};

export default TicketDetails;
