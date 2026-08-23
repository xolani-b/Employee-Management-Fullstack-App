import { useEffect, useState } from 'react';
import { isAuthenticated, getRole, getStatus, getUsername, subscribeAuth } from '../services/authService';

const readState = () => ({
  authenticated: isAuthenticated(),
  username: getUsername(),
  role: getRole(),
  status: getStatus(),
});

const useAuth = () => {
  const [state, setState] = useState(readState);

  useEffect(() => {
    const sync = () => {
      const next = readState();
      setState(prev =>
        prev.authenticated === next.authenticated && prev.username === next.username && prev.role === next.role && prev.status === next.status ? prev : next
      );
    };
    sync();
    return subscribeAuth(sync);
  }, []);

  return state;
};

export default useAuth;
