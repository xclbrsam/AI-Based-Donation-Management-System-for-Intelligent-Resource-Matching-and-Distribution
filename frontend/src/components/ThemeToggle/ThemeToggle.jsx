import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={{
        display: "block",
        width: "50px",
        height: "40px",
        background: "red",
        color: "white",
        border: "2px solid white",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "20px",
        zIndex: 99999,
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;