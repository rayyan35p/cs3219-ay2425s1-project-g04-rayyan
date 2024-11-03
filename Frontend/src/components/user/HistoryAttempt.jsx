// HistoryAttempt.js
import React from 'react';

const HistoryAttempt = ({ attempt }) => {
  const { matchedUsername, questionTitle, startTime, duration, code } = attempt;

  return (
    <tr>
      <td>{matchedUsername}</td>
      <td>{questionTitle}</td>
      <td>{new Date(startTime).toLocaleString()}</td>
      <td>{duration} minutes</td>
      {/* <td>
        {/* <button onClick={() => downloadCode(codeFile)} className="btn btn-sm btn-primary">
          Download Code
        </button> }
        </td>*/}
      <td>{code} dummy file content</td>
      
    </tr>
  );
};

const downloadCode = (file) => {
  // Logic for downloading the binary code file
  const blob = new Blob([file], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'code_attempt.bin';
  link.click();
};

export default HistoryAttempt;
