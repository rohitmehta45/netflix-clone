import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={user ? <Home /> : <Login />} />
        <Route path='/player/:id' element={user ? <Player /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;
