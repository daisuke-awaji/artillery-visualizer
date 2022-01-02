import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Elements,
  FlowElement,
  Handle,
  MiniMap,
  Position,
} from 'react-flow-renderer';
import { SpecificationService } from '../../services';

import state from '../../state';

type ArtilleryCustomNodeComponentProps = {
  url?: string;
  method?: ArtilleryMethodType;
  json?: object;
  body?: object;
  header?: object;
  cookie?: object;
  capture?: object;
};

// const elementsSample: Elements<ArtilleryCustomNodeComponentProps> = [
//   {
//     id: '1',
//     data: {
//       url: '/search',
//       json: {
//         kw: '{{ keyword }}',
//         id: '{{ id }}',
//         user: {
//           name: '{{ userName }}',
//           email: '{{ userEmail }}',
//         },
//       },
//       method: 'POST',
//       capture: [
//         {
//           json: '$.results[0].id',
//           as: 'productId',
//         },
//       ],
//     },
//     position: { x: 100, y: 5 },
//     type: 'special', // input node
//   },
//   {
//     id: '2',
//     data: { url: '/product/{{ productId }}/details', method: 'GET' },
//     position: { x: 100, y: 220 },
//     type: 'special',
//   },
//   { id: 'e1-2', source: '1', target: '2', animated: true, type: 'special' },
//   {
//     id: '3',
//     data: { url: '/cart', json: { productId: '{{ productId }}' }, method: 'DELETE' },
//     position: { x: 100, y: 300 },
//     type: 'special',
//   },
//   { id: 'e2-3', source: '2', target: '3', animated: true, type: 'special' },
//   {
//     id: '4',
//     data: { url: '/cart', json: { productId: '{{ productId }}' }, method: 'PUT' },
//     position: { x: 100, y: 450 },
//     type: 'special',
//   },
//   { id: 'e3-4', source: '3', target: '4', animated: true, type: 'special' },
// ];

type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
type ArtilleryMethodType = HTTPMethod | 'THINK';

const HTTPMethodLabel: React.FC<{
  method: ArtilleryMethodType;
  className: string;
}> = ({ method, className }) => {
  const classes: { [key in ArtilleryMethodType]?: string } = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-purple-500',
    DELETE: 'bg-red-500',
    THINK: 'bg-gray-400',
  };

  return (
    <div className={`${className} -fit rounded-sm h-fit text-white text-xs ${classes[method]}`}>
      {method}
    </div>
  );
};

const FlowNodeComponent: React.FC<FlowElement<ArtilleryCustomNodeComponentProps>> = ({ data }) => {
  return (
    <div className="border p-1 rounded min-w-full min-h-32 border-black bg-white">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center mb-1 justify-left">
        <HTTPMethodLabel method={data?.method ?? 'GET'} className="p-1" />
        <span className="p-1">{data?.url}</span>
      </div>

      <div className="flex items-stretch">
        {data?.json ? (
          <div className="text-xs border">
            <div className=" bg-slate-500 w-fit text-white p-1">json</div>
            <pre className="p-1">{JSON.stringify(data?.json, null, 2)}</pre>
          </div>
        ) : null}

        {data?.capture ? (
          <div className="text-xs border">
            <div className=" bg-slate-500 w-fit text-white p-1">capture</div>
            <pre className="p-1">{JSON.stringify(data?.capture, null, 2)}</pre>
          </div>
        ) : null}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
const nodeTypes = {
  special: FlowNodeComponent,
};

const getElementsFromArtilleryScenario = (
  parsedSpec: any,
): Elements<ArtilleryCustomNodeComponentProps> => {
  if (!parsedSpec?.scenarios) {
    return [];
  }

  const scenarios = parsedSpec.scenarios;

  const elements = scenarios[0].flow.map((flowItem: any, index: number) => {
    const method = Object.keys(flowItem)[0];
    const nodeObj = flowItem[method];

    if (method === 'think') {
      return {
        id: method + index,
        data: {
          url: nodeObj + ' sec',
          method: method.toUpperCase(),
        },
        position: { x: 100, y: 75 + index * 200 },
        type: 'special', // input node
      };
    }

    return {
      id: nodeObj.url + method + index,
      data: {
        url: nodeObj.url,
        json: nodeObj?.json,
        method: method.toUpperCase(),
        capture: nodeObj?.capture || undefined,
      },
      position: { x: 100, y: 75 + index * 200 },
      type: 'special', // input node
    };
  });

  console.log(elements);

  return elements;
};

const BasicFlow = () => {
  const [parsedSpec, setParsedSpec] = useState<any[] | null>(null);

  const parserState = state.useParserState();
  const templateState = state.useTemplateState();

  useEffect(() => {
    const a = SpecificationService.getParsedSpec();
    setParsedSpec(a);
  }, [parserState.parsedSpec, setParsedSpec]);

  const e = getElementsFromArtilleryScenario(parsedSpec);

  useEffect(() => {
    if (templateState.rerender.get()) {
      setParsedSpec(SpecificationService.getParsedSpec());
      templateState.rerender.set(false);
    }
  }, [templateState.rerender.get()]); // eslint-disable-line

  return (
    <div className="h-screen bg-neutral-200 relative">
      <ReactFlow elements={e} nodeTypes={nodeTypes}>
        <MiniMap style={{ bottom: '70px' }} />
        <Controls style={{ bottom: '70px' }} />
        <Background />
      </ReactFlow>
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Artillery Visualizer</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">Scenarios</span>
      </div>
    </div>
  );
};

export default BasicFlow;
