import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css'

// Helper function to group transactions by week
function groupByWeekday(transactions) {
    const weekdays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const groupedData = {};

    // Initialize all weekdays with default values
    weekdays.forEach(weekday => {
        groupedData[weekday] = { credit: 0, debit: 0 };
    });

    transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const weekday = weekdays[date.getDay()];
        if (transaction.type.toLowerCase() === 'credit') {
            groupedData[weekday].credit += transaction.sum;
        } else if (transaction.type.toLowerCase() === 'debit') {
            groupedData[weekday].debit += transaction.sum;
        }
    });
    return groupedData;
}

const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    const borderRadius = 10; // Adjust the value to control the curvature of the bars
    return (
        <g>
           <rect x={x} y={y} width={width} height={height} fill={fill} rx={borderRadius} ry={borderRadius} />
        </g>
    );
};


const BarGraph = props => {
    const { total7 } = props
    const weeklyData = groupByWeekday(total7);

    const chartData = Object.entries(weeklyData).map(([weekday, { credit, debit }]) => ({
        weekday,
        credit,
        debit,
    }));

    return (
        <div style={{ overflowX: 'auto' }}>
            <ResponsiveContainer height={400} className="chart-container">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }} padding={{bottom: 10}} barGap={10} >
                    <CartesianGrid strokeDasharray="none" vertical={false} verticalStrokeWidth={0}/>
                    <XAxis dataKey="weekday" tickLine={false} />
                    <YAxis domain={[0, 500]} tickCount={6} allowDataOverflow={true} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="debit" fill="#4D78FF" name="Debit" shape={<CustomBar />}  />
                    <Bar dataKey="credit" fill="#FCAA0B" name="Credit" shape={<CustomBar />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarGraph;