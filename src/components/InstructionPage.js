// components/InstructionPage.js

import React from "react";

import "./InstructionPage.css";

function InstructionPage({ onStartChat }) {
  return (
    <div className="instruction-page">
      <h1>Instructions</h1>
      In the following pages you will be shown a set of text message
      conversations.
      <ol>
        <li className="instruction-item">
          You will be presented with different types of questions, including
          word/character processing tasks and basic math problems, similar to a
          CAPTCHA test.
        </li>
        <li className="instruction-item">
          Try your best to answer all the questions correctly. At the end, you
          will be asked to complete a quick survey about this exercise.
        </li>
      </ol>
      <button onClick={onStartChat}>Start Chat</button>
    </div>
  );
}

export default InstructionPage;
