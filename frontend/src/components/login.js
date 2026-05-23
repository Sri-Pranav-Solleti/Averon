// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../index.css";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("viewer");
//   const [msg, setMsg] = useState("");
//   const [snack, setSnack] = useState({
//     open: false,
//     message: "",
//     severity: "error",
//   });
//   const navigate = useNavigate();

//   const handleCloseSnack = () => {
//     setSnack({ ...snack, open: false });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setSnack({ open: false, message: "", severity: "error" });

//     const authRes = await fetch("http://127.0.0.1:8000/api/token/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     const authData = await authRes.json();

//     if (!authRes.ok) {
//       setSnack({
//         open: true,
//         message: "Invalid username or password",
//         severity: "error",
//       });
//       return;
//     }

//     const usersRes = await fetch("http://127.0.0.1:8000/api/users/", {
//       headers: {
//         Authorization: `Bearer ${authData.access}`,
//       },
//     });

//     if (!usersRes.ok) {
//       setSnack({
//         open: true,
//         message: "Unable to fetch user details",
//         severity: "error",
//       });
//       return;
//     }

//     const usersData = await usersRes.json();
//     const users = Array.isArray(usersData) ? usersData : usersData.results;

//     if (!Array.isArray(users)) {
//       setSnack({
//         open: true,
//         message: "Server error",
//         severity: "error",
//       });
//       return;
//     }

//     const dbUser = users.find((u) => u.username === username.trim());

//     if (!dbUser) {
//       setSnack({
//         open: true,
//         message: "User not found",
//         severity: "error",
//       });
//       return;
//     }

//     if (dbUser.role !== role) {
//       setSnack({
//         open: true,
//         message: `Wrong role selected. You are registered as "${dbUser.role}".`,
//         severity: "error",
//       });
//       return;
//     }

//     localStorage.setItem("access", authData.access);
//     localStorage.setItem("refresh", authData.refresh);
//     localStorage.setItem("username", username.trim());
//     localStorage.setItem("role", dbUser.role);
//     sessionStorage.setItem("login_refresh", "true");

//     setSnack({
//       open: true,
//       message: "Login successful",
//       severity: "success",
//     });

//     setTimeout(() => navigate("/"), 800);
//   };

//   return (
//     <div className="page">
//       <Snackbar
//         open={snack.open}
//         autoHideDuration={3000}
//         onClose={handleCloseSnack}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseSnack}
//           severity={snack.severity}
//           sx={{ width: "100%" }}
//         >
//           {snack.message}
//         </Alert>
//       </Snackbar>

//       <div className="card">
//         <h1 className="title">Welcome Back</h1>

//         <p className="quote">“Lights, camera… your ticket awaits.”</p>

//         {msg && <p className="msg">{msg}</p>}

//         <form onSubmit={handleLogin} className="form">
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="input"
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="input"
//             required
//           />

//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="input"
//           >
//             <option value="viewer">Viewer</option>
//             <option value="organizer">Organizer</option>
//           </select>

//           <button type="submit" className="btn">
//             LOGIN
//           </button>
//         </form>

//         <div className="google">
//           <GoogleLogin
//             onSuccess={async (credentialResponse) => {
//               try {
//                 const res = await axios.post(
//                   "http://127.0.0.1:8000/api/googlelogin/",
//                   {
//                     id_token: credentialResponse.credential,
//                   }
//                 );

//                 localStorage.setItem("access", res.data.access);
//                 localStorage.setItem("refresh", res.data.refresh);

//                 alert("Google Login Successful");

//                 console.log(res.data);
//               } catch (err) {
//                 console.error(err);
//                 alert("Google Login Failed");
//               }
//             }}
//             onError={() => {
//               alert("Google Login Failed");
//             }}
//           />
//         </div>

//         <div className="footer">
//           <button className="btn-outline" onClick={() => navigate("/register")}>
//             I don’t have an account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { Login };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [msg, setMsg] = useState("");
  const API = process.env.REACT_APP_API_URL;
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const navigate = useNavigate();

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setSnack({ open: false, message: "", severity: "error" });

    const authRes = await fetch(`${API}/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      setSnack({
        open: true,
        message: "Invalid username or password",
        severity: "error",
      });
      return;
    }

    const usersRes = await fetch(`${API}/api/users/`, {
      headers: {
        Authorization: `Bearer ${authData.access}`,
      },
    });

    if (!usersRes.ok) {
      setSnack({
        open: true,
        message: "Unable to fetch user details",
        severity: "error",
      });
      return;
    }

    const usersData = await usersRes.json();
    const users = Array.isArray(usersData) ? usersData : usersData.results;

    const dbUser = users.find((u) => u.username === username.trim());

    if (!dbUser) {
      setSnack({
        open: true,
        message: "User not found",
        severity: "error",
      });
      return;
    }

    if (dbUser.role !== role) {
      setSnack({
        open: true,
        message: `Wrong role selected. You are registered as "${dbUser.role}".`,
        severity: "error",
      });
      return;
    }

    localStorage.setItem("access", authData.access);
    localStorage.setItem("refresh", authData.refresh);
    localStorage.setItem("username", username.trim());
    localStorage.setItem("role", dbUser.role);
    sessionStorage.setItem("login_refresh", "true");

    setSnack({
      open: true,
      message: "Login successful",
      severity: "success",
    });

    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="page">
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <div className="card">
        <h1 className="title">Welcome Back</h1>
        <p className="quote">“Lights, camera… your ticket awaits.”</p>

        {msg && <p className="msg">{msg}</p>}

        <form onSubmit={handleLogin} className="form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
          >
            <option value="viewer">Viewer</option>
            <option value="organizer">Organizer</option>
          </select>

          <button type="submit" className="btn">
            LOGIN
          </button>
        </form>

        {/* GOOGLE LOGIN */}
        <div className="google">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post(
                  `${API}/api/googlelogin/`,
                  { id_token: credentialResponse.credential }
                );

                const email = res.data.user.email;
                const googleUsername = email.split("@")[0];

                localStorage.setItem("access", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);
                localStorage.setItem("username", googleUsername);
                localStorage.setItem("role", "viewer");
                sessionStorage.setItem("login_refresh", "true");

                setSnack({
                  open: true,
                  message: "login successful",
                  severity: "success",
                });

                setTimeout(() => navigate("/"), 800);
              } catch (err) {
                console.error(err);
                setSnack({
                  open: true,
                  message: "login failed",
                  severity: "error",
                });
              }
            }}
            onError={() => {
              setSnack({
                open: true,
                message: "login failed",
                severity: "error",
              });
            }}
          />
        </div>

        <div className="footer">
          <button className="btn-outline" onClick={() => navigate("/register")}>
            I don’t have an account
          </button>
        </div>
      </div>
    </div>
  );
}

export { Login };