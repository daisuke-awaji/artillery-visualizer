import React from 'react';
import { IoGlobeOutline, IoLogoGithub, IoTransgenderOutline } from 'react-icons/io5';

interface ToolbarProps {}

export const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
  return (
    <div className="px-4 border-b border-neutral-700 bg-neutral-800">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="inline-block text-xl text-white tracking-wide -ml-1 transform translate-y-0.5 font-bold">
              Artillery Visualizer
            </span>
          </div>
          <div className="text-white p-2">
            <IoTransgenderOutline size={24} />
          </div>
        </div>
        <ul className="flex items-center text-white">
          <li className="text-xl opacity-75 hover:opacity-100 m-2">
            <a
              href="https://www.artillery.io/docs/guides/guides/test-script-reference"
              title="Artillery Website"
              target="_blank"
              rel="noreferrer"
            >
              <IoGlobeOutline />
            </a>
          </li>
          <li className="text-xl ml-2 opacity-75 hover:opacity-100 m-2">
            <a
              href="https://github.com/daisuke-awaji/artillery-visualizer"
              title="Artillery Github Repository"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoGithub />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
