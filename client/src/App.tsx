import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';
import Preloader from './components/PreLoader';
import { useAppSelector } from './hooks';
import RoutesConfig from './routes/index';

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {loading ? <Preloader /> : <RoutesConfig />}
        <Toaster position='top-right' />
      </div>
    </Router>
  );
};

export default App;
