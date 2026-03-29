import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

export const AttendanceChart = () => {
    const data = [
        { name: 'Present', value: 67, color: '#22c55e' }, // Green
        { name: 'Late', value: 33, color: '#f59e0b' },    // Yellow/Orange
        { name: 'Absent', value: 12, color: '#8b5cf6' },   // Purple
    ];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        // Simplifying for now, using Legend instead as it's cleaner than custom labels without exact coordinates
        return null;
    };

    return (
        <div className="card" style={{ height: '350px' }}>
            <h3 className="font-medium" style={{ marginBottom: '0.5rem' }}>Attendance Overview</h3>
            <p className="text-xs text-gray" style={{ marginBottom: '1.5rem' }}>Monthly attendance distribution</p>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={0} // Pie, not donut in screenshot? Actually looks like Pie.
                        outerRadius={80}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        iconType="circle"
                        formatter={(value, entry, index) => (
                            <span style={{ color: entry.color, fontWeight: 500, fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                                {value}: {data[index].value}%
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export const LeaveChart = () => {
    const data = [
        { name: 'Pending', value: 0.8 }, // Visual approximation
        { name: 'Approved', value: 0.8 },
        { name: 'Rejected', value: 0 },
    ];

    return (
        <div className="card" style={{ height: '350px' }}>
            <h3 className="font-medium" style={{ marginBottom: '0.5rem' }}>Leave Requests</h3>
            <p className="text-xs text-gray" style={{ marginBottom: '1.5rem' }}>Status distribution</p>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        domain={[0, 1]}
                        ticks={[0, 0.25, 0.5, 0.75, 1]}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const DepartmentChart = () => {
    const data = [
        { name: 'Engineering', value: 2 },
        { name: 'Marketing', value: 1 },
    ];

    return (
        <div className="card" style={{ height: '350px' }}>
            <h3 className="font-medium" style={{ marginBottom: '0.5rem' }}>Department Distribution</h3>
            <p className="text-xs text-gray" style={{ marginBottom: '1.5rem' }}>Employees by department</p>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data} barSize={80}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        domain={[0, 2]}
                        ticks={[0, 0.5, 1, 1.5, 2]}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ProjectChart = () => {
    const data = [
        { name: 'Active', value: 2, color: '#3b82f6' },
    ];

    return (
        <div className="card" style={{ height: '350px' }}>
            <h3 className="font-medium" style={{ marginBottom: '0.5rem' }}>Project Status</h3>
            <p className="text-xs text-gray" style={{ marginBottom: '1.5rem' }}>Project distribution by status</p>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        verticalAlign="middle"
                        align="left"
                        layout="vertical"
                        iconType="circle"
                        formatter={(value, entry, index) => (
                            <span style={{ color: '#3b82f6', fontWeight: 500, fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                                {value}: {data[index].value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
