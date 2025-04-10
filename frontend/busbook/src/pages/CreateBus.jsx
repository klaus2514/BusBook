import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import '../styles/createBus.css';

const CreateBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    totalSeats: "",
    schedules: [{
      destinationDate: "", // Changed from departureDate
      destinationTime: "", // Changed from departureTime
      arrivalDate: "",
      arrivalTime: "",
      startingPoint: "",
      destination: "",
      ticketPrice: ""
    }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Bus name is required";
    if (!formData.totalSeats || formData.totalSeats < 1) newErrors.totalSeats = "Must have at least 1 seat";
    
    formData.schedules.forEach((schedule, index) => {
      if (!schedule.startingPoint.trim()) newErrors[`startingPoint-${index}`] = "Starting point is required";
      if (!schedule.destination.trim()) newErrors[`destination-${index}`] = "Destination is required";
      if (!schedule.destinationDate) newErrors[`destinationDate-${index}`] = "Departure date is required"; // Updated
      if (!schedule.destinationTime) newErrors[`destinationTime-${index}`] = "Departure time is required"; // Updated
      if (!schedule.arrivalDate) newErrors[`arrivalDate-${index}`] = "Arrival date is required";
      if (!schedule.arrivalTime) newErrors[`arrivalTime-${index}`] = "Arrival time is required";
      
      if (schedule.destinationDate && schedule.arrivalDate) { // Updated
        if (new Date(schedule.arrivalDate) < new Date(schedule.destinationDate)) { // Updated
          newErrors[`arrivalDate-${index}`] = "Arrival date must be after departure date";
        }
      }
      
      if (!schedule.ticketPrice || isNaN(schedule.ticketPrice) || parseFloat(schedule.ticketPrice) <= 0) {
        newErrors[`ticketPrice-${index}`] = "Valid ticket price is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index === null) {
      setFormData(prev => ({
        ...prev,
        [name]: name === "totalSeats" ? (value === "" ? "" : parseInt(value)) : value
      }));
    } else {
      const updatedSchedules = [...formData.schedules];
      updatedSchedules[index] = { 
        ...updatedSchedules[index], 
        [name]: name === "ticketPrice" ? (value === "" ? "" : parseFloat(value)) : value 
      };
      setFormData(prev => ({ ...prev, schedules: updatedSchedules }));
    }
  };

  const addSchedule = () => setFormData(prev => ({
    ...prev,
    schedules: [
      ...prev.schedules,
      {
        destinationDate: "", // Updated
        destinationTime: "", // Updated
        arrivalDate: "",
        arrivalTime: "",
        startingPoint: "",
        destination: "",
        ticketPrice: ""
      }
    ]
  }));

  const removeSchedule = (index) => {
    if (formData.schedules.length > 1) {
      setFormData(prev => ({
        ...prev,
        schedules: prev.schedules.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Create Bus
      const busRes = await axios.post(
        "/buses/add-bus",
        {
          name: formData.name,
          totalSeats: parseInt(formData.totalSeats)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const busId = busRes.data.bus._id;
      const totalSeats = parseInt(formData.totalSeats);

      // 2. Create Schedules
      const schedulePromises = formData.schedules.map(schedule => 
        axios.post(
          "/buses/add-schedule",
          {
            busId: busId,
            departureDate: schedule.destinationDate, // Updated
            departureTime: schedule.destinationTime, // Updated
            arrivalDate: schedule.arrivalDate,
            arrivalTime: schedule.arrivalTime,
            startingPoint: schedule.startingPoint,
            destination: schedule.destination,
            ticketPrice: parseFloat(schedule.ticketPrice),
            totalSeats: totalSeats,
            availableSeats: totalSeats
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(schedulePromises);
      toast.success("Bus and schedules created successfully!");
      navigate("/operator/my-buses");
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         "Operation failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-bus-container">
      <div className="create-bus-glass">
        <h2 className="create-bus-title">Create New Bus</h2>
        
        <form onSubmit={handleSubmit} className="create-bus-form">
          <div className="bus-details">
            <div className="grid-container">
              <div className="input-group">
                <label className="input-label">Bus Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange(e)}
                  className="create-bus-input"
                  required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="input-group">
                <label className="input-label">Total Seats*</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={(e) => handleChange(e)}
                  min="1"
                  className="create-bus-input"
                  required
                />
                {errors.totalSeats && <span className="error-message">{errors.totalSeats}</span>}
              </div>
            </div>
          </div>

          <div className="schedule-section">
            <h3 className="schedule-title">Schedules*</h3>
            
            {formData.schedules.map((schedule, index) => (
              <div key={index} className="schedule-card">
                <div className="grid-container">
                  <div className="input-group">
                    <label className="input-label">From*</label>
                    <input
                      type="text"
                      name="startingPoint"
                      value={schedule.startingPoint}
                      onChange={(e) => handleChange(e, index)}
                      className="create-bus-input"
                      required
                    />
                    {errors[`startingPoint-${index}`] && (
                      <span className="error-message">{errors[`startingPoint-${index}`]}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <label className="input-label">To*</label>
                    <input
                      type="text"
                      name="destination"
                      value={schedule.destination}
                      onChange={(e) => handleChange(e, index)}
                      className="create-bus-input"
                      required
                    />
                    {errors[`destination-${index}`] && (
                      <span className="error-message">{errors[`destination-${index}`]}</span>
                    )}
                  </div>
                </div>

                <div className="grid-container">
                  <div className="input-group">
                    <label className="input-label">Departure Date*</label>
                    <input
                      type="date"
                      name="destinationDate" // Updated
                      value={schedule.destinationDate} // Updated
                      onChange={(e) => handleChange(e, index)}
                      className="create-bus-input"
                      required
                    />
                    {errors[`destinationDate-${index}`] && ( // Updated
                      <span className="error-message">{errors[`destinationDate-${index}`]}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Departure Time*</label>
                    <input
                      type="time"
                      name="destinationTime" // Updated
                      value={schedule.destinationTime} // Updated
                      onChange={(e) => handleChange(e, index)}
                      className="create-bus-input"
                      required
                    />
                    {errors[`destinationTime-${index}`] && ( // Updated
                      <span className="error-message">{errors[`destinationTime-${index}`]}</span>
                    )}
                  </div>
                </div>

                <div className="grid-container">
                  <div className="input-group">
                    <label className="input-label">Arrival Date*</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={schedule.arrivalDate}
                      onChange={(e) => handleChange(e, index)}
                      className="create-bus-input"
                      required
                      min={schedule.destinationDate} // Updated
                    />
                    {errors[`arrivalDate-${index}`] && (
                      <span className="error-message">{errors[`arrivalDate-${index}`]}</span>
                    )}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Arrival Time*</label>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={schedule.arrivalTime}
                      onChange={(e) => handleChange(e, index)}
                      className="create-bus-input"
                      required
                    />
                    {errors[`arrivalTime-${index}`] && (
                      <span className="error-message">{errors[`arrivalTime-${index}`]}</span>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Ticket Price (₹)*</label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={schedule.ticketPrice}
                    onChange={(e) => handleChange(e, index)}
                    min="0"
                    step="0.01"
                    className="create-bus-input"
                    required
                  />
                  {errors[`ticketPrice-${index}`] && (
                    <span className="error-message">{errors[`ticketPrice-${index}`]}</span>
                  )}
                </div>

                {formData.schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="remove-schedule-btn"
                  >
                    Remove Schedule
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSchedule}
              className="add-schedule-btn"
            >
              + Add Another Schedule
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Processing...' : 'Create Bus & Schedules'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBus;