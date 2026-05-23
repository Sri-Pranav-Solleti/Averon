import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Home() {
  useEffect(() => {
    if (sessionStorage.getItem("login_refresh")) {
      sessionStorage.removeItem("login_refresh");
      window.location.reload();
    }
  }, []);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const API = process.env.REACT_APP_API_URL;
  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }


  async function handleBookNow() {
    let access = localStorage.getItem("access");
    let refresh = localStorage.getItem("refresh");

    if (!access || !refresh) {
      navigate("/login");
      return;
    }

    if (isTokenExpired(access)) {
      if (refresh && !isTokenExpired(refresh)) {
        const res = await fetch(`${API}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });
        const data = await res.json();

        if (data.access) {
          localStorage.setItem("access", data.access);
        } else {
          localStorage.clear();
          navigate("/login");
          return;
        }
      } else {
        localStorage.clear();
        navigate("/login");
        return;
      }
    }

    navigate("/book");
  }

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);
    console.log(r);
  }, []);

  function upload_movie() {
    navigate("/releasetickets");
  }
  function login(){
    navigate("/login")
  }

  return (
    <>
      <div>
        <p className="welcomebox">
          {username ? (
            <>
              Welcome, <b>{username}</b>
            </>
          ) : (
            <div>
              <span className="notlogin">You are not currently logged in</span>
              <br></br>
              <span className="notlogin"> Please Login and Continue</span>
            </div>
          )}
        </p>
      </div>
      <div className="home-hero">
        <div className="home-content">
          <p className="home-title">Welcome to Averon</p>
          <p className="home-subtitle">
            Your one-stop platform for seamless movie ticket booking. Discover
            movies, choose your preferred theatre, select your show, and book
            your tickets in just a few clicks — fast, secure, and hassle-free.
          </p>

          <div className="home-features">
            <div className="feature-card">
              <h3>Latest Movies</h3>
              <p>Browse currently running and upcoming movies.</p>
            </div>

            <div className="feature-card">
              <h3>Choose Theatre</h3>
              <p>Select your preferred cinema near you.</p>
            </div>

            <div className="feature-card">
              <h3>Instant Booking</h3>
              <p>Check availability and book tickets instantly.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="comet-section">
        <div className="comet-stage">
          <svg
            viewBox="0 0 1600 200"
            className="comet-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="tailGlow" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(168,85,247,0.9)" />
                <stop offset="40%" stopColor="rgba(127,124,255,0.6)" />
                <stop offset="70%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <filter id="blurGlow">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            <path
              d="M -200 100
         C 100 -20, 250 220, 400 90
         S 650 -30, 800 160
         S 1050 10, 1250 190
         S 1450 80, 1650 100"
              fill="none"
              stroke="url(#tailGlow)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#blurGlow)"
              strokeDasharray="360 1100"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-1470"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <div className="main">
          {role === "viewer" && (
            <button className="bwbtn1" onClick={handleBookNow}>
              Book Now
            </button>
          )}
          {role === "organizer" && (
            <button className="bwbtn1" onClick={upload_movie}>
              Release Tickets
            </button>
          )}
          {role===null &&(
            <p onClick={login} className="bwbtn1" >Click here to log in</p>
          )}
        </div>
      </div>

      <div className="workhero">
        <section class="how-it-works">
          <h1 class="heading">How It Works</h1>

          <ul class="steps">
            <li>
              <span class="step-no">01</span>
              <div>
                <h3>Select a Movie</h3>
                <p>Choose from the list of movies currently playing.</p>
              </div>
            </li>

            <li>
              <span class="step-no">02</span>
              <div>
                <h3>Pick Date & Theatre</h3>
                <p>Select your preferred date and theatre for the show.</p>
              </div>
            </li>

            <li>
              <span class="step-no">03</span>
              <div>
                <h3>Choose Show Time</h3>
                <p>View available shows and real-time seat availability.</p>
              </div>
            </li>

            <li>
              <span class="step-no">04</span>
              <div>
                <h3>Confirm Booking</h3>
                <p>Enter ticket count and reserve your seats instantly.</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}

export { Home };
