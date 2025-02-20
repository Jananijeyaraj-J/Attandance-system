import React, { useState, useEffect } from "react";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    examNo: "",
    rollNo: "",
    department: "IT", // Default value
    year: 4 // Default value
  });
  const [editing, setEditing] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("https://csice-attendance.saranmani.tech/api/v1/admin/student", getAuthHeader());
      if (response.data.status === "success") {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await axios.post("https://csice-attendance.saranmani.tech/api/v1/admin/student", newStudent, getAuthHeader());
      if (response.data.status === "success") {
        fetchStudents();
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error adding student", error);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent({
      name: student.name,
      email: student.email,
      examNo: student.examNo,
      rollNo: student.rollNo,
      department: student.department,
      year: student.year,
    });
    setEditing(student._id);
    setShowPopup(true);
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await axios.put(`https://csice-attendance.saranmani.tech/api/v1/admin/student/${editing}`, newStudent, getAuthHeader());
      if (response.data.status === "success") {
        fetchStudents();
        setEditing(null);
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error updating student", error);
    }
  };

  const buttonStyle = {
    padding: "10px",
    borderRadius: "5px",
    background: "linear-gradient(to right, #5f77ff, #a14cd9)", // Matching Edit button color
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "5px"
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Students</h2>
      <button
        onClick={() => {
          setNewStudent({ name: "", email: "", examNo: "", rollNo: "", department: "IT", year: 4 });
          setShowPopup(true);
        }}
        style={buttonStyle}
      >
        Add Student
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Exam No</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.examNo}</td>
              <td>{student.rollNo}</td>
              <td>{student.department}</td>
              <td>{student.year}</td>
              <td>
                <button onClick={() => handleEditStudent(student)} style={buttonStyle}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", width: "400px", textAlign: "center" }}>
            <h3>{editing ? "Edit Student" : "Add Student"}</h3>
            <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Exam No" value={newStudent.examNo} onChange={(e) => setNewStudent({ ...newStudent, examNo: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Roll No" value={newStudent.rollNo} onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            
            {/* Department Dropdown */}
            <select value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
            </select>

            {/* Year Dropdown */}
            <select value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: parseInt(e.target.value) })} style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
              <option value={2}>2nd</option>
              <option value={3}>3rd</option>
              <option value={4}>4th</option>
            </select>

            <button onClick={editing ? handleUpdateStudent : handleAddStudent} style={buttonStyle}>{editing ? "Update" : "Add"}</button>
            <button onClick={() => setShowPopup(false)} style={buttonStyle}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
