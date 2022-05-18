import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

const Chat = React.lazy(() => import("./pages/chat"));
const Login = React.lazy(() => import("./pages/login"));
const Room = React.lazy(() => import("./pages/room"));
const Register = React.lazy(() => import("./pages/register"));
const Config = React.lazy(() => import("./pages/config"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div />}>
        <Router>
          <Routes>
            <Route path={"/chat/:room"} element={<Chat> </Chat>}></Route>
            <Route path={"/room"} element={<Room> </Room>}></Route>
            <Route path={"/config"} element={<Config> </Config>}></Route>
            <Route path={"/register"} element={<Register> </Register>}></Route>
            <Route index path={"/"} element={<Login> </Login>}></Route>
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
