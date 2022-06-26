import { useContext, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from 'context/UserContext';
import authAPI from "api/authAPI";

function ProtectedOutlet() {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    async function verify() {
      try {
        await authAPI.verify(user.token);
      } catch (error) {
        setUser(null);
        return <Navigate to="/" />;
      }
    }
    verify();
  },);

  return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedOutlet;
