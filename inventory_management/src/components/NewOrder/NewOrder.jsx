import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import "./NewOrder.css";

const flavors = [
  { name: "Vanilla", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Strawberry", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Chocolate", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Mango", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Pineapple", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Fruit Mix", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Butter Scotch", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Pista", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Tutty Fruity", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  {
    name: "Fig & Honey",
    quantities: ["50ml", "100ml", "1000ml", "4000ml"],
  },
  { name: "Kesar Malai", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Coffee", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  {
    name: "Spanish Delight",
    quantities: ["50ml", "100ml", "1000ml", "4000ml"],
  },
  { name: "Black Currant", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Natural Sapota", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Natural Banana", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  {
    name: "Natural Fruit Ice Creams",
    quantities: ["50ml", "100ml", "1000ml", "4000ml"],
  },
  { name: "Orange", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
  { name: "Casatta Ball", quantities: ["50ml", "100ml", "1000ml", "4000ml"] },
];

const specialFlavors = [
  { name: "Casatta Slice" },
  { name: "Pot Kulfi" },
  { name: "Abu Cutta Kulfi" },
  { name: "Orange Fruit" },
];
// const specialQuantities = ["50ml", "100ml", "1000ml", "4000ml"];

function NewOrder({ open, onClose, orderData, onOrderSubmitted }) {
  const [Open, setOpen] = useState(open ?? false);
  const [form, setForm] = useState({
    name: "",
    caterer: "",
    deliveryDetails: "",
    contact: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryLocation: "",
    status: "",
  });
  const [flavorTable, setFlavorTable] = useState(() => {
    const table = {};
    flavors.forEach((f) => {
      table[f.name] = {};
      f.quantities.forEach((q) => {
        table[f.name][q] = { qty: "" };
      });
    });
    return table;
  });
  const [catererOptions, setCatererOptions] = useState([]);
  const [customerMap, setCustomerMap] = useState({});

  // Fill form and flavorTable if orderData is provided
  React.useEffect(() => {
    if (orderData) {
      setForm({
        name: orderData.name || "",
        caterer: orderData.caterer || "",
        deliveryDetails: orderData.deliveryDetails || "",
        contact: orderData.contact || "",
        deliveryDate: orderData.deliveryDate || orderData.delivery_date || "",
        deliveryTime: orderData.deliveryTime || orderData.delivery_time || "",
        deliveryLocation:
          orderData.deliveryLocation || orderData.delivery_location || "",
        status: orderData.status || "",
      });
      // Fill flavorTable
      const newTable = {};
      if (orderData.flavors) {
        orderData.flavors.forEach((f) => {
          newTable[f.flavor] = {};
          f.quantities.forEach((q) => {
            newTable[f.flavor][q.size] = { qty: q.qty };
          });
        });
        setFlavorTable(newTable);
      }
      setOpen(true);
    }
  }, [orderData]);

  const handleOpenClose = () => {
    setOpen((prev) => !prev);
  };

  const handleOpenNewOrder = () => {
    setForm({
      name: "",
      caterer: "",
      deliveryDetails: "",
      contact: "",
      deliveryDate: "",
      deliveryTime: "",
      deliveryLocation: "",
      status: "",
    });
    const table = {};
    flavors.forEach((f) => {
      table[f.name] = {};
      f.quantities.forEach((q) => {
        table[f.name][q] = { qty: "" };
      });
    });
    specialFlavors.forEach((f) => {
      table[f.name] = {};
    });
    setFlavorTable(table);
    setOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTableChange = (flavor, quantity, field, value) => {
    setFlavorTable((prev) => ({
      ...prev,
      [flavor]: {
        ...prev[flavor],
        [quantity]: {
          ...prev[flavor][quantity],
          [field]: value,
        },
      },
    }));
  };

  const handleCatererFocus = async () => {
    try {
      const res = await axios.get("https://inventory-management-5-9dr8.onrender.com/orders/caterers");
      // API returns { customers: [ ... ] }
      const customers = Array.isArray(res.data.customers) ? res.data.customers : [];
      setCatererOptions(customers.map((c) => c.caterer).filter(Boolean));
      // Map caterer name to customer details for autofill
      const map = {};
      customers.forEach((c) => {
        map[c.caterer] = c;
      });
      setCustomerMap(map);
    } catch {
      setCatererOptions([]);
      setCustomerMap({});
    }
  };

  const handleCatererSelect = (e) => {
    const caterer = e.target.value;
    setForm((prev) => ({ ...prev, caterer }));
    if (customerMap[caterer]) {
      setForm((prev) => ({
        ...prev,
        name: customerMap[caterer].name || "",
        contact: customerMap[caterer].contact || "",
        deliveryLocation: customerMap[caterer].address || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare data
    const order = {
      ...form,
      flavors: [
        ...Object.entries(flavorTable)
          .filter(
            ([flavor]) => !specialFlavors.map((f) => f.name).includes(flavor)
          )
          .map(([flavor, quantities]) => ({
            flavor,
            quantities: Object.entries(quantities).map(([size, vals]) => ({
              size,
              qty: vals.qty,
            })),
          })),
        // Add special flavors if quantity is entered (no size required)
        ...specialFlavors
          .map((f) => ({ name: f.name, data: flavorTable[f.name] }))
          .filter((f) => f.data && f.data.qty && f.data.qty !== "")
          .map((f) => ({
            flavor: f.name,
            quantities: [
              {
                size: "", // No size for special flavors
                qty: f.data.qty,
              },
            ],
          })),
      ],
    };
    try {
      if (orderData && orderData.id) {
        await axios.patch(
          `https://inventory-management-5-9dr8.onrender.com/orders/${orderData.id}`,
          order
        );
        alert("Order updated!");
      } else {
        await axios.post("https://inventory-management-5-9dr8.onrender.com/orders", order);
        alert("Order submitted!");
      }
      setOpen(false);
      if (onOrderSubmitted) onOrderSubmitted();
    } catch {
      alert("Failed to submit order");
    }
  };

  return (
    <div className="new-order">
      <React.Fragment>
        <Button variant="outlined" onClick={handleOpenNewOrder}>
          New Order
        </Button>
        <Dialog open={Open} maxWidth="lg" fullWidth onClose={onClose}>
          <DialogTitle>Fill the Order Details</DialogTitle>
          <DialogContent>
            <div className="form-dialog">
              <form className="dialog-box">
                <label>Name</label>
                <input
                  className="input-form"
                  name="name"
                  placeholder="Your name.."
                  value={form.name}
                  onChange={handleFormChange}
                />

                <label>Caterer Name</label>
                <input
                  className="input-form"
                  name="caterer"
                  placeholder="Your Caterer name.."
                  value={form.caterer}
                  onChange={handleCatererSelect}
                  onFocus={handleCatererFocus}
                  list="caterer-list"
                  autoComplete="off"
                />
                <datalist id="caterer-list">
                  {catererOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>

                <label>Delivery Details</label>
                <input
                  className="input-form"
                  name="deliveryDetails"
                  placeholder="Delivery Venue.."
                  value={form.deliveryDetails}
                  onChange={handleFormChange}
                />
              </form>

              <form className="dialog-box">
                <label>Contact Number</label>
                <input
                  className="input-form"
                  name="contact"
                  placeholder="Contact Number.."
                  value={form.contact}
                  onChange={handleFormChange}
                />
                <div className="inline-fields">
                  <div className="field">
                    <label>Delivery Date</label>
                    <input
                      className="input-form"
                      type="date"
                      name="deliveryDate"
                      value={form.deliveryDate}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="field">
                    <label>Delivery Time</label>
                    <input
                      className="input-form"
                      type="time"
                      name="deliveryTime"
                      value={form.deliveryTime}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <label>Delivery Location</label>
                <input
                  className="input-form"
                  name="deliveryLocation"
                  placeholder="Delivery Location.."
                  value={form.deliveryLocation}
                  onChange={handleFormChange}
                />
              </form>
            </div>
            <div className="table-dialog">
              <div className="heading-subhead">Flavours</div>
              <form onSubmit={handleSubmit}>
                <table className="flavor-table">
                  <thead>
                    <tr>
                      <th>Flavour</th>
                      <th>50ml</th>
                      <th>100ml</th>
                      <th>1000ml</th>
                      <th>4000ml</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flavors.map((flavor) => (
                      <tr key={flavor.name}>
                        <td>{flavor.name}</td>
                        {flavor.quantities.map((quantity, idx) => (
                          <td key={idx}>
                            <input
                              type="number"
                              min="0"
                              name={`${flavor.name}-${quantity}-qty`}
                              placeholder="Qty"
                              style={{ width: "60px" }}
                              value={
                                flavorTable[flavor.name] &&
                                flavorTable[flavor.name][quantity]
                                  ? flavorTable[flavor.name][quantity].qty
                                  : ""
                              }
                              onChange={(e) =>
                                handleTableChange(
                                  flavor.name,
                                  quantity,
                                  "qty",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Special flavors with dropdown for quantity */}
                    {specialFlavors.map((flavor) => (
                      <tr key={flavor.name}>
                        <td>{flavor.name}</td>
                        <td colSpan={4}>
                          <input
                            type="number"
                            min="0"
                            name={`${flavor.name}-qty`}
                            placeholder="Qty"
                            style={{ width: "60px" }}
                            value={
                              flavorTable[flavor.name] &&
                              flavorTable[flavor.name].qty
                                ? flavorTable[flavor.name].qty
                                : ""
                            }
                            onChange={(e) =>
                              setFlavorTable((prev) => ({
                                ...prev,
                                [flavor.name]: {
                                  ...prev[flavor.name],
                                  qty: e.target.value,
                                },
                              }))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <DialogActions>
                  <Button onClick={onClose || handleOpenClose}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                  <Button
                    type="button"
                    onClick={() => window.print()}
                    color="primary"
                    variant="outlined"
                  >
                    Print
                  </Button>
                </DialogActions>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
}

export default NewOrder;
