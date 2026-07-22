import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
import { UserWeights } from '../types/user';

interface WeightsRadarChartProps {
    weights: UserWeights | null;
    width?: number;
    height?: number;
}

/**
 * Radar chart displaying a user's nonprofit preference weights.
 *
 * Converts user preference weights into chart data and visualizes the relative
 * importance of each category using a Recharts radar chart.
 *
 * Props:
 * - weights: User preference weights mapped by category tag.
 * - width: Width of the radar chart.
 * - height: Height of the radar chart.
 */
const WeightsRadarChart = ({
    weights,
    width = 400,
    height = 400,
}: WeightsRadarChartProps) => {
    const data = weights
        ? Object.entries(weights).map(([tag, weight]) => ({
              tag,
              weight,
          }))
        : [];

    return (
        <RadarChart
            responsive
            outerRadius="75%"
            width={width}
            height={height}
            data={data}
            margin={{
                top: 20,
                left: 60,
                right: 20,
                bottom: 60,
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
