import React from 'react';

const EmployeeStats = () => {
    const stats = [
        { label: 'Total Days', value: '3', color: 'var(--text-primary)' },
        { label: 'Present', value: '2', color: 'var(--success)' },
        { label: 'Late', value: '1', color: 'var(--warning)' },
        { label: 'Absent', value: '0', color: 'var(--danger)' },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
        }}>
            {stats.map((stat) => (
                <div key={stat.label} className="card" style={{ padding: '1.5rem' }}>
                    <p className="text-xs text-gray" style={{ marginBottom: '0.5rem' }}>{stat.label}</p>
                    <div style={{ fontSize: '2rem', fontWeight: '500', color: stat.color }}>
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeStats;
