import {Entity} from 'aframe-react';
import React from 'react';

import 'aframe-terrain-model-component'


//const DEM = 'data/noctis-3500-clip-envi.bin'

const TEXTURE = 'data/noctis-3500-clip-textureRED-resized.jpg'

const DEM = 'data/schneeberg_gdm.tif'
//const TEXTURE = 'data/schneeberg_texture.png'

export default props => (
  <Entity terrain-model={`DEM: url(${DEM}); 
  	texture: url(${TEXTURE}); 
  	planeWidth: 346; planeHeight: 346; 
  	segmentsWidth: 199; segmentsHeight: 199; zPosition: 100;`}/>
)


//<a-entity terrain-model='DEM: url(data/noctis-3500-clip-envi.bin); texture: url(data/noctis-3500-clip-textureRED-resized.jpg); planeWidth: 346; planeHeight: 346; segmentsWidth: 199; segmentsHeight: 199; zPosition: 100;'></a-entity>