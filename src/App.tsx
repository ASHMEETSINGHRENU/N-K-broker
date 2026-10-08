import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BrokerAuthProvider, useBrokerAuth } from './context/AuthContext';
import { BrokerNotificationProvider } from './context/NotificationContext';
import { BrokerLayout } from './layouts/BrokerLayout';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { PropertiesPage } from './pages/Properties/PropertiesPage';
import { NewPropertyPage } from './pages/Properties/NewPropertyPage';
import { PropertyDetailPage } from './pages/Properties/PropertyDetailPage';
import { LeadsPage } from './pages/Leads/LeadsPage';
import { LeadDetailPage } from './pages/Leads/LeadDetailPage';
import { ClientsPage } from './pages/Clients/ClientsPage';
import { ViewingsPage } from './pages/Viewings/ViewingsPage';
import { CommissionsPage } from './pages/Commissions/CommissionsPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { ProfilePage } from './pages/Profile/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useBrokerAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-[#F7F3EA] flex items-center justify-center text-xs text-[#6B7280] font-ui">Verifying Broker Access...</div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/broker/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrokerAuthProvider>
      <BrokerNotificationProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/broker/login" element={<LoginPage />} />
          <Route
            path="/broker"
            element={
              <ProtectedRoute>
                <BrokerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/broker/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/new" element={<NewPropertyPage />} />
            <Route path="properties/:id" element={<PropertyDetailPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="viewings" element={<ViewingsPage />} />
            <Route path="commissions" element={<CommissionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/broker/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      </BrokerNotificationProvider>
    </BrokerAuthProvider>
  );
};

export default App;
