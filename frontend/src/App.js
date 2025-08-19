import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // handle login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // optional: persist user
  };

  // handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // optional: clear user
  };

  return (
    <div className="App">
      <h1>Cloud Finance Tracker</h1>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login setUser={setUser} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
