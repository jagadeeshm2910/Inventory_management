import React from "react";
import Grid from "@mui/material/Grid"; // Import Grid from Material-UI
import "../style/HomePage.css";

function HomePage() {
  return (
    <div style={{ paddingTop: "50px" }}>
      <div className="dashboard">
        <h1 className="primary-header">Order Details</h1>
        <div className="dashboard-content"></div>
      </div>
    </div>
  );
}

export default HomePage;
