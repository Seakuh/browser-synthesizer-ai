import React from "react";
import "./App.css";
import HandDetection from "./components/HandDetection";

const App: React.FC = () => {
  return (
    <div className="appContainer">
      <HandDetection />
    </div>
  );
};

export default App;
