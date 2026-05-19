// import React,{useState} from "react";
// import { useNavigate } from "react-router-dom";
// import "../index.css";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// function Register(){

//     const[username,setUsername]=useState("");
//     const[email,setEmail]=useState("");
//     const[password,setPassword]=useState("");
//     const[role,setRole]=useState("viewer"); 
//     const[snack,setSnack]=useState({open:false,message:"",severity:"success"});

//     const navigate=useNavigate();

//     const handleCloseSnack=()=>{
//         setSnack({...snack,open:false});
//     };

//     const handleSubmit=async(e)=>{
//         e.preventDefault();

//         try{
//             const res=await fetch("http://127.0.0.1:8000/api/register/",{
//                 method:"POST",
//                 headers:{
//                     "Content-Type":"application/json",
//                 },
//                 body:JSON.stringify({
//                     username,
//                     email,
//                     password,
//                     role,
//                 })
//             });

//             const data=await res.json();

//             if(res.ok){
//                 localStorage.setItem("access",data.tokens.access);
//                 localStorage.setItem("refresh",data.tokens.refresh);
//                 localStorage.setItem("username",data.user.username);
//                 localStorage.setItem("role",data.user.role);
//                 sessionStorage.setItem("login_refresh","true");

//                 setSnack({
//                     open:true,
//                     message:"Registration successful",
//                     severity:"success"
//                 });

//                 setUsername("");
//                 setEmail("");
//                 setPassword("");
//                 setRole("viewer");

//                 setTimeout(()=>navigate("/"),800);

//             }else{
//                 setSnack({
//                     open:true,
//                     message:data?.error || "Registration failed",
//                     severity:"error"
//                 });
//             }

//         }catch(err){
//             setSnack({
//                 open:true,
//                 message:"Server error",
//                 severity:"error"
//             });
//         }
//     };

//     return(
//         <div className="page">

//             <Snackbar
//                 open={snack.open}
//                 autoHideDuration={3000}
//                 onClose={handleCloseSnack}
//                 anchorOrigin={{vertical:"top",horizontal:"center"}}
//             >
//                 <Alert
//                     onClose={handleCloseSnack}
//                     severity={snack.severity}
//                     sx={{width:"100%"}}
//                 >
//                     {snack.message}
//                 </Alert>
//             </Snackbar>

//             <div className="card">
//                 <h1 className="title">Create Account</h1>

//                 <p className="quote">
//                     “Your seat to every story begins here.”
//                 </p>

//                 <form onSubmit={handleSubmit} className="form">
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e)=>setUsername(e.target.value)}
//                         className="input"
//                         required
//                     />

//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e)=>setEmail(e.target.value)}
//                         className="input"
//                         required
//                     />

//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e)=>setPassword(e.target.value)}
//                         className="input"
//                         required
//                     />

//                     <select
//                         value={role}
//                         onChange={(e)=>setRole(e.target.value)}
//                         className="input"
//                     >
//                         <option value="viewer">Viewer (Book tickets)</option>
//                         <option value="organizer">Organizer (Manage theatre)</option>
//                     </select>

//                     <button type="submit" className="btn">
//                         REGISTER
//                     </button>
//                 </form>

//                 <div className="footer">
//                     Already have an account?{" "}
//                     <span
//                         style={{cursor:"pointer",fontWeight:"600"}}
//                         onClick={()=>navigate("/login")}
//                     >
//                         Login
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export {Register};

import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Register(){

    const[username,setUsername]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[role,setRole]=useState("viewer"); 
    const[snack,setSnack]=useState({open:false,message:"",severity:"success"});

    const navigate=useNavigate();

    const handleCloseSnack=()=>{
        setSnack({...snack,open:false});
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            const res=await fetch("http://127.0.0.1:8000/api/register/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    username,
                    email,
                    password,
                    role,
                })
            });

            const data=await res.json();

            if(res.ok){
                localStorage.setItem("access",data.tokens.access);
                localStorage.setItem("refresh",data.tokens.refresh);
                localStorage.setItem("username",data.user.username);
                localStorage.setItem("role",data.user.role);
                sessionStorage.setItem("login_refresh","true");

                setSnack({
                    open:true,
                    message:"Registration successful",
                    severity:"success"
                });

                setUsername("");
                setEmail("");
                setPassword("");
                setRole("viewer");

                setTimeout(()=>navigate("/"),800);

            }else{
                setSnack({
                    open:true,
                    message:data?.error || "Registration failed",
                    severity:"error"
                });
            }

        }catch(err){
            setSnack({
                open:true,
                message:"Server error",
                severity:"error"
            });
        }
    };

    return(
        <div className="page">

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={handleCloseSnack}
                anchorOrigin={{vertical:"top",horizontal:"center"}}
            >
                <Alert
                    onClose={handleCloseSnack}
                    severity={snack.severity}
                    sx={{width:"100%"}}
                >
                    {snack.message}
                </Alert>
            </Snackbar>

            <div className="card">
                <h1 className="title">Create Account</h1>

                <p className="quote">
                    “Your seat to every story begins here.”
                </p>

                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        className="input"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="input"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="input"
                        required
                    />

                    <select
                        value={role}
                        onChange={(e)=>setRole(e.target.value)}
                        className="input"
                    >
                        <option value="viewer">Viewer (Book tickets)</option>
                        <option value="organizer">Organizer (Manage theatre)</option>
                    </select>

                    <button type="submit" className="btn">
                        REGISTER
                    </button>
                </form>

                {/* GOOGLE REGISTER / LOGIN */}
                <div className="google" style={{marginTop:"16px"}}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const res = await axios.post(
                                    "http://127.0.0.1:8000/api/googlelogin/",
                                    { id_token: credentialResponse.credential }
                                );

                                const email = res.data.user.email;
                                const googleUsername = email.split("@")[0];

                                localStorage.setItem("access", res.data.access);
                                localStorage.setItem("refresh", res.data.refresh);
                                localStorage.setItem("username", googleUsername);
                                localStorage.setItem("role", "viewer");
                                sessionStorage.setItem("login_refresh","true");

                                setSnack({
                                    open:true,
                                    message:"signup successful",
                                    severity:"success"
                                });

                                setTimeout(()=>navigate("/"),800);

                            } catch (err) {
                                console.error(err);
                                setSnack({
                                    open:true,
                                    message:"signup failed",
                                    severity:"error"
                                });
                            }
                        }}
                        onError={() => {
                            setSnack({
                                open:true,
                                message:"signup failed",
                                severity:"error"
                            });
                        }}
                    />
                </div>

                <div className="footer">
                    Already have an account?{" "}
                    <span
                        style={{cursor:"pointer",fontWeight:"600"}}
                        onClick={()=>navigate("/login")}
                    >
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}

export {Register};