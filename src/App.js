import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

const Chat = React.lazy(() => import('./pages/chat'));
const Login = React.lazy(() => import('./pages/login'));
const Room = React.lazy(() => import('./pages/room'));


function App() {
  
  console.log('rendered, App.js');

  return (

    <div className="App">
      <Suspense fallback={<div />}>
        <Router>
          <Routes>
            <Route index path={"/chat"} element={<Chat> </Chat>}></Route>
            <Route index path={"/room"} element={<Room> </Room>}></Route>
            <Route index path={"/login"} element={<Login> </Login>}></Route>
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
