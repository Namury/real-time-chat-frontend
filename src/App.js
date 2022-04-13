import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, Component } from "react";

const Chat = React.lazy(() => import("./pages/chat"));
const Login = React.lazy(() => import("./pages/login"));
const Room = React.lazy(() => import("./pages/room"));



function App() {
  return (
    <div className="App">
      <Suspense fallback={<div />}>
        <Router>
          <Routes>
            <Route path={"/chat/:room"} element={<Chat> </Chat>}></Route>
            <Route path={"/room"} element={<Room> </Room>}></Route>
            <Route index path={"/"} element={<Login> </Login>}></Route>
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
