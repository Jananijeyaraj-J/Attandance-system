import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: "", lastName: "", email: "", username: ""});
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("https://csice-attendance.saranmani.tech/api/v1/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data.data.admins || []);
    } catch (error) {
      console.error("Error fetching admins", error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const response = await axios.post("https://csice-attendance.saranmani.tech/api/v1/admin", newAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins([...admins, response.data.data]);
      setIsModalOpen(false);
      setNewAdmin({ firstName: "", lastName: "", email: "", username: "", password: "" });
    } catch (error) {
      console.error("Error adding admin", error);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "auto", backgroundColor: "#f3f4f6", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "16px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Admin Dashboard</h2>
        <button
          style={{ background: "linear-gradient(to right, #c31432, #240b36)", color: "white", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Admin
        </button>
      </div>

      <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", marginTop: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Existing Admins</h3>
        <ul style={{ listStyleType: "none", padding: "0", fontSize: "16px", color: "#555" }}>
          {admins.length > 0 ? (
            admins.map((admin, index) => (
              <li key={index} style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>{admin.username}</li>
            ))
          ) : (
            <p style={{ color: "#888" }}>No admins found.</p>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", width: "350px", position: "relative" }}>
            <button
              style={{ position: "absolute", top: "8px", right: "12px", fontSize: "18px", color: "#555", border: "none", background: "none", cursor: "pointer" }}
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Add New Admin</h3>
            <input
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "12px" }}
              placeholder="First Name"
              value={newAdmin.firstName}
              onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
            />
            <input
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "12px" }}
              placeholder="Last Name"
              value={newAdmin.lastName}
              onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
            />
            <input
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "12px" }}
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
            <input
              style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "12px" }}
              placeholder="Username"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                style={{ padding: "10px 16px", background: "linear-gradient(to right, #c31432, #240b36)", color: "white", borderRadius: "6px", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" }}
                onClick={handleAddAdmin}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
