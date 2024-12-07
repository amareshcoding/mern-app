import { Routes, Route } from 'react-router';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import AuthLayout from './components/Auth';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
