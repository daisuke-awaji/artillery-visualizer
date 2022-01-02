import { createState, useState } from '@hookstate/core';

export interface ParserState {
  parsedSpec: any | null; // TODO: spec
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
