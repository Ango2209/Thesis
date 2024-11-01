import React from "react";

const RoleSelector = ({ role, setRole }) => (
  <div>
    <label>
      <input
        type="radio"
        name="role"
        value="doctor"
        checked={role === "doctor"}
        onChange={() => setRole("doctor")}
      />
      Doctor
    </label>
    <label>
      <input
        type="radio"
        name="role"
        value="admin"
        checked={role === "admin"}
        onChange={() => setRole("admin")}
      />
      Admin
    </label>
  </div>
);

export default RoleSelector;
