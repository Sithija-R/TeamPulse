import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../types/user';
import { useAuthStore } from '@/store/authStore';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { authUser } = useAuthStore();

  if (!authUser || !allowedRoles.includes(authUser.role)) {
    if (authUser?.role === 'MANAGER' || authUser?.role === 'ADMIN') {
      return <Navigate to="/management/dashboard" replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};
