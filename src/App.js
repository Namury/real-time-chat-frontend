import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useMemo, useRef } from "react";
import { UserContext } from "context/UserContext";
// import { VideoContext } from "context/VideoContext";
import { ProtectedOutlet, Snackbar } from "components";
import { useLocalStorage } from "hooks/useLocalStorage";
import { SnackbarContext } from "context/SnackbarContext";

const Chat = React.lazy(() => import("./pages/chat"));
const Login = React.lazy(() => import("./pages/login"));
const Room = React.lazy(() => import("./pages/room"));
const Register = React.lazy(() => import("./pages/register"));
const Config = React.lazy(() => import("./pages/config"));
const PageBase = React.lazy(() => import("./pages/pageBase"));

function App() {
  const [user, setUser] = useLocalStorage("user");
  const userProviderValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser]
  );

  const snackbarRef = useRef(null);

  return (
    <UserContext.Provider value={userProviderValue}>
        <Snackbar ref={snackbarRef} />
        <Suspense fallback={<div />}>
          <SnackbarContext.Provider value={snackbarRef}>
            <Router>
              <Routes>
                <Route index path={"/"} element={<Login> </Login>}></Route>
                <Route
                  path={"/register"}
                  element={<Register> </Register>}
                ></Route>
                <Route
                  element={
                    <PageBase>
                      <ProtectedOutlet />
                    </PageBase>
                  }
                >
                  <Route path={"/chat/:room"} element={<Chat> </Chat>}></Route>
                  <Route path={"/room"} element={<Room> </Room>}></Route>
                  <Route path={"/config"} element={<Config> </Config>}></Route>
                </Route>
              </Routes>
            </Router>
          </SnackbarContext.Provider>
        </Suspense>
    </UserContext.Provider>
  );
}

export default App;
