// import { AsyncAPIDocument } from '@asyncapi/parser';

// import specs from '@asyncapi/specs';
import { loader } from '@monaco-editor/react';
import * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';

import state from '../state';

import jsonSchemaDraft07 from './json-schema.draft-07';

export class MonacoService {
  private static actualVersion = 'X.X.X';
  private static Monaco: any = null;
  private static Editor: any = null;

  static get monaco() {
    return MonacoService.Monaco;
  }
  static set monaco(value: any) {
    MonacoService.Monaco = value;
  }

  static get editor() {
    return MonacoService.Editor;
  }
  static set editor(value: any) {
    MonacoService.Editor = value;
  }

  static prepareLanguageConfig(): monacoAPI.languages.json.DiagnosticsOptions {
    return {
      validate: true,
      enableSchemaRequest: true,
      completion: true,
      schemas: [
        {
          uri: jsonSchemaDraft07.$id, // id of the draft-07 schema
          fileMatch: ['*'], // associate with all models
          schema: jsonSchemaDraft07,
        },
      ],
    } as any;
  }

  static loadLanguageConfig() {
    const monacoInstance = window.Monaco;
    if (!monacoInstance) return;

    const options = this.prepareLanguageConfig();

    const json = monacoInstance.languages.json;
    json && json.jsonDefaults && json.jsonDefaults.setDiagnosticsOptions(options);

    const yaml = (monacoInstance.languages as any).yaml;
    yaml && yaml.yamlDefaults && yaml.yamlDefaults.setDiagnosticsOptions(options);
  }

  static loadMonacoConfig() {
    const monacoInstance = window.Monaco;
    if (!monacoInstance) return;

    monacoInstance.editor.defineTheme('artillery-visualizer-theme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#262626',
        'editor.lineHighlightBackground': '#1f2a37',
      },
      rules: [{ token: '', background: '#262626' }],
    });
  }

  static async loadMonaco() {
    const monacoInstance = await loader.init();
    window.Monaco = monacoInstance;

    // load monaco config
    this.loadMonacoConfig();

    // load yaml plugin
    // @ts-ignore
    await import('monaco-yaml/lib/esm/monaco.contribution');

    // load language config (for json and yaml)
    this.loadLanguageConfig();
    state.editor.monacoLoaded.set(true);
  }
}
