import React, { useEffect, useState } from "react";
import "./Summary.css";
import { motion } from "framer-motion";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Summary({ selectedDate, refreshKey }) {
  const [summary, setSummary] = useState({
    total: 0,
    order_received: 0,
    yet_to_be_packed: 0,
    dispatched: 0,
  });
  const [flavorDialogOpen, setFlavorDialogOpen] = useState(false);
  const [selectedFlavorDetails, setSelectedFlavorDetails] = useState([]);

  useEffect(() => {
    // Use today if selectedDate is not provided
    const dateToUse = selectedDate || new Date();
    const fetchSummary = async () => {
      try {
        const res = await axios.post(
          "https://inventory-management-5-9dr8.onrender.com/orders/summary",
          {
            date: dateToUse.toISOString().slice(0, 10),
          }
        );
        setSummary(res.data);
      } catch (err) {
        setSummary({
          total: 0,
          order_received: 0,
          yet_to_be_packed: 0,
          dispatched: 0,
        });
      }
    };
    fetchSummary();
    // Listen for status update events
    const handleStatusUpdate = () => {
      fetchSummary();
    };
    window.addEventListener("order-status-updated", handleStatusUpdate);
    return () => {
      window.removeEventListener("order-status-updated", handleStatusUpdate);
    };
  }, [selectedDate, refreshKey]);

  // Fetch detailed flavor summary on dialog open
  const handleOpenFlavorDialog = async () => {
    try {
      const res = await axios.post(
        "https://inventory-management-5-9dr8.onrender.com/orders/flavour-summary-details",
        {
          date: (selectedDate || new Date()).toISOString().slice(0, 10),
        }
      );
      // Defensive: always set to array
      setSelectedFlavorDetails(
        Array.isArray(res.data.summary) ? res.data.summary : []
      );
      setFlavorDialogOpen(true);
    } catch {
      setSelectedFlavorDetails([]);
      setFlavorDialogOpen(true);
    }
  };
  const handleCloseFlavorDialog = () => setFlavorDialogOpen(false);

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      {/* Order Summary Card */}
      <motion.div
        className="CompactCard"
        style={{
          background: "linear-gradient(120deg, #ffe0ec 0%, #fff7c2 100%)",
          boxShadow: "0px 10px 20px 0px rgba(255, 224, 236, 0.4)",
          opacity: 1,
          color: "#333333",
          flex: 1,
          minWidth: 320,
          marginBottom: "1rem",
        }}
      >
        <div className="summaryContent">
          <div
            className="summaryTitle"
            style={{
              fontWeight: 600,
              marginBottom: 16,
              fontSize: 18,
            }}
          >
            Order Summary
          </div>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <strong>Total Orders:</strong> {summary.total}
            </div>
            <div>
              <strong>Order Received:</strong> {summary.order_received}
            </div>
            <div>
              <strong>Yet to be packed:</strong> {summary.yet_to_be_packed}
            </div>
            <div>
              <strong>Dispatched:</strong> {summary.dispatched}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Flavour Summary Card as dialog trigger */}
      <motion.div
        className="CompactCard"
        style={{
          background: "linear-gradient(120deg, #fff7c2 0%, #ffe0ec 100%)",
          boxShadow: "0px 10px 20px 0px rgba(255, 224, 236, 0.4)",
          opacity: 1,
          color: "#333333",
          flex: 1,
          minWidth: 320,
          marginBottom: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleOpenFlavorDialog}
      >
        <div className="summaryContent">
          <div
            className="summaryTitle"
            style={{ fontWeight: 600, fontSize: 18 }}
          >
            Flavour Summary
          </div>
        </div>
      </motion.div>
      {/* Flavour Summary Dialog */}
      <Dialog
        open={flavorDialogOpen}
        onClose={handleCloseFlavorDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Flavour Summary Details
          <IconButton
            aria-label="close"
            onClick={handleCloseFlavorDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {Array.isArray(selectedFlavorDetails) &&
          selectedFlavorDetails.length === 0 ? (
            <div style={{ color: "#999", padding: 24 }}>
              No flavour data for this date.
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Flavour</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Size (ml)</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Quantity</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(selectedFlavorDetails) &&
                    selectedFlavorDetails.map((row, idx) => (
                      <TableRow key={row.flavor + row.size + idx}>
                        <TableCell>{row.flavor}</TableCell>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Summary;
