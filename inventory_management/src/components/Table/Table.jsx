import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import "./Table.css";
import NewOrder from "../NewOrder/NewOrder";

const STATUS_OPTIONS = ["Dispatched", "Yet to be packed", "order received"];

const makeStyle = (status) => {
  if (status === "Dispatched") {
    return {
      background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
      color: "white",
    };
  } else if (status === "Yet to be packed") {
    return {
      background: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
      color: "white",
    };
  } else if (status === "order received") {
    return {
      background: "linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%)", // pink gradient
      color: "white",
    };
  } else {
    return {
      background: "#f0f0f0",
      color: "black",
    };
  }
};

export default function BasicTable({ selectedDate, refreshKey }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [orders, setOrders] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      let res;
      const dateToUse = selectedDate || new Date();
      res = await axios.post("https://inventory-management-5-9dr8.onrender.com/orders/by-date", {
        date: dateToUse.toISOString().slice(0, 10),
      });
      setOrders(res.data);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, refreshKey]);

  // Update status in backend
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`https://inventory-management-5-9dr8.onrender.com/orders/${id}/status`, {
        status: newStatus,
      });
      fetchOrders(); // refresh table
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new Event("order-status-updated"));
      }
    } catch {
      // handle error
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`https://inventory-management-5-9dr8.onrender.com/orders/${id}`);
      setDeleteDialogOpen(false);
      fetchOrders(); // refresh table
    } catch {
      // handle error
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  // Handler to open dialog and fetch order details
  const handleRowClick = async (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
    try {
      const res = await axios.post("https://inventory-management-5-9dr8.onrender.com/orders/details", {
        order_id: order.id,
      });
      setOrderDetails(res.data);
    } catch {
      setOrderDetails(null);
    }
  };

  // Handler to close dialog
  const handleOrderDialogClose = () => {
    setOrderDialogOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  // Handler to open delete confirmation dialog
  const handleDeleteClick = (orderId) => {
    setDeleteOrderId(orderId);
    setDeleteDialogOpen(true);
  };

  // Handler to close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteOrderId(null);
  };

  return (
    <div className="Table">
      <h3>Recent Orders</h3>
      <span
        style={{
          fontWeight: 500,
          fontSize: 16,
          marginBottom: 8,
          display: "inline-block",
        }}
      >
        Date:{" "}
        {selectedDate
          ? selectedDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
      </span>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell align="left">Caterer Name</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Delivery time</TableCell>
              <TableCell align="left">Location</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell align="left">{row.caterer}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">
                    {row.delivery_time || row.deliveryTime || "-"}
                  </TableCell>
                  <TableCell align="left">
                    {row.delivery_location || row.deliveryLocation}
                  </TableCell>
                  <TableCell align="left">
                    {editingStatusId === row.id ? (
                      <select
                        value={statusValue}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setStatusValue(newStatus);
                          await updateStatus(row.id, newStatus);
                          setEditingStatusId(null);
                        }}
                        autoFocus
                        style={{
                          ...makeStyle(statusValue),
                          border: "1px solid #ccc",
                          borderRadius: 4,
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className="status"
                        style={makeStyle(row.status)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStatusId(row.id);
                          setStatusValue(row.status);
                        }}
                        tabIndex={0}
                        role="button"
                        title="Click to edit status"
                      >
                        {row.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      className="edit-badge"
                      style={{
                        background: "#1976d2",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.85em",
                        cursor: "pointer",
                        display: "inline-block",
                        marginRight: 8,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(row);
                      }}
                    >
                      Edit
                    </span>
                    <span
                      className="delete-badge"
                      style={{
                        background: "#ff4d4f",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.85em",
                        cursor: "pointer",
                        display: "inline-block",
                        marginLeft: 8,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(row.id);
                      }}
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {orderDialogOpen && orderDetails && (
        <NewOrder
          open={orderDialogOpen}
          onClose={handleOrderDialogClose}
          orderData={orderDetails}
        />
      )}
      {/* Delete confirmation dialog */}
      {deleteDialogOpen && (
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this order?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => deleteOrder(deleteOrderId)}
              color="error"
              variant="contained"
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
