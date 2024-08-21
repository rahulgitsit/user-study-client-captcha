import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ChatInterface.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ChatInterface({ userId, onSurveyPage }) {
  const [prompts, setPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [allPromptsComplete, setAllPromptsComplete] = useState(false);
  const [isTutorial, setIsTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialPosition, setTutorialPosition] = useState({
    top: 0,
    left: 0,
  });
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [completedPrompts, setCompletedPrompts] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState(null);

  const promptInfoRef = useRef(null);
  const inputAreaRef = useRef(null);
  const userInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPrompts = useCallback(async () => {
    console.log("fetchPrompts called");
    try {
      const response = await fetch(`${BACKEND_URL}/api/string-math-data`);
      const prompts = await response.json();
      setPrompts(prompts);
      console.log(prompts);
      console.log(prompts.length);
      setTotalPrompts(prompts.length);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const renderPrompt = (prompt) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const lines = prompt.split("\n"); // Split the prompt by newlines

    return lines.map((line, index) => {
      const parts = [];
      let lastIndex = 0;
      let match;

      // Iterate through all bold text matches in the current line
      while ((match = boldRegex.exec(line)) !== null) {
        const start = match.index;
        const end = start + match[0].length;

        // Add any non-bold text before the current match
        if (start > lastIndex) {
          parts.push(line.substring(lastIndex, start));
        }

        // Add the bold text as a <strong> element
        parts.push(<strong key={`bold-${index}-${start}`}>{match[1]}</strong>);

        lastIndex = end;
      }

      // Add any remaining non-bold text after the last match
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Wrap the line in a <p> tag to preserve newlines
      return <p key={index}>{parts}</p>;
    });
  };

  const startNewRound = useCallback(() => {
    if (!prompts.length) return;

    const currentPrompt = prompts[currentPromptIndex];

    setUserInput("");
    setIsComplete(false);

    if (currentPromptIndex === 0) {
      setIsTutorial(true);
      setTutorialStep(0);
    } else {
      setIsTutorial(false);
    }

    setTimeout(() => {
      if (userInputRef.current) {
        userInputRef.current.focus();
      }
    }, 0);
  }, [prompts, currentPromptIndex]);

  useEffect(() => {
    if (prompts.length) {
      startNewRound();
    }
  }, [prompts, startNewRound]);

  const handleSendMessage = async () => {
    if (userInput.trim() === "" || allPromptsComplete || isSaving) return;

    setIsSaving(true);

    const saveConversation = async (retryCount = 3) => {
      try {
        await fetch(`${BACKEND_URL}/api/save-captcha-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userId,
            // prompt_id: prompts[currentPromptIndex].id,
            tactic: currentPrompt.tactic, // Add tactic
            technique: currentPrompt.technique, // Add technique
            prompt: prompts[currentPromptIndex].prompt,
            user_response: userInput,
          }),
        });
        setIsComplete(true);
      } catch (error) {
        console.error("Error saving conversation:", error);
        if (retryCount > 0) {
          console.log(`Retrying... (${3 - retryCount + 1})`);
          saveConversation(retryCount - 1);
        } else {
          alert("Failed to save conversation. Please try again.");
        }
      } finally {
        setIsSaving(false);
      }
    };

    saveConversation();
  };

  const handleNextRound = () => {
    if (currentPromptIndex + 1 < prompts.length) {
      setCurrentPromptIndex((prevIndex) => prevIndex + 1);
    } else {
      setAllPromptsComplete(true);
    }
    setCompletedPrompts((prev) => prev + 1);

    setTimeout(() => {
      if (userInputRef.current) {
        userInputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (isComplete) {
      handleNextRound();
    }
  }, [isComplete]);

  const positionTutorialDialog = useCallback((step) => {
    let targetRef;
    switch (step) {
      case 0:
        targetRef = promptInfoRef;
        setHighlightedElement("prompt-info");
        break;
      case 1:
        targetRef = inputAreaRef;
        setHighlightedElement("message-input");
        break;
      default:
        setHighlightedElement(null);
        return;
    }

    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 40,
      });
    }
  }, []);

  useEffect(() => {
    if (isTutorial && prompts.length) {
      const timer = setTimeout(() => {
        positionTutorialDialog(tutorialStep);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isTutorial, tutorialStep, positionTutorialDialog, prompts]);

  const handleTutorialNext = () => {
    if (tutorialStep < 1) {
      setTutorialStep((prevStep) => prevStep + 1);
    } else {
      setIsTutorial(false);
      setTutorialStarted(true);
      setHighlightedElement(null);
    }
  };

  useEffect(() => {
    if (allPromptsComplete) {
      onSurveyPage();
    }
  }, [allPromptsComplete, onSurveyPage]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (isTutorial) {
        handleTutorialNext();
      } else if (isComplete) {
        handleNextRound();
      } else {
        handleSendMessage();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [
    isTutorial,
    isComplete,
    handleSendMessage,
    handleNextRound,
    handleTutorialNext,
  ]);

  const renderTutorialDialog = () => {
    const dialogContent = [
      "This is the task that you have to complete.",
      "Type your response and press Enter or click 'Submit'.",
    ][tutorialStep];

    const progressPercentage = ((tutorialStep + 1) / 2) * 100;

    return (
      <div
        className={`tutorial-dialog tutorial-step-${tutorialStep}`}
        style={{ top: tutorialPosition.top, left: tutorialPosition.left }}
      >
        <h3>Tutorial: Step {tutorialStep + 1}</h3>
        <div className="tutorial-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span
            className={`tutorial-icon ${
              tutorialStep === 1 ? "check-icon" : "info-icon"
            }`}
          ></span>
        </div>
        <p>{dialogContent}</p>
        <button onClick={handleTutorialNext} className="green-button">
          {tutorialStep < 1 ? "Next" : "Start"}
        </button>
        <p className="enter-instruction">Press Enter to continue</p>
      </div>
    );
  };

  const renderProgressBar = () => {
    const progressPercentage = ((completedPrompts + 1) / totalPrompts) * 100;
    return (
      <div className="overall-progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <span className="progress-text">{`${
          completedPrompts + 1
        } / ${totalPrompts} Prompts Completed`}</span>
      </div>
    );
  };

  if (!prompts.length) {
    console.log("asdasd");
    return <div>Loading...</div>;
  }

  const currentPrompt = prompts[currentPromptIndex];
  console.log(currentPrompt);
  return (
    <div className="chat-interface">
      {!allPromptsComplete && renderProgressBar()}
      {allPromptsComplete ? (
        <></>
      ) : (
        <>
          {tutorialStep >= 0 && (
            <div
              className={`prompt-info ${
                highlightedElement === "prompt-info" ? "highlight-glow" : ""
              }`}
              ref={promptInfoRef}
            >
              {tutorialStep >= 0 && (
                <h2>Category: {currentPrompt.technique}</h2>
              )}
              <p>{renderPrompt(currentPrompt.prompt)}</p>
            </div>
          )}
          <div
            className={`message-input ${
              highlightedElement === "message-input" ? "highlight-glow" : ""
            }`}
            ref={inputAreaRef}
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type your answer here..."
              disabled={
                isComplete ||
                (isTutorial && tutorialStep < 1) ||
                !tutorialStarted
              }
              ref={userInputRef}
            />
            <button
              onClick={handleSendMessage}
              disabled={
                isComplete ||
                (isTutorial && tutorialStep < 1) ||
                !tutorialStarted
              }
            >
              Submit
            </button>
          </div>
        </>
      )}
      {isTutorial &&
        tutorialPosition.top !== 0 &&
        tutorialPosition.left !== 0 &&
        renderTutorialDialog()}
    </div>
  );
}
export default ChatInterface;
