import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tasks from "./screens/Tasks";
import Habits from "./screens/Habits";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App dark-theme">
        <Routes>
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
