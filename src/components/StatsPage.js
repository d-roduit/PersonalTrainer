import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Lodash from 'lodash';
import { useTheme } from '@mui/material/styles';

function StatsPage() {

    const [chartData, setChartData] = useState([]);

    const fetchTrainings = () => {
        const getTrainingsAPIEndpoint = process.env.REACT_APP_API_GETTRAININGS_URL;
        fetch(getTrainingsAPIEndpoint)
            .then(response => response.json())
            .then(data => {
                let trainingsGroupedByActivity = Lodash.groupBy(data, 'activity');

                const chartData = [];

                for (let activity in trainingsGroupedByActivity) {
                    let sumOfTrainingDuration = Lodash.sumBy(trainingsGroupedByActivity[activity], training => training.duration);
                    chartData.push({
                        activity: activity,
                        duration: sumOfTrainingDuration
                    });
                }

                setChartData(chartData);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => fetchTrainings(), []);

    const theme = useTheme();

    return (
        <BarChart width={800} height={500} data={chartData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="activity" />
            <YAxis label={{ value: "Duration (min)", angle: -90, position: 'insideLeft', fill: theme.palette.text.primary }}/>
            <Tooltip />
            <Bar dataKey="duration" fill="#0288d1" />
        </BarChart>
    );
}

export default StatsPage;
