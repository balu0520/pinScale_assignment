import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css'
import { Week7Transaction,GroupedData,BarGraphProps } from '../../types/interfaces';

function groupByWeekday(transactions:Week7Transaction[]) {
    const weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const groupedData:GroupedData = {};

    weekDays.forEach(weekday => {
        groupedData[weekday] = { credit: 0, debit: 0 };
    });

    const oneWeekAgo = new Date(); 
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const transaction of transactions){
        const date:Date | string = new Date(transaction.date);
        const weekday = weekDays[date.getDay()];
        if (transaction.type.toLowerCase() === 'credit') {
            groupedData[weekday].credit += transaction.sum;
        } else if (transaction.type.toLowerCase() === 'debit') {
            groupedData[weekday].debit += transaction.sum;
        }
    }
    return groupedData;
}


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
