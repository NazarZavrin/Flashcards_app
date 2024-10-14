import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAppSelector } from '../store';
import AuthForm from '../Auth/AuthForm';
import AppMessage from '../components/AppMessage';

function App() {
  const messageText = useAppSelector(state => state.app.text);
  const messageType = useAppSelector(state => state.app.type);
  const messageDisplayDuration = useAppSelector(state => state.app.displayDuration);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
      </Routes>
      <AppMessage type={messageType} displayDuration={messageDisplayDuration}>
        {messageText}
      </AppMessage>
    </BrowserRouter>
  );
}

export default App;