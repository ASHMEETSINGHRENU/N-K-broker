import React, { createContext, useContext, useState, useEffect } from 'react';
import { brokerApi } from '../services/api';

interface BrokerUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  brokerProfile?: any;
}

interface BrokerAuthContextType {
  user: BrokerUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const BrokerAuthContext = createContext<BrokerAuthContextType | undefined>(undefined);

export const BrokerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BrokerUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nestandkey_broker_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      brokerApi
        .getMe()
        .then((res) => {
          if (res.user.role === 'BROKER' || res.user.role === 'ADMIN') {
            setUser(res.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await brokerApi.login(email, password);
    if (res.user.role !== 'BROKER' && res.user.role !== 'ADMIN') {
      throw new Error('Access denied. This workspace is reserved for authorized brokers.');
    }
    localStorage.setItem('nestandkey_broker_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('nestandkey_broker_token');
    setToken(null);
    setUser(null);
  };

  return (
    <BrokerAuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </BrokerAuthContext.Provider>
  );
};

export const useBrokerAuth = () => {
  const context = useContext(BrokerAuthContext);
  if (!context) throw new Error('useBrokerAuth must be used within BrokerAuthProvider');
  return context;
};
