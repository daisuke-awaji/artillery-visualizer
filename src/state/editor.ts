import { createState, useState } from '@hookstate/core';

const schema =
  localStorage.getItem('document') || `config:
  target: "https://example.com/api"
  phases:
    - duration: 60
      arrivalRate: 5
      name: Warm up
    - duration: 120
      arrivalRate: 5
      rampTo: 50
      name: Ramp up load
    - duration: 60
      arrivalRate: 50
      name: Sustained load
  # Artillery viewer not support payload yet.
  payload:
    path: "keywords.csv"
    fields:
      - "keyword"

scenarios:
  - name: "Search and buy"
    flow:
      - post:
          url: "/search"
          json:
            kw: "{{ keyword }}"
          capture:
            - json: "$.results[0].id"
              as: "productId"
      - get:
          url: "/product/{{ productId }}/details"
      - think: 5
      - post:
          url: "/cart"
          json:
            productId: "{{ productId }}"
  - name: "View the latest blog"
    flow:
      - get:
          url: "/articles?latest=true&limit=30&offset=0"
      - get:
          url: "/articles?latest=true&limit=30&offset=30"
      - get:
          url: "/articles?latest=true&limit=30&offset=60"
      - get:
          url: "/articles/7937909"
      - post:
          url: "/articles/7937909/likes"
          json:
            like: true
            updateBy: gee-awa
  - name: "View the blog with large size of paging"
    flow:
      - get:
          url: "/articles?latest=true&limit=1000&offset=0"
      - get:
          url: "/articles?latest=true&limit=1000&offset=30"
      - get:
          url: "/articles?latest=true&limit=1000&offset=60"

`;
export type EditorStateDocumentFrom = 'localStorage' | `URL: ${string}` | 'Base64';

export interface EditorState {
  height: string;
  fileName: string;
  language: string;
  editorValue: string;
  monacoLoaded: boolean;
  editorLoaded: boolean;
  documentFrom: EditorStateDocumentFrom;
  decorations: Array<any>;
  modified: boolean,
}

export const editorState = createState<EditorState>({
  height: 'calc(100% - 36px)',
  fileName: 'artillery',
  language: schema.trim()[0] === '{' ? 'json' : 'yaml',
  editorValue: schema,
  monacoLoaded: false,
  editorLoaded: false,
  documentFrom: 'localStorage',
  decorations: [],
  modified: false,
});

export function useEditorState() {
  return useState(editorState);
}
