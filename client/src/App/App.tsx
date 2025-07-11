import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAppSelector } from '../store';
import AuthForm from '../Auth/AuthForm';
import AppMessage from '../components/AppMessage';
import Sets from '../Sets/Sets';
import { useAuthenticationCheck } from '../Auth/hooks/useAuthenticationCheck';
import AppLoader from '../components/AppLoader';

function App() {
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  // console.log('App.tsx ', new Date().toLocaleTimeString("UK"), isAuthenticated);
  const isChecking = useAuthenticationCheck(isAuthenticated);
  const messageText = useAppSelector(state => state.message.queue[0]?.text);
  const messageType = useAppSelector(state => state.message.queue[0]?.type);
  const messageDisplayDuration = useAppSelector(state => state.message.queue[0]?.displayDuration);
  return (
    isChecking ? <div className='w-full h-full flex'><AppLoader className='w-[30%] max-w-[5em] max-h-[5em] m-auto' /></div> :
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <AuthForm /> : <Navigate to='/sets' />} />
        <Route path="/sets" element={isAuthenticated ? <Sets /> : <Navigate to='/' />} />
        <Route path="*" element={<div>The page you requested was not found<span>Back to home</span></div>} />
      </Routes>
      <AppMessage type={messageType} displayDuration={messageDisplayDuration}>
        {messageText}
      </AppMessage>
    </BrowserRouter>
  );
}

export default App;