const BASE_WIDTH = 360;
const BASE_HEIGHT = 800;

export const pxW = (px) => `${(px / BASE_WIDTH) * 100}vw`; 
export const pxH = (px) => `${(px / BASE_HEIGHT) * 100}vh`;