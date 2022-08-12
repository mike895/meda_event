import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import Login from './Components/Auth/Login';
import { Link, Outlet } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser)
  return (
    <div className="App">
      <header className="App-header">
        <Login/>
        <h1>
        <Link to="/protected-route">Protected Route</Link>
        </h1>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
