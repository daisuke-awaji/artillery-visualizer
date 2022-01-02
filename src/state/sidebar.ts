import { createState, useState } from '@hookstate/core';

export interface SidebarState {
  show: boolean;
  panels: {
    // newFile: boolean;
    navigation: boolean;
    editor: boolean;
    view: boolean;
    viewType: 'phasesSeriesGraph' | 'visualizer';
  };
}

export const sidebarState = createState<SidebarState>({
  show: true,
  panels: {
    // newFile: false,
    navigation: true,
    editor: true,
    view: true,
    viewType: 'visualizer',
  },
});

export function useSidebarState() {
  return useState(sidebarState);
}
