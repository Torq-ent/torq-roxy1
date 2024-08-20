"use client"; // Ensure this component is treated as a Client Component in Next.js

import React, { useState, useEffect, useCallback } from "react";
import fetchInfluencers from "../../utils/fetchInfluencers"; // Adjusted path
import gifs from "../../data/gifsData"; // Adjusted path
import "../../styles/App.css"; // Adjusted path for the CSS
import AdPlaceholder from "../../components/AdPlaceholder"; // Adjusted path

export default function Game() {
  const [currentInfluencer, setCurrentInfluencer] = useState(null);
  const [nextInfluencer, setNextInfluencer] = useState(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showFollowerCount, setShowFollowerCount] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [backgroundGif, setBackgroundGif] = useState("");
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [showAd, setShowAd] = useState(false);

  // Log when the component renders
  console.log("Game component rendered");

  // Memoized fetch function to ensure it's not recreated on every render
  const fetchAndSetInfluencers = useCallback(async () => {
    console.log("Fetching influencers...");
    const influencer1 = await fetchInfluencers();
    const influencer2 = await fetchInfluencers();

    console.log("Fetched Influencers:", influencer1, influencer2);

    setCurrentInfluencer(influencer1);
    setNextInfluencer(influencer2);
    setGameOver(false); // Reset game over state
    setScore(0); // Reset score
    setShowFollowerCount(false); // Reset follower count display
    setIsCorrect(null); // Reset correctness state
    setShowResult(false); // Reset result display
    setBackgroundGif(""); // Reset background GIF
    setGameOverMessage(""); // Reset game over message
    setShowAd(false); // Hide the ad
  }, []);

  // useEffect to initialize the game, running only once when the component mounts
  useEffect(() => {
    console.log("Game component mounted");
    fetchAndSetInfluencers();
  }, [fetchAndSetInfluencers]); // Dependency ensures this effect runs only once

  // Helper function to handle guesses
  const handleGuess = async (guess) => {
    const correct =
      guess === "more"
        ? nextInfluencer.followers > currentInfluencer.followers
        : nextInfluencer.followers < currentInfluencer.followers;

    setIsCorrect(correct);
    setShowFollowerCount(true);
    animateFollowerCount(nextInfluencer.followers);

    setTimeout(async () => {
      setShowResult(true);

      setTimeout(async () => {
        if (correct) {
          setScore((prevScore) => {
            const newScore = prevScore + 1;
            if (newScore > highscore) {
              setHighscore(newScore);
              localStorage.setItem("highscore", newScore);
            }
            return newScore;
          });

          setCurrentInfluencer(nextInfluencer);

          let newInfluencer;
          do {
            newInfluencer = await fetchInfluencers();
          } while (newInfluencer.name === nextInfluencer.name);

          console.log("New Influencer fetched:", newInfluencer);

          await preloadImage(newInfluencer.image);

          setNextInfluencer(newInfluencer);
          setShowFollowerCount(false);
          setFollowerCount(0);
          setIsCorrect(null);
          setShowResult(false);
        } else {
          setGameOver(true);
          setShowAd(true);

          const { gifArray, gameOverMsg } = getGameOverDetails(score);

          const randomGif =
            gifArray[Math.floor(Math.random() * gifArray.length)];
          setBackgroundGif(randomGif);
          setGameOverMessage(gameOverMsg);
        }
      }, 1000);
    }, 1500);
  };

  // Function to preload images
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  };

  // Function to animate the follower count
  const animateFollowerCount = (targetCount) => {
    const duration = 1500;
    const increment = targetCount / (duration / 20);
    let currentCount = 0;

    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(interval);
      }
      setFollowerCount(Math.floor(currentCount).toLocaleString());
    }, 20);
  };

  // Function to get game over details
  const getGameOverDetails = (score) => {
    let gifArray;
    let gameOverMsg;
    if (score <= 2) {
      gifArray = gifs.low;
      gameOverMsg = "Oh dear!!! That's an embarrassing score, isn’t it?";
    } else if (score <= 6) {
      gifArray = gifs.medium;
      gameOverMsg = "Not bad, but you can do better!";
    } else if (score <= 10) {
      gifArray = gifs.high;
      gameOverMsg = "Great job! You're getting the hang of it!";
    } else {
      gifArray = gifs.highest;
      gameOverMsg = "Amazing! You're a true follower expert!";
    }
    return { gifArray, gameOverMsg };
  };

  if (gameOver) {
    const handleCloseAd = () => {
      setShowAd(false); // Close the ad
    };

    return (
      <div
        className="game-container"
        style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        <div className="overlay">
          <h1>Good Game!</h1>
          <p>Your score: {score}</p>
          <p>{gameOverMessage}</p>
          {showAd && <AdPlaceholder onClose={handleCloseAd} />}
          {!showAd && (
            <div className="button-group">
              <button onClick={fetchAndSetInfluencers}>Play Again</button>{" "}
              {/* Fixed Play Again button */}
              <button onClick={() => (window.location.href = "/")}>Home</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentInfluencer || !nextInfluencer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-container">
      <div className="highscore-overlay">Highscore: {highscore}</div>
      <h1
        className={score >= 3 ? "animate" : ""}
        style={{ color: getScoreColor(score) }}
      >
        Score: {score}
      </h1>
      <div className="influencer-container">
        <div className="influencer-card-container left">
          <div
            className="influencer-card left"
            style={{ backgroundImage: `url(${currentInfluencer.image})` }}
          >
            <div className="influencer-info">
              <h2>{currentInfluencer.name}</h2>
              <p className="small-text">has</p>
              <p className="follower-count">
                {currentInfluencer.followers.toLocaleString()}
              </p>
              <p className="small-text">followers</p>
              <img
                src={currentInfluencer.platformLogo}
                alt="Platform Logo"
                className="platform-logo"
              />
              <a
                className="source-link"
                href={currentInfluencer.linkMaterial}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </div>
          </div>
        </div>
        <div
          className={`vs-circle ${
            showResult && (isCorrect ? "correct" : "incorrect")
          }`}
        >
          <p className="vs-text">VS</p>
        </div>
        <div className="influencer-card-container right">
          <div
            className={`influencer-card right ${
              showResult ? "slide-left" : ""
            }`}
            style={{ backgroundImage: `url(${nextInfluencer.image})` }}
          >
            <div className="influencer-info">
              <h2>{nextInfluencer.name}</h2>
              <p className="small-text">has</p>
              {showFollowerCount ? (
                <>
                  <p className="follower-count">{followerCount}</p>
                  <p className="small-text">followers</p>
                </>
              ) : (
                <>
                  <div className="button-container">
                    <button
                      className="guess-button higher"
                      onClick={() => handleGuess("more")}
                    >
                      Higher
                    </button>
                    <button
                      className="guess-button lower"
                      onClick={() => handleGuess("less")}
                    >
                      Lower
                    </button>
                  </div>
                  <p className="small-text">
                    followers than {currentInfluencer.name}
                  </p>
                </>
              )}
              <img
                src={nextInfluencer.platformLogo}
                alt="Platform Logo"
                className="platform-logo"
              />
              <a
                className="source-link"
                href={nextInfluencer.linkMaterial}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getScoreColor = (score) => {
  if (score >= 15) return "purple";
  if (score >= 8) return "blue";
  if (score >= 3) return "darkred";
  return "black";
};
