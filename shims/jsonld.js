'use strict';
// Shim: jsonld depende de módulos Node.js nativos incompatíveis com React Native.
// As funcionalidades que dependem de jsonld (canonização RDF) não são usadas no mobile.
module.exports = {
  compact: async () => ({}),
  expand: async () => ([]),
  flatten: async () => ({}),
  frame: async () => ({}),
  normalize: async () => (''),
  toRDF: async () => ([]),
  fromRDF: async () => ({}),
  processContext: async () => ({}),
  documentLoaders: { node: () => {}, xhr: () => {} },
};
