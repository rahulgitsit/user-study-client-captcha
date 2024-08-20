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
          You will be given a persona (who you are) and a scenario (what you are
          doing)
        </li>
        <li className="instruction-item">
          You will be asked to respond to the last message in the conversation
        </li>
        <li className="instruction-item">
          You will be required to finish some word/character processing tasks or
          basic math tasks in each round just like a CAPTCHA test.
        </li>
      </ol>
      <button onClick={onStartChat}>Start Chat</button>
    </div>
  );
}

export default InstructionPage;
