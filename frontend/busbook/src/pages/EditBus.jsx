// src/pages/EditBus.jsx
import React, { useEffect, useState } from "react";

const EditBus = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState("");
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBuses = async () => {
      const res = await fetch("/api/buses/my-buses", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setBuses(data);
    };
    fetchBuses();
  }, []);

  const handleBusSelect = (e) => {
    const id = e.target.value;
    setSelectedBusId(id);
    const selected = buses.find((b) => b._id === id);
    if (selected) {
      setName(selected.name);
      setTotalSeats(selected.totalSeats);
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/buses/update-bus/${selectedBusId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ name, totalSeats }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Bus updated!");
    } else {
      alert(data.message || "Error updating bus");
    }
  };

  return (
    <div className="form">
      <h2>Edit Bus</h2>
      <select value={selectedBusId} onChange={handleBusSelect}>
        <option value="">Select a Bus</option>
        {buses.map((bus) => (
          <option key={bus._id} value={bus._id}>
            {bus.name}
          </option>
        ))}
      </select>
      {selectedBusId && (
        <>
          <input
            type="text"
            placeholder="New Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="New Seat Count"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
          />
          <button onClick={handleUpdate}>Update Bus</button>
        </>
      )}
    </div>
  );
};

export default EditBus;
