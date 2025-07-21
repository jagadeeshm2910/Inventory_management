import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Orders.css";
import Table from "./../Table/Table";
import NewOrder from "./../NewOrder/NewOrder";
import Summary from "../Summary/Summary";

function Orders() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  // Handler to trigger table refresh
  const handleOrderSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="orders-container">
        <h1 className="orders-title">Order Summery</h1>
        <div className="date-summary-row">
          <label className="orders-label">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="orders-date-input"
            // open={true}
          />

          <Summary selectedDate={selectedDate} />
          <NewOrder onOrderSubmitted={handleOrderSubmitted} />
        </div>

        <Table selectedDate={selectedDate} refreshKey={refreshKey} />
      </div>
    </div>
  );
}

export default Orders;
