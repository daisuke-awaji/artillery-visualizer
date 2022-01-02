/* eslint-disable import/no-anonymous-default-export */
export default {
  $id: 'artillery test scripts schema',
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Schema for Artillery test scripts',
  type: 'object',
  properties: {
    config: {
      type: 'object',
      properties: {
        environments: {
          type: 'object',
        },
        target: { type: 'string' },
        phases: {
          type: 'array',
        },
        payload: {
          anyOf: [{ type: 'object' }, { type: 'array' }],
        },
        defaults: {
          type: 'object',
        },
        ensure: {
          type: 'object',
        },
        mode: {
          type: 'string',
          enum: ['poisson', 'uniform'],
        },
        tls: {
          type: 'object',
        },
      },
    },
    before: {
      type: 'object',
      properties: {
        flow: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
      required: ['flow'],
    },
    after: {
      type: 'object',
      properties: {
        flow: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
      required: ['flow'],
    },
    scenarios: {
      type: 'array',
    },
  },
  required: ['scenarios'],
};
