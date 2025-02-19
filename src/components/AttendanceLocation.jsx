import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE_URL = "https://csice-attendance.saranmani.tech/api/v1/admin/attendance-location";

const AttendanceLocation = () => {
    const [locations, setLocations] = useState([]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editLocation, setEditLocation] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("API Response:", data);

            if (data.status === "success") {
                setLocations(data.data.locations || []);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const LocationSelector = () => {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
            },
        });
        return null;
    };

    const handleSubmit = async () => {
        if (!department || !year || !latitude || !longitude) {
            alert("Please fill all fields and select a location!");
            return;
        }

        const newLocation = {
            department,
            year,
            geoLocation: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            radius: "15",
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: editLocation ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newLocation),
            });

            const result = await response.json();
            console.log("Submit Response:", result);

            if (result.status === "success") {
                fetchLocations();
                setIsModalOpen(false);
                resetForm();
            } else {
                alert("Failed to save location");
            }
        } catch (error) {
            console.error("Error submitting location:", error);
        }
    };

    const resetForm = () => {
        setDepartment("");
        setYear("");
        setLatitude(null);
        setLongitude(null);
        setEditLocation(null);
    };

    return (
        <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ color: "#333", marginBottom: "20px" }}>Attendance Location</h2>

            <button
                style={{
                    background: "#6a11cb",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontWeight: "bold",
                }}
                onClick={() => {
                    setIsModalOpen(true);
                    setEditLocation(null);
                }}
            >
                Add Location
            </button>

            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "1000",
                    }}
                >
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", width: "500px", position: "relative" }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "10px", right: "10px", border: "none", background: "transparent", cursor: "pointer" }}>✖</button>

                        <h3>{editLocation ? "Edit Location" : "Select Location"}</h3>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: "100%", marginBottom: "10px", padding: "10px" }}>
                            <option value="">Select Department</option>
                            <option value="IT">IT</option>
                        </select>
                        <select value={year} onChange={(e) => setYear(e.target.value)} style={{ width: "100%", marginBottom: "10px", padding: "10px" }}>
                            <option value="">Select Year</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>

                        <MapContainer center={[latitude || 12.9716, longitude || 77.5946]} zoom={13} style={{ height: "300px", width: "100%", marginTop: "10px" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationSelector />
                            {latitude && longitude && (
                                <Marker position={[latitude, longitude]}>
                                    <Popup>
                                        Latitude: {latitude} <br />
                                        Longitude: {longitude}
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                        <button
                            onClick={handleSubmit}
                            style={{
                                background: "#2575fc",
                                color: "white",
                                border: "none",
                                padding: "10px 15px",
                                cursor: "pointer",
                                borderRadius: "5px",
                                marginTop: "10px",
                                fontWeight: "bold",
                            }}
                        >
                            {editLocation ? "Update" : "Submit"}
                        </button>
                    </div>
                </div>
            )}

            <h3 style={{ marginTop: "20px" }}>Saved Locations</h3>
            <table style={{ width: "80%", margin: "20px auto", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#6a11cb", color: "white" }}>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.length > 0 ? (
                        locations.map((location, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                                <td>{location.department}</td>
                                <td>{location.year}</td>
                                <td>{location.geoLocation?.coordinates[1]}</td>
                                <td>{location.geoLocation?.coordinates[0]}</td>
                                <td>
                                    <button onClick={() => setIsModalOpen(true)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5">No locations found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceLocation;
