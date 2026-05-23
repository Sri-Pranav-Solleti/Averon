import React, { useEffect, useState, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Book() {
  const [movies, setMovies] = useState([]);
  const [dates, setDates] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);

  const [movie, setMovie] = useState("");
  const [date, setDate] = useState("");
  const [theatre, setTheatre] = useState("");
  const [screen, setScreen] = useState(null);
  const [qty, setQty] = useState(1);

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const TICKET_PRICE = 150;

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API = process.env.REACT_APP_API_URL;

  const dateRef = useRef(null);
  const theatreRef = useRef(null);
  const screenRef = useRef(null);
  const showRef = useRef(null);

  const closeSnack = () => {
    setSnack({ ...snack, open: false });
  };

  useEffect(() => {
    fetch(`${API}/api/movies/`)
      .then((r) => r.json())
      .then(setMovies);
  }, []);

  useEffect(() => {
    if (movie) {
      fetch(`${API}/api/dates/?movie=${movie}`)
        .then((r) => r.json())
        .then(setDates);

      setTimeout(() => {
        dateRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [movie]);

  useEffect(() => {
    if (movie && date) {
      fetch(`${API}/api/theatres/?movie=${movie}&date=${date}`)
        .then((r) => r.json())
        .then(setTheatres);

      setTimeout(() => {
        theatreRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [movie, date]);

  useEffect(() => {
    if (movie && date && theatre) {
      fetch(
        `${API}/api/screens/?movie=${movie}&date=${date}&organizer=${theatre}`
      )
        .then((r) => r.json())
        .then(setScreens);

      setTimeout(() => {
        screenRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [movie, date, theatre]);

  useEffect(() => {
    if (movie && date && theatre && screen !== null) {
      fetch(
        `${API}/api/shows/?movie=${movie}&date=${date}&organizer=${theatre}&screen=${screen}`
      )
        .then((r) => r.json())
        .then(setShows);

      setTimeout(() => {
        showRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [movie, date, theatre, screen]);

  function handleBook(showTime) {
    setBill({
      movie,
      date,
      theatre,
      screen,
      show: showTime,
      qty,
      total: qty * TICKET_PRICE,
    });
  }

  async function confirmBooking() {
    if (loading) return;

    setLoading(true);

    const payload = {
      movie: bill.movie,
      date: bill.date,
      organizer: bill.theatre,
      screen: bill.screen,
      show: bill.show,
      qty: Number(bill.qty),
    };

    try {
      const res = await fetch(`${API}/api/bookticket/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSnack({
          open: true,
          message: data.msg,
          severity: "success",
        });

        setBill(null);

        fetch(
          `${API}/api/shows/?movie=${movie}&date=${date}&organizer=${theatre}&screen=${screen}`
        )
          .then((r) => r.json())
          .then(setShows);
      } else {
        setSnack({
          open: true,
          message: data.error || "Booking failed",
          severity: "error",
        });
      }
    } catch (err) {
      setSnack({
        open: true,
        message: "Server error",
        severity: "error",
      });
    }

    setLoading(false);
    setQty(1);
  }

  return (
    <div className="pagebox">
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <section className="book-intro-box">
        <h1>Book Your Show</h1>
        <p>
          Choose your movie, select a convenient date and theatre, and explore
          available shows in real time. Adjust the number of tickets and confirm
          your booking instantly for a smooth and hassle-free cinema experience.
        </p>
      </section>

      <h2 className="sectiontitle">Select Movie</h2>
      <div className="optiongrid">
        {movies.map((m, i) => (
          <div
            key={i}
            className={`moviecard ${movie === m.movie_name ? "selected" : ""}`}
            onClick={() => {
              setMovie(m.movie_name);
              setDate("");
              setTheatre("");
              setScreen(null);
              setShows([]);
            }}
          >
            {m.movie_name}
          </div>
        ))}
      </div>

      {movie && (
        <>
          <h2 ref={dateRef} className="sectiontitle">Select Date</h2>
          <div className="optiongrid">
            {dates.map((d, i) => (
              <div
                key={i}
                className={`moviecard ${date === d.date ? "selected" : ""}`}
                onClick={() => {
                  setDate(d.date);
                  setTheatre("");
                  setScreen(null);
                  setShows([]);
                }}
              >
                {d.date}
              </div>
            ))}
          </div>
        </>
      )}

      {movie && date && (
        <>
          <h2 ref={theatreRef} className="sectiontitle">Select Theatre</h2>
          <div className="optiongrid">
            {theatres.map((t, i) => (
              <div
                key={i}
                className={`moviecard ${theatre === t.organizer ? "selected" : ""}`}
                onClick={() => {
                  setTheatre(t.organizer);
                  setScreen(null);
                  setShows([]);
                }}
              >
                {t.organizer}
              </div>
            ))}
          </div>
        </>
      )}

      {movie && date && theatre && (
        <>
          <h2 ref={screenRef} className="sectiontitle">Select Screen</h2>
          <div className="optiongrid">
            {screens.map((s, i) => (
              <div
                key={i}
                className={`moviecard ${
                  screen === Number(s.screen_no) ? "selected" : ""
                }`}
                onClick={() => setScreen(Number(s.screen_no))}
              >
                Screen {s.screen_no}
              </div>
            ))}
          </div>
        </>
      )}

      {movie && date && theatre && screen !== null && (
        <>
          <h2 ref={showRef} className="sectiontitle">Shows & Tickets</h2>

          <div className="qtybox">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          {shows.map((s, i) => {
            const available = Number(s.capacity) - Number(s.booked);
            const soldout = available <= 0;

            return (
              <div key={i} className="showcard">
                <div className="slot">
                  <b className="slot-time">{s.time}</b>
                  <p className={`slot-available ${soldout ? "zero" : "ok"}`}>
                    {soldout ? "Sold Out" : `Available : ${available}`}
                  </p>
                </div>

                <div
                  className={`booknow ${soldout ? "disabled" : ""}`}
                  onClick={() => !soldout && handleBook(s.time)}
                >
                  Book Now
                </div>
              </div>
            );
          })}
        </>
      )}

      {bill && (
        <div className="bill-overlay">
          <div className="bill-card">
            <h2>Booking Summary</h2>

            <p><b>Movie:</b> {bill.movie}</p>
            <p><b>Date:</b> {bill.date}</p>
            <p><b>Theatre:</b> {bill.theatre}</p>
            <p><b>Screen:</b> {bill.screen}</p>
            <p><b>Show:</b> {bill.show}</p>
            <p><b>Tickets:</b> {bill.qty}</p>

            <hr />
            <h3>Total: ₹{bill.total}</h3>

            <div className="bill-actions">
              <button className="cancel" onClick={() => setBill(null)}>
                Cancel
              </button>
              <button
                className={`confirm ${loading ? "disabled" : ""}`}
                onClick={confirmBooking}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Book };