import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const API_URL = "https://csice-attendance.saranmani.tech/api/v1/admin/announcement";

const getAuthToken = () => localStorage.getItem("token");

const PageContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f4f4f9;
  min-height: 100vh;
  position: relative;
`;

const AddButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const AnnouncementList = styled.div`
  margin-top: 60px;
`;

const AnnouncementItem = styled.div`
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContainer = styled.div`
  background: white;
  padding: 25px;
  width: 450px;
  border-radius: 10px;
  position: relative;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
`;

const PopupTitle = styled.h2`
  margin: 0 0 15px 0;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: 2px solid black;
  background: white;
  color: black;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.status === "success" && response.data.data) {
          setAnnouncements(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
        }
      })
      .catch(error => console.error("Error fetching announcements:", error));
  }, []);

  const handleSubmit = () => {
    if (announcementTitle.trim() && announcementContent.trim()) {
      const newAnnouncement = { title: announcementTitle, content: announcementContent };
      const token = getAuthToken();
      
      axios.post(API_URL, newAnnouncement, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.status === "success") {
            setAnnouncements(prevAnnouncements => [...prevAnnouncements, response.data.data]);
            setAnnouncementTitle("");
            setAnnouncementContent("");
            setShowPopup(false);
          }
        })
        .catch(error => console.error("Error adding announcement:", error));
    }
  };

  return (
    <PageContainer>
      <h1>Announcements</h1>
      <AddButton onClick={() => setShowPopup(true)}>Add</AddButton>

      {showPopup && (
        <PopupOverlay>
          <PopupContainer>
            <PopupTitle>New Announcement</PopupTitle>
            <CloseButton onClick={() => setShowPopup(false)}>X</CloseButton>
            <Input
              type="text"
              placeholder="Enter title..."
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
            />
            <TextArea
              placeholder="Enter announcement content..."
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
            />
            <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
          </PopupContainer>
        </PopupOverlay>
      )}

      <AnnouncementList>
        {announcements.map((announcement, index) => (
          <AnnouncementItem key={index}>
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
          </AnnouncementItem>
        ))}
      </AnnouncementList>
    </PageContainer>
  );
};

export default Announcements;
