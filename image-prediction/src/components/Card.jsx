import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-lg rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

export default Card;