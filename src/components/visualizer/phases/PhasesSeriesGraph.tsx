import { useState, useEffect } from 'react';
import { SpecificationService } from '../../../services';
import state from '../../../state';
import { ArtillerySpec } from '../../../state/parser';
import ArtilleryScenarioChart from './ArtilleryScenarioChart';

export const PhasesSeriesGraph = () => {
  const [parsedSpec, setParsedSpec] = useState<ArtillerySpec | null>(null);

  const parserState = state.useParserState();

  useEffect(() => {
    setParsedSpec(SpecificationService.getParsedSpec());
  }, [parserState.parsedSpec, setParsedSpec]);

  return (
    <div className="h-full bg-neutral-100">
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Artillery Visualizer</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">Phases</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">arrival rate time series</span>
      </div>
      <ArtilleryScenarioChart phases={parsedSpec?.config.phases ?? []} />;
    </div>
  );
};
