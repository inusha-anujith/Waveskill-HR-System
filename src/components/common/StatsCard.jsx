import React from 'react';

const StatsCard = ({ title, value, subtext, icon: Icon, color }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 className="text-sm text-gray font-medium">{title}</h3>
                {Icon && <Icon size={20} color={color || 'var(--text-secondary)'} />}
            </div>
            <div>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: color || 'var(--text-primary)' }}>
                    {value}
                </div>
                <p className="text-xs text-gray">{subtext}</p>
            </div>
        </div>
    );
};

export default StatsCard;
