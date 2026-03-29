import React from 'react';

const EmployeeList = () => {
    const employees = [
        { name: 'Sarah Manager', role: 'Engineering Manager', status: 'Not Checked In' },
        { name: 'John Doe', role: 'Software Engineer', status: 'Not Checked In' },
        { name: 'Jane Smith', role: 'Marketing Specialist', status: 'Not Checked In' },
        { name: 'Mike Johnson', role: 'Product Designer', status: 'Checked In' },
    ];

    return (
        <div className="card">
            <h3 className="font-medium" style={{ marginBottom: '1rem' }}>Employee Availability</h3>
            <p className="text-xs text-gray" style={{ marginBottom: '1rem' }}>Current status overview</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {employees.map((emp, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{emp.name}</p>
                                <p className="text-xs text-gray">{emp.role}</p>
                            </div>
                        </div>
                        <span style={{
                            fontSize: '0.75rem',
                            color: emp.status === 'Checked In' ? 'var(--success)' : 'var(--text-secondary)',
                            backgroundColor: emp.status === 'Checked In' ? '#dcfce7' : 'transparent',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '99px'
                        }}>
                            {emp.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
