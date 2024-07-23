import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthForm from '../Auth/AuthForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;