import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart2,
    Users,
    Calendar,
    FileText,
    Briefcase,
    Bell,
    LogOut
} from 'lucide-react';

const ManagerLayout = () => {
    const navigate = useNavigate();

    const navItems = [
        { icon: BarChart2, label: 'Analytics', path: '/manager/analytics' },
        { icon: Users, label: 'Employees', path: '/manager/employees' },
        { icon: Calendar, label: 'Attendance', path: '/manager/attendance' },
        { icon: FileText, label: 'Leaves', path: '/manager/leaves' },
        { icon: Briefcase, label: 'Projects', path: '/manager/projects' },
        { icon: Bell, label: 'Announcements', path: '/manager/announcements' },
    ];

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#111', fontFamily: 'var(--font-family)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {/* Header Section */}
                <header style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>HR Management System</h1>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#111',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Welcome, Sarah Manager [manager]
                    </p>

                    {/* Navigation Tabs */}
                    <nav>
                        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <NavLink
                                        to={item.path}
                                        style={({ isActive }) => ({
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            textDecoration: 'none',
                                            color: isActive ? '#111' : '#64748b',
                                            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                                            borderRadius: '8px',
                                            fontWeight: isActive ? '600' : '500',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s'
                                        })}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </header>

                {/* content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ManagerLayout;
