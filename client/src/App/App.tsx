import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useAuthenticationCheck } from '../Auth/hooks/useAuthenticationCheck';
import { useAppSelector } from '../store';
import AppLoader from '../components/AppLoader';
import AuthForm from '../Auth/AuthForm';
import Sets from '../Sets/Sets';
import NotFoundPage from './NotFoundPage';
import AppMessage from '../components/AppMessage';

function App() {
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <AppMessage type={messageType} displayDuration={messageDisplayDuration}>
          {messageText}
        </AppMessage>
      </BrowserRouter>
  );
}

export default App;