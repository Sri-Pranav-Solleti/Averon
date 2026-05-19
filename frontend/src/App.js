import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Home} from "./components/Home";
import { Login } from "./components/login";
import { Register } from "./components/register";
import Navbar from "./components/navbar";
import {ReleaseTickets} from "./components/ReleaseTickets";
import { Book } from "./components/Book";

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/releasetickets" element={<ReleaseTickets/>}/>
        <Route path="/book" element={<Book/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
