import { ResponsiveContainer, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { CategoryPoint } from '../../model/types';

export const RadarChart: React.FC<{ data: CategoryPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={384}>
      <ReRadarChart
        cy={'50%'}
        cx={'50%'}
        outerRadius={'60%'}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis style={{ fontSize: '12px' }} dataKey={'name'} />
        <PolarRadiusAxis style={{ fontSize: '12px' }} />
        <Radar dataKey={'value'} stroke='#3b82f6' fill='#3b82f6' fillOpacity={.6} />
      </ReRadarChart>
    </ResponsiveContainer>
  );
};