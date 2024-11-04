// HistoryAttempt.js
import React from 'react';

const HistoryAttempt = ({ attempt }) => {
  const { matchedUsername, questionTitle, startTime, duration, code } = attempt;

  // Function to format duration based on requirements
  const formatDuration = (seconds) => {
    if (seconds >= 3600) {
      // Format as H:MM:SS
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else if (seconds >= 60) {
      // Format as MM:SS
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else {
      // Format as 00:SS
      return `00:${String(seconds).padStart(2, '0')}`;
    }
  };

  return (
    <tr>
      <td>{matchedUsername}</td>
      <td>{questionTitle}</td>
      <td>{new Date(startTime).toLocaleString()}</td>
      <td>{formatDuration(duration)}</td>
      {/* Uncomment the below section if you want to enable code download */}
      {/* <td>
        <button onClick={() => downloadCode(code)} className="btn btn-sm btn-primary">
          Download Code
        </button>
      </td> */}
      <td>{code} dummy file content</td>
    </tr>
  );
};

// Function to download the binary code file
const downloadCode = (file) => {
  const blob = new Blob([file], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'code_attempt.bin';
  link.click();
};

export default HistoryAttempt;
