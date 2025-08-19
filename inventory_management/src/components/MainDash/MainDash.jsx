import React, { useState } from "react";
import "./MainDash.css";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import NewOrder from "../NewOrder/NewOrder";

const MainDash = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrderSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="MainDash">
      <h1 className="main-title">Inventory Management Application</h1>

      <NewOrder onOrderSubmitted={handleOrderSubmitted} />

      <Cards refreshKey={refreshKey} />

      <Table refreshKey={refreshKey} />
    </div>
  );
};

export default MainDash;
