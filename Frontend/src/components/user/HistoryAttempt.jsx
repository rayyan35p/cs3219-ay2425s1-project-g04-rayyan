// HistoryAttempt.js
import React from 'react';

const HistoryAttempt = ({ attempt }) => {
  const { matchedUser, question, startTime, duration, codeFile } = attempt;

  return (
    <div className="history-attempt">
      <h3>Attempt with {matchedUser}</h3>
      <p>Question: {question.title}</p>
      <p>Start Time: {new Date(startTime).toLocaleString()}</p>
      <p>Duration: {duration} minutes</p>
      <button onClick={() => downloadCode(codeFile)}>Download Code</button>
    </div>
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
