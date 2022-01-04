import { createState, useState } from '@hookstate/core';

export type ArtillerySpec = {
  config: {
    target: string;
    phases: any[];
  };
  payload: {
    path: string;
    fields: string[];
  };
  scenarios: Array<{
    name: string;
    flow: any[];
  }>;
};

export interface ParserState {
  parsedSpec: ArtillerySpec | null; // TODO: spec
  valid: boolean;
  errors: any[];
}

export const parserState = createState<ParserState>({
  parsedSpec: null,
  valid: false,
  errors: [],
});

export function useParserState() {
  return useState(parserState);
}
