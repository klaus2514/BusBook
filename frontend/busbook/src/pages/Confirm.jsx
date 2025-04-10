import React from "react";
import "../styles/TicketConfirmed.css"; // Adjust path if your CSS is in another folder

const TicketConfirmed = () => {
  return (
    <div className="ticket-confirmed-container">
      <div className="ticket-card">
        <h1>🎉 Your Ticket is Confirmed!</h1>
        <p>Thank you for booking with us. Safe travels! 🚌</p>
      </div>
    </div>
  );
};

export default TicketConfirmed;
