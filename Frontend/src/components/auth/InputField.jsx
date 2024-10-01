import React from 'react';
import '../../css/InputField.css'; // Import the CSS file for styling

const InputField = ({ label, type = "text", placeholder, value, onChange }) => {
  return (
    <div className="input-container">
      <div className="input-title">{label}</div>
      <input 
        className="input-element" 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} // Call the onChange function passed from SignUp
      />
    </div>
  );
};

export default InputField;
