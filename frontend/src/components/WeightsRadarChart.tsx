import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
const data = [
    //sample data
    {
        tag: 'Animals',
        weight: 0.7432,
    },
    {
        tag: 'Mental Health',
        weight: 0.423,
    },
    {
        tag: 'Conservation',
        weight: 0.52392,
    },
    {
        tag: 'Justice',
        weight: 0.84758,
    },
    {
        tag: 'Science & Technology',
        weight: 0.32764892,
    },
    {
        tag: 'Food Security',
        weight: 0.854739,
    },
    {
        tag: 'Humans',
        weight: 0.9,
    },
    {
        tag: 'Music',
        weight: 0.48375,
    },
];

// got this from the recharts api
// later, make data be a thing passed in as a prop instead
const WeightsRadarChart = () => {
    return (
        <RadarChart
            style={{ width: '50%', height: '50%', aspectRatio: 1.2 }}
            responsive
            outerRadius="80%"
            data={data}
            margin={{
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
            }}
        >
            <PolarGrid />
            <PolarAngleAxis dataKey="tag" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
            <Radar
                name="User"
                dataKey="weight"
                stroke="#3a5b22"
                fill="#3a5b22"
                fillOpacity={0.6}
            />
        </RadarChart>
    );
};

export default WeightsRadarChart;
