import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import Register from './pages/Register';
import Result from './pages/Result';
import OrgProfile from './pages/OrgProfile';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-background">
        <Routes>
          {/* public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/org/:ein" element={<OrgProfile />} />

          {/* protected pages */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/quiz"
            element={
              <RequireAuth>
                <Quiz />
              </RequireAuth>
            }
          />

          <Route
            path="/result"
            element={
              <RequireAuth>
                <Result />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
