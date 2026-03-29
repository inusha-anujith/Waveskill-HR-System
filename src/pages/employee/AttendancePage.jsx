import React from 'react';
import AttendanceWidget from '../../components/employee/AttendanceWidget';
import EmployeeStats from '../../components/employee/EmployeeStats';
import AttendanceHistory from '../../components/employee/AttendanceHistory';

const AttendancePage = () => {
    return (
        <div style={{ paddingBottom: '2rem' }}>
            <AttendanceWidget />
            <EmployeeStats />
            <AttendanceHistory />
        </div>
    );
};

export default AttendancePage;
