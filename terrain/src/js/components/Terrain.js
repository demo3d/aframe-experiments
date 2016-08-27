import {Entity} from 'aframe-react';
import React from 'react';

import 'aframe-terrain-model-component'

//const DEM = 'data/noctis-3500-clip-envi.bin'
//const TEXTURE = 'data/noctis-3500-clip-textureRED-resized.jpg'

const DEM = 'data/schneeberg_dem.bin'
const TEXTURE = 'data/schneeberg_texture.jpg'

export default props => (
  <Entity id="terrain"
  	terrain-model={`DEM: url(${DEM}); 
  	texture: url(${TEXTURE}); 
  	planeWidth: 30; planeHeight: 30; 
  	segmentsWidth: 19; segmentsHeight: 19; zPosition: 20;
  	debug: false`}/>
)
