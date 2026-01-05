import { useLocation } from 'react-router-dom';
import AllRoutes from './allroutes/AllRoutes';
import { AdminProfileProvider } from './context/AdminProfileContext';
import { LoginModalProvider } from './context/LoginModalContext';
import { WalletProvider } from './context/WalletContext';
import { useEffect, useState } from 'react';
import Loader from './components/common/loader/Loader';

function RouteChangeTracker() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Start loader on every route change
  useEffect(() => {
    setLoading(true);
  }, [location]);

  // Stop loader AFTER the new page has mounted
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 0); // micro-wait

    return () => clearTimeout(t);
  });

  return loading ? <Loader /> : null;
}



function App() {

  return (
    <div className="App">
      <RouteChangeTracker />
      <AdminProfileProvider>
        <WalletProvider>
          <LoginModalProvider>
            <AllRoutes />
          </LoginModalProvider>
        </WalletProvider>
      </AdminProfileProvider>
    </div>
  );
}

export default App;