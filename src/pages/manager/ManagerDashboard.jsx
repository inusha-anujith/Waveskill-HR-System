import React from 'react';
import { Users, UserCheck, FileText, Briefcase } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import {
    AttendanceChart,
    LeaveChart,
    DepartmentChart,
    ProjectChart
} from '../../components/manager/DashboardCharts';
import EmployeeList from '../../components/manager/EmployeeList';

const ManagerDashboard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stats Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem'
            }}>
                <StatsCard
                    title="Active Employees"
                    value="3"
                    subtext="Total registered users"
                    icon={Users}
                    color="var(--success)" // Green
                />
                <StatsCard
                    title="Attendance Rate"
                    value="100%"
                    subtext="This Month"
                    icon={UserCheck}
                    color="var(--purple)" // Purple/Blue
                />
                <StatsCard
                    title="Pending Leaves"
                    value="100%"
                    subtext="Awaiting approval"
                    icon={FileText}
                    color="#000" // Black icon
                />
                <StatsCard
                    title="Active Projects"
                    value="2"
                    subtext="Total registered users"
                    icon={Briefcase}
                    color="var(--warning)" // Orange
                />
            </div>

            {/* Charts Grid - 2x2 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem'
            }}>
                <AttendanceChart />
                <LeaveChart />
                <DepartmentChart />
                <ProjectChart />
            </div>

            {/* Bottom Section */}
            <EmployeeList />
        </div>
    );
};

export default ManagerDashboard;
