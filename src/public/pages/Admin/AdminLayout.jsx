// AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthRedirect from '../../../backend/hooks/useAuthRedirect';

const AdminLayout = () => {
  useAuthRedirect('admin'); // 🔒 Check for admin role

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
