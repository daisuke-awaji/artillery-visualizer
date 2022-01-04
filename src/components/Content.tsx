import React from 'react';
import SplitPane from 'react-split-pane';

// import { Editor } from './Editor/Editor';
// import { Navigation } from './Navigation';
// import { Template } from './Template';
// import NewFile from './NewFile';
// import { visualizerTemplate } from './visualizer';

import { debounce } from '../helpers';
import state from '../state';
import { Editor } from './editor';
import BasicFlow from './visualizer/scenarios/BasicFlow';
import { PhasesSeriesGraph } from './visualizer/phases';

interface ContentProps {}

export const Content: React.FunctionComponent<ContentProps> = () => {
  const sidebarState = state.useSidebarState();

  const editorEnabled = sidebarState.panels.editor.get();
  // const newFileEnabled = sidebarState.panels.newFile.get();
  const viewEnabled = sidebarState.panels.view.get();
  const viewType = sidebarState.panels.viewType.get();

  const splitPosLeft = 'splitPos:left';
  const splitPosRight = 'splitPos:right';

  const localStorageLeftPaneSize = parseInt(localStorage.getItem(splitPosLeft) || '0', 10) || 220;
  const localStorageRightPaneSize =
    parseInt(localStorage.getItem(splitPosRight) || '0', 10) || '40%';

  const secondPaneSize = !editorEnabled ? localStorageLeftPaneSize : localStorageRightPaneSize;
  const secondPaneMaxSize = !editorEnabled ? 360 : '100%';

  return (
    <div className="flex flex-1 flex-row relative">
      <div className="flex flex-1 flex-row relative">
        <SplitPane
          size={viewEnabled ? secondPaneSize : 0}
          minSize={0}
          maxSize={secondPaneMaxSize}
          pane1Style={editorEnabled ? undefined : { width: '0px' }}
          pane2Style={viewEnabled ? { overflow: 'auto' } : { width: '0px' }}
          primary={viewEnabled ? 'first' : 'second'}
          defaultSize={localStorageRightPaneSize}
          onChange={debounce((size: string) => {
            localStorage.setItem(splitPosRight, String(size));
          }, 100)}
        >
          <Editor />
          {viewType === 'phasesSeriesGraph' && <PhasesSeriesGraph />}
          {viewType === 'visualizer' && <BasicFlow />}
        </SplitPane>
      </div>
    </div>
  );
};
