"use client"; // This directive makes the component a Client Component

import Link from "next/link";
import "./Home.css"; // Import the CSS file

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Follower Game</h1>
      <p className="home-description">Can you guess who has more followers?</p>
      <p className="home-subtitle">
        A <span className="highlight">highly addictive</span> game of <br />
        <span className="highlight">higher or lower</span> featuring the latest{" "}
        <br />
        follower counts from <span className="highlight">YouTube</span>, <br />
        <span className="highlight">Twitch</span>,{" "}
        <span className="highlight">TikTok</span>, and{" "}
        <span className="highlight">Instagram</span>. <br />
        Based on data from <span className="highlight">June 2024</span>. <br />
        <span className="highlight">Good luck!</span>
      </p>
      <Link href="/game">
        <button className="play-button">Play!</button>
      </Link>
    </div>
  );
}
