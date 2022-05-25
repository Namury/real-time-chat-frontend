import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from 'context/UserContext';

function ProtectedOutlet() {
  const { user } = useContext(UserContext);

  return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedOutlet;
