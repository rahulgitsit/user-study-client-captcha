// src/App.js
import React, { useState } from "react";
import LoadingPage from "./components/LoadingPage";
import InstructionPage from "./components/InstructionPage";
import ChatInterface from "./components/ChatInterface";
import SurveyPage from "./components/SurveyPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("loading");
  const [userId, setUserId] = useState("");

  const handleUserSubmit = (id) => {
    setUserId(id);
    setCurrentPage("instruction");
  };

  const handleStartChat = () => {
    setCurrentPage("chat");
  };

  const handleSurveyPage = () => {
    setCurrentPage("survey");
  };

  return (
    <div className="App">
      {currentPage === "loading" && (
        <LoadingPage onUserSubmit={handleUserSubmit} />
      )}
      {currentPage === "instruction" && (
        <InstructionPage onStartChat={handleStartChat} />
      )}
      {currentPage === "chat" && (
        <ChatInterface userId={userId} onSurveyPage={handleSurveyPage} />
      )}
      {currentPage === "survey" && <SurveyPage userId={userId} />}
    </div>
  );
}

export default App;
