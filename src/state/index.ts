import { editorState, useEditorState } from './editor';
import { parserState, useParserState } from './parser';
import { settingsState, useSettingsState } from './settings';
import { sidebarState, useSidebarState } from './sidebar';
import { specState, useSpecState } from './spec';
import { templateState, useTemplateState } from './template';

const state = {
  // sidebar
  sidebar: sidebarState,
  useSidebarState,

  // editor
  editor: editorState,
  useEditorState,

  // parser
  parser: parserState,
  useParserState,

  // spec
  spec: specState,
  useSpecState,

  // settings
  settings: settingsState,
  useSettingsState,

  // template
  template: templateState,
  useTemplateState,
};

export default state;
