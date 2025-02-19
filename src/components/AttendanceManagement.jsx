import React, { useState, useEffect } from "react";
import "./AttendanceManagement.css";

const AttendanceManagement = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("IT");
  const [selectedYear, setSelectedYear] = useState("4");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Manually set your Bearer token
  const token =  localStorage.getItem("token");// Replace with the correct token

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!token) {
        console.error("Bearer token is missing!");
        return;
      }

      try {
        const response = await fetch(
          `https://csice-attendance.saranmani.tech/api/v1/admin/attendance?department=${selectedDepartment}&year=${selectedYear}&date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        if (result.status === "success") {
          setAttendanceData(result.data);
        } else {
          setAttendanceData([]);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceData([]);
      }
    };
    fetchAttendance();
  }, [token, selectedDepartment, selectedYear, selectedDate]);

  return (
    <div className="attendance-container">
      <h2>Attendance Management</h2>

      {/* Filters */}
      <div className="filters">
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="2">2nd year</option>
          <option value="3">3rd year</option>
          <option value="4">4th year</option>
        </select>

        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {/* Attendance Table */}
      <div className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Department</th>
              <th>Year</th>
              <th>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.rollNo}</td>
                  <td>{entry.department}</td>
                  <td>{entry.year}</td>
                  <td className={entry.present ? "present" : "absent"}>{entry.present ? "Present" : "Absent"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No records found for this date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManagement;
