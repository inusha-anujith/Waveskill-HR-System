import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AttendanceWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckedIn, setIsCheckedIn] = useState(true);

    // Static time for demo match
    const checkInTime = '15:19:59';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }); // e.g., 4:55 AM
    };

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-medium">Mark Attendance</h3>
                <p className="text-xs text-gray">Check in and check out for today</p>
            </div>

            <div style={{
                backgroundColor: '#eff6ff', // Light blue background
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header Row: Date and Time */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <p className="text-xs text-slategray" style={{ marginBottom: '0.5rem', color: '#64748b' }}>Today's Date</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem', fontWeight: '500' }}>
                            <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex' }}>
                                <Clock size={20} />
                            </div>
                            {formatDate(currentTime)}
                        </div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '600', color: '#111' }}>
                        {formatTime(currentTime)}
                    </div>
                </div>

                {/* Status Cards */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {/* Check In Card */}
                    <div style={{
                        flex: 1,
                        minWidth: '240px',
                        backgroundColor: '#fff',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        <p className="text-xs text-gray" style={{ marginBottom: '0.75rem' }}>Check In</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: '500' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: '#dcfce7'
                            }}>
                                <Clock size={20} color="#22c55e" />
                            </div>
                            {checkInTime}
                        </div>
                        <span style={{
                            position: 'absolute',
                            bottom: '1.5rem',
                            left: '1.5rem',
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#e2e8f0',
                            color: '#475569',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            borderRadius: '6px'
                        }}>
                            Late
                        </span>
                    </div>

                    {/* Check Out Card */}
                    <div style={{
                        flex: 1,
                        minWidth: '240px',
                        backgroundColor: '#fff',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <p className="text-xs text-gray" style={{ marginBottom: '0.75rem' }}>Check Out</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: '500' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: '#fee2e2'
                                }}>
                                    <Clock size={20} color="#ef4444" />
                                </div>
                                {isCheckedIn ? 'Not yet' : '18:00:00'}
                            </div>
                        </div>

                        <div style={{ alignSelf: 'flex-end' }}>
                            <button
                                style={{
                                    backgroundColor: '#ef4444',
                                    color: '#fff',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    marginTop: '2rem'
                                }}
                                onClick={() => setIsCheckedIn(!isCheckedIn)}
                            >
                                <Clock size={16} />
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <MapPin size={16} />
                    IP: 192.168.1.79
                </div>
            </div>
        </div>
    );
};

export default AttendanceWidget;
