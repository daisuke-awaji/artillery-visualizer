import React from 'react';
import { VscCode, VscOpenPreview, VscGraph } from 'react-icons/vsc';

// import { SettingsModal } from './Modals/Settings/SettingsModal';

import state from '../state';

type NavItemType = 'navigation' | 'editor' | 'phasesSeriesGraph' | 'visualizer';

function setActiveNav(navItem: NavItemType) {
  const panels = state.sidebar.panels;
  const panelsState = panels.get();

  const newState = {
    ...panelsState,
  };

  if (navItem === 'phasesSeriesGraph' || navItem === 'visualizer') {
    // on current type
    if (newState.viewType === navItem) {
      newState.view = !newState.view;
    } else {
      newState.viewType = navItem;
      localStorage.setItem('nav-item', navItem);
      if (newState.view === false) {
        newState.view = true;
      }
    }
  } else {
    (newState as any)[String(navItem)] = !(newState as any)[String(navItem)];
  }

  if (newState.navigation && !newState.editor && !newState.view) {
    panels.set({
      ...newState,
      view: true,
    });
    return;
  }
  if (!Object.values(newState).some((itemNav) => itemNav === true)) {
    panels.set({
      ...newState,
      view: true,
    });
    return;
  }

  panels.set(newState);
}

interface NavItem {
  name: string;
  state: () => boolean;
  icon: React.ReactNode;
}

interface SidebarProps {}

export const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const sidebarState = state.useSidebarState();

  if (sidebarState.show.get() === false) {
    return null;
  }

  const navigation: NavItem[] = [
    // navigation
    // {
    //   name: 'navigation',
    //   state: () => sidebarState.panels.navigation.get(),
    //   icon: <VscListSelection className="w-5 h-5" />,
    // },
    // editor
    {
      name: 'editor',
      state: () => sidebarState.panels.editor.get(),
      icon: <VscCode className="w-5 h-5" />,
    },
    // template
    {
      name: 'phasesSeriesGraph',
      state: () =>
        sidebarState.panels.view.get() &&
        sidebarState.panels.viewType.get() === 'phasesSeriesGraph',
      icon: <VscGraph className="w-5 h-5" />,
    },
    // visuliser
    {
      name: 'visualizer',
      state: () =>
        sidebarState.panels.view.get() && sidebarState.panels.viewType.get() === 'visualizer',
      icon: <VscOpenPreview className="w-5 h-5" />,
    },
    // newFile
    // {
    //   name: 'newFile',
    //   state: () => sidebarState.panels.newFile.get(),
    //   icon: <VscNewFile className="w-5 h-5" />,
    // },
  ];

  return (
    <div className="flex flex-col  shadow-lg border-r border-neutral-700 bg-neutral-800 justify-between">
      <div className="flex flex-col">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveNav(item.name as NavItemType)}
            className={`flex text-sm border-l-2  ${
              item.state()
                ? 'text-white hover:text-gray-500 border-white'
                : 'text-gray-500 hover:text-white border-gray-800'
            } focus:outline-none border-box p-4`}
            type="button"
          >
            {item.icon}
          </button>
        ))}
      </div>
      <div className="flex flex-col">{/* <SettingsModal /> */}</div>
    </div>
  );
};
