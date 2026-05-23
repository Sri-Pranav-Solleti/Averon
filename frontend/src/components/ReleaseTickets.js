import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ReleaseTickets(){

    const [movie_name,setMovie_name]=useState("");
    const [screen_no,setScreen_no]=useState("");
    const [fromdate,setFromdate]=useState("");
    const [todate,setTodate]=useState("");
    const [count,setCount]=useState("");
    const API = process.env.REACT_APP_API_URL;
    const [snack,setSnack]=useState({open:false,message:"",severity:"success"});

    const navigate=useNavigate();

    const handleCloseSnack=()=>{
        setSnack({...snack,open:false});
    };

    async function handleReleaseTickets(e){
        e.preventDefault();

        const data={
            movie_name:movie_name.trim(),
            screen_no:Number(screen_no),
            organizer:localStorage.getItem("username"),
            fromdate,
            todate,
            count:Number(count)
        };

        try{
            const res=await fetch(`${API}/api/generate/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("access")
                },
                body:JSON.stringify(data)
            });

            const resData=await res.json();

            if(res.ok){
                setSnack({
                    open:true,
                    message:resData.msg || "Tickets released successfully",
                    severity:"success"
                });
                setTimeout(()=>navigate("/"),800);
            }else{
                setSnack({
                    open:true,
                    message:resData.error || JSON.stringify(resData),
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
    }

    return(
        <div className="uploadbox">

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

            <h1 className="uploadtitle">Make Tickets Available</h1>

            <form onSubmit={handleReleaseTickets}>

                <label>Movie Name</label>
                <input 
                    placeholder="Enter the movie title"
                    onChange={e=>setMovie_name(e.target.value)}
                    required
                />

                <label>Screen Number</label>
                <input 
                    type="number"
                    min="1"
                    placeholder="Enter screen number"
                    onChange={e=>setScreen_no(e.target.value)}
                    required
                />

                <label>Start Date</label>
                <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e=>setFromdate(e.target.value)}
                    required
                />

                <label>End Date</label>
                <input
                    type="date"
                    min={fromdate}
                    onChange={e=>setTodate(e.target.value)}
                    required
                />

                <label>Tickets Per Show</label>
                <input 
                    type="number"
                    min="1"
                    placeholder="Enter number of tickets per show"
                    onChange={e=>setCount(e.target.value)}
                    required
                />

                <button className="bwbtn" type="submit">
                    Publish Tickets
                </button>

                <button
                    type="button"
                    onClick={()=>navigate("/")}
                    className="bwbtn"
                >
                    Go Back
                </button>

            </form>
        </div>
    );
}

export { ReleaseTickets };
