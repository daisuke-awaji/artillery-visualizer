import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Elements,
  FlowElement,
  Handle,
  MiniMap,
  Position,
  isNode,
} from 'react-flow-renderer';
import { SpecificationService } from '../../../services';

import state from '../../../state';

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

type ArtilleryCustomNodeComponentProps = {
  url?: string;
  method?: ArtilleryMethodType;
  json?: object;
  body?: object;
  header?: object;
  cookie?: object;
  capture?: object;
  flow?: string;
};

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

const flowColors = [
  'bg-gradient-to-r from-emerald-300 to-green-200',
  'bg-cyan-400',
  'bg-indigo-200',
  'bg-lime-400',
  'bg-red-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-rose-400',
];
const flowColorMap = new Map();

const FlowNodeComponent: React.FC<FlowElement<ArtilleryCustomNodeComponentProps>> = ({ data }) => {
  if (data?.flow) {
    if (!flowColorMap.get(data.flow)) {
      flowColorMap.set(data.flow, flowColors[Math.floor(Math.random() * flowColors.length)]);
    }
    const flowColor = flowColorMap.get(data.flow);
    return (
      <div className={'border p-1 rounded min-w-full min-h-48 w-[32rem] border-black ' + flowColor}>
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center mb-1 justify-center">
          <span className="p-1 font-bold">{data.flow}</span>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div className="border p-1 rounded min-w-full min-h-48 w-[32rem] border-black bg-white">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center mb-1 justify-left">
        <HTTPMethodLabel method={data?.method ?? 'GET'} className="p-1" />
        <span className="p-1">{data?.url}</span>
      </div>

      <div className="flex items-stretch">
        {data?.json ? (
          <div className="text-xs border w-1/2">
            <div className=" bg-slate-500 w-fit text-white p-1">json</div>
            <pre className="p-1">{JSON.stringify(data?.json, null, 2)}</pre>
          </div>
        ) : null}

        {data?.capture ? (
          <div className="text-xs border  w-1/2">
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

const nodeWidth = 172;
const nodeHeight = 150;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getLayoutedElements = (elements: Elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el: FlowElement) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};

const getElementsFromArtilleryScenario = (
  parsedSpec: any,
): Elements<ArtilleryCustomNodeComponentProps> => {
  if (!parsedSpec?.scenarios) {
    return [];
  }

  const elements = parsedSpec.scenarios
    .map((scenario: any, scenarioIndex: number) => {
      const x = 100 + scenarioIndex * 500;

      const flowScenarios = scenario.flow.map((flowItem: any, index: number) => {
        const method = Object.keys(flowItem)[0];
        const nodeObj = flowItem[method];

        const y = 175 + index * 200;

        const nodeOptions = { position: { x, y }, type: 'special' };

        if (method === 'think') {
          return {
            id: 'node-' + method + '-flow-' + scenarioIndex + '-item-' + index,
            data: {
              url: nodeObj + ' sec',
              method: method.toUpperCase(),
            },
            ...nodeOptions,
          };
        }

        return {
          id: 'node-' + nodeObj.url + method + '-flow-' + scenarioIndex + '-item-' + index,
          data: {
            url: nodeObj.url,
            json: nodeObj?.json,
            method: method.toUpperCase(),
            capture: nodeObj?.capture || undefined,
          },
          ...nodeOptions,
        };
      });

      const flow = scenario?.name ? `(Flow) ${scenario.name}` : '(Flow)';
      flowScenarios.splice(0, 0, {
        id: 'node-start-flow-' + scenarioIndex,
        data: { flow },
        position: { x, y: 100 },
        type: 'special',
      });

      flowScenarios.push({
        id: 'node-end-flow-' + scenarioIndex,
        data: { flow },
        position: { x, y: 175 + (flowScenarios.length - 1) * 200 },
        type: 'special',
      });

      return flowScenarios;
    })
    .flat();

  // Add Edge
  for (const [index, ele] of elements.entries()) {
    if (ele?.id && ele.id.startsWith('node-')) {
      if (elements[index + 1]) {
        elements.splice(index + 1, 0, {
          id: 'edge' + index,
          source: elements[index].id,
          target: elements[index + 1].id,
          animated: true,
          type: 'special',
        });
      }
    }
  }

  return elements;
};

const BasicFlow = () => {
  const [parsedSpec, setParsedSpec] = useState<any | null>(null);

  const parserState = state.useParserState();
  const templateState = state.useTemplateState();

  useEffect(() => {
    const a = SpecificationService.getParsedSpec();
    setParsedSpec(a);
  }, [parserState.parsedSpec, setParsedSpec]);

  const e = getElementsFromArtilleryScenario(parsedSpec);
  // const elements = getLayoutedElements(e);
  const elements = e;

  useEffect(() => {
    if (templateState.rerender.get()) {
      setParsedSpec(SpecificationService.getParsedSpec());
      templateState.rerender.set(false);
    }
  }, [templateState.rerender.get()]); // eslint-disable-line

  return (
    <div className="h-screen bg-neutral-100 relative">
      <div className="m-4 px-2 text-lg absolute text-gray-800 top-0 left-0 bg-white space-x-2 py-2 border border-gray-100 inline-block">
        <span className="font-bold">Artillery Visualizer</span>
        <span className="text-gray-200">|</span>
        <span className="font-light capitalize">Scenarios</span>
      </div>
      <ReactFlow elements={elements} nodeTypes={nodeTypes}>
        <MiniMap style={{ bottom: '70px' }} />
        <Controls style={{ bottom: '70px' }} />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default BasicFlow;
