import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ManagerLayout from './components/layout/ManagerLayout';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import EmployeeLayout from './components/layout/EmployeeLayout';
import AttendancePage from './pages/employee/AttendancePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<ManagerDashboard />} />
          <Route path="employees" element={<div className="p-4">Employees Page (Placeholder)</div>} />
          <Route path="attendance" element={<div className="p-4">Attendance Page (Placeholder)</div>} />
          <Route path="leaves" element={<div className="p-4">Leaves Page (Placeholder)</div>} />
          <Route path="projects" element={<div className="p-4">Projects Page (Placeholder)</div>} />
          <Route path="announcements" element={<div className="p-4">Announcements Page (Placeholder)</div>} />
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="attendance" replace />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="leave" element={<div className="p-4">Leave Page (Placeholder)</div>} />
          <Route path="projects" element={<div className="p-4">Projects Page (Placeholder)</div>} />
          <Route path="announcements" element={<div className="p-4">Announcements Page (Placeholder)</div>} />
          <Route path="profile" element={<div className="p-4">Profile Page (Placeholder)</div>} />
        </Route>

        {/* Redirect root to manager for demo */}
        <Route path="/" element={<Navigate to="/manager/analytics" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
