import React, { useState } from "react";
import "./SurveyPage.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function SurveyPage({ userId }) {
  const [overallDifficulty, setOverallDifficulty] = useState(null);
  const [easiestTask, setEasiestTask] = useState("");
  const [mostDifficultTask, setMostDifficultTask] = useState("");
  const [difficultyComparedToCaptcha, setDifficultyComparedToCaptcha] =
    useState(null);
  const [additionalComments, setAdditionalComments] = useState("");
  const [rewardCode, setRewardCode] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/api/save-survey-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userId,
          overall_difficulty: overallDifficulty,
          easiest_task: easiestTask,
          most_difficult_task: mostDifficultTask,
          difficulty_compared_to_captcha: difficultyComparedToCaptcha,
          additional_comments: additionalComments,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Fetch reward code after survey completion
      const rewardResponse = await fetch(
        `${BACKEND_URL}/api/fetch-reward-code-captcha`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: userId }),
        }
      );
      const rewardData = await rewardResponse.json();
      setRewardCode(rewardData.code);
      setShowThankYou(true);
    } catch (error) {
      console.error("Error saving survey response:", error);
    }
  };

  const handleBubbleClick1 = (value) => {
    // Prevent form submission when clicking bubbles
    setOverallDifficulty(value);
  };

  const handleBubbleClick2 = (value) => {
    // Prevent form submission when clicking bubbles
    setDifficultyComparedToCaptcha(value);
  };
  return (
    <div className="survey-page">
      {showThankYou ? (
        <div className="thank-you-message">
          <h2>Thank You!</h2>
          <p>
            You have completed the user study. We appreciate your participation.
          </p>
          <p>
            Your reward code is: <strong>{rewardCode}</strong>
          </p>
        </div>
      ) : (
        <>
          <h1>Survey</h1>
          {
            <form onSubmit={handleSubmit}>
              <div className="survey-question">
                <p>
                  On a scale of 1 to 10, where 1 is very easy and 10 is very
                  difficult, please rate the overall difficulty of the
                  tasks/questions you just completed.
                </p>
                <div className="rating-bubbles">
                  {[...Array(10)].map((_, index) => (
                    <button
                      key={index}
                      className={`rating-bubble ${
                        overallDifficulty === index + 1 ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleBubbleClick1(index + 1);
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="survey-question">
                <p>
                  Please select the task/question that you found to be the
                  easiest from the list below.
                </p>
                <select
                  value={easiestTask}
                  onChange={(e) => setEasiestTask(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {/* Add options for tasks/questions */}
                  <option value="a">Character Count</option>
                  <option value="b">Word Count (Even/Odd)</option>
                  <option value="c">Count Words with Specific Length</option>
                  <option value="d">Compare Word Length to Number</option>
                  <option value="e">Count Vowels or Consonants</option>
                  <option value="f">Compare Decimal Numbers</option>
                  <option value="g">Number Sense</option>
                </select>
              </div>

              <div className="survey-question">
                <p>
                  Please select the task/question that you found to be the most
                  difficult from the list below.
                </p>
                <select
                  value={mostDifficultTask}
                  onChange={(e) => setMostDifficultTask(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {/* Add options for tasks/questions */}
                  <option value="a">Character Count</option>
                  <option value="b">Word Count (Even/Odd)</option>
                  <option value="c">Count Words with Specific Length</option>
                  <option value="d">Compare Word Length to Number</option>
                  <option value="e">Count Vowels or Consonants</option>
                  <option value="f">Compare Decimal Numbers</option>
                  <option value="g">Number Sense</option>
                </select>
              </div>
              <div className="survey-question">
                <p>
                  On a scale of 1 to 10, where 1 is much easier and 10 is much
                  harder, how does the difficulty of these tasks/questions
                  compare to regular CAPTCHAs you typically encounter?
                </p>
                <div className="rating-bubbles">
                  {[...Array(10)].map((_, index) => (
                    <button
                      key={index}
                      className={`rating-bubble ${
                        difficultyComparedToCaptcha === index + 1
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleBubbleClick2(index + 1);
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="survey-question">
                <p>
                  Please provide any additional comments or feedback regarding
                  the tasks/questions or the overall user experience.
                </p>
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  rows={4}
                />
              </div>

              <button type="submit">Submit</button>
            </form>
          }
        </>
      )}
    </div>
  );
}

export default SurveyPage;
