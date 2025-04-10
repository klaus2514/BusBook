import React, { useState } from "react";
import "../styles/admin.css";
import Navbar from "../components/Navbar";
import CreateBus from "./CreateBus";
import DeleteBus from "./DeleteBus";
import MyBuses from "./MyBuses";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("myBuses");

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-dashboard">
        <h1>Operator Dashboard</h1>
        <div className="tabs">
          <button onClick={() => setActiveTab("createBus")}>Add Bus</button>
          <button onClick={() => setActiveTab("deleteBus")}>Delete Bus</button>
        </div>
        <div className="content">
          {activeTab === "createBus" && <CreateBus />}
          {activeTab === "deleteBus" && <DeleteBus />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;