'use strict';
// Shim: Node.js document loader não é suportado em React Native.
module.exports = () => {
  throw new Error('Node.js document loader not available in React Native');
};
