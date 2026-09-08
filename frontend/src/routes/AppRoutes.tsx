import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Auth Pages

import { Register } from '../pages/auth/Register';

// User Pages

import { MyReports } from '../pages/user/reports/MyReports';
import { CreateReport } from '../pages/user/reports/CreateReport';
import { EditReport } from '../pages/user/reports/EditReport';
import { ReportDetail } from '../pages/user/reports/ReportDetail';
import { ReportVersions } from '../pages/user/reports/ReportVersions';
import { Profile } from '../pages/user/Profile';

// Management Pages
import { ManagementDashboard } from '../pages/management/Dashboard';
import { AllReports } from '../pages/management/reports/AllReports';
import { ManagementReportDetail } from '../pages/management/reports/ReportDetail';
import { ReviewReport } from '../pages/management/reports/ReviewReport';
import { ManagementReportVersions } from '../pages/management/reports/ReportVersions';
import { TeamMembers } from '../pages/management/team/TeamMembers';
import { MemberProfile } from '../pages/management/team/MemberProfile';
import { Projects } from '../pages/management/projects/Projects';
import { Users } from '../pages/management/users/Users';
import { UserDetail } from '../pages/management/users/UserDetail';
import { useAuthStore } from '@/store/authStore';
import Login from '@/pages/auth/Login';
import UserDashboard from '@/pages/user/Dashboard';
import { AuthLayout } from './AuthLayout';

export const AppRoutes: React.FC = () => {
  const { authUser } = useAuthStore();

  const getDefaultRedirect = () => {
    if (authUser?.role === 'MANAGER' || authUser?.role === 'ADMIN') {
      return '/management/dashboard';
    }
    return '/user/dashboard';
  };

  return (
<Routes>
  {/* Public Auth Routes */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  {/* Protected Main Layout Routes */}
  <Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route
        path="/"
        element={<Navigate to={getDefaultRedirect()} replace />}
      />

      {/* User Routes */}
      <Route
        element={
          <RoleRoute
            allowedRoles={["TEAM_MEMBER", "MANAGER", "ADMIN"]}
          />
        }
      >
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/reports" element={<MyReports />} />
        <Route path="/user/reports/create" element={<CreateReport />} />
        <Route path="/user/reports/:id" element={<ReportDetail />} />
        <Route path="/user/reports/:id/edit" element={<EditReport />} />
        <Route
          path="/user/reports/:id/versions"
          element={<ReportVersions />}
        />
        <Route path="/user/profile" element={<Profile />} />
      </Route>

      {/* Management Routes */}
      <Route
        element={
          <RoleRoute allowedRoles={["MANAGER", "ADMIN"]} />
        }
      >
        <Route
          path="/management/dashboard"
          element={<ManagementDashboard />}
        />
        <Route path="/management/reports" element={<AllReports />} />
        <Route
          path="/management/reports/:id"
          element={<ManagementReportDetail />}
        />
        <Route
          path="/management/reports/:id/review"
          element={<ReviewReport />}
        />
        <Route
          path="/management/reports/:id/versions"
          element={<ManagementReportVersions />}
        />
        <Route path="/management/team" element={<TeamMembers />} />
        <Route
          path="/management/team/:id"
          element={<MemberProfile />}
        />
        <Route path="/management/projects" element={<Projects />} />
        <Route path="/management/users" element={<Users />} />
        <Route
          path="/management/users/:id"
          element={<UserDetail />}
        />
      </Route>
    </Route>
  </Route>


      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
};
