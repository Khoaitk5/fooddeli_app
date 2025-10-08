import React from 'react';
import { pxW, pxH } from '../../utils/scale.js';

const OutlineBorder = () => (
  <div style={{
    width: pxW(360),
    outline: '0.35px #E9E9E9 solid',
    outlineOffset: '-0.17px'
  }} />
);

export default OutlineBorder;