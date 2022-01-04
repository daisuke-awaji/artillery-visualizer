import React from 'react';
import ReactECharts from 'echarts-for-react';

type Pause = { pause: number };
type Ramp = {
  duration: number;
  arrivalRate: number;
  rampTo?: number;
};

type Props = {
  phases: Array<Ramp | Pause>;
};

const isRamp = (arg: any): arg is Ramp => arg.duration !== undefined;
const isPause = (arg: any): arg is Pause => arg.pause !== undefined;

const ArtilleryScenarioChart: React.FC<Props> = ({ phases }) => {
  const options = {
    xAxis: {
      type: 'value',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      show: true,
      left: 'center',
      itemSize: 20,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
        dataZoom: {
          yAxisIndex: 'none',
        },
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        name: 'arrivalRate',
        type: 'line',
        // symbol: 'circle',
        symbolSize: 0,
        itemStyle: {
          color: '#F2597F',
          width: 1,
        },
        data: [] as any[],
      },
    ],
  };

  let sec = 0;
  let nowRamp = 0;
  phases.forEach((phase) => {
    if (isRamp(phase)) {
      const gradient = phase.rampTo ? (phase.rampTo - nowRamp) / phase.duration : 0;

      for (let i = sec; i < sec + phase.duration; i++) {
        phase.arrivalRate += gradient;
        options.series[0].data.push([i, phase.arrivalRate]);
      }
      phase.arrivalRate -= phase.rampTo ? phase.rampTo - nowRamp : 0;
      sec += phase.duration;
      nowRamp = phase.arrivalRate;
    } else if (isPause(phase)) {
      // isPause
      for (let i = sec; i < sec + phase.pause; i++) {
        options.series[0].data.push([i, 0]);
      }
      sec += phase.pause;
    } else {
      // do nothing
    }
  });

  return (
    <ReactECharts
      option={options}
      style={{ width: '100%', maxWidth: '100%', height: '100%', maxHeight: '100%' }}
    />
  );
};
export default ArtilleryScenarioChart;
