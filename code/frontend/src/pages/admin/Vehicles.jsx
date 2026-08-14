import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    type: "",
    number: "",
    seats: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset the form to its default state
  const resetForm = () => {
    setForm({
      type: "",
      number: "",
      seats: "",
    });
    setEditingId(null);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Load all vehicles
  const loadVehicles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      alert("Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  // Load vehicles when the component is mounted
  useEffect(() => {
    loadVehicles();
  }, []);

  // Add or update a vehicle
  const handleSubmit = async () => {
    if (!form.type || !form.number || !form.seats) {
      alert("Fill all fields!");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, form);
      } else {
        await api.post("/vehicles", form);
      }

      resetForm();
      await loadVehicles();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      alert("Unable to save vehicle.");
    }
  };

  // Select a vehicle for editing
  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);

    setForm({
      type: vehicle.type,
      number: vehicle.number,
      seats: vehicle.seats,
    });
  };

  // Delete a vehicle
  const handleDelete = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      await loadVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Unable to delete vehicle.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vehicle Management</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          name="type"
          placeholder="Type (Bus/Van/Car)"
          value={form.type}
          onChange={handleChange}
        />

        <input
          name="number"
          placeholder="Number"
          value={form.number}
          onChange={handleChange}
        />

        <input
          name="seats"
          placeholder="Seats"
          type="number"
          value={form.seats}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update Vehicle" : "Add Vehicle"}
        </button>

        {editingId && (
          <button onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <h3>Vehicle List</h3>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle._id}>
              {vehicle.type} — {vehicle.number} — {vehicle.seats} seats

              <button onClick={() => handleEdit(vehicle)}>
                Edit
              </button>

              <button onClick={() => handleDelete(vehicle._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
