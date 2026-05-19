import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Navbar() {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("username");
        setIsLogin(!!user);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLogin(false);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-left" onClick={() => navigate("/")}>
                Averon
            </div>

            <div className="nav-right">
                {isLogin ? (
                    <>
                        <button className="nav-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="nav-btn outline"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className="nav-btn"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;


