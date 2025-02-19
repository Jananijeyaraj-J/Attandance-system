import React, { useState } from "react";
import "./Dashboard.css";
import Admin from "./Admin";
import StudentManagement from "./StudentManagement";
import AttendanceManagement from "./AttendanceManagement";
import AttendanceLocation from "./AttendanceLocation";
import Announcement from "./Announcement";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Admin");

  const renderPage = () => {
    switch (activePage) {
      case "Admin":
        return <Admin />;
      case "StudentManagement":
        return <StudentManagement />;
      case "AttendanceManagement":
        return <AttendanceManagement />;
      case "AttendanceLocation":
        return <AttendanceLocation />;
      case "Announcement":
        return <Announcement />;
      default:
        return <Admin />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar" style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "20px" }}>
          <img
            src="public\csi.jpg"
            alt="Logo"
            style={{
              width: "80px",        // Set the desired size of the logo
              height: "80px",       // Set the height equal to the width for a circular shape
              borderRadius: "50%",  // Make the image circular
              objectFit: "cover",   // Ensure the image covers the circle area neatly
            }}
          />
        </div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li
            onClick={() => setActivePage("Admin")}
            style={{
              padding: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Admin
          </li>
          <li
            onClick={() => setActivePage("StudentManagement")}
            style={{
              padding: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Student Management
          </li>
          <li
            onClick={() => setActivePage("AttendanceManagement")}
            style={{
              padding: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Attendance Management
          </li>
          <li
            onClick={() => setActivePage("AttendanceLocation")}
            style={{
              padding: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Attendance Location
          </li>
          <li
            onClick={() => setActivePage("Announcement")}
            style={{
              padding: "10px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Announcement
          </li>
        </ul>
      </div>
      <div className="main-content">{renderPage()}</div>
    </div>
  );
};

export default Dashboard;
