import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css'

interface Week7Transaction{
    date:Date,
    type:string,
    sum:number
}

interface WeeklyData{
    credit:number,
    debit:number
}

interface GroupedData {
    [key: string]: WeeklyData; // Assuming Week7Transaction is your type/interface
}

interface BarGraphProps{
    total7:Week7Transaction[]
}

function groupByWeekday(transactions:Week7Transaction[]) {
    const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const groupedData:GroupedData = {};

    weekdays.forEach(weekday => {
        groupedData[weekday] = { credit: 0, debit: 0 };
    });

    const oneWeekAgo = new Date(); 
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const transaction of transactions){
        const date:Date | string = new Date(transaction.date);
        // if(date == "Invalid Date" || date < oneWeekAgo){
        //     continue
        // }
        const weekday = weekdays[date.getDay()];
        if (transaction.type.toLowerCase() === 'credit') {
            groupedData[weekday].credit += transaction.sum;
        } else if (transaction.type.toLowerCase() === 'debit') {
            groupedData[weekday].debit += transaction.sum;
        }
    }
    return groupedData;
}

// const CustomBar = props => {
//     const { x, y, width, height, fill } = props;
//     const borderRadius = 10; 
//     return (
//         <g>
//            <rect x={x} y={y} width={width} height={height} fill={fill} rx={borderRadius} ry={borderRadius} />
//         </g>
//     );
// };


const BarGraph = (props:BarGraphProps) => {
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
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }} barGap={10} >
                    <CartesianGrid strokeDasharray="none" vertical={false}/>
                    <XAxis dataKey="weekday" tickLine={false} />
                    <YAxis domain={[0, 500]} tickCount={6} allowDataOverflow={true} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="debit" fill="#4D78FF" name="Debit"   />
                    <Bar dataKey="credit" fill="#FCAA0B" name="Credit"  />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarGraph;
