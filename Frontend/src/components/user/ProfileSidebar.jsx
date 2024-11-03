// ProfileSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import historyService from '../../services/history';

const ProfileSidebar = ({ userID }) => {

  const handleAddHistory = async () => {
    try {
      // const codeInput = new TextEncoder().encode("Sample code input");

      // Prepare the new history entry
      const newHistory = {
        user: userID,
        matchedUser: userID, // As per your request, both user and matchedUser are the user's own ID
        question: "66f63f8758ef3f359e17c18a", // Given question ID
        datetime: new Date(), // Current date and time
        duration: 3000, // Duration in seconds
        code: 1 // Arbitrary code input as a string converted to Buffer
      };

      // Call the service to create a new history entry
      const response = await historyService.createHistory(newHistory);

      // Check if the history entry was created successfully
      if (response.status === 201) {
        console.log("History entry added successfully:", response.data);
      } else {
        console.log("Error creating history entry:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating history entry:", error);
    }
  };


  return (
    <div
      className="profile-sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        top: '30%', // Start 30% down from the top
      }}
    >
      <Link to={`/profile/${userID}`}>
        <button className="btn btn-primary mb-3">Edit Profile</button>
      </Link>
      <Link to={`/history/${userID}`}>
        <button className="btn btn-secondary">Attempt History</button>
      </Link>
      <button onClick={handleAddHistory} className="btn btn-success">
        Add History Entry
      </button>
    </div>
  );
};

export default ProfileSidebar;
