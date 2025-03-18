import React from "react";

const Input = ({ type, accept, onChange, className = "" }) => (
  <input
    type={type}
    accept={accept}
    onChange={onChange}
    className={`border border-gray-300 rounded-md px-2 py-1 ${className}`}
  />
);

export default Input;