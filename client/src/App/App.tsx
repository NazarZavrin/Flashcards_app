import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAppSelector } from '../store';
import AuthForm from '../Auth/AuthForm';
import AppMessage from '../components/AppMessage';

function App() {
  const messageText = useAppSelector(state => state.message.queue[0]?.text);
  const messageType = useAppSelector(state => state.message.queue[0]?.type);
  const messageDisplayDuration = useAppSelector(state => state.message.queue[0]?.displayDuration);
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