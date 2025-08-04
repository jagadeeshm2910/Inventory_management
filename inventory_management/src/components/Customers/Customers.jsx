import React, { useState } from "react";
import axios from "axios";

function OrdersTable({ orders }) {
  if (!orders || orders.length === 0) {
    return <div style={{ color: "#999", padding: 12 }}>No orders found.</div>;
  }
  return (
    <div style={{ height: "300px", overflowY: "auto", width: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#f9f9f9",
          borderRadius: "8px",
          marginTop: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <thead>
          <tr style={{ background: "#ffe0ec" }}>
            <th style={{ padding: "8px", border: "1px solid #eee" }}>Date</th>
            <th style={{ padding: "8px", border: "1px solid #eee" }}>
              Delivery Time
            </th>
            <th style={{ padding: "8px", border: "1px solid #eee" }}>
              Delivery Address
            </th>
            <th style={{ padding: "8px", border: "1px solid #eee" }}>Status</th>
            <th style={{ padding: "8px", border: "1px solid #eee" }}>
              Flavours
            </th>
            <th style={{ padding: "8px", border: "1px solid #eee" }}>
              Total Qty
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr
              key={order.id}
              style={{ background: idx % 2 === 0 ? "#fff" : "#f6fef7" }}
            >
              <td style={{ padding: "8px", border: "1px solid #eee" }}>
                {order.date}
              </td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>
                {order.delivery_time || "-"}
              </td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>
                {order.delivery_location || "-"}
              </td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>
                {order.status}
              </td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>
                {order.flavors && Array.isArray(order.flavors)
                  ? order.flavors.map((f, i) =>
                      f.quantities
                        .filter((q) => q.qty && q.qty !== "0" && q.qty !== "")
                        .map((q, j) => (
                          <div key={i + "-" + j}>
                            {f.flavor} {q.size ? `(${q.size})` : ""} - {q.qty}
                          </div>
                        ))
                    )
                  : "-"}
              </td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>
                {order.flavors && Array.isArray(order.flavors)
                  ? order.flavors.reduce(
                      (sum, f) =>
                        sum +
                        f.quantities.reduce(
                          (s, q) => s + (parseInt(q.qty) || 0),
                          0
                        ),
                      0
                    )
                  : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    caterer: "",
    address: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [customerOrders, setCustomerOrders] = useState({});
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch customers from backend
  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          "https://inventory-management-5-9dr8.onrender.com/orders/customers"
        );
        setCustomers(res.data);
      } catch {
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", caterer: "", address: "", contact: "" });
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://inventory-management-5-9dr8.onrender.com/orders/customers",
        {
          name: form.name,
          caterer: form.caterer,
          address: form.address,
          contact: form.contact,
        }
      );
      // Refetch customers after adding
      const res = await axios.get(
        "https://inventory-management-5-9dr8.onrender.com/orders/customers"
      );
      setCustomers(res.data);
      handleClose();
    } catch {
      alert("Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
      return;
    }
    setExpandedCustomerId(customerId);
    if (!customerOrders[customerId]) {
      setOrdersLoading(true);
      try {
        const res = await axios.get(
          `https://inventory-management-5-9dr8.onrender.com/orders/customer-orders/${customerId}`
        );
        setCustomerOrders((prev) => ({ ...prev, [customerId]: res.data }));
      } catch {
        setCustomerOrders((prev) => ({ ...prev, [customerId]: [] }));
      } finally {
        setOrdersLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: "24px", position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Customers</h2>
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontWeight: 500,
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "10px",
          }}
          onClick={handleOpen}
        >
          Enter Customer details
        </button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <thead>
          <tr style={{ background: "#e0f7ff" }}>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>S.no</th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>
              Caterer Name
            </th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>
              Address
            </th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}>
              Contact Number
            </th>
            <th style={{ padding: "10px", border: "1px solid #eee" }}></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, idx) => (
            <React.Fragment key={customer.id}>
              <tr style={{ background: idx % 2 === 0 ? "#f6fef7" : "#fff" }}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #eee",
                    textAlign: "center",
                  }}
                >
                  {idx + 1}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {customer.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {customer.caterer}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {customer.address}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {customer.contact}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <button
                    style={{
                      background: "#ffe0ec",
                      color: "#333",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                    onClick={() => handleExpand(customer.id)}
                  >
                    {expandedCustomerId === customer.id
                      ? "Hide Orders"
                      : "Show Orders"}
                  </button>
                </td>
              </tr>
              {expandedCustomerId === customer.id && (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    {ordersLoading ? (
                      <div style={{ padding: 16, color: "#999" }}>
                        Loading orders...
                      </div>
                    ) : (
                      <OrdersTable orders={customerOrders[customer.id] || []} />
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Simple modal dialog */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "32px 28px 20px 28px",
              minWidth: 320,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 18 }}>
              Enter Customer Details
            </h3>
            <label style={{ marginBottom: 6 }}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #bbb",
              }}
            />
            <label style={{ marginBottom: 6 }}>caterer Name</label>
            <input
              name="caterer"
              value={form.caterer}
              onChange={handleChange}
              required
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #bbb",
              }}
            />
            <label style={{ marginBottom: 6 }}>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #bbb",
              }}
            />
            <label style={{ marginBottom: 6 }}>Contact Number</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              style={{
                marginBottom: 18,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #bbb",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: "7px 18px",
                  borderRadius: 4,
                  border: "none",
                  background: "#eee",
                  color: "#333",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "7px 18px",
                  borderRadius: 4,
                  border: "none",
                  background: "#1976d2",
                  color: "#fff",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Customers;
