    // DashboardCharts.jsx
    import React from 'react';
    import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer
    } from 'recharts';

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316'];

    const DashboardCharts = ({ stats }) => {
    const chartData = [
        { name: 'Products', value: stats.products },
        { name: 'Tables', value: stats.tables },
        { name: 'Bookings', value: stats.bookingsToday },
        { name: 'Users', value: stats.users },
    ];

    return (
        <div style={{ display: 'flex', gap: '100px', flexWrap: 'wrap', marginTop: '2rem' }}>
        
        {/* Bar Chart */}
        <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>Bar Chart</h4>
            <ResponsiveContainer>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" />
            </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>Pie Chart</h4>
            <ResponsiveContainer>
            <PieChart>
                <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>

        </div>
    );
    };

    export default DashboardCharts;
