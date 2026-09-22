import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ResidentDashboard from '../pages/resident/ResidentDashboard'
import ReportIssue from '../pages/resident/ReportIssue'
import MyIssues from '../pages/resident/MyIssues'
import ResidentIssueDetails from '../pages/resident/IssueDetails'
import StaffDashboard from '../pages/staff/StaffDashboard'
import AssignedIssues from '../pages/staff/AssignedIssues'
import StaffIssueDetails from '../pages/staff/IssueDetails'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AllIssues from '../pages/admin/AllIssues'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageCategories from '../pages/admin/ManageCategories'
import Analytics from '../pages/admin/Analytics'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/resident/dashboard" element={<ProtectedRoute role="resident"><ResidentDashboard /></ProtectedRoute>} />
      <Route path="/resident/report" element={<ProtectedRoute role="resident"><ReportIssue /></ProtectedRoute>} />
      <Route path="/resident/issues" element={<ProtectedRoute role="resident"><MyIssues /></ProtectedRoute>} />
      <Route path="/resident/issues/:id" element={<ProtectedRoute role="resident"><ResidentIssueDetails /></ProtectedRoute>} />

      <Route path="/staff/dashboard" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/issues" element={<ProtectedRoute role="staff"><AssignedIssues /></ProtectedRoute>} />
      <Route path="/staff/issues/:id" element={<ProtectedRoute role="staff"><StaffIssueDetails /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/issues" element={<ProtectedRoute role="admin"><AllIssues /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute role="admin"><ManageCategories /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
    </Routes>
  )
}

export default AppRoutes
