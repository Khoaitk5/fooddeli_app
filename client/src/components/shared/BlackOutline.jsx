import React from 'react';

const BlackOutline = ({ width = '152px' }) => (
  <div style={{
    width,
    outline: '2px black solid',
    outlineOffset: '-1px'
  }} />
);

export default BlackOutline;