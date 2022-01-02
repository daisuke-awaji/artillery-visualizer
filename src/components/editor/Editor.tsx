import React from 'react';

import { EditorSidebar } from './EditorSidebar';
import { MonacoWrapper } from './MonacoWrapper';

export interface EditorProps {}

export const Editor: React.FC<EditorProps> = () => {
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <EditorSidebar />
      <MonacoWrapper />
    </div>
  );
};
