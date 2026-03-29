import React from 'react';

const AttendanceHistory = () => {
    const history = [
        { date: '1/8/2026', checkIn: '09:00:00', checkOut: '18:00:00', hours: '9h 0m', status: 'Present', statusBg: '#111', statusText: '#fff' },
        { date: '2/8/2026', checkIn: '08:55:00', checkOut: '17:55:00', hours: '9h 0m', status: 'Present', statusBg: '#111', statusText: '#fff' },
        { date: '3/8/2026', checkIn: '09:35:00', checkOut: '17:55:00', hours: '8h 25m', status: 'Late', statusBg: '#e2e8f0', statusText: '#111' },
        { date: '4/8/2026', checkIn: '09:00:00', checkOut: '18:00:00', hours: '9h 0m', status: 'Present', statusBg: '#111', statusText: '#fff' },
    ];

    return (
        <div className="card">
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-medium">Attendance History</h3>
                <p className="text-xs text-gray">Your recent attendance records</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            {['Date', 'Check In', 'Check Out', 'Work Hours', 'Status'].map((head) => (
                                <th key={head} style={{
                                    textAlign: 'left',
                                    padding: '1rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row, index) => (
                            <tr key={index} style={{ borderBottom: index !== history.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>{row.date}</td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{row.checkIn}</td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{row.checkOut}</td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{row.hours}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        backgroundColor: row.statusBg,
                                        color: row.statusText,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        display: 'inline-block',
                                        minWidth: '60px',
                                        textAlign: 'center'
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceHistory;
